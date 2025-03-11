import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const company_id = searchParams.get("id");
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');


  if (!company_id) {
    return NextResponse.json({ error: "Missing company ID" }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    // Fetch bookings data
    const { data: booking_data, error: booking_error } = await supabase
      .from("booking")
      .select("created_at, totalAmount")
      .eq("company_uid", company_id)
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    if (booking_error) {
      console.error("Database error (booking):", booking_error);
      return NextResponse.json({ error: "Failed to fetch booking records" }, { status: 500 });
    }

    // Fetch expenses data
    const { data: expenses_data, error: expenses_error } = await supabase
      .from("expenses")
      .select("date, amount")
      .eq("company_uid", company_id)
      .gte("date", startDate)
      .lte("date", endDate);

    if (expenses_error) {
      console.error("Database error (expenses):", expenses_error);
      return NextResponse.json({ error: "Failed to fetch expenses records" }, { status: 500 });
    }

    // Helper function to format date to "MMM" (Jan, Feb, etc.)
    const formatToMonth = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleString("en-US", { month: "short" });
    };

    // Process bookings data to group by month
    const revenueByMonth: Record<string, number> = {};
    booking_data.forEach(({ created_at, totalAmount }) => {
      const month = formatToMonth(created_at);
      revenueByMonth[month] = (revenueByMonth[month] || 0) + totalAmount;
    });

    // Process expenses data to group by month
    const expensesByMonth: Record<string, number> = {};
    expenses_data.forEach(({ date, amount }) => {
      const month = formatToMonth(date);
      expensesByMonth[month] = (expensesByMonth[month] || 0) + amount;
    });

    // Define all months to ensure all are represented
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Construct final chart data
    const chartData = months.map((month) => ({
      month,
      revenue: revenueByMonth[month] || 0,
      expenses: expensesByMonth[month] || 0,
    }));

    return NextResponse.json(chartData, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
