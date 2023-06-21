import { environment } from "../environment/environment.dev";

export const basicAuth = {
    username: environment.UserBasicAuth,
    password: environment.PasswordBasicAuth
};