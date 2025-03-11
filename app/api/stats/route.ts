import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const start_date = searchParams.get("start_date");
  const end_date = searchParams.get("end_date");
  const id =searchParams.get('id')

  if (!id || !start_date || !end_date) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    // Calculate history date range
    const history_end_date = start_date;
    const history_start_date = new Date(new Date(start_date).getTime() - (new Date(end_date).getTime() - new Date(start_date).getTime())).toISOString().split("T")[0];

    // Get current stats
    const { data: bookings, error: bookingsError } = await supabase
      .from("booking")
      .select("totalAmount")
      .eq("company_uid", id)
      .gte("created_at", start_date)
      .lte("created_at", end_date);

    if (bookingsError) throw bookingsError;

    const number_of_bookings = bookings.length;
    const total_revenue = bookings.reduce((sum: number, b: { totalAmount: number }) => sum + b.totalAmount, 0);

    const { data: expenses, error: expensesError } = await supabase
      .from("expenses")
      .select("amount")
      .eq("company_uid", id)
      .gte("date", start_date)
      .lte("date", end_date);

    if (expensesError) throw expensesError;

    const total_expenses = expenses.reduce((sum: number, e: { amount: number }) => sum + e.amount, 0);
    const total_profit = total_revenue - total_expenses;

    // Get historical stats
    const { data: historyBookings, error: historyBookingsError } = await supabase
      .from("booking")
      .select("totalAmount")
      .eq("company_uid", id)
      .gte("created_at", history_start_date)
      .lte("created_at", history_end_date);

    if (historyBookingsError) throw historyBookingsError;

    const history_number_of_bookings = historyBookings.length;
    const history_total_revenue = historyBookings.reduce((sum: number, b: { totalAmount: number }) => sum + b.totalAmount, 0);

    const { data: historyExpenses, error: historyExpensesError } = await supabase
      .from("expenses")
      .select("amount")
      .eq("company_uid", id)
      .gte("date", history_start_date)
      .lte("date", history_end_date);

    if (historyExpensesError) throw historyExpensesError;

    const history_total_expenses = historyExpenses.reduce((sum: number, e: { amount: number }) => sum + e.amount, 0);
    const history_total_profit = history_total_revenue - history_total_expenses;

    // Calculate percentage change and trends
    const calculateChange = (current: number, previous: number) => (previous === 0 ?  current : ((current - previous) * 100.0) / previous);
    const calculateTrend = (current: number, previous: number) => (current > previous ? "increase" : current < previous ? "decrease" : "no change");

    return NextResponse.json({
      number_of_bookings,
      total_revenue,
      total_expenses,
      total_profit,
      number_of_bookings_change: calculateChange(number_of_bookings, history_number_of_bookings),
      number_of_bookings_trend: calculateTrend(number_of_bookings, history_number_of_bookings),
      total_revenue_change: calculateChange(total_revenue, history_total_revenue),
      total_revenue_trend: calculateTrend(total_revenue, history_total_revenue),
      total_expenses_change: calculateChange(total_expenses, history_total_expenses),
      total_expenses_trend: calculateTrend(total_expenses, history_total_expenses),
      total_profit_change: calculateChange(total_profit, history_total_profit),
      total_profit_trend: calculateTrend(total_profit, history_total_profit),
    }, { status: 200 });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}