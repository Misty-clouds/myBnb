import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

enum ProService {
  YES = 1,
  NO = 0,
}

interface ServiceProps {
  title: string;
  pro: ProService;
  description: string;
}

export const ServicesSection = () => {
  const t = useTranslations("Services");

  const serviceList: ServiceProps[] = [
    {
      title: t("custom_domain.title"),
      description: t("custom_domain.description"),
      pro: ProService.NO,
    },
    {
      title: t("social_media.title"),
      description: t("social_media.description"),
      pro: ProService.NO,
    },
    {
      title: t("email_marketing.title"),
      description: t("email_marketing.description"),
      pro: ProService.NO,
    },
    {
      title: t("seo_optimization.title"),
      description: t("seo_optimization.description"),
      pro: ProService.YES,
    },
  ];

  return (
    <section id="services" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        {t("title")}
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        {t("subtitle")}
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        {t("description")}
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-[60%] mx-auto">
        {serviceList.map(({ title, description, pro }) => (
          <Card key={title} className="bg-muted/60 dark:bg-card h-full relative">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <Badge
              data-pro={pro === ProService.YES}
              variant="secondary"
              className="absolute -top-2 -right-3 data-[pro=false]:hidden"
            >
              PRO
            </Badge>
          </Card>
        ))}
      </div>
    </section>
  );
};
