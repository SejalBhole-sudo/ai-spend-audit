"use client";

import { useEffect, useState } from "react";

export default function ResultsPage() {
  const [savedResults, setSavedResults] = useState([]);

  useEffect(() => {
    const results = JSON.parse(
      localStorage.getItem("auditResults")
    );

    if (results) {
      setSavedResults(results);
    }
  }, []);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">
        Audit Results
      </h1>

      <div className="space-y-4">
        {savedResults.map((result, index) => (
          <div
            key={index}
            className="border rounded-lg p-5"
          >
            <h2 className="text-xl font-bold mb-2">
              {result.current}
            </h2>

            <p>
              Recommended: {result.recommended}
            </p>

            <p>
              Monthly Savings: ${result.savings}
            </p>

            <p className="text-gray-600 mt-2">
              {result.reason}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}