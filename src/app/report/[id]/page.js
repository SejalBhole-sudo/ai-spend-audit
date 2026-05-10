import { supabase } from "@/lib/supabase";
export async function generateMetadata({
  params,
}) {
  return {
    title:
      "AI Spend Audit Report",

    description:
      "See how much this AI stack could save with Credex Audit.",

    openGraph: {
      title:
        "AI Spend Audit Report",

      description:
        "Discover hidden savings opportunities in AI tooling.",

      type: "website",
    },

    twitter: {
      card: "summary_large_image",

      title:
        "AI Spend Audit Report",

      description:
        "Discover hidden AI cost savings.",
    },
  };
}

export default async function ReportPage({ params }) {
  const { id } = params; 
  
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Report not found</h1>
          <p className="text-gray-500">
            This report may have been removed or never existed.
          </p>
        </div>
      </main>
    );
  }

  const report = data.report_data;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Public badge */}
        <div className="mb-4">
          <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
            Public Shareable Report
          </span>
        </div>

        {/* Hero */}
        <div className="bg-green-600 text-white rounded-2xl p-8 mb-8 text-center">
          <p className="text-lg opacity-90 mb-1">Potential monthly savings</p>
          <div className="text-6xl font-bold mb-2">
            ${report.totalMonthlySaving.toFixed(0)}
          </div>
          <p className="text-lg opacity-90">
            ${report.totalAnnualSaving.toFixed(0)}/year savings identified
          </p>
        </div>

        {/* Tool breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Tool Recommendations</h2>
          <div className="space-y-4">
            {report.results.map((r) => (
              <div
                key={r.toolId}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold text-gray-900">
                      {r.toolName}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">{r.plan}</span>
                  </div>
                  {r.totalSaving > 0 && (
                    <div className="text-green-600 font-semibold">
                      Save ${r.totalSaving.toFixed(0)}/mo
                    </div>
                  )}
                </div>
                {r.recommendations.length === 0 ? (
                  <p className="text-sm text-gray-500">Looks optimal</p>
                ) : (
                  <ul className="space-y-1">
                    {r.recommendations.slice(0, 2).map((rec, i) => (
                      <li key={i} className="text-sm text-gray-700">
                        → {rec.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-green-200 text-center">
          <h3 className="text-xl font-bold mb-2">
            Want to optimize your AI spend?
          </h3>
          <p className="text-gray-600 mb-4">
            Run your own free AI Spend Audit and discover hidden savings.
          </p>
          <a
            href="/"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg"
          >
            Run Free Audit →
          </a>
        </div>
      </div>
    </main>
  );
}