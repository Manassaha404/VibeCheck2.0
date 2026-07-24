import { AppError } from "@repo/error";
import * as crypto from "node:crypto";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import {
  formBuilderAgentServices,
  formRespondentAgentService,
  langChainService,
  quizBuilderAgentService,
} from "../../services";
import {
  generateFormDto,
  clearHistoryDto,
  getRealTimeTokenDto,
  storeDocumentsEmbeddingsDto,
  getDocumentRealTimeTokenDto,
  runQuizBuilderAgentDto,
  clearQuizBuilderHistoryDto,
} from "./model";
import {
  agentChatDto,
  agentClearSessionDto,
  agentGetSessionDto,
} from "@repo/services/form/model";
import { handleRouteError } from "../../utils/error";
import { inngest, getClientSubscriptionToken } from "@repo/services/inngest";
import { quizAgentChannel } from "@repo/services/inngest/agent-functions";

export const agentRouter = router({
  generateForm: protectedProcedure
    .input(generateFormDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const jobId = crypto.randomUUID();
        await inngest.send({
          name: "form-builder-agent/run",
          data: {
            jobId,
            prompt: input.prompt,
            userId: ctx.user.id,
            formId: input.formId,
            currentFields: input.currentFields,
          },
        });
        return {
          jobId,
          message:
            "Agent is processing your request. You will receive updates on the status of the job.",
        };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getRealTimeToken: publicProcedure
    .input(getRealTimeTokenDto)
    .query(async ({ input }) => {
      try {
        const { quizId } = input;
        const channel = quizAgentChannel({ quizId: quizId as string });
        
        const token = await getClientSubscriptionToken(inngest, {
          channel,
          topics: ["status"],
        });
        return {
          token,
          message:
            "Token generated successfully. Use this token to subscribe to the agent's status updates.",
        };
      } catch (error) {
        handleRouteError(error);
      }
    }),

  clearFormBuilderAgentHistory: protectedProcedure
    .input(clearHistoryDto)
    .mutation(async ({ input, ctx }) => {
      try {
        await formBuilderAgentServices.clearHistory({
          userId: ctx.user.id,
          formId: input.formId,
        });
        return { message: "Conversation history cleared" };
      } catch (error) {
        handleRouteError(error);
      }
    }),

  respondentAgentChat: publicProcedure
    .input(agentChatDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const guestToken = ctx.guestToken;
        const jobId = crypto.randomUUID();
        await inngest.send({
          name: "form-respondent-agent/run",
          data: {
            jobId,
            formId: input.formId,
            guestToken,
            userMessage: input.message,
          },
        });
        return {
          jobId,
          message:
            "Agent is processing your request. You will receive updates on the status of the job.",
        };
      } catch (error) {
        handleRouteError(error);
      }
    }),

  respondentAgentGetSession: publicProcedure
    .input(agentGetSessionDto)
    .query(async ({ input, ctx }) => {
      try {
        const guestToken = ctx.guestToken;
        if (!guestToken)
          return {
            hasSession: false,
            isCompleted: false,
            collectedAnswers: [],
            currentFieldId: null,
          };
        return await formRespondentAgentService.getSession({
          formId: input.formId,
          guestToken,
        });
      } catch (error) {
        handleRouteError(error);
      }
    }),

  respondentAgentClearSession: publicProcedure
    .input(agentClearSessionDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const guestToken = ctx.guestToken;
        if (!guestToken) return { message: "No session to clear" };
        await formRespondentAgentService.clearSession({
          formId: input.formId,
          guestToken,
        });
        return { message: "Session cleared" };
      } catch (error) {
        handleRouteError(error);
      }
    }),

  quizBuilderAgentStoreDocuments: protectedProcedure
    .input(storeDocumentsEmbeddingsDto)
    .mutation(async ({ input, ctx }) => {
      try {
        return await langChainService.storeDocumentsEmbeddings({
          documentId: input.documentId,
          fileUrl: input.fileUrl,
          userId: ctx.user.id,
          quizId: input.quizId,
          conversationId: input.conversationId,
        });
      } catch (error) {
        handleRouteError(error);
      }
    }),

  getDocumentRealTimeToken: protectedProcedure
    .input(getDocumentRealTimeTokenDto)
    .query(async ({ input }) => {
      try {
        const token = await getClientSubscriptionToken(inngest, {
          channel: quizAgentChannel({ quizId: input.quizId }),
          topics: ["status"],
        });
        return { token };
      } catch (error) {
        handleRouteError(error);
      }
    }),

  runQuizBuilderAgent: protectedProcedure
    .input(runQuizBuilderAgentDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizBuilderAgentService.runQuizBuilderAgent({
          userId: ctx.user.id,
          quizId: input.quizId,
          prompt: input.prompt,
          conversationId: input.conversationId,
        });
        return {
          quizId: result.quizId,
          conversationId: result.conversationId,
          message:
            "Quiz builder agent is processing your request. You will receive updates on the status of the job.",
        };
      } catch (error) {
        handleRouteError(error);
      }
    }),

  clearQuizBuilderAgentHistory: protectedProcedure
    .input(clearQuizBuilderHistoryDto)
    .mutation(async ({ input, ctx }) => {
      try {
        await quizBuilderAgentService.clearHistory({
          userId: ctx.user.id,
          quizId: input.quizId,
        });
        return { message: "Quiz builder conversation history cleared" };
      } catch (error) {
        handleRouteError(error);
      }
    }),
});
