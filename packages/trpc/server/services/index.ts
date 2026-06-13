import AuthServices from "@repo/services/auth";
import OauthService from "@repo/services/oAuth";
import FormServices from "@repo/services/form";
export const authService = new AuthServices();
export const oAuthService = new OauthService();
export const formServices = new FormServices();