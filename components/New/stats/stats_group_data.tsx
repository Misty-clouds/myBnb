import { useEffect, useState } from "react";
import StatsCardGroup from "./group_stats";
import { useTranslations } from "next-intl";
import { useUserContext } from "@/contexts/UserProvider"
import { getBookingStats } from "@/helper-functions"; // Import the helper function
import { GetBookingStats } from "@/types"; // Ensure you have the correct type
import { Card,CardContent } from "@/components/ui/card";
export default function StatsGroupDashboardData({company_id,startDate,endDate}: {company_id: string,startDate:string,endDate:string}) {
  const t = useTranslations("Dashboard");
  const {userEmail,userId}=useUserContext()

  // State to store fetched stats
  const [stats, setStats] = useState<GetBookingStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        if(startDate===""||endDate==="")return;
        const data = await getBookingStats(company_id,startDate, endDate);
        setStats(data);
      } catch (err) {
        setError("Failed to load stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [startDate,endDate,company_id]);

  // Loading state
  if (loading) return <div className="w-full align-middle m-4 h-40 justify-center text-center ">
    <Card className="m-auto aspect-video rounded-xl  w-full h-full">
      <CardContent className="m-auto">
      </CardContent>
    </Card>
  </div>;
  if (error) return <p>{error}</p>;
  if (!stats) return <p>No stats available</p>;

  // Map the fetched data to StatsCard format
  const formattedStats = [
    { label: t("numberOfBookings"), value: stats.number_of_bookings, trend: { type: stats.number_of_bookings_trend, value: stats.number_of_bookings_change?.toString() || "0" } },
    { label: t("totalExpenses"), value: stats.total_expenses, trend: { type: stats.total_expenses_trend, value: stats.total_expenses_change?.toString() || "0" } },
    { label: t("totalRevenue"), value: stats.total_revenue, trend: { type: stats.total_revenue_trend, value: stats.total_revenue_change?.toString() || "0" } },
    { label: t("totalProfit"), value: stats.total_profit, trend: { type: stats.total_profit_trend, value: stats.total_profit_change?.toString() || "0" } },
  ];

  return <StatsCardGroup 
  
  stats={formattedStats} />;
}
