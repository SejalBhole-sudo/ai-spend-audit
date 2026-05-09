export async function POST(req) {
  try {
    const { auditResult, useCase } =
      await req.json();

    const prompt = `
You are an expert AI infrastructure cost analyst.

A user completed an AI spend audit.

Current monthly spend: $${auditResult.totalCurrentSpend}
Potential monthly savings: $${auditResult.totalMonthlySaving}
Primary use case: ${useCase}

Tools audited:
${auditResult.results
  .map(
    (r) =>
      `${r.toolName} (${r.plan}, $${r.currentSpend}/mo)`
  )
  .join(", ")}

Write a short personalized summary.

Be concise, direct, and useful.
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model:
            "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log(data)

    return Response.json({
      summary:
        data.choices?.[0]?.message?.content ||
        null,
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        summary: null,
        error: "API unavailable",
      },
      { status: 500 }
    );
  }
}