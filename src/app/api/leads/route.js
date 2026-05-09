import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      email,
      company,
      role,
      monthlySaving,
      annualSaving,
    } = body;

    const { error } = await supabase
      .from("leads")
      .insert([
        {
          email,
          company,
          role,
          monthly_saving: monthlySaving,
          annual_saving: annualSaving,
        },
      ]);

    if (error) {
      console.error(error);

      return Response.json(
        {
          success: false,
          error: "Database insert failed",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Failed to save lead",
      },
      { status: 500 }
    );
  }
}