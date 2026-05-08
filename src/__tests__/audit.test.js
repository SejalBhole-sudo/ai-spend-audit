import { describe, it, expect } from "vitest";
import { runAudit } from "../lib/auditEngine.js";

describe("Audit Engine — Core Rules", () => {

  it("returns optimal status when spend matches official pricing", () => {
    const result = runAudit({
      tools: {
        cursor: {
          plan: "Pro",
          seats: 1,
          monthlySpend: "20",
        },
      },
      teamSize: 1,
      useCase: "coding",
    });

    expect(result.totalMonthlySaving).toBeLessThan(10);
  });

  it("flags overpaying when spend exceeds official rate", () => {
    const result = runAudit({
      tools: {
        cursor: {
          plan: "Pro",
          seats: 1,
          monthlySpend: "50",
        },
      },
      teamSize: 1,
      useCase: "coding",
    });

    const cursorResult = result.results.find(
      (r) => r.toolId === "cursor"
    );

    const hasOverpayingFlag =
      cursorResult.recommendations.some(
        (r) => r.type === "overpaying_retail"
      );

    expect(hasOverpayingFlag).toBe(true);
  });

  it("flags Claude Team as wrong plan for under 5 seats", () => {
    const result = runAudit({
      tools: {
        claude: {
          plan: "Team",
          seats: 2,
          monthlySpend: "60",
        },
      },
      teamSize: 2,
      useCase: "writing",
    });

    const claudeResult = result.results.find(
      (r) => r.toolId === "claude"
    );

    const hasWrongPlan =
      claudeResult.recommendations.some(
        (r) => r.type === "wrong_plan"
      );

    expect(hasWrongPlan).toBe(true);
  });

  it("flags GitHub Copilot as redundant with Cursor", () => {
    const result = runAudit({
      tools: {
        cursor: {
          plan: "Pro",
          seats: 1,
          monthlySpend: "20",
        },

        github_copilot: {
          plan: "Individual",
          seats: 1,
          monthlySpend: "10",
        },
      },
      teamSize: 1,
      useCase: "coding",
    });

    const copilotResult = result.results.find(
      (r) => r.toolId === "github_copilot"
    );

    const isRedundant =
      copilotResult.recommendations.some(
        (r) => r.type === "redundant"
      );

    expect(isRedundant).toBe(true);
  });

  it("calculates savings correctly", () => {
    const result = runAudit({
      tools: {
        cursor: {
          plan: "Pro",
          seats: 1,
          monthlySpend: "50",
        },
      },
      teamSize: 1,
      useCase: "coding",
    });

    expect(result.totalMonthlySaving).toBeGreaterThan(0);

    expect(result.totalAnnualSaving).toBe(
      result.totalMonthlySaving * 12
    );
  });

  it("flags Claude Max downgrade for writing", () => {
    const result = runAudit({
      tools: {
        claude: {
          plan: "Max",
          seats: 1,
          monthlySpend: "100",
        },
      },
      teamSize: 1,
      useCase: "writing",
    });

    const claudeResult = result.results.find(
      (r) => r.toolId === "claude"
    );

    const hasDowngrade =
      claudeResult.recommendations.some(
        (r) => r.type === "downgrade"
      );

    expect(hasDowngrade).toBe(true);
  });

  it("returns isOptimal true when no savings found", () => {
    const result = runAudit({
      tools: {
        cursor: {
          plan: "Pro",
          seats: 1,
          monthlySpend: "20",
        },
      },
      teamSize: 1,
      useCase: "coding",
    });

    expect(result.isOptimal).toBe(true);
  });

});