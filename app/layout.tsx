import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import AdminProvider from "@/contexts/AdminProvider";
import CompanyProvider from "@/contexts/CompanyProvider";
import { UserProvider } from "@/contexts/UserProvider";
import AuthListenerWrapper from "@/components/Authlistenr";

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
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={geistSans.className} suppressHydrationWarning>
      <body className={`bg-background text-foreground ${locale === "ar" ? "rtl" : "ltr"}`}>
      <AuthListenerWrapper>
        <NextIntlClientProvider messages={messages}>
          
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {/* Ensure UserProvider only runs on the client */}
            <UserProvider>
              <AdminProvider>
                <CompanyProvider>
                  <main className="min-h-screen flex flex-col items-center">{children}</main>
                </CompanyProvider>
              </AdminProvider>
            </UserProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        </AuthListenerWrapper>
      </body>
    </html>
  );
}
