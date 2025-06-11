import type { Metadata } from "next";
import NextTopLoader from 'nextjs-toploader';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import "./globals.css";
import AuthProvider from "@/context/authContext";
import AppLayout from "@/components/layout";


export const metadata: Metadata = {
  title: "Docmino - Secure document management",
  description: "Efficient and secure document handling powered by blockchain technology",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={``}>
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
          <AuthProvider isTesting={false}>
            <AppLayout>
              {children}
            </AppLayout>
          </AuthProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
