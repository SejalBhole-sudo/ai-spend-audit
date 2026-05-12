import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();
    const { reportData } = body;

    // Validate input
    if (!reportData) {
      console.warn("No report data provided");
      return Response.json(
        {
          success: false,
          error: "No report data provided",
        },
        { status: 400 }
      );
    }

    // Verify environment variables are configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
      return Response.json(
        {
          success: false,
          error: "Server not configured: Missing Supabase URL",
        },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
      return Response.json(
        {
          success: false,
          error: "Server not configured: Missing Supabase key",
        },
        { status: 500 }
      );
    }

    // Attempt to insert into database
    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          report_data: reportData,
        },
      ])
      .select()
      .single();

    // Handle database errors
    if (error) {
      console.error("Database insertion error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      // Provide specific error messages based on error type
      let userMessage = "Failed to save report";
      
      if (error.code === "42P01") {
        userMessage = "Database table 'reports' not found. Please create it.";
      } else if (error.code === "42501") {
        userMessage = "Permission denied. Table permissions need to be configured.";
      } else if (error.code === "23505") {
        userMessage = "Duplicate entry. This report already exists.";
      }

      return Response.json(
        {
          success: false,
          error: userMessage,
          code: error.code,
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Verify data was returned
    if (!data || !data.id) {
      console.error("No ID returned from database insert", { data });
      return Response.json(
        {
          success: false,
          error: "Report created but no ID returned",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      id: data.id,
    });

  } catch (error) {
    console.error("Report API error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return Response.json(
      {
        success: false,
        error: `Error: ${error.message}`,
      },
      { status: 500 }
    );
  }
}