"use client";

import { useEffect, useState } from "react";

export default function ResultsPage() {
  const [savedResults, setSavedResults] = useState(null);

  useEffect(() => {
    const results = JSON.parse(
      localStorage.getItem("auditResults")
    );

    if (results) {
      setSavedResults(results);
    }
  }, []);

  if (!savedResults) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading results...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">
        Audit Results
      </h1>

      <div className="mb-8 p-5 border rounded-lg">
        <h2 className="text-2xl font-bold">
          Estimated Savings
        </h2>

        <p className="mt-2">
          Monthly Savings:
          <span className="font-semibold">
            {" "}
            ${savedResults.totalMonthlySaving}
          </span>
        </p>

        <p>
          Annual Savings:
          <span className="font-semibold">
            {" "}
            ${savedResults.totalAnnualSaving}
          </span>
        </p>

        <p>
          Current Spend:
          <span className="font-semibold">
            {" "}
            ${savedResults.totalCurrentSpend}
          </span>
        </p>
      </div>

      <div className="space-y-6">
        {savedResults.results.map((result, index) => (
          <div
            key={index}
            className="border rounded-lg p-5"
          >
            <h2 className="text-2xl font-bold mb-2">
              {result.toolName}
            </h2>

            <p>
              Current Plan: {result.plan}
            </p>

            <p>
              Seats: {result.seats}
            </p>

            <p>
              Current Spend: ${result.currentSpend}
            </p>

            <p className="mt-2 font-semibold">
              Potential Savings:
              ${result.totalSaving}
            </p>

            <div className="mt-4 space-y-3">
              {result.recommendations.map(
                (rec, recIndex) => (
                  <div
                    key={recIndex}
                    className="bg-gray-100 p-3 rounded"
                  >
                    <p>{rec.message}</p>

                    <p className="font-medium mt-1">
                      Save: ${rec.saving}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}