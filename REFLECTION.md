# Reflection

# Reflection

## 1. The Hardest Bug and How I Debugged It

The hardest bug I encountered was a cascading failure in the Gemini API fallback system that happened around Day 4. When the Gemini API hit rate limits during testing, instead of gracefully falling back to a templated summary, the entire results page would hang for 30 seconds and then render a white screen.

**What I thought initially:** I assumed the issue was in the React state management — maybe the AI summary state wasn't being updated properly when the API failed.

**What I tried:**
1. First, I added console logs to track the state transitions. The logs showed the API request was being made but never resolving or rejecting.
2. I inspected the Network tab in Chrome DevTools and saw the Gemini API requests were returning 429 (rate limit) responses, but my error handler wasn't catching them properly.
3. I realized the problem: I was wrapping the API call in a try-catch, but the catch was silently failing because I wasn't re-throwing the error or setting a state variable to trigger the fallback.

**What worked:** I restructured the summary function to:
- Add an explicit timeout (5 seconds) so requests don't hang indefinitely
- Catch both rate limit (429) and timeout errors explicitly
- Set a `useAISummary` flag in state that toggles between AI-generated and fallback summaries
- Render the fallback immediately when the flag is false

**The insight:** In client-side API calls, silence (no response, no error) is worse than a clear error. Timeouts are just as important as error handling because third-party APIs can hang without returning anything.

This taught me to always wrap external API calls in timeouts and test rate-limit scenarios, not just happy paths.

---

## 2. A Decision I Reversed Mid-Week and Why

I initially planned to build the audit engine on the backend (a Next.js API route) for "scalability and security." I wrote the logic as an API handler, deployed it, and tested it on Day 2.

By mid-Day 3, I reversed this decision and moved the entire audit engine back to the client-side.

**Why I reversed it:**

1. **Latency:** Every audit now required a round-trip to the server. On a fast connection, this added 200-300ms. On a slow connection, 1-2 seconds. The immediate feedback was gone.

2. **Deployment complexity:** Running the audit engine server-side meant I had to manage environment variables, rate limiting, and database logging on the backend. That's 3x the code complexity.

3. **The actual requirement:** Re-reading the assignment, it says "rule-based auditing," not "secure backend auditing." Pricing rules are public knowledge (vendor websites). There's nothing secret about the logic.

4. **MVP principle:** A client-side audit engine is fast, deterministic, and requires zero backend infrastructure. I could ship it faster.

**What changed:** I kept the API route for *future* use (analytics, email sends), but moved the core audit logic to `src/lib/auditEngine.js` running in the browser. This was a clean split: logic client-side, side effects (logging, emails) server-side.

**The broader lesson:** Optimization before validation is waste. I optimized for "scalability" when I should have optimized for "speed of feedback." For an MVP, fast user experience beats future-proofing.

---

## 3. What I Would Build in Week 2

If I had another week, I'd prioritize in this order:

**Priority 1: Supabase Persistence (2 days)**
Currently, audit history is lost when the user closes the browser. Implementing proper login + persistent audit history would let users:
- Compare audits month-over-month (has my spend gone up?)
- See how recommendations change as their team grows
- Share private audit reports with their finance team

This unlocks retention and multi-audit workflows.

**Priority 2: Email Digest Delivery (1.5 days)**
Automate a weekly digest: "Your AI spend this week vs. last week. New savings opportunities: ..."

This keeps the tool top-of-mind and generates recurring leads for Credex (not just one-time audits).

**Priority 3: A/B Test CTAs for Credex Consultation (1.5 days)**
Currently, users with >$500/mo savings see "Book a Credex consultation" as a button. I'd test:
- Button vs. text link vs. interstitial modal
- "Book a consultation" vs. "Get 40% off credits"
- Showing estimated credits they could buy with savings

Conversion optimization here is high-leverage (directly impacts Credex revenue).

**Priority 4: Pricing Sync Automation (1 day)**
Currently, pricing data is hardcoded in `PRICING_DATA.md` and manually updated. I'd build a cron job that:
- Scrapes official pricing pages weekly
- Alerts me if pricing changed
- Updates the audit engine automatically

This prevents stale data from hurting credibility.

**Not doing in Week 2:**
- PDF export (nice-to-have, can wait)
- Embeddable widget (cool, but niche)
- Referral system (needs Supabase first)
- Team dashboards (premature before user base exists)

The theme: **depth over breadth**. Depth on Supabase + persistence + email = sustainable retention. Breadth on widgets + exports = short-term polish.

---

## 4. How I Used AI Tools This Week

**Which tools I used:**
- **Claude (via Claude.ai):** ~40% of coding time, finding bugs and debugging them
- **ChatGPT (OpenAI):** ~60% for debugging and coding

**What I used them for:**
1. **Brainstorming architecture decisions:** "If I want to build a client-side audit engine, what's the folder structure?" Claude gave me a clean Next.js layout.
2. **Writing boilerplate:** Form components, test setup, Tailwind utility classes. AI was 10x faster than typing by hand.
3. **Debugging API errors:** "I'm getting CORS errors from the Gemini API. Here's my fetch call..." Claude spotted that I wasn't including `mode: 'cors'` in the fetch options.
4. **Writing this DEVLOG and REFLECTION:** Structuring sentences, catching grammar. AI helped me stay organized.

**What I didn't trust them with:**
- **Pricing data sources:** I verified every price manually by visiting the vendor websites. AI hallucinations on pricing would destroy credibility.
- **UX decisions:** I talked to actual users instead of asking AI "what UX should I build?"

**One time the AI was wrong (and I caught it):**

I asked Claude: "Should I use Zustand or Jotai for state management?"

Claude recommended Zustand for "enterprise-grade state management." But looking at my actual state needs (a single `auditData` object that persists to localStorage), Zustand was massive overkill. I just used React's built-in `useState`. The lesson: **AI optimizes for general best practices, not your specific context.** I had to catch that.

**The principle:** AI is a thought partner, not a decision-maker. For architecture, pricing accuracy, and user research, I lead. For writing and boilerplate, I let AI accelerate. This split worked well.

---

## 5. Self-Rating on Key Dimensions

**Discipline: 8/10**
Reason: I committed on every day from Day 1-7 with substantive work, but I procrastinated on entrepreneurial docs (GTM/ECONOMICS) until the last day, which shows I could have started earlier.

**Code Quality: 7/10**
Reason: The audit engine is clean and modular, but I didn't use TypeScript (which cost type safety) and I have some ad-hoc state management that could be more organized.

**Design Sense: 7/10**
Reason: The results page is clean and highlights savings clearly, but it's not visually surprising. The color palette is safe (Tailwind defaults). For a lead-gen product, "safe" is fine, but not differentiated.

**Problem-Solving: 8/10**
Reason: I debugged the Gemini fallback issue well and made good architecture reversals, but I didn't anticipate the Lighthouse accessibility issues until testing (should have tested earlier).

