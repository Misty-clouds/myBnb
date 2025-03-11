import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { getTranslations } from "next-intl/server";

export default async function Login({ searchParams, params }) {
  const t = await getTranslations(params.locale);
  const searchParamsResolved = await searchParams;

  return (
    <section className="container py-24 sm:py-32">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">{t("Login.title")}</h2>
          <p>{t("Login.subtile")}</p>          
        </div>

        <Card className="bg-muted/60 dark:bg-card">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <Mail className="h-4 w-4" />
              <span className="text-sm font-medium">{t("Login.enter-credentials")}</span>
            </div>
          </CardHeader>
          <CardContent>
            <form action={signInAction} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t("Login.emailLabel")}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("Login.emailPlaceholder")}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    {t("Login.passwordLabel")}
                  </label>
                  <Link
                    className="text-xs text-muted-foreground hover:text-primary"
                    href="/forgot-password"
                  >
                    {t("Login.forgotPassword")}
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t("Login.passwordPlaceholder")}
                  required
                  className="w-full"
                />
              </div>

              <Button className="w-full" type="submit">
                {t("Login.signIn")}
              </Button>

              <FormMessage message={searchParamsResolved} />
            </form>
          </CardContent>
        </Card>
        <div className="mt-3 pt-3 text-center">
        <p className="text-muted-foreground">
            {t("Login.noAccount")}{" "}
            <Link className="text-primary font-medium hover:underline" href="/sign-up">
              {t("Login.signUp")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}