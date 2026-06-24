import AuthServices from "@repo/services/auth";
import OauthService from "@repo/services/oAuth";
import FormServices from "@repo/services/form";
import FormBuilderAgentServices from "@repo/services/agent/formBuilderAgent";
import FormRespondentAgentService from "@repo/services/agent/formRespondentAgent";
import EmailServices from "@repo/services/email";
import PollService from "@repo/services/poll";
import TagService from "@repo/services/tag";

export const authService = new AuthServices();
export const oAuthService = new OauthService();
export const formServices = new FormServices();
export const formBuilderAgentServices = new FormBuilderAgentServices();
export const formRespondentAgentService = new FormRespondentAgentService();
export const emailServices = new EmailServices();
export const pollService = new PollService();
export const tagService = new TagService();