import AuthServices from "@repo/services/auth"
import OauthService from "@repo/services/oAuth";
export const authService = new AuthServices();
export const oAuthService = new OauthService();