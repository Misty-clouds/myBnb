import { createClient } from "@/utils/supabase/server"
import { NextResponse,NextRequest } from "next/server"


//function to fetch expenses records from the database
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  try {
    const supabase = await createClient()
    const { data, error } = await fetchBookings(supabase, startDate, endDate)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error("Error fetching expenses:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

async function fetchBookings(supabase: any, startDate: string | null, endDate: string | null) {
  let query = supabase.from("expenses").select("*")

  if (startDate && endDate) {
    query = query.gte("date", startDate).lte("date", endDate)
  }

  return await query
}



//function to create new expenses records in the database 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Incoming Booking Data:", body)

    const supabase = await createClient()
    const { data, error } = await supabase.from("expenses").insert(body).select()

    if (error) {
      console.error("Supabase Error:", error)
      throw error
    }

    console.log("Inserted expenses:", data)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Catch Block Error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    } else {
      return NextResponse.json({ error: "An unknown error occurred" }, { status: 400 })
    }
  }
}


