"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

interface ReviewProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
  rating: number;
}

export const TestimonialSection = () => {
  const t = useTranslations("Testimonials");

  const reviewList: ReviewProps[] = [
    {
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Liam Anderson",
      userName: t("titles.host"),
      comment: t("reviews.liam"),
      rating: 5.0,
    },
    {
      image: "https://randomuser.me/api/portraits/women/29.jpg",
      name: "Sophia Carter",
      userName: t("titles.traveler"),
      comment: t("reviews.sophia"),
      rating: 4.8,
    },
    {
      image: "https://randomuser.me/api/portraits/men/36.jpg",
      name: "Noah Wright",
      userName: t("titles.property_owner"),
      comment: t("reviews.noah"),
      rating: 4.9,
    },
    {
      image: "https://randomuser.me/api/portraits/women/31.jpg",
      name: "Olivia Bennett",
      userName: t("titles.host"),
      comment: t("reviews.olivia"),
      rating: 5.0,
    },
    {
      image: "https://randomuser.me/api/portraits/men/39.jpg",
      name: "Ethan Roberts",
      userName: t("titles.frequent_traveler"),
      comment: t("reviews.ethan"),
      rating: 5.0,
    },
  ];

  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          {t("title")}
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
          {t("subtitle")}
        </h2>
      </div>

      <Carousel className="relative w-[85%] sm:w-[90%] lg:max-w-screen-xl mx-auto">
        <CarouselContent>
          {reviewList.map(({ image, name, userName, comment, rating }) => (
            <CarouselItem key={name} className="md:basis-1/2 lg:basis-1/3">
              <Card className="bg-muted/50 dark:bg-card p-4 rounded-lg shadow-lg">
                <CardContent className="pt-4 pb-0">
                  <div className="flex gap-1 pb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4"
                        fill={i < Math.floor(rating) ? "gold" : "gray"}
                        color={i < Math.floor(rating) ? "gold" : "gray"}
                      />
                    ))}
                  </div>
                  <p className="italic text-muted-foreground">{`"${comment}"`}</p>
                </CardContent>

                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={image} alt={name} />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{name}</CardTitle>
                      <CardDescription>{userName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};
