import { Months } from "../constants";
import { Card, CardContent, CardHeader, CardTitle,CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function BookingPage({year,company_id}:{year:string,company_id:string}) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 px-5 md:grid-cols-4">
      {Months.map((monthData) => (
      <Link key={monthData.id} href={`/dashboard/booking/${monthData.id}/${year}/${company_id}`}>
        <Card className="rounded-lg border bg-card text-card-foreground shadow-sm border-secondary transition-all duration-200 hover:transform hover:scale-105">
          <CardHeader>
            <CardTitle>{monthData.month}</CardTitle>
            <CardDescription>{year}</CardDescription>
          </CardHeader>
        </Card>
      </Link>
    ))}
          </div>
    </div>
  );
}
