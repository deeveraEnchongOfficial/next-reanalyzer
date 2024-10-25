import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SearchContextProvider } from "@/context/search-context";
import { LogProvider } from "@/context/log-context";
import { SectionProvider } from "@/context/section-observer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReanalyzeAI",
  description: "ReanalyzeAI",
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SearchContextProvider>
      <SessionProvider session={session}>
        <LogProvider>
          <SectionProvider>
            <html lang="en">
              <body className={inter.className}>
                <Toaster
                  toastOptions={{
                    unstyled: false,
                    classNames: {
                      error: "bg-red-300 rounded-lg p-4",
                      info: "bg-blue-300 rounded-lg p-4",
                      success: "bg-green-300 rounded-lg p-4",
                      warning: "bg-orange-300 rounded-lg p-4",
                      description: "text-green-500",
                    },
                  }}
                />
                {children}
              </body>
            </html>
          </SectionProvider>
        </LogProvider>
      </SessionProvider>
    </SearchContextProvider>
  );
}
