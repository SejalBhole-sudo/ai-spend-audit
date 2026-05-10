// File: app/api/summary/route.js (or pages/api/summary.js depending on your Next.js setup)

export async function GET(req) {
  try {
    // DEBUG: List all available models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    const data = await response.json();
    console.log("Available models:", JSON.stringify(data.models, null, 2));
    
    return Response.json({
      message: "Check console logs for available models",
      models: data.models || data
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { auditResult, useCase } = await req.json();

    const prompt = `
You are an expert AI infrastructure cost analyst.
A user completed an AI spend audit.
Current monthly spend: $${auditResult.totalCurrentSpend}
Potential monthly savings: $${auditResult.totalMonthlySaving}
Primary use case: ${useCase}
Tools audited: ${auditResult.results
  .map(
    (r) =>
      `${r.toolName} (${r.plan}, $${r.currentSpend}/mo)`
  )
  .join(", ")}

Write a concise 100-word personalized summary with optimization advice.
    `;

    // Try gemini-1.5-flash first
    let modelName = "gemini-1.5-flash";
    let response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    let data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));

    // If gemini-1.5-flash fails, fallback to gemini-pro
    if (data.error && data.error.code === 404) {
      console.log("gemini-1.5-flash not available, trying gemini-pro...");
      modelName = "gemini-pro";
      
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      data = await response.json();
      console.log("Fallback response:", JSON.stringify(data, null, 2));
    }

    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    return Response.json({
      summary,
      model: modelName,
      success: !!summary,
    });
  } catch (error) {
    console.error("Error:", error);

    return Response.json(
      {
        summary: null,
        error: error.message || "Gemini API failed",
      },
      { status: 500 }
    );
  }
}