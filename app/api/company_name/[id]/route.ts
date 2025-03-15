// app/api/expenses/[id]/route.js
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";


// function to get expenses records from the database
export async function GET(
    _request:Request,
    {params}:{params:Promise<{id : string}>}
){
const {id} =await params;
const supabase = await createClient();

try{
    const {data,error} = await supabase.
    from('company_name')
    .select('*')
    .eq('uid',id)
    .single()

    if (error){
        console.error('failed to get company_name details')
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
const {id} =await params;
const body =await request.json();
const supabase = await createClient();

try{
    const {data,error} = await supabase.
    from('company_name')
    .update(body)
    .eq('id',id)
    .single()

    if (error){
        console.error('failed to update company_name details')
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
  from('company_name')
  .delete()
  .eq('id',id)
  .single()

  if (error){
      console.error('failed to delete company_name details')
      return NextResponse.json(error,{status:400})
  }
return NextResponse.json(data,{status:200})
}catch(error){
  console.error(error)
  return NextResponse.json(error,{status:500})
}

}