"use client"
import authApiRequest from "@/api/authApiRequest";
import PageLoading from "@/components/loading/PageLoading";
import { getClientToken, getRefreshToken, isLoginPage, removeClientToken, setClientToken } from "@/lib/utils";
import { Result } from "@/types/api";
import { LoginRequest, LoginResponse, testAdminUser, Token, User } from "@/types/User";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
    user: User | undefined,
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>
    logout: () => void
    login: (data: LoginRequest) => Promise<Result<LoginResponse>>;
    loading: boolean,

    hasIncomingDocumentRight: boolean;
    hasOutgoingDocumentRight: boolean;
    hasInternalDocumentRight: boolean;
    hasProcessManagerRight: boolean;
    hasStoreDocumentRight: boolean;
    hasManageCategoriesRight: boolean;
    hasInitialConfirmProcessRight: boolean;


}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    setIsAuthenticated: () => { },
    user: undefined,
    setUser: () => { },
    logout: () => { },
    login: async () => ({}) as Result<LoginResponse>,
    loading: false,
    hasIncomingDocumentRight: false,
    hasOutgoingDocumentRight: false,
    hasInternalDocumentRight: false,
    hasProcessManagerRight: false,
    hasStoreDocumentRight: false,
    hasManageCategoriesRight: false,
    hasInitialConfirmProcessRight: false,
})

export const useAuthContext = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: ReactNode, isTesting: boolean }> = ({ children, isTesting = false }) => {
    const accessToken = getClientToken();
    const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);

    const [hasIncomingDocumentRight, setHasIncomingDocumentRight] = useState(false);
    const [hasOutgoingDocumentRight, setHasOutgoingDocumentRight] = useState(false);
    const [hasInternalDocumentRight, setHasInternalDocumentRight] = useState(false);
    const [hasProcessManagerRight, setHasProcessManagerRight] = useState(false);
    const [hasStoreDocumentRight, setHasStoreDocumentRight] = useState(false);
    const [hasManageCategoriesRight, setHasManageCategoriesRight] = useState(false);
    const [hasInitialConfirmProcessRight, setHasInitialConfirmProcessRight] = useState(false);


    useEffect(() => {
        if (isTesting) {
            setUser(testAdminUser);
            setLoading(false);
            setIsAuthenticated(true)
            return;
        }
        if (!isAuthenticated || isLoginPage()) {
            setLoading(false);
            return;
        };
        authApiRequest.getUserContext().then(res => {
            setUserRights(res.data);
            setUser(res.data)
            console.log("USER CONTEXT", res.data)
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
        setUserRights(undefined);
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
        setUserRights(res.data?.user);
        setUser(res.data?.user);
        return res;
    };

    const setUserRights = (u: User | undefined) => {
        if (!u) {
            setHasIncomingDocumentRight(false);
            setHasOutgoingDocumentRight(false);
            setHasInternalDocumentRight(false);
            setHasProcessManagerRight(false);
            setHasStoreDocumentRight(false);
            setHasManageCategoriesRight(false);
            setHasInitialConfirmProcessRight(false);
            return;
        }
        setHasIncomingDocumentRight(u.createIncomingDocumentRight ?? false);
        setHasOutgoingDocumentRight(u.createOutgoingDocumentRight ?? false);
        setHasInternalDocumentRight(u.createInternalDocumentRight ?? false);
        setHasProcessManagerRight(u.processManagerRight ?? false);
        setHasStoreDocumentRight(u.storeDocumentRight ?? false);
        setHasManageCategoriesRight(u.manageCategories ?? false);
        setHasInitialConfirmProcessRight(u.initialConfirmProcessRight ?? false);
    }

    const contextValue: AuthContextType = {
        isAuthenticated,
        setIsAuthenticated,
        user, setUser,
        login, logout,
        loading,
        hasIncomingDocumentRight,
        hasOutgoingDocumentRight,
        hasInternalDocumentRight,
        hasProcessManagerRight,
        hasStoreDocumentRight,
        hasManageCategoriesRight,
        hasInitialConfirmProcessRight
    };
    return (loading ? <PageLoading /> : <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>);
}

export default AuthProvider;