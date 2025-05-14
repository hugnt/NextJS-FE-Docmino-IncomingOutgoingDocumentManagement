"use client"
import authApiRequest from "@/api/authApiRequest";
import PageLoading from "@/components/loading/PageLoading";
import { getClientToken, getRefreshToken, isLoginPage, removeClientToken, setClientToken } from "@/lib/utils";
import { Result } from "@/types/api";
import { LoginRequest, LoginResponse, Token, User } from "@/types/User";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
    user: User | undefined,
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>
    logout: () => void
    login: (data: LoginRequest) => Promise<Result<LoginResponse>>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    setIsAuthenticated: () => { },
    user: undefined,
    setUser: () => { },
    logout: () => { },
    login: async () => ({}) as Result<LoginResponse>,
    loading: false
})

export const useAuthContext = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const accessToken = getClientToken();
    const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || isLoginPage()) {
            setLoading(false);
            return;
        };
        authApiRequest.getUserContext().then(res => {
            setUser(res.data)
        }).catch(() => {
            removeClientToken();
            setUser(undefined)
            setIsAuthenticated(false)
        }).finally(() => setLoading(false))
    }, []);

    const logout = () => {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            console.log("LOGOUT", refreshToken)

            authApiRequest.logout({ refreshToken }).finally(() => removeClientToken());
        }
        // location.href = PATH.Login;
        setIsAuthenticated(false);
        setUser(undefined);
    };

    const login = async (data: LoginRequest): Promise<Result<LoginResponse>> => {
        const res = await authApiRequest.login(data);
        const token: Token = {
            accessToken: res.data?.accessToken,
            refreshToken: res.data?.refreshToken,
        };
        setClientToken(token);
        setIsAuthenticated(true);
        setUser(res.data?.user);
        return res;
    };


    const contextValue: AuthContextType = { isAuthenticated, setIsAuthenticated, user, setUser, login, logout, loading };
    return (loading ? <PageLoading /> : <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>);
}

export default AuthProvider;