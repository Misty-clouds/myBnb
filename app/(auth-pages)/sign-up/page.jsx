import { signUpAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Signup({ searchParams, params }) {
  const t = await getTranslations(params.locale);
  const searchParamsResolved = await searchParams;

  if ("message" in searchParamsResolved) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParamsResolved} />
      </div>
    );
  }

  return (
    <form className="flex flex-col min-w-64 max-w-64 mx-auto">
      <h1 className="text-2xl font-medium">{t("Signup.title")}</h1>
      <p className="text-sm text text-foreground">
        {t("Signup.alreadyHaveAccount")}{" "}
        <Link className="text-primary font-medium underline" href="/sign-in">
          {t("Signup.signIn")}
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">{t("Signup.emailLabel")}</Label>
        <Input name="email" placeholder={t("Signup.emailPlaceholder")} required />
        <Label htmlFor="password">{t("Signup.passwordLabel")}</Label>
        <Input
          type="password"
          name="password"
          placeholder={t("Signup.passwordPlaceholder")}
          minLength={6}
          required
        />
        <SubmitButton formAction={signUpAction} pendingText={t("Signup.signingUp")}>
          {t("Signup.signUp")}
        </SubmitButton>
        <FormMessage message={searchParamsResolved} />
      </div>
    </form>
  );
}
