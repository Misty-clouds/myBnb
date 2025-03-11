import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string;
  popular: PopularPlan;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

export const PricingSection = () => {
  const t = useTranslations("Pricing");

  const plans: PlanProps[] = [
    {
      title: t("free.title"),
      popular: PopularPlan.NO,
      price: 0,
      description: t("free.description"),
      buttonText: t("free.button"),
      benefitList: [
        t("free.benefit_1"),
        t("free.benefit_2"),
        t("free.benefit_3"),
        t("free.benefit_4"),
        t("free.benefit_5"),
      ],
    },
    {
      title: t("premium.title"),
      popular: PopularPlan.YES,
      price: 45,
      description: t("premium.description"),
      buttonText: t("premium.button"),
      benefitList: [
        t("premium.benefit_1"),
        t("premium.benefit_2"),
        t("premium.benefit_3"),
        t("premium.benefit_4"),
        t("premium.benefit_5"),
      ],
    },
    {
      title: t("enterprise.title"),
      popular: PopularPlan.NO,
      price: 120,
      description: t("enterprise.description"),
      buttonText: t("enterprise.button"),
      benefitList: [
        t("enterprise.benefit_1"),
        t("enterprise.benefit_2"),
        t("enterprise.benefit_3"),
        t("enterprise.benefit_4"),
        t("enterprise.benefit_5"),
      ],
    },
  ];

  return (
    <section className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        {t("title")}
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        {t("subtitle")}
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
        {t("description")}
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
        {plans.map(({ title, popular, price, description, buttonText, benefitList }) => (
          <Card
            key={title}
            className={
              popular === PopularPlan.YES
                ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1]"
                : ""
            }
          >
            <CardHeader>
              <CardTitle className="pb-2">{title}</CardTitle>

              <CardDescription className="pb-4">{description}</CardDescription>

              <div>
                <span className="text-3xl font-bold">${price}</span>
                <span className="text-muted-foreground"> / {t("month")}</span>
              </div>
            </CardHeader>

            <CardContent className="flex">
              <div className="space-y-4">
                {benefitList.map((benefit) => (
                  <span key={benefit} className="flex">
                    <Check className="text-primary mr-2" />
                    <h3>{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter>
              <Button variant={popular === PopularPlan.YES ? "default" : "secondary"} className="w-full">
                {buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
