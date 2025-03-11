import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  Globe,
  CalendarCheck,
  Wallet,
  Users,
  ShieldCheck,
} from "lucide-react";
import { LucideProps } from "lucide-react";
import { ComponentType } from "react";
import { useTranslations } from "next-intl";

interface FeaturesProps {
  icon: ComponentType<LucideProps>;
  title: string;
  description: string;
}

export const FeaturesSection = () => {
  const t = useTranslations("Features");

  const featureList: FeaturesProps[] = [
    {
      icon: Home,
      title: t("f1_title"),
      description: t("f1_desc"),
    },
    {
      icon: Globe,
      title: t("f2_title"),
      description: t("f2_desc"),
    },
    {
      icon: CalendarCheck,
      title: t("f3_title"),
      description: t("f3_desc"),
    },
    {
      icon: Wallet,
      title: t("f4_title"),
      description: t("f4_desc"),
    },
    {
      icon: Users,
      title: t("f5_title"),
      description: t("f5_desc"),
    },
    {
      icon: ShieldCheck,
      title: t("f6_title"),
      description: t("f6_desc"),
    },
  ];

  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        {t("title")}
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        {t("heading")}
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        {t("subheading")}
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon: Icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon size={24} color="hsl(var(--primary))" className="text-primary" />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
