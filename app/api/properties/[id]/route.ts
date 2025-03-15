import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";


// function to get expenses records from the database
export async function GET(
    request:Request,
    {params}:{params:Promise<{id : string}>}
){
const {id} =await params;
const { searchParams } = new URL(request.url);
const startDate = searchParams.get("startDate");
const endDate = searchParams.get("endDate");
const supabase = await createClient();

try{
    const {data,error} = await supabase.
    from('properties')
    .select('*')
    .eq('company_uid',id)
    .gte("created_at", startDate)
    .lte("created_at", endDate)

    if (error){
        console.error('failed to get properties details')
        return NextResponse.json(error,{status:400})
    }
    
return NextResponse.json(data,{status:200})

}catch(error){
    console.error(error)
    return NextResponse.json(error,{status:500})
}

}




export async function PATCH(
    request:Request,
    {params}:{params:Promise<{id : string}>}
){
const id =await params;
const body =await request.json();
const supabase = await createClient();

try{
    const {data,error} = await supabase.
    from('properties')
    .update(body)
    .eq('id',id)
    .single()

    if (error){
        console.error('failed to update properties details')
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
const id =await params;
const supabase = await createClient();

try{
  const {data,error} = await supabase.
  from('properties')
  .delete()
  .eq('id',id)
  .single()

  if (error){
      console.error('failed to delete properties details')
      return NextResponse.json(error,{status:400})
  }
return NextResponse.json(data,{status:200})
}catch(error){
  console.error(error)
  return NextResponse.json(error,{status:500})
}

}