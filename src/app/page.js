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
    <main className="relative overflow-hidden min-h-screen flex flex-col items-center p-8 bg-[#0B1120] text-white">
      <div className="absolute top-0 left-0 w-[800px] h-[900px] bg-sky-900/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

<div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div
  className="mb-8 text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(96,165,250,0.9)]"
  style={{
    WebkitTextStroke: "1px rgba(10, 10, 81, 0.35)",
  }}
>
  CredexIQ
</div>

<h1 className="text-5xl md:text-6xl font-bold mb-4 text-center leading-tight">
  Stop Overpaying for AI Tools
</h1>

<p className="text-sky-100 text-lg md:text-xl mb-12 text-center max-w-2xl">
  Instantly audit your ChatGPT, Claude, Cursor, Gemini, and AI tooling spend — and uncover hidden monthly savings.
</p>

<div className="flex flex-wrap justify-center gap-3 mb-10 text-base text-gray-50">
  <span className="bg-black/80 border border-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
    ChatGPT
  </span>

  <span className="bg-black/80 border border-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
    Claude
  </span>

  <span className="bg-black/80 border border-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
    Cursor
  </span>

  <span className="bg-black/80 border border-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
    Gemini
  </span>

  <span className="bg-black/80 border border-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
    GitHub Copilot
  </span>
</div>

      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/40 rounded-3xl p-10 shadow-[0_0_60px_rgba(59,130,246,0.15)]">
  <ToolCard
    formData={formData}
    setFormData={setFormData}
  />
</div>
{error && (
  <div className="mt-6 w-full max-w-2xl bg-red-500/10 border border-red-400/20 backdrop-blur-md text-red-200 px-5 py-4 rounded-2xl text-sm shadow-lg">
    {error}
  </div>
)}

<button
  onClick={handleAudit}
  disabled={loading}
  className={`mt-10 px-10 py-4 text-xl rounded-2xl font-semibold transition-all duration-300 shadow-[0_0_60px_rgba(59,130,246,0.15)] ${
    loading
      ? "bg-gray-700 text-gray-300 cursor-not-allowed"
      : "bg-white text-black hover:scale-[1.02] hover:bg-gray-200"
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