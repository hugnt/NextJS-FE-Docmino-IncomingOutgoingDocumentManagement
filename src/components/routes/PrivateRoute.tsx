"use client";
import { PATH } from "@/constants/paths";
import { useAuthContext } from "@/context/authContext";
import { JSX, useEffect } from "react";
import { useRouter } from "next/navigation";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace(PATH.Login);
        }
    }, [isAuthenticated, loading, router]);

    if (loading) return null; // or a loading spinner

    return isAuthenticated ? children : null;
};

export default PrivateRoute;