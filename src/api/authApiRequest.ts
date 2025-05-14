
import { httpClient, httpClientRetry } from "@/lib/httpClient";
import { ExtendSessionRequest, LoginRequest, LoginResponse, LogoutRequest, Token, User } from "@/types/User";

const authApiRequest = {
    login: (body: LoginRequest) => httpClient.post<LoginResponse>('users/login', body),
    extendSession: (body: ExtendSessionRequest) => httpClientRetry.post<Token>('users/extend-session', body),
    getUserContext: () => httpClient.get<User>("users/get-current-context"),
    logout: (body: LogoutRequest) => httpClient.post("users/logout", body)

};

export default authApiRequest;