"use client";
import { usePathname } from 'next/navigation';
import { ToastContainer } from "react-toastify";
import AuthLayout from './auth';
import MainLayout from './main/main-layout';
import PrivateRoute from '../routes/PrivateRoute';

const authPaths = ['/login'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    let layout = authPaths.includes(pathname) ? 0 : 1;
    if (pathname === '/') layout = 3;
    return (
        <>
            {layout === 0 && <AuthLayout>{children}</AuthLayout>}
            {layout === 1 &&
                <PrivateRoute>
                    <MainLayout>
                        {children}
                    </MainLayout>
                </PrivateRoute>}
            {layout === 3 && <>{children}</>}
            <ToastContainer autoClose={2000} />
        </>
    );
}
