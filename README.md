# AI Spend Audit

AI Spend Audit is a lightweight SaaS-style web application that helps startups, developers, and small teams identify unnecessary spending across AI tools like ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, Windsurf, and more.

The platform analyzes tool subscriptions, detects redundant products, compares pricing against official plans, and estimates potential monthly and annual savings.

---

## Live Demo

Deployed on Vercel:

https://credex-audit-beta.vercel.app/

---

## Features

- AI tool spend audit
- Official pricing comparison
- Overpayment detection
- Wrong-plan detection
- Cross-tool redundancy analysis
- Savings estimation
- Annual + monthly savings calculations
- Results persistence using localStorage
- Automated CI pipeline with GitHub Actions
- Unit-tested audit engine using Vitest

---

## Current Audit Rules

The audit engine currently supports:

- Overpaying vs official pricing
- Team plan mismatch detection
- Cheaper same-vendor plan recommendations
- Cross-tool redundancy detection
- Credit optimization opportunities

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 |
| Language | JavaScript |
| Styling | Tailwind CSS |
| Testing | Vitest |
| CI/CD | GitHub Actions |
| Deployment | Vercel |
| State Persistence | localStorage |
| Planned Database | Supabase |
| Planned AI API | Anthropic Claude API |

---

## Local Development

Clone the repository:

```bash
git clone https://github.com/SejalBhole-sudo/credex-audit.git
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Run tests:

```bash
npm run test
```

---

## Architecture Decisions

### Why Next.js?
Next.js App Router provides:
- simple routing
- API route support
- scalable architecture
- seamless Vercel deployment

### Why JavaScript instead of TypeScript?
The project prioritizes rapid iteration during a constrained 7-day build timeline.

Type safety tradeoffs are mitigated through:
- deterministic audit logic
- unit testing
- modular architecture

### Why Rule-Based Audit Logic Instead of AI?
Financial recommendations should be:
- deterministic
- explainable
- auditable

The audit engine intentionally uses hardcoded pricing rules instead of AI-generated calculations.

AI will only be used later for:
- personalized summaries
- recommendation explanation

---

## Current Project Status

### Completed
- Core audit engine
- Savings calculations
- Results page
- Testing infrastructure
- CI workflow
- Deployment pipeline
- Architecture documentation

### In Progress
- AI-generated summaries
- Lead capture system
- Supabase integration
- Shareable public reports
- Email workflows

---

## Screenshots

Screenshots will be added during final polish phase.

---

## Future Improvements

- Supabase persistence
- Public report sharing
- Claude-generated summaries
- Better visual analytics
- Pricing sync automation
- Team dashboards

---

## Repository Structure

```text
src/
├── app/
├── components/
├── lib/
└── __tests__/
```

---

## Author

Built by Sejal Bhole as part of a startup-focused engineering assignment.