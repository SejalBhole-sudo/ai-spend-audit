import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

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

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your AI Spend Audit Report",
      html: `
        <h2>Your AI Spend Audit</h2>

        <p>
          Estimated Monthly Savings:
          <strong>$${monthlySaving}</strong>
        </p>

        <p>
          Estimated Annual Savings:
          <strong>$${annualSaving}</strong>
        </p>

        <p>
          Thanks for trying Credex Audit.
          We'll notify you when additional
          optimization opportunities become available.
        </p>
      `,
    });

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