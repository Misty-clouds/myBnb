"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, TrendingUp, ClipboardList } from "lucide-react"; // Updated icons
import { LucideProps } from "lucide-react";
import { useTranslations } from "next-intl";
import { ComponentType } from "react";

interface BenefitsProps {
  icon: ComponentType<LucideProps>;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: Home,
    title: "manageProperties",
    description: "managePropertiesDescription",
  },
  {
    icon: Users,
    title: "increaseGuestSatisfaction",
    description: "increaseGuestSatisfactionDescription",
  },
  {
    icon: TrendingUp,
    title: "boostRevenue",
    description: "boostRevenueDescription",
  },
  {
    icon: ClipboardList,
    title: "streamlineOperations",
    description: "streamlineOperationsDescription",
  },
];

export const BenefitsSection = () => {
  const t = useTranslations("Benefits");

  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">{t("benefits")}</h2>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("shortcutSuccess")}</h2>
          <p className="text-xl text-muted-foreground mb-8">{t("benefitsDescription")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon: Icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    size={32}
                    color="hsl(var(--primary))"
                    className="mb-6 text-primary"
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{t(title)}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {t(description)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
