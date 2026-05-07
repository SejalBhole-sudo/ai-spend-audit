export function runAudit(data) {
  const recommendations = [];

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

  return recommendations;
}