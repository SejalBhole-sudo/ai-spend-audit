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

    // Validate input
    if (!email || !company || !role) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields (email, company, role)",
        },
        { status: 400 }
      );
    }

    console.log(`Processing lead submission for: ${email}`);

    // Save to Supabase database
    const { error: dbError } = await supabase
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

    if (dbError) {
      console.error("Database error:", dbError);
      return Response.json(
        {
          success: false,
          error: "Failed to save lead to database",
          details: dbError.message,
        },
        { status: 500 }
      );
    }

    // Send email via Resend
    try {
      const emailResult = await resend.emails.send({
        from: "noreply@credex-audit-beta.vercel.app", // Update to your domain
        to: email,
        subject: "Your AI Spend Audit Report | CredexIQ",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px;">
              <h1 style="color: #000; margin: 0; font-size: 28px;">CredexIQ</h1>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">AI Spend Audit Report</p>
            </div>

            <!-- Main Content -->
            <div style="background: #f9f9f9; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
              <p style="margin: 0 0 20px 0; color: #555; font-size: 16px;">
                Hi <strong>${company}</strong>,
              </p>

              <p style="margin: 0 0 20px 0; color: #666; font-size: 14px; line-height: 1.6;">
                Thanks for running your AI spend audit with CredexIQ! Here's a quick summary of your findings:
              </p>

              <!-- Savings Highlights -->
              <div style="background: #fff; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: center;">
                <div style="margin-bottom: 15px;">
                  <p style="color: #666; font-size: 13px; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1px;">Monthly Savings Opportunity</p>
                  <h2 style="color: #22c55e; font-size: 36px; font-weight: bold; margin: 0;">$${monthlySaving.toFixed(0)}</h2>
                </div>
                <div style="border-top: 1px solid #f0f0f0; padding-top: 15px;">
                  <p style="color: #666; font-size: 13px; margin: 0;">Annual Savings Potential</p>
                  <p style="color: #22c55e; font-size: 24px; font-weight: bold; margin: 5px 0 0 0;">$${annualSaving.toFixed(0)}</p>
                </div>
              </div>

              <!-- Role Info -->
              <div style="background: #f5f5f5; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  <strong>Your Role:</strong> ${role}
                </p>
              </div>
            </div>

            <!-- Next Steps -->
            <div style="background: #e3f2fd; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #1976d2; margin: 0 0 12px 0; font-size: 16px;">What's Next?</h3>
              <ul style="margin: 0; padding: 0; list-style: none; color: #333; font-size: 14px;">
                <li style="padding: 8px 0; color: #555;">✓ Review your detailed audit report above</li>
                <li style="padding: 8px 0; color: #555;">✓ Share the report with your team for discussion</li>
                <li style="padding: 8px 0; color: #555;">✓ Implement the recommended optimizations</li>
                <li style="padding: 8px 0; color: #555;">✓ Re-audit in 3-6 months to track progress</li>
              </ul>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 25px;">
              <a href="https://credex-audit-beta.vercel.app/" style="display: inline-block; background: #3b82f6; color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; transition: background 0.3s;">
                View Full Analysis
              </a>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center; color: #999; font-size: 12px;">
              <p style="margin: 0 0 10px 0;">
                CredexIQ helps teams optimize AI infrastructure spending
              </p>
              <p style="margin: 0; color: #bbb;">
                © 2026 CredexIQ. All rights reserved.
              </p>
            </div>
          </div>
        `,
      });

      console.log("Email sent successfully:", emailResult.id);
    } catch (emailError) {
      // Log email error but don't fail the whole request
      // The lead was saved successfully to the database
      console.error("Email sending error:", emailError);
      console.warn(`Warning: Lead saved but email failed for ${email}`);
    }

    return Response.json({
      success: true,
      message: "Lead saved and email sent successfully",
    });

  } catch (error) {
    console.error("API error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to process request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}