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

  useEffect(() => {
    const input = localStorage.getItem('audit_input')
    if (!input) { router.push('/'); return }
    
    const formData = JSON.parse(input)
    const result = runAudit(formData)
    setAuditData(result)

    // Fetch AI summary
    fetch('/api/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auditResult: result, useCase: formData.useCase })
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

  if (!auditData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  const { results, totalMonthlySaving, totalAnnualSaving, totalCurrentSpend, isOptimal } = auditData
  const highSavings = totalMonthlySaving > 500
  const lowSavings = totalMonthlySaving < 100

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        
        {/* Hero savings block */}
        <div className={`rounded-2xl p-8 mb-8 text-center ${highSavings ? 'bg-green-600 text-white' : isOptimal ? 'bg-blue-600 text-white' : 'bg-yellow-500 text-white'}`}>
          {isOptimal ? (
            <>
              <div className="text-5xl mb-2">✅</div>
              <h1 className="text-3xl font-bold mb-2">You're spending well</h1>
              <p className="text-lg opacity-90">Your AI tool stack looks optimized. No major changes needed.</p>
            </>
          ) : (
            <>
              <p className="text-lg opacity-90 mb-1">Potential monthly savings</p>
              <div className="text-6xl font-bold mb-2">${totalMonthlySaving.toFixed(0)}</div>
              <p className="text-lg opacity-90">${totalAnnualSaving.toFixed(0)}/year — on a ${totalCurrentSpend.toFixed(0)}/mo stack</p>
            </>
          )}
        </div>

        {/* Credex CTA for high savings */}
        {highSavings && (
          <div className="bg-white border-2 border-green-500 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">💡 Capture more with Credex</h2>
            <p className="text-gray-600 mb-4">
              You're overspending by ${totalMonthlySaving.toFixed(0)}/mo. Credex sells discounted AI credits 
              (Cursor, Claude, ChatGPT Enterprise) from companies that overforecasted — at 20–40% below retail.
            </p>
            <a 
              href="https://credex.rocks" 
              target="_blank"
              className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Book a Free Credex Consultation →
            </a>
          </div>
        )}

        {/* AI Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-3">📊 Your Audit Summary</h2>
          {summaryLoading ? (
            <div className="animate-pulse h-16 bg-gray-100 rounded" />
          ) : (
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          )}
        </div>

        {/* Per-tool breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Per-Tool Breakdown</h2>
          <div className="space-y-4">
            {results.map(r => (
              <div key={r.toolId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold text-gray-900">{r.toolName}</span>
                    <span className="text-sm text-gray-500 ml-2">{r.plan} · {r.seats} seat(s)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Current: ${r.currentSpend}/mo</div>
                    {r.totalSaving > 0 && (
                      <div className="text-green-600 font-semibold">Save ${r.totalSaving.toFixed(0)}/mo</div>
                    )}
                  </div>
                </div>
                {r.recommendations.length === 0 ? (
                  <p className="text-sm text-gray-500">✅ Looks optimal for your usage</p>
                ) : (
                  <ul className="space-y-1">
                    {r.recommendations.slice(0, 2).map((rec, i) => (
                      <li key={i} className="text-sm text-gray-700">
                        <span className="text-yellow-600 mr-1">→</span> {rec.message}
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
            {lowSavings ? '🔔 Stay updated' : '📧 Get your full report'}
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            {lowSavings 
              ? "You're in good shape. Get notified when new optimizations apply to your stack."
              : "We'll email you a detailed breakdown and flag when better pricing becomes available."}
          </p>
          <button 
            onClick={() => setShowEmailModal(true)}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {lowSavings ? 'Notify me of savings →' : 'Email me this report →'}
          </button>
        </div>

        <button 
          onClick={() => router.push('/')}
          className="text-sm text-gray-400 hover:text-gray-600 underline"
        >
          ← Run a new audit
        </button>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal 
          auditData={auditData}
          onClose={() => setShowEmailModal(false)} 
        />
      )}
    </main>
  )
}

function EmailModal({ auditData, onClose }) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  // Honeypot field — bots fill this, humans don't see it
  const [honeypot, setHoneypot] = useState('')

  const handleSubmit = async () => {
    if (!email || honeypot) return // honeypot filled = bot
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, company, role, 
          monthlySaving: auditData.totalMonthlySaving,
          annualSaving: auditData.totalAnnualSaving
        })
      })
      if (res.ok) setSubmitted(true)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        {submitted ? (
          <div className="text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-xl font-bold mb-2">Report sent!</h3>
            <p className="text-gray-500">Check your inbox. We'll reach out if we find better deals for your stack.</p>
            <button onClick={onClose} className="mt-4 text-blue-600 underline">Close</button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-1">Get your report</h3>
            <p className="text-gray-500 text-sm mb-4">No spam. One email with your audit.</p>
            
            {/* Honeypot — invisible to humans */}
            <input 
              type="text" 
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />
            
            <div className="space-y-3">
              <input
                type="email"
                placeholder="your@email.com *"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Company name (optional)"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Your role (optional)"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!email || loading}
              className="w-full mt-4 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Sending...' : 'Send my report →'}
            </button>
            <button onClick={onClose} className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600">Cancel</button>
          </>
        )}
      </div>
    </div>
  )
}

function generateFallbackSummary(result) {
  if (result.isOptimal) {
    return `Your AI tool stack is well-optimized. You're spending $${result.totalCurrentSpend}/month and our audit found no significant areas of overspend. Keep monitoring as pricing changes frequently.`
  }
  return `Your AI tools are costing $${result.totalCurrentSpend}/month, but our audit identified $${result.totalMonthlySaving}/month in potential savings — that's $${result.totalAnnualSaving}/year. The biggest opportunities are in plan mismatches and tool redundancy. Acting on these recommendations could meaningfully reduce your AI infrastructure costs.`
}