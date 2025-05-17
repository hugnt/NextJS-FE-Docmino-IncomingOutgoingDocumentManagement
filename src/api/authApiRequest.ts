
import { httpClient, httpClientRetry } from "@/lib/httpClient";
import { ExtendSessionRequest, LoginRequest, LoginResponse, LogoutRequest, Token, User } from "@/types/User";

const authApiRequest = {
    login: (body: LoginRequest) => httpClient.post<LoginResponse>('auth/login', body),
    extendSession: (body: ExtendSessionRequest) => httpClientRetry.post<Token>('auth/extend-session', body),
    getUserContext: () => httpClient.get<User>("auth/get-current-context"),
    logout: (body: LogoutRequest) => httpClient.post("auth/logout", body)

};

export default authApiRequest;