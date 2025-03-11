import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";



export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const company_id = searchParams.get('id');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');




  
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("booking")
      .select("*")
      .eq("company_uid", company_id)
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    if (error) {
      console.error("Database error:", error);
      return { error: "Failed to fetch booking records" };
    }

    // Count records by booking method
    const bookingCounts = {
      online: 0,
      phone: 0,
      "in-person": 0,
    };
    
    data.forEach((record: { bookingMethod: 'online' | 'phone' | 'in-person' }) => {
      if (bookingCounts.hasOwnProperty(record.bookingMethod)) {
        bookingCounts[record.bookingMethod]++;
      }
    });

    const totalRecords = data.length;
    const percentage = {
      online: totalRecords > 0 ? (bookingCounts.online / totalRecords) * 100 : 0,
      phone: totalRecords > 0 ? (bookingCounts.phone / totalRecords) * 100 : 0,
      "in-person": totalRecords > 0 ? (bookingCounts["in-person"] / totalRecords) * 100 : 0,
    };

    return NextResponse.json({
      totalRecords,
      bookingCounts,
      percentage,
      
    },{status:200});
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
