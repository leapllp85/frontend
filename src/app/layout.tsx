import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Provider } from "@/components/ui/provider"
import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import AuthWrapper from "@/components/AuthWrapper";
import AppLoader from "@/components/common/AppLoader";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Corporate MVP",
  description: "Platform for Corporate Employee Mangement"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <LoadingProvider>
            <AuthProvider>
              <AuthWrapper>{children}</AuthWrapper>
              <Suspense fallback={null}>
                <AppLoader />
              </Suspense>
            </AuthProvider>
          </LoadingProvider>
        </Provider>
      </body>
    </html>
  );
}
