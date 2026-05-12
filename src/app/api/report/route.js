import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();
    const { reportData } = body;

    // Validate input
    if (!reportData) {
      return Response.json(
        {
          success: false,
          error: "No report data provided",
        },
        { status: 400 }
      );
    }

    console.log('Creating report...', {
      hasSavings: !!reportData.totalMonthlySaving,
      hasResults: !!reportData.results,
    });

    // Verify Supabase connection
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      return Response.json(
        {
          success: false,
          error: "Server configuration error",
          details: "Supabase credentials not configured",
        },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          report_data: reportData,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Database insertion error:', {
        message: error.message,
        code: error.code,
        details: error.details,
      });

      return Response.json(
        {
          success: false,
          error: "Failed to create report in database",
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!data || !data.id) {
      console.error('No ID returned from database insert');
      return Response.json(
        {
          success: false,
          error: "Report created but ID not returned",
        },
        { status: 500 }
      );
    }

    console.log('Report created successfully with ID:', data.id);

    return Response.json({
      success: true,
      id: data.id,
    });

  } catch (error) {
    console.error('Report API error:', {
      message: error.message,
      stack: error.stack,
    });

    return Response.json(
      {
        success: false,
        error: "Failed to create report",
        details: error.message,
      },
      { status: 500 }
    );
  }
}