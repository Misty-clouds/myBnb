// app/api/expenses/[id]/route.js
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Update expense
export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    console.log("Updating Expense Data:", body);

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("expenses")
      .update(body)
      .eq("id", params.id)
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    console.log("Updated Expense:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Catch Block Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 400 }
    );
  }
}

// Delete expense
export async function DELETE(request, { params }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    return NextResponse.json(
      { message: "Expense deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Catch Block Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 400 }
    );
  }
}
