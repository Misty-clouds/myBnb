// app/api/expenses/[id]/route.js
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";


// function to get bookinh records from the database

export async function GET(
  request:Request,
  {params}:{params:Promise<{id : string}>}
){

  const {id}= await params;
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const created_by = searchParams.get("created_by");

  const supabase = await createClient();

  try {
    let query = supabase.from("booking").select("*").eq('company_uid',id);

    // **Apply date range filter if provided**
    if (startDate && endDate) {
      query = query.gte("created_at", startDate).lte("created_at", endDate);
    } else if (startDate) {
      query = query.gte("created_at", startDate);
    } else if (endDate) {
      query = query.lte("created_at", endDate);
    }

    if (created_by) query = query.eq("created_by", created_by);

    // // **Pagination: Calculate start and end indexes**
    // const start = (page - 1) * limit;
    // const end = start + limit - 1;
    // query = query.range(start, end).order("entryDate", { ascending: false }); // Sort by latest entries
     query = query.order("created_at", { ascending: false }); 

    

    const { data, error } = await query;

    if (error) {
      console.error("Failed to get booking details:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



export async function PATCH(
    request:Request,
    {params}:{params:Promise<{id : string}>}
){
const {id} =await params;
const body =await request.json();
const supabase = await createClient();

try{
    const {data,error} = await supabase.
    from('booking')
    .update(body)
    .eq('id',id)
    .single()

    if (error){
        console.error('failed to update booking details')
        return NextResponse.json(error,{status:400})
    }
return NextResponse.json(data,{status:200})
}catch(error){
    console.error(error)
    return NextResponse.json(error,{status:500})
}

}




//function to delete booking records from the database
export async function DELETE(
  _request:Request,
  {params}:{params:Promise<{id : string}>}
){
const {id} =await params;
const supabase = await createClient();

try{
  const {data,error} = await supabase.
  from('booking')
  .delete()
  .eq('id',id)
  .single()

  if (error){
      console.error('failed to delete booking details')
      return NextResponse.json(error,{status:400})
  }
return NextResponse.json(data,{status:200})
}catch(error){
  console.error(error)
  return NextResponse.json(error,{status:500})
}

}