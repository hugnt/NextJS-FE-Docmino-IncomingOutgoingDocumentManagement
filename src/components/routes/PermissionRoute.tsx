"use client";
import { JSX, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Role } from "@/types/User";
import { PATH } from "@/constants/paths";
import { useAuthContext } from "@/context/authContext";
import PageLoading from "../loading/PageLoading";

const PermissionRoute = ({ children, role }: { children: JSX.Element, role: Role }) => {
    const { user, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user && user.role !== role) {
            router.replace(PATH.Forbidden);
        }
    }, [user, loading, role, router]);

    if (loading) {
        return <PageLoading />;
    }

    if (!user || user.role !== role) {
        return null;
    }

    return children;
};

export default PermissionRoute;