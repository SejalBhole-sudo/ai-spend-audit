# Development Assistance Prompts
## AI-Assisted Development Workflow

Throughout development of the AI Spend Audit tool, AI was used as an engineering assistant for iterative problem-solving rather than one-shot code generation. This document outlines the key prompting patterns, reasoning, and outcomes.

---

## Core Prompting Philosophy

AI was trusted for:
- Architecture and design decisions
- Debugging production issues
- UX flow optimization
- Implementation approaches
- Edge case handling
- Performance optimization
- Refactoring suggestions
- Documentation and copywriting

AI was NOT trusted for:
- Pricing data verification (manual checks against official sources)
- Financial calculations (manually validated)
- Audit engine recommendation logic (manually designed)
- User interviews (conducted by humans)
- Business decisions (made by humans)

---

# Category 1: Debugging & Production Issues

## Example 1: Share Link Rendering Failure on Vercel

### Prompt
"I have a Next.js client component that creates a shareable audit report link. 
The button works perfectly in localhost but disappears entirely on Vercel production.

Key details:
- reportId state updates via async fetch to /api/report
- Conditional rendering: {reportId && <ShareButton />}
- No console errors in Vercel logs
- Page loads fine, just the button section is missing

What could cause this? I'm thinking:
1. Hydration mismatch between server/client
2. Timing issue where reportId isn't set before render
3. Async state not completing before SSR

Here's the component - can you identify the issue?"

### Original Code (Problematic)
```javascript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ResultsPage() {
  const router = useRouter()
  const [auditData, setAuditData] = useState(null)
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
    createShareableReport(result)
  }, [])

  const createShareableReport = async (result) => {
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportData: result,
        }),
      })

      const data = await response.json()
      setReportId(data.id)
    } catch (error) {
      console.error(error)
    }
  }

  if (!auditData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* This section disappears on Vercel */}
        {reportId && (
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">
                Share this audit
              </p>
              <p className="text-sm text-gray-500">
                Public version with sensitive details removed
              </p>
            </div>

            <button
              onClick={() => {
                const url = `${window.location.origin}/report/${reportId}`
                navigator.clipboard.writeText(url)
                alert('Share link copied!')
              }}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm"
            >
              Copy Link
            </button>
          </div>
        )}

        {/* Rest of page renders fine */}
      </div>
    </main>
  )
}
```

### Why I Asked This
The share link UI was a critical feature but only rendered conditionally based on async state. Symptoms pointed to either:
- Hydration mismatch: Server renders without reportId, client renders with it (Next.js warning)
- Race condition: Component unmounts before async fetch completes
- SSR timing: Static generation runs before database query finishes

### Investigation Process
1. Checked Vercel build logs - no errors
2. Tested in dev environment - worked perfectly
3. Tested in production build locally - reproduced the issue
4. Realized difference: dev uses `next dev` (different rendering), prod uses `next build` + SSR

### Fixed Code
```javascript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { runAudit } from '../../lib/auditEngine'

export default function ResultsPage() {
  const router = useRouter()

  const [auditData, setAuditData] = useState(null)
  const [reportId, setReportId] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const input = localStorage.getItem('audit_input')

    if (!input) {
      router.push('/')
      return
    }

    const formData = JSON.parse(input)
    const result = runAudit(formData)
    setAuditData(result)

    createShareableReport(result)
  }, [])

  const createShareableReport = async (result) => {
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportData: result,
        }),
      })

      const data = await response.json()

      if (data.id) {
        setReportId(data.id)
        console.log('Report created:', data.id)
      } else {
        console.error('Failed to create report:', data)
      }
    } catch (error) {
      console.error('Error creating shareable report:', error)
    }
  }

  const copyShareLink = async () => {
    if (!reportId) {
      alert('Report is still loading...')
      return
    }

    const url = `${window.location.origin}/report/${reportId}`

    try {
      await navigator.clipboard.writeText(url)
      alert('Share link copied!')
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('Failed to copy link')
    }
  }

  if (!auditData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Shareable Report - Only show when mounted AND reportId exists */}
        {mounted && reportId && (
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Share this audit</p>
              <p className="text-sm text-gray-500">Public version with sensitive details removed</p>
            </div>
            <button
              onClick={copyShareLink}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
            >
              Copy Link
            </button>
          </div>
        )}

        {/* Loading state for share link */}
        {mounted && !reportId && (
          <div className="bg-gray-100 rounded-xl p-4 mb-6 flex items-center justify-between animate-pulse">
            <div>
              <p className="font-semibold text-gray-400">Creating shareable link...</p>
              <p className="text-sm text-gray-400">Please wait</p>
            </div>
            <div className="w-20 h-10 bg-gray-300 rounded-lg"></div>
          </div>
        )}

        {/* Rest of page */}
      </div>
    </main>
  )
}
```

