import { Separator } from "@/components/ui/separator";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const FooterSection = () => {
  const t = useTranslations("Footer");

  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link href="/" className="flex font-bold items-center">
              <HomeIcon className="w-9 h-9 mr-2 bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg border border-secondary" />
              <h3 className="text-2xl">MyBnb</h3>
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">{t("contact_title")}</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                {t("contact_support")}
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                {t("contact_partners")}
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                {t("contact_careers")}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">{t("platforms_title")}</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                iOS
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Android
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Web
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">{t("help_title")}</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                {t("help_faq")}
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                {t("help_support")}
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                {t("help_policy")}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">{t("socials_title")}</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Facebook
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Twitter
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Instagram
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="text-center">
          <h3 className="">
            &copy; {new Date().getFullYear()} {t("copyright")}  
            <Link
              target="_blank"
              href="https://cloudstech.com"
              className="text-primary transition-all border-primary hover:border-b-2 ml-1"
            >
              Clouds Tech
            </Link>
          </h3>
        </section>
      </div>
    </footer>
  );
};
