import { createClient } from "@/utils/supabase/server"
import { NextResponse,NextRequest } from "next/server"



//function to create new expenses records in the database 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Incoming admin_table Data:", body)

    const supabase = await createClient()
    const { data, error } = await supabase
    .from("booking")
    .insert(body)

    if (error) {
      console.error("Supabase Error:", error)
      throw error
    }

    console.log("Inserted admin_table:", data)
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