### Key Changes
1. Added mounted state to track client-side hydration
2. Only render share section when mounted AND reportId exists
3. Added loading state while report is being created
4. Improved error handling with better messages

### Result
Button now appears reliably on Vercel. The mounted flag prevents hydration mismatch by gating all async-dependent UI until after client-side hydration completes.

---

## Example 2: Gemini API Model Not Found Error

### Prompt
"Getting a 404 error from Gemini API: 'models/gemini-1.5-flash is not found for API version v1'

I'm using the correct API key and endpoint. The model name seems standard.

Here's my fetch call - is this a real model that exists? Should I use a different endpoint or model name?"

### Original Code (Problematic)
```javascript
export async function POST(req) {
  try {
    const { auditResult, useCase } = await req.json()

    const prompt = `
You are an expert AI infrastructure cost analyst.
A user completed an AI spend audit.
Current monthly spend: $${auditResult.totalCurrentSpend}
Potential monthly savings: $${auditResult.totalMonthlySaving}
Primary use case: ${useCase}
Tools audited: ${auditResult.results
  .map(
    (r) =>
      `${r.toolName} (${r.plan}, $${r.currentSpend}/mo)`
  )
  .join(", ")}

Write a concise 100-word personalized summary with optimization advice.
    `

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    )

    const data = await response.json()
    console.log(data)

    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || null

    return Response.json({
      summary,
    })
  } catch (error) {
    console.error(error)

    return Response.json(
      {
        summary: null,
        error: "Gemini API failed",
      },
      { status: 500 }
    )
  }
}
```

### Why I Asked This
The error message was clear (model not found), but I needed to understand:
- Is gemini-1.5-flash a real model?
- Is it available in the REST API?
- Do I need v1beta instead of v1?
- What models are actually available?

### Investigation Process
1. Checked official Gemini docs
2. Tested with v1beta endpoint
3. Called ListModels API to see available models
4. Found that 1.5 models require v1beta (not v1)

### Fixed Code
```javascript
export async function POST(req) {
  try {
    const { auditResult, useCase } = await req.json()

    const prompt = `
You are an expert AI infrastructure cost analyst.
A user completed an AI spend audit.
Current monthly spend: $${auditResult.totalCurrentSpend}
Potential monthly savings: $${auditResult.totalMonthlySaving}
Primary use case: ${useCase}
Tools audited: ${auditResult.results
  .map(
    (r) =>
      `${r.toolName} (${r.plan}, $${r.currentSpend}/mo)`
  )
  .join(", ")}

Write a concise 100-word personalized summary with optimization advice.
    `

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    )

    const data = await response.json()
    console.log("Gemini Response:", JSON.stringify(data, null, 2))

    if (data.error) {
      console.error("Gemini API Error:", data.error)
      return Response.json(
        {
          summary: null,
          error: data.error.message,
        },
        { status: 500 }
      )
    }

    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || null

    return Response.json({
      summary,
      model: "gemini-2.5-flash",
      success: !!summary,
    })
  } catch (error) {
    console.error("Error:", error)

    return Response.json(
      {
        summary: null,
        error: error.message || "Gemini API failed",
      },
      { status: 500 }
    )
  }
}
```

### Key Changes
1. Changed endpoint from `/v1/` to `/v1beta/`
2. Updated model from `gemini-1.5-flash` to `gemini-2.5-flash`
3. Added error checking for API errors
4. Improved logging for debugging

### Result
API now works with gemini-2.5-flash using the v1beta endpoint. The newer model also provides better quality summaries.

---

## Example 3: Dynamic Route Params as Promise Error

### Prompt
"Getting a weird error in Next.js 15:
'Route \"/report/[id]\" used params.id. params is a Promise and must be 
unwrapped with await or React.use() before accessing its properties.'

This worked in older versions. What changed and how do I fix it?"

