import { supabase } from "@/lib/supabase";

export async function generateMetadata({ params }) {
  return {
    title:
      "AI Spend Audit Report | Discover Hidden AI Cost Savings",

    description:
      "See detailed AI spend optimization recommendations, uncover hidden SaaS redundancies, and discover potential monthly and annual savings across your AI tooling stack.",

    openGraph: {
      title:
        "AI Spend Audit Report | Credex Audit",

      description:
        "Discover hidden savings opportunities across ChatGPT, Claude, Cursor, Gemini, Copilot, and more.",

      type: "website",

      images: [
        {
          url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",

          width: 1200,

          height: 630,

          alt: "AI Spend Audit Dashboard",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title:
        "AI Spend Audit Report",

      description:
        "Discover hidden AI tooling savings and optimization opportunities.",

      images: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      ],
    },
  };
}

export default async function ReportPage({ params }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📄</div>

          <h1 className="text-3xl font-bold text-white mb-3">
            Report not found
          </h1>

          <p className="text-gray-400 mb-6">
            This report may have been removed, expired, or never existed.
          </p>

          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all"
          >
            Run Free Audit →
          </a>
        </div>
      </main>
    );
  }

  const report = data.report_data;

  const highSavings = report.totalMonthlySaving > 500;
  const lowSavings = report.totalMonthlySaving < 100;

  return (
    <main className="relative overflow-hidden min-h-screen bg-[#0B1120] text-white">

      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[800px] h-[900px] bg-sky-900/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 sm:py-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">

          <div
            className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent"
            style={{
              WebkitTextStroke: "1px rgba(10, 10, 81, 0.35)",
            }}
          >
            CredexIQ
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2">
            <span className="text-xs text-gray-300">
              Public Shareable Report
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div
          className={`rounded-3xl p-10 mb-8 backdrop-blur-xl border transition-all duration-500 ${
            highSavings
              ? "bg-gradient-to-br from-green-600/20 to-emerald-600/10 border-green-400/20"
              : lowSavings
              ? "bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border-blue-400/20"
              : "bg-gradient-to-br from-indigo-600/20 to-blue-600/10 border-indigo-400/20"
          }`}
        >

          <div className="text-center">

            <p className="text-gray-300 text-sm uppercase tracking-widest mb-3">
              Potential Monthly Savings
            </p>

            <h1 className="text-5xl sm:text-6xl font-black mb-4 bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
              ${report.totalMonthlySaving.toFixed(0)}
            </h1>

            <p className="text-gray-300 text-lg">
              That's{" "}
              <span className="font-bold text-white">
                ${report.totalAnnualSaving.toFixed(0)}/year
              </span>{" "}
              in identified savings opportunities
            </p>

          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">
              Monthly Savings
            </p>

            <p className="text-3xl font-black text-green-400">
              ${report.totalMonthlySaving.toFixed(0)}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">
              Annual Savings
            </p>

            <p className="text-3xl font-black text-blue-300">
              ${report.totalAnnualSaving.toFixed(0)}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">
              Tools Analyzed
            </p>

            <p className="text-3xl font-black text-white">
              {report.results.length}
            </p>
          </div>

        </div>

        {/* Recommendations */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            📊 AI Tool Recommendations
          </h2>

          <div className="space-y-5">

            {report.results.map((r) => (
              <div
                key={r.toolId}
                className="border border-white/10 rounded-2xl p-6 bg-white/[0.02] hover:border-white/20 transition-all duration-300"
              >

                <div className="flex items-start justify-between mb-4">

                  <div>
                    <h3 className="font-semibold text-lg text-white">
                      {r.toolName}
                    </h3>

                    <p className="text-sm text-gray-400">
                      {r.plan}
                    </p>
                  </div>

                  {r.totalSaving > 0 && (
                    <div className="text-right">
                      <p className="text-2xl font-black text-green-400">
                        ${r.totalSaving.toFixed(0)}
                      </p>

                      <p className="text-xs text-gray-400">
                        savings/month
                      </p>
                    </div>
                  )}

                </div>

                {r.recommendations.length === 0 ? (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <p className="text-sm text-green-300">
                      ✅ This tool is already well optimized
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-3 pt-4 border-t border-white/10">

                    {r.recommendations.map((rec, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-300 flex items-start gap-3"
                      >
                        <span className="text-yellow-400 flex-shrink-0 mt-1">
                          →
                        </span>

                        <span>{rec.message}</span>
                      </li>
                    ))}

                  </ul>
                )}

              </div>
            ))}

          </div>

        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-blue-600/30 to-indigo-600/20 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-8 mb-8 text-center">

          <h3 className="text-2xl font-bold mb-3">
            Want to optimize your AI spend?
          </h3>

          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Run your own free AI Spend Audit and discover hidden savings
            opportunities across ChatGPT, Claude, Gemini, Copilot, Cursor,
            and more.
          </p>

          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all"
          >
            Run Free Audit →
          </a>

        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs">
          <p>CredexIQ © 2026</p>
        </div>

      </div>
    </main>
  );
}