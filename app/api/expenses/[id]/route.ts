import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
export async function GET(request: Request, 
  {params}:{params:Promise<{id : string}>}
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const supabase = await createClient();

  try {
    let query = supabase.from("expenses").select("*").eq("company_uid", id);

    if (startDate && endDate) {
      query = query.gte("date", startDate).lte("date", endDate);
    }

   
    const { data, error } = await query;

    if (error) {
      console.error("Failed to get expenses details:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
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
    from('expenses')
    .update(body)
    .eq('id',id)
    .single()

    if (error){
        console.error('failed to get user details')
        return NextResponse.json(error,{status:400})
    }
return NextResponse.json(data,{status:200})
}catch(error){
    console.error(error)
    return NextResponse.json(error,{status:500})
}

}




export async function DELETE(
  _request:Request,
  {params}:{params:Promise<{id : string}>}
){
const {id} =await params;
const supabase = await createClient();

try{
  const {data,error} = await supabase.
  from('expenses')
  .delete()
  .eq('id',id)
  .single()

  if (error){
      console.error('failed to get user details')
      return NextResponse.json(error,{status:400})
  }
return NextResponse.json(data,{status:200})
}catch(error){
  console.error(error)
  return NextResponse.json(error,{status:500})
}

}