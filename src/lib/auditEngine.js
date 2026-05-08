export function runAudit(data) {
  const recommendations = [];

  // ChatGPT conditions
  if (
    data.tool.toLowerCase() === "chatgpt" &&
    data.plan.toLowerCase() === "team" &&
    Number(data.seats) <= 2
  ) {
    recommendations.push({
      current: "ChatGPT Team",
      recommended: "ChatGPT Plus",
      savings: 20,
      reason:
        "Team plan is expensive for very small teams.",
    });
  }

  // Cursor conditions
  if (
    data.tool.toLowerCase() === "cursor" &&
    Number(data.seats) <= 1
  ) {
    recommendations.push({
      current: "Cursor Business",
      recommended: "Cursor Pro",
      savings: 20,
      reason:
        "Business features may not be necessary for solo developers.",
    });
  }

  // 🆕 ADD THIS: Default recommendation if no specific matches
  if (recommendations.length === 0) {
    recommendations.push({
      current: `${data.tool} - ${data.plan}`,
      recommended: "Review your plan based on actual usage",
      savings: Math.round(Number(data.monthlySpend) * 0.1), // 10% estimated savings
      reason:
        "Your current setup is already optimized. Monitor usage over time to find additional savings.",
    });
  }

  return recommendations;
}