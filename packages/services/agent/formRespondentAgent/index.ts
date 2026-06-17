import { run } from "@openai/agents";
import type { AgentInputItem } from "@openai/agents";
import db, { eq, and } from "@repo/database";
import { forms } from "@repo/database/models/forms";
import { formFields } from "@repo/database/models/form-fields";
import { formResponses } from "@repo/database/models/form-responses";
import { formAnswers } from "@repo/database/models/form-answers";
import redis from "@repo/services/redis";
import { formRespondentAgent } from "./createAgent";
import {
  CollectedAnswer,
  RespondentAgentChatResult,
  RespondentFormField,
} from "./model";
import { AppError } from "@repo/error";

//redis session key for respondent conversation store in redis
const SESSION_KEY = (formId: string, guestToken: string) =>
  `respondent:session:${formId}:${guestToken}`;

const HISTORY_KEY = (formId: string, guestToken: string) =>
  `respondent:history:${formId}:${guestToken}`;

// per session TTL, 24hrs
const SESSION_TTL_SECONDS = 60 * 60 * 24;

//redis session type
interface RedisSession {
  collectedAnswers: CollectedAnswer[];
  isCompleted: boolean;
  currentFieldId: string | null;
  responseId?: string;
}

class FormRespondentAgentService {
  //Send a respondent's message to the interviewer agent.
  //Redis stores two keys per session:
  // SESSION_KEY  → { collectedAnswers, isCompleted, currentFieldId, responseId? }
  // HISTORY_KEY  → AgentInputItem[]  (raw @openai/agents conversation history)
  //Both keys share a 24-hour TTL, refreshed on every turn.
  //The DB is only touched once — when `isCompleted` flips to true.

  // build full context for agent, 
  private buildContextBlock(
    title: string,
    description: string | undefined,
    fields: RespondentFormField[],
    collectedAnswers: CollectedAnswer[],
  ): string {
    const fieldLines = fields
      .map((f) => {
        const optionsList =
          f.options && f.options.length > 0
            ? f.options.map((o) => `"${o.value}"`).join(", ")
            : "n/a";
        return (
          `  [${f.fieldId}] ${f.label}` +
          ` (type: ${f.type}, required: ${f.isRequired ? "yes" : "no"}, options: ${optionsList})`
        );
      })
      .join("\n");

    const collectedLines =
      collectedAnswers.length > 0
        ? collectedAnswers
            .map((a) => {
              const field = fields.find((f) => f.fieldId === a.fieldId);
              return `  ${a.fieldId} (${field?.label ?? a.fieldId}): ${JSON.stringify(a.value)}`;
            })
            .join("\n")
        : "  None yet";

    return [
      "FORM CONTEXT:",
      `Title: ${title}`,
      `Description: ${description ?? "No description"}`,
      "Fields (in order):",
      fieldLines,
      "",
      "COLLECTED SO FAR:",
      collectedLines,
    ].join("\n");
  }


  //store response in the db
  private async submitResponse(
    formId: string,
    guestToken: string,
    collectedAnswers: CollectedAnswer[],
  ): Promise<string> {
    // Guard against double-submission on rapid re-renders
    const [existing] = await db
      .select({ responseId: formResponses.responseId })
      .from(formResponses)
      .where(
        and(
          eq(formResponses.formId, formId),
          eq(formResponses.guestToken, guestToken),
        ),
      );

    if (existing) return existing.responseId;

    // Insert the response row
    const [newResponse] = await db
      .insert(formResponses)
      .values({ formId, guestToken })
      .returning({ responseId: formResponses.responseId });

    if (!newResponse) throw new Error("Failed to create form response record");

    // Insert all answers
    if (collectedAnswers.length > 0) {
      await db.insert(formAnswers).values(
        collectedAnswers.map((answer) => ({
          fieldId: answer.fieldId,
          responseId: newResponse.responseId,
          value: answer.value as any,
        })),
      );
    }

    return newResponse.responseId;
  }



