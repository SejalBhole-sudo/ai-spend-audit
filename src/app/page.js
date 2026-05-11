"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ToolCard from "../components/ToolCard";
import { runAudit } from "../lib/auditEngine";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
  tool: "",
  plan: "",
  monthlySpend: "",
  seats: "",
  useCase: "",
});
const [loading, setLoading] = useState(false);
const [results, setResults] = useState([]);
const [error, setError] = useState("");

useEffect(() => {
  const savedData = localStorage.getItem("auditForm");

  if (savedData) {
    setFormData(JSON.parse(savedData));
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    "auditForm",
    JSON.stringify(formData)
  );
}, [formData]);


const handleAudit = async () => {
  if (
    !formData.tool ||
    !formData.plan ||
    !formData.monthlySpend ||
    !formData.seats ||
    !formData.useCase
  ) {
    setError("Please complete all required fields.");
return;
  }
  setError("");
  setLoading(true);

  try {
    const formattedData = {
      tools: {
        [formData.tool]: {
          plan: formData.plan,
          seats: Number(formData.seats),
          monthlySpend: formData.monthlySpend,
        },
      },
      teamSize: Number(formData.seats),
      useCase: formData.useCase,
    };

    const auditResults = runAudit(formattedData);

    setResults(auditResults.results || []);

    localStorage.setItem(
      "audit_input",
      JSON.stringify(formattedData)
    );

    router.push("/results");

  } catch (error) {
    console.error("Audit failed:", error);

    alert(
      "Something went wrong while generating the audit."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen flex flex-col items-center p-8">
      <h1 className="text-5xl font-bold mb-4">
        AI Spend Audit
      </h1>

      <p className="text-gray-600 text-lg mb-10">
        Optimize your AI subscription costs.
      </p>

      <ToolCard
  formData={formData}
  setFormData={setFormData}
/>
{error && (
  <div className="mt-4 w-full max-w-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
    {error}
  </div>
)}

<button
  onClick={handleAudit}
  disabled={loading}
  className={`mt-6 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
    loading
      ? "bg-gray-400 cursor-not-allowed text-white"
      : "bg-black hover:bg-gray-800 text-white"
  }`}
>
  {loading ? "Generating Audit..." : "Run Free Audit →"}
</button>

      <div className="mt-10 w-full max-w-xl">
        {results.map((result, index) => (
          <div
            key={index}
            className="border rounded-lg p-5 mb-4"
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