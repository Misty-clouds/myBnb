import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Login({ searchParams, params }) {
  const t = await getTranslations(params.locale);
  const searchParamsResolved = await searchParams;

  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">{t("Login.title")}</h1>
      <p className="text-sm text-foreground">
        {t("Login.noAccount")}{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          {t("Login.signUp")}
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">{t("Login.emailLabel")}</Label>
        <Input name="email" placeholder={t("Login.emailPlaceholder")} required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">{t("Login.passwordLabel")}</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            {t("Login.forgotPassword")}
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder={t("Login.passwordPlaceholder")}
          required
        />
        <SubmitButton pendingText={t("Login.signingIn")} formAction={signInAction}>
          {t("Login.signIn")}
        </SubmitButton>
        <FormMessage message={searchParamsResolved} />
      </div>
    </form>
  );
}
