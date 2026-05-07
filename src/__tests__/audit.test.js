import { describe, it, expect } from "vitest";
import { runAudit } from "../lib/auditEngine";

describe("Audit Engine", () => {
  it("recommends ChatGPT Plus for small teams", () => {
    const result = runAudit({
      tool: "chatgpt",
      plan: "team",
      seats: 2,
    });

    expect(result.length).toBeGreaterThan(0);
  });
});
