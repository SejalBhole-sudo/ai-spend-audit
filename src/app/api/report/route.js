import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    const { reportData } = body;

    const { data, error } =
      await supabase
        .from("reports")
        .insert([
          {
            report_data: reportData,
          },
        ])
        .select()
        .single();

    if (error) {
      console.error(error);

      return Response.json(
        {
          success: false,
          error:
            "Failed to create report",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      id: data.id,
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error:
          "Something went wrong",
      },
      { status: 500 }
    );
  }
}