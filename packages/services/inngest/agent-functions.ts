import { inngest } from "./client";
import { realtime } from "inngest";
import { z } from "zod";
import FormBuilderAgentServices from "../agent/formBuilderAgent";
import { CollectedAnswer } from "../agent/formRespondentAgent/model";
import FormRespondentAgentService from "../agent/formRespondentAgent";
export const agentChannel = realtime.channel({
  name: ({ jobId }: { jobId: string }) => `agent:${jobId}`,
  topics: {
    status: {
      schema: z.object({
        status: z.string(),
        result: z.any().optional(),
      }),
    },
  },
});

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
    const ch = agentChannel({ jobId });
    await step.realtime.publish("agent-running", ch.status, {
      status: "running",
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
    await step.realtime.publish("agent-done", ch.status, {
      status: "done",
      result,
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
    const ch = agentChannel({ jobId });
    await step.realtime.publish("agent-running", ch.status, {
      status: "running",
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
    await step.realtime.publish("agent-done", ch.status, {
      status: "done",
      result,
    });
  },
);

const agentFunctions = [runFormBuilderAgent, runFormRespondentAgent];
export default agentFunctions;