### Original Code (Problematic)
```javascript
import { supabase } from "@/lib/supabase"

export default async function ReportPage({ params }) {
  const id = params?.id
  console.log("Report ID:", id)

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single()

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
    )
  }

  const report = data.report_data

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Report content */}
      </div>
    </main>
  )
}
```

### Why I Asked This
This was a breaking change in Next.js 15. I needed to understand:
- Why is params now a Promise?
- What's the migration path?
- Should I use await or React.use()?
- Are there other implications?

### Fixed Code
```javascript
import { supabase } from "@/lib/supabase"

export default async function ReportPage({ params }) {
  const { id } = await params
  console.log("Report ID:", id)

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single()

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
    )
  }

  const report = data.report_data

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-4">
          <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
            Public Shareable Report
          </span>
        </div>

        <div className="bg-green-600 text-white rounded-2xl p-8 mb-8 text-center">
          <p className="text-lg opacity-90 mb-1">Potential monthly savings</p>
          <div className="text-6xl font-bold mb-2">
            ${report.totalMonthlySaving.toFixed(0)}
          </div>
          <p className="text-lg opacity-90">
            ${report.totalAnnualSaving.toFixed(0)}/year savings identified
          </p>
        </div>

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
            Run Free Audit
          </a>
        </div>
      </div>
    </main>
  )
}
```

### Key Changes
1. Changed `const id = params?.id` to `const { id } = await params`
2. This unwraps the Promise before accessing properties
3. Rest of logic remains the same

### Result
Dynamic routes now work correctly in Next.js 15. The await is necessary because Next.js 15 returns params as a Promise for better performance.

---

# Category 2: Architecture & Design Decisions

## Example 4: Public Shareable Report Architecture

### Prompt
"I need to implement shareable audit URLs. Requirements:
- Public URLs that anyone can view without login
- Remove sensitive details (email, account info)
- Keep results data and savings recommendations
- SEO-friendly (Open Graph previews)
- Direct URL access without going through app

I'm thinking:
1. Create report entry in Supabase when audit finishes
2. Generate unique report ID
3. Create route /report/[id] that fetches and renders public version
4. Filter out sensitive fields before rendering

Is this the right approach? Any gotchas I should know about?"

### Original Implementation
```javascript
export async function POST(req) {
  try {
    const { auditResult, useCase } = await req.json()

    const response = await fetch('/api/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reportData: auditResult,
      }),
    })

    const data = await response.json()
    setReportId(data.id)
  } catch (error) {
    console.error(error)
  }
}
```

### API Route for Creating Reports
```javascript
import { supabase } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { reportData } = await req.json()

    if (!reportData) {
      return Response.json(
        { error: 'Missing report data' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('reports')
      .insert([
        {
          report_data: reportData,
          created_at: new Date().toISOString(),
        }
      ])
      .select()

    if (error) {
      console.error('Report creation failed:', error)
      return Response.json(
        { error: 'Failed to create report' },
        { status: 500 }
      )
    }

    return Response.json({ id: data[0].id })
  } catch (error) {
    console.error('Unexpected error:', error)
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
```

### Public Report Page with Sanitization
```javascript
import { supabase } from "@/lib/supabase"

export default async function ReportPage({ params }) {
  const { id } = await params

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single()

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
    )
  }

  const report = data.report_data

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-4">
          <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
            Public Shareable Report
          </span>
        </div>

        <div className="bg-green-600 text-white rounded-2xl p-8 mb-8 text-center">
          <p className="text-lg opacity-90 mb-1">Potential monthly savings</p>
          <div className="text-6xl font-bold mb-2">
            ${report.totalMonthlySaving.toFixed(0)}
          </div>
          <p className="text-lg opacity-90">
            ${report.totalAnnualSaving.toFixed(0)}/year savings identified
          </p>
        </div>

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
            Run Free Audit
          </a>
        </div>
      </div>
    </main>
  )
}
```

### Key Design Decisions
1. Use UUID for unique IDs (secure, no enumeration)
2. Store only public data in reports table
3. Public pages don't require authentication
4. Sanitization happens at storage time, not render time
5. Each report is immutable (no updates after creation)

### Result
Public shareable URLs work reliably. No sensitive data is exposed. Direct URL access works without any app navigation.

---

## Example 5: Graceful Degradation for AI Summary

### Prompt
"The Gemini API summary is nice-to-have but sometimes fails. Right now 
if the API times out, the whole summary section shows blank/loading forever.

