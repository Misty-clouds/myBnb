import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/SignOutButton";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "MyBnb",
  description: "The best way to manage your real estate properties",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}
    dir={locale === 'ar' ? 'rtl' : 'ltr'}
     className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background
       text-foreground
       ${locale === 'ar' ? 'rtl' : 'ltr'}
      ">
      <NextIntlClientProvider messages={messages}>


        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen  flex flex-col items-center">
            {children}
          </main>
        </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
