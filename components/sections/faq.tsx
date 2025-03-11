import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

export const FAQSection = () => {
  const t = useTranslations("FAQ");

  const FAQList: FAQProps[] = [
    {
      question: t("q1"),
      answer: t("a1"),
      value: "item-1",
    },
    {
      question: t("q2"),
      answer: t("a2"),
      value: "item-2",
    },
    {
      question: t("q3"),
      answer: t("a3"),
      value: "item-3",
    },
    {
      question: t("q4"),
      answer: t("a4"),
      value: "item-4",
    },
    {
      question: t("q5"),
      answer: t("a5"),
      value: "item-5",
    }
  ];

  return (
    <section id="faq" className="container md:w-[700px] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          {t("title")}
        </h2>
        <h2 className="text-3xl md:text-4xl text-center font-bold">
          {t("heading")}
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
