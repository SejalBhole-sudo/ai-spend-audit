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

const [results, setResults] = useState([]);

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


const handleAudit = () => {
  if (
    !formData.tool ||
    !formData.plan ||
    !formData.monthlySpend ||
    !formData.seats ||
    !formData.useCase
  ) {
    alert("Please fill all fields.");
    return;
  }

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

  localStorage.setItem(
  "audit_input",
  JSON.stringify(formattedData)
);

  router.push("/results");
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

      <button
        onClick={handleAudit}
        className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
      >
        Run Audit
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