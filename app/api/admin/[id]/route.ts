import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";


// function to get expenses records from the database
export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
  ) {
    const { id } = await params; 
    const supabase =await createClient(); 
  
    try {
      const { data, error } = await supabase
        .from("admin_table")
        .select("*")
        .eq("uid", id) 
  
      if (error) {
        console.error("Failed to get admin details", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
  
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      console.error("Unexpected error:", error);
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
    from('admin_table')
    .update(body)
    .eq('uid',id)
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




//function to delete expenses records from the database
export async function DELETE(
  _request:Request,
  {params}:{params:Promise<{id : string}>}
){
const {id} =await params;
const supabase = await createClient();

try{
  const {data,error} = await supabase.
  from('admin_table')
  .delete()
  .eq('uid',id)
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