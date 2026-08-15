import { inngest } from "./client";
import { z } from "zod";
import { run } from "@openai/agents";
import type { AgentInputItem } from "@openai/agents";
import FormBuilderAgentServices from "../agent/formBuilderAgent";
import FormRespondentAgentService from "../agent/formRespondentAgent";
import { routerQuizBuilderAgent } from "../agent/quizBuilderAgent/createAgent";
import db, { eq, and } from "@repo/database";
import { quizBuilderAgentConversation } from "@repo/database/models/quiz-builder-agent-conversation";
import { publisher } from "@repo/redis/pubsub";

interface formBuilderAgentEventData {
  jobId: string;
  prompt: string;
  userId: string;
  formId: string;
  currentFields: Array<{
    label: string;
    type: string;
    placeholder?: string;
    helperText?: string;
    isRequired: boolean;
    isPrimary: boolean;
    options?: { id: string; value: string }[];
  }>;
}

interface formRespondentEventData {
  jobId: string;
  formId: string;
  guestToken: string;
  userMessage: string;
}

interface quizBuilderAgentEventData {
  userId: string;
  quizId: string;
  input: string | AgentInputItem[];
  conversationId: string;
}

const runFormBuilderAgent = inngest.createFunction(
  {
    id: "run-form-builder-agent",
    triggers: {
      event: "form-builder-agent/run",
    },
  },
  async ({ event, step }) => {
    const { jobId, prompt, userId, formId, currentFields } =
      event.data as formBuilderAgentEventData;
    
    await step.run("publish-agent-running", async () => {
      await publisher.publish(
        "redis:agent:status",
        JSON.stringify({
          jobId,
          topic: "status",
          payload: { status: "running" },
        })
      );
    });
    const result = await step.run("call-openai", async () => {
      try {
        const data = await FormBuilderAgentServices.runFormMakerAgent({
          userId,
          formId,
          prompt,
          currentFields,
        });
        return data;
      } catch (error) {
        if (
          error instanceof Error &&
          (error.constructor.name === "InputGuardrailTripwireTriggered" ||
            error.constructor.name === "OutputGuardrailTripwireTriggered")
        ) {
          return {
            error: true,
            message: error.message,
          };
        }
        throw error;
      }
    });
    await step.run("publish-agent-done", async () => {
      await publisher.publish(
        "redis:agent:status",
        JSON.stringify({
          jobId,
          topic: "status",
          payload: { status: "done", result },
        })
      );
    });
  },
);

const runFormRespondentAgent = inngest.createFunction(
  {
    id: "run-form-respondent-agent",
    triggers: {
      event: "form-respondent-agent/run",
    },
  },
  async ({ event, step }) => {
    const { jobId, formId, guestToken, userMessage } =
      event.data as formRespondentEventData;
    
    await step.run("publish-respondent-running", async () => {
      await publisher.publish(
        "redis:agent:status",
        JSON.stringify({
          jobId,
          topic: "status",
          payload: { status: "running" },
        })
      );
    });
    const result = await step.run("call-openai", async () => {
      try {
        const data = await FormRespondentAgentService.chat({
          formId,
          guestToken,
          userMessage,
        });
        return data;
      } catch (error) {
        if (
          error instanceof Error &&
          (error.constructor.name === "InputGuardrailTripwireTriggered" ||
            error.constructor.name === "OutputGuardrailTripwireTriggered")
        ) {
          return {
            error: true,
            message: error.message,
          };
        }
        throw error;
      }
    });
    await step.run("publish-respondent-done", async () => {
      await publisher.publish(
        "redis:agent:status",
        JSON.stringify({
          jobId,
          topic: "status",
          payload: { status: "done", result },
        })
      );
    });
  },
);

const runQuizBuilderAgent = inngest.createFunction(
  {
    id: "run-quiz-builder-agent",
    triggers: {
      event: "quiz-builder-agent/run",
    },
  },
  async ({ event, step }) => {
    const { userId, quizId, input, conversationId } =
      event.data as quizBuilderAgentEventData;

    await step.run("publish-quiz-running", async () => {
      await publisher.publish(
        "redis:quiz-agent:status",
        JSON.stringify({
          quizId,
          topic: "status",
          payload: { status: "running" },
        })
      );
    });

    const result = await step.run("call-openai", async () => {
      try {
        const agentResult = await run(
          routerQuizBuilderAgent,
          input as string | AgentInputItem[],
        );

        if (!agentResult.finalOutput) {
          throw new Error("Quiz builder agent returned no output");
        }

        // Persist updated conversation history
        const [existing] = await db
          .select({ fileUrls: quizBuilderAgentConversation.fileUrls })
          .from(quizBuilderAgentConversation)
          .where(eq(quizBuilderAgentConversation.id, conversationId));

        await db
          .update(quizBuilderAgentConversation)
          .set({
            history: agentResult.history as any,
            updatedAt: new Date(),
          })
          .where(eq(quizBuilderAgentConversation.id, conversationId));

        return agentResult.finalOutput;
      } catch (error) {
        if (
          error instanceof Error &&
          (error.constructor.name === "InputGuardrailTripwireTriggered" ||
            error.constructor.name === "OutputGuardrailTripwireTriggered")
        ) {
          return { error: true, message: error.message };
        }
        throw error;
      }
    });

    await step.run("publish-quiz-done", async () => {
      await publisher.publish(
        "redis:quiz-agent:status",
        JSON.stringify({
          quizId,
          topic: "status",
          payload: { status: "done", result: { ...(result as any), quizId } },
        })
      );
    });
  },
);

const agentFunctions = [
  runFormBuilderAgent,
  runFormRespondentAgent,
  runQuizBuilderAgent,
];
export default agentFunctions;
