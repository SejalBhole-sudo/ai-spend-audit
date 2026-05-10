'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { runAudit } from '../../lib/auditEngine'

export default function ResultsPage() {
  const router = useRouter()

  const [auditData, setAuditData] = useState(null)
  const [summary, setSummary] = useState('')
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [reportId, setReportId] = useState(null)

  useEffect(() => {
    const input = localStorage.getItem('audit_input')

    if (!input) {
      router.push('/')
      return
    }

    const formData = JSON.parse(input)

    const result = runAudit(formData)

    setAuditData(result)

    // Create shareable report
    createShareableReport(result)

    // Fetch AI summary
    fetch('/api/summary', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        auditResult: result,
        useCase: formData.useCase,
      }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.summary) {
          setSummary(d.summary)
        } else {
          setSummary(generateFallbackSummary(result))
        }

        setSummaryLoading(false)
      })
      .catch(() => {
        setSummary(generateFallbackSummary(result))
        setSummaryLoading(false)
      })

  }, [])

  const createShareableReport = async (
    result
  ) => {
    try {
      const response = await fetch(
        '/api/report',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            reportData: result,
          }),
        }
      )

      const data =
        await response.json()

      setReportId(data.id)

    } catch (error) {
      console.error(error)
    }
  }

  const copyShareLink = async () => {
    if (!reportId) return

    const url = `${window.location.origin}/report/${reportId}`

    await navigator.clipboard.writeText(
      url
    )

    alert('Share link copied!')
  }

  if (!auditData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )

  const {
    results,
    totalMonthlySaving,
    totalAnnualSaving,
    totalCurrentSpend,
    isOptimal,
  } = auditData

  const highSavings =
    totalMonthlySaving > 500

  const lowSavings =
    totalMonthlySaving < 100

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Hero savings block */}
        <div
          className={`rounded-2xl p-8 mb-8 text-center ${
            highSavings
              ? 'bg-green-600 text-white'
              : isOptimal
              ? 'bg-blue-600 text-white'
              : 'bg-yellow-500 text-white'
          }`}
        >
          {isOptimal ? (
            <>
              <div className="text-5xl mb-2">
                ✅
              </div>

              <h1 className="text-3xl font-bold mb-2">
                You're spending well
              </h1>

              <p className="text-lg opacity-90">
                Your AI tool stack
                looks optimized. No
                major changes needed.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg opacity-90 mb-1">
                Potential monthly
                savings
              </p>

              <div className="text-6xl font-bold mb-2">
                $
                {totalMonthlySaving.toFixed(
                  0
                )}
              </div>

              <p className="text-lg opacity-90">
                $
                {totalAnnualSaving.toFixed(
                  0
                )}
                /year — on a $
                {totalCurrentSpend.toFixed(
                  0
                )}
                /mo stack
              </p>
            </>
          )}
        </div>

        {/* Shareable Report */}
        {reportId && (
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">
                Share this audit
              </p>

              <p className="text-sm text-gray-500">
                Public version with
                sensitive details
                removed
              </p>
            </div>

            <button
              onClick={copyShareLink}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm"
            >
              Copy Link
            </button>
          </div>
        )}

        {/* AI Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-3">
            📊 Your Audit Summary
          </h2>

          {summaryLoading ? (
            <div className="animate-pulse h-16 bg-gray-100 rounded" />
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {summary}
            </p>
          )}
        </div>

        {/* Per-tool breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Per-Tool Breakdown
          </h2>

          <div className="space-y-4">
            {results.map(r => (
              <div
                key={r.toolId}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold text-gray-900">
                      {r.toolName}
                    </span>

                    <span className="text-sm text-gray-500 ml-2">
                      {r.plan} ·{' '}
                      {r.seats} seat(s)
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      Current: $
                      {r.currentSpend}
                      /mo
                    </div>

                    {r.totalSaving >
                      0 && (
                      <div className="text-green-600 font-semibold">
                        Save $
                        {r.totalSaving.toFixed(
                          0
                        )}
                        /mo
                      </div>
                    )}
                  </div>
                </div>

                {r.recommendations
                  .length === 0 ? (
                  <p className="text-sm text-gray-500">
                    ✅ Looks optimal
                    for your usage
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {r.recommendations
                      .slice(0, 2)
                      .map((rec, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-700"
                        >
                          <span className="text-yellow-600 mr-1">
                            →
                          </span>{' '}
                          {rec.message}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lead capture */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6 border border-blue-100">
          <h2 className="text-lg font-semibold mb-1">
            {lowSavings
              ? '🔔 Stay updated'
              : '📧 Get your full report'}
          </h2>

          <p className="text-gray-500 text-sm mb-4">
            {lowSavings
              ? "You're in good shape. Get notified when new optimizations apply to your stack."
              : "We'll email you a detailed breakdown and flag when better pricing becomes available."}
          </p>

          <button
            onClick={() =>
              setShowEmailModal(true)
            }
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {lowSavings
              ? 'Notify me of savings →'
              : 'Email me this report →'}
          </button>
        </div>

        <button
          onClick={() =>
            router.push('/')
          }
          className="text-sm text-gray-400 hover:text-gray-600 underline"
        >
          ← Run a new audit
        </button>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal
          auditData={auditData}
          onClose={() =>
            setShowEmailModal(false)
          }
        />
      )}
    </main>
  )
}