  public async chat(
    formId: string,
    guestToken: string,
    userMessage: string,
  ): Promise<RespondentAgentChatResult> {
    
    const [form] = await db
      .select()
      .from(forms)
      .where(eq(forms.formId, formId));

    if (!form) throw new AppError("NOT_FOUND", "Form not found")
    if (!form.isPublished)
      throw new AppError("FORBIDDEN", "This form is not accepting responses yet");

    const fields = await db
      .select()
      .from(formFields)
      .where(eq(formFields.formId, formId))
      .orderBy(formFields.orderIndex);

    //Load existing session state from Redis
    const sessionKey = SESSION_KEY(formId, guestToken);
    const historyKey = HISTORY_KEY(formId, guestToken);

    const [rawSession, rawHistory] = await Promise.all([
      redis.get(sessionKey),
      redis.get(historyKey),
    ]);

    const session: RedisSession = rawSession
      ? JSON.parse(rawSession)
      : { collectedAnswers: [], isCompleted: false, currentFieldId: null };

    //already completed — no need to run the agent again
    if (session.isCompleted) {
      return {
        reply:
          "You've already completed this form. Thank you for your response! 🎉",
        collectedAnswers: session.collectedAnswers,
        isComplete: true,
        currentFieldId: null,
        responseId: session.responseId,
      };
    }

    const previousHistory: AgentInputItem[] = rawHistory
      ? JSON.parse(rawHistory)
      : [];

    // Build context block injected into each turn
    const contextBlock = this.buildContextBlock(
      form.title,
      form.description ?? undefined,
      fields as RespondentFormField[],
      session.collectedAnswers,
    );

    const turnMessage = `${contextBlock}\n\nRespondent: ${userMessage}`;

    // agent-input -> resume from history or start fresh
    const agentInput: string | AgentInputItem[] =
      previousHistory.length > 0
        ? ([
            ...previousHistory,
            { role: "user", content: turnMessage },
          ] as AgentInputItem[])
        : turnMessage;

    // Run the agent
    const result = await run(formRespondentAgent, agentInput);

    if (!result.finalOutput) throw new Error("Agent returned no output");

    const output = result.finalOutput;

    // Persist updated state to Redis (refresh TTL on every turn)
    const updatedSession: RedisSession = {
      collectedAnswers: output.collectedAnswers,
      isCompleted: output.isComplete,
      currentFieldId: output.currentFieldId,
    };

    await Promise.all([
      redis.set(
        sessionKey,
        JSON.stringify(updatedSession),
        "EX",
        SESSION_TTL_SECONDS,
      ),
      redis.set(
        historyKey,
        JSON.stringify(result.history),
        "EX",
        SESSION_TTL_SECONDS,
      ),
    ]);

    // write the permanent DB submission (only once)
    let responseId: string | undefined;
    if (output.isComplete && output.collectedAnswers.length > 0) {
      responseId = await this.submitResponse(
        formId,
        guestToken,
        output.collectedAnswers,
      );

      // Patch the responseId into the session so reconnects can surface it
      updatedSession.responseId = responseId;
      await redis.set(
        sessionKey,
        JSON.stringify(updatedSession),
        "EX",
        SESSION_TTL_SECONDS,
      );
    }

    return {
      reply: output.reply,
      collectedAnswers: output.collectedAnswers,
      isComplete: output.isComplete,
      currentFieldId: output.currentFieldId,
      responseId,
    };
  }

  
  public async getSession(
    formId: string,
    guestToken: string,
  ): Promise<{
    hasSession: boolean;
    isCompleted: boolean;
    collectedAnswers: CollectedAnswer[];
    currentFieldId: string | null;
    responseId?: string;
  }> {
    const raw = await redis.get(SESSION_KEY(formId, guestToken));

    if (!raw) {
      return {
        hasSession: false,
        isCompleted: false,
        collectedAnswers: [],
        currentFieldId: null,
      };
    }

    const session: RedisSession = JSON.parse(raw);
    return {
      hasSession: true,
      isCompleted: session.isCompleted,
      collectedAnswers: session.collectedAnswers,
      currentFieldId: session.currentFieldId,
      responseId: session.responseId,
    };
  }

  
  public async clearSession(formId: string, guestToken: string): Promise<void> {
    await Promise.all([
      redis.del(SESSION_KEY(formId, guestToken)),
      redis.del(HISTORY_KEY(formId, guestToken)),
    ]);
  }
}

export default FormRespondentAgentService;
