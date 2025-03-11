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
import { signUpAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { getTranslations } from "next-intl/server";

export default async function Signup({ searchParams, params }) {
  const t = await getTranslations(params.locale);
  const searchParamsResolved = await searchParams;

  return (
    <section className="container py-24 sm:py-32">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl  font-bold mb-2">{t("Signup.title")}</h2>
          <p>{t("Signup.subtitle")}</p>
        </div>

        <Card className="bg-muted/60 dark:bg-card">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <Mail className="h-4 w-4" />
              <span className="text-sm font-medium">{t("Signup.enter-credentials")}</span>
            </div>
          </CardHeader>
          <CardContent>
            <form action={signUpAction} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t("Signup.emailLabel")}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("Signup.emailPlaceholder")}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  {t("Signup.passwordLabel")}
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t("Signup.passwordPlaceholder")}
                  required
                  className="w-full"
                />
              </div>

              <Button className="w-full" type="submit">
                {t("Signup.signUp")}
              </Button>

              <FormMessage message={searchParamsResolved} />
            </form>
          </CardContent>
        </Card>
        <div className="mt-3 pt-3 text-center">
          <p className="text-muted-foreground">
            {t("Signup.alreadyHaveAccount")} {" "}
            <Link className="text-primary font-medium hover:underline" href="/sign-in">
              {t("Signup.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}