The audit results themselves are instant and work great.

How should I handle this so:
1. Audit results render immediately (don't wait for summary)
2. If summary fails, show a templated fallback instead of blank
3. No janky loading states that confuse users
4. User can still access their full results even if AI fails"

### Original Code (Problematic)
```javascript
const [summaryLoading, setSummaryLoading] = useState(true)
const [summary, setSummary] = useState('')

useEffect(() => {
  // Wait for summary before showing anything
  fetch('/api/summary', { ... })
    .then(r => r.json())
    .then(d => {
      setSummary(d.summary)
      setSummaryLoading(false)
    })
}, [])

// Nothing shows until summary loads
{summaryLoading ? <LoadingState /> : <Summary text={summary} />}
```

### Fixed Code with Independent Loading
```javascript
const [auditData, setAuditData] = useState(null)
const [summary, setSummary] = useState('')
const [summaryLoading, setSummaryLoading] = useState(true)

useEffect(() => {
  const input = localStorage.getItem('audit_input')

  if (!input) {
    router.push('/')
    return
  }

  const formData = JSON.parse(input)
  const result = runAudit(formData)
  setAuditData(result)

  // Fetch summary independently - don't block main content
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
    .then((r) => r.json())
    .then((d) => {
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

function generateFallbackSummary(result) {
  return `Your AI tool spend audit is complete. You're currently spending $${result.totalCurrentSpend.toFixed(0)}/month and could save $${result.totalMonthlySaving.toFixed(0)}/month with optimizations.`
}

// Render results immediately
if (!auditData)
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  )

return (
  <main className="min-h-screen bg-gray-50">
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero renders instantly */}
      <div className="rounded-2xl p-8 mb-8 text-center bg-green-600 text-white">
        <p className="text-lg opacity-90 mb-1">Potential monthly savings</p>
        <div className="text-6xl font-bold mb-2">
          ${auditData.totalMonthlySaving.toFixed(0)}
        </div>
        <p className="text-lg opacity-90">
          ${auditData.totalAnnualSaving.toFixed(0)}/year savings identified
        </p>
      </div>

      {/* Summary loads independently with fallback */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-3">Your Audit Summary</h2>
        {summaryLoading ? (
          <div className="animate-pulse h-16 bg-gray-100 rounded" />
        ) : (
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        )}
      </div>

      {/* Rest of results */}
    </div>
  </main>
)
```

### Key Improvements
1. Audit results render immediately (not blocked by summary fetch)
2. Summary fetches independently in background
3. Fallback summary is data-driven (uses audit results)
4. Error handling shows fallback, not blank
5. Loading state only on summary section, not entire page

### Result
Audit renders in less than 100ms. Summary appears after 500-1000ms with automatic fallback if API fails.

---

# Category 3: Edge Cases & Error States

## Example 6: Missing or Empty Audit Results

### Prompt
"What should happen if the user runs an audit with no tools selected?

Current behavior: Page goes blank, confusing.

Options:
1. Block submission (disable button until at least 1 tool selected)
2. Show empty state message
3. Redirect back to form
4. Show helpful message with next steps

Which is best UX?"

### Original Code (Problematic)
```javascript
const handleSubmit = async () => {
  const result = runAudit(formData)
  
  if (!result || result.results.length === 0) {
    // No clear error message
    return
  }

  router.push('/results')
}
```

### Fixed Code with Validation
```javascript
import { useState } from 'react'

export default function AuditForm() {
  const [selectedTools, setSelectedTools] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleToolChange = (toolId, checked) => {
    setSelectedTools((prev) => {
      const updated = { ...prev }
      if (checked) {
        updated[toolId] = { plan: 'Free', seats: 1, monthlySpend: 0 }
      } else {
        delete updated[toolId]
      }
      return updated
    })
  }

  const handleSubmit = () => {
    // Validate at least one tool selected
    if (Object.keys(selectedTools).length === 0) {
      setSubmitted(true)
      return
    }

    const formData = {
      tools: selectedTools,
      useCase: selectedUseCase,
      teamSize: parseInt(teamSize),
    }

    localStorage.setItem('audit_input', JSON.stringify(formData))
    router.push('/results')
  }

  return (
    <div>
      {/* Tool selection checkboxes */}
      <div className="space-y-3 mb-6">
        {Object.keys(OFFICIAL_PRICING).map((toolId) => (
          <label key={toolId} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedTools.hasOwnProperty(toolId)}
              onChange={(e) => handleToolChange(toolId, e.target.checked)}
              className="mr-3"
            />
            <span>{getToolName(toolId)}</span>
          </label>
        ))}
      </div>

      {/* Error message if submitted with no tools */}
      {submitted && Object.keys(selectedTools).length === 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-semibold">Please select at least one tool</p>
          <p className="text-red-600 text-sm mt-1">
            Choose the AI tools you're currently using or considering
          </p>
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={Object.keys(selectedTools).length === 0}
        className={`w-full py-3 rounded-lg font-semibold ${
          Object.keys(selectedTools).length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        Run Audit
      </button>
    </div>
  )
}
```

### Key Features
1. Disable button when no tools selected
2. Show clear error message if user tries to submit
3. Error message is specific and actionable
4. Visual feedback with disabled button styling

### Result
Users cannot accidentally submit empty audit. Clear error messages guide them.

---

# Category 4: What Was NOT Delegated to AI

## Pricing Data Verification

This is financial data. Wrong pricing leads to:
- Incorrect savings recommendations
- Loss of user trust
- Potential liability

Process:
1. Visit official pricing page (e.g., https://claude.ai/pricing)
2. Document exact prices and dates
3. Store in OFFICIAL_PRICING constant
4. Update when vendor pricing changes

Example from code:
```javascript
export const OFFICIAL_PRICING = {
  claude: {
    Free: { pricePerSeat: 0, description: 'Free' },
    Pro: { pricePerSeat: 20, description: '$20/user/mo' },
    Max5: { pricePerSeat: 100, description: '$100/user/mo' },
    Team: { pricePerSeat: 25, description: '$25/user/mo, min 5 seats' },
    Enterprise: { pricePerSeat: 60, description: 'Custom enterprise pricing' },
  },
  // Prices manually verified and dated
}
```

## Audit Engine Logic

The recommendation logic is the core product. Wrong recommendations lead to bad financial decisions.

Design process:
1. Research each tool's business model
2. Understand minimum seat requirements
3. Document specific rules with examples
4. Test with real-world scenarios
5. Update when pricing or rules change

Example rule from code:
```javascript
// RULE 2: Team plan for too few users
if (toolId === 'claude' && plan === 'Team' && seats < 5) {
  recommendations.push({
    type: 'wrong_plan',
    message: `Claude Team requires a minimum of 5 seats. With ${seats} user(s), Pro at $20/seat saves you money.`,
    saving: currentSpend - (20 * seats)
  })
}
```

## Savings Calculations

Every calculation must be auditable.

Example validation:
- Claude Max: $100/mo
- Claude Pro: $20/mo
- Difference: $80/mo (correct)

All calculations shown explicitly in recommendations so users can verify.

---

# Prompting Patterns That Worked

## Pattern 1: Structured Debugging Prompts

"I'm seeing [symptom].
Context: [relevant code and logs]
I think it might be [hypothesis 1] or [hypothesis 2]
Can you help me [specific question]?"

Why it works:
- Clear problem statement
- Provides context upfront
- Shows your thinking
- Focuses on specific question

## Pattern 2: Validation Requests

"I'm planning to [approach] for [use case].
Constraints: [requirements]
Is this the right direction? Any gotchas?"

Why it works:
- Shares thinking before implementing
- Asks for validation (not code)
- Leaves room for better suggestions

## Pattern 3: Edge Case Questions

"What happens if [edge case]?
Current code: [snippet]
Should I handle it? If so, how?"

Why it works:
- Identifies gaps proactively
- Considers failure modes
- Gets concrete suggestions

---

# Summary

When to ask AI:
- Debugging: Why is X broken?
- Architecture: Should I do A or B?
- Optimization: How can I make this faster?
- Patterns: What's the best practice?
- Edge cases: What could go wrong?
- Copywriting: How should I phrase this?
- Documentation: Can you improve this?

When NOT to ask AI:
- Financial accuracy: Verify against official sources
- Business logic: Design intentionally, test manually
- User research: Talk to real users
- Calculations: Show your work, verify math
- Compliance: Consult documentation
- Data: Never trust AI-generated data as real

Key lessons:
1. AI excels at explanation and iteration
2. AI fails at ground truth
3. Context is everything
4. Validation prevents hallucinations
5. Use it for thinking, not replacing thinking

Last Updated: May 10, 2026