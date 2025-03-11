"use client";

import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import { Briefcase, Building, Star, Home, Key, Rocket, Globe } from "lucide-react";
import { LucideProps } from "lucide-react";
import { ComponentType } from "react";
import { useTranslations } from "next-intl";

interface SponsorProps {
  icon: ComponentType<LucideProps>;
  name: string;
}

export const SponsorsSection = () => {
  const t = useTranslations("Sponsors");

  const sponsors: SponsorProps[] = [
    { icon: Briefcase, name: t("hostly") },
    { icon: Building, name: t("staypro") },
    { icon: Star, name: t("luxbnb") },
    { icon: Home, name: t("homescape") },
    { icon: Key, name: t("rentwise") },
    { icon: Rocket, name: t("airstay") },
    { icon: Globe, name: t("globetrot") },
  ];

  return (
    <section id="sponsors" className="max-w-[80%] mx-auto pb-24 sm:pb-32">
      <h2 className="text-lg md:text-xl text-center mb-6 font-semibold">
        {t("title")}
      </h2>

      <div className="mx-auto">
        <Marquee
          className="gap-[2.5rem]"
          fade
          innerClassName="gap-[2.5rem]"
          pauseOnHover
        >
          {sponsors.map(({ icon: Icon, name }) => (
            <div
              key={name}
              className="flex items-center text-xl md:text-2xl font-medium text-white bg-primary px-4 py-2 rounded-lg shadow-lg"
            >
              <Icon size={32} color="white" className="mr-2" />
              {name}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
