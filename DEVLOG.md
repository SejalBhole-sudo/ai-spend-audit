## Day 1 — 2026-05-06

**Hours worked:** 3

**What I did:**
- Carefully analyzed assignment requirements and scoped MVP features
- Researched suitable tech stack choices for fast development
- Started outreach to developers/startup users on LinkedIn for user interviews
- Successfully connected with initial interview participants
- Planned the core flow of the AI spend audit product

**What I learned:**
- The assignment focuses heavily on product thinking and execution
- Developers often use multiple AI tools with overlapping purposes

**Blockers / what I'm stuck on:**
- Deciding how detailed the audit recommendation logic should be for the MVP

**Plan for tomorrow:**
- Setup the development environment
- Build the initial spend input form
- Continue user interviews and gather insights


## Day 2 — 2026-05-07

**Hours worked:** 7

**What I did:**
- Setup Next.js project with Tailwind CSS
- Configured GitHub repository and resolved merge conflicts
- Deployed application to Vercel with automatic deployment flow
- Built initial AI spend audit form
- Implemented audit engine recommendation logic
- Added localStorage persistence for form data
- Added form validation
- Created dedicated results page
- Setup Vitest for testing
- Added GitHub Actions CI workflow

**What I learned:**
- How Next.js App Router structures routes
- How CI workflows automatically run tests on push
- Importance of separating application flow into dedicated pages

**Blockers / what I'm stuck on:**
- Need to expand audit engine rules and pricing logic
- Need more advanced multi-tool recommendations

**Plan for tomorrow:**
- Expand audit engine with more rules and cross-tool redundancy detection
- Write real tests covering all audit rules
- Fix ARCHITECTURE.md with Mermaid diagram
- Create placeholder files for all required markdown docs


## Day 3 — 2026-05-08

**Hours worked:** 8

### What I did
- Replaced the initial audit engine with a more advanced rule-based pricing analysis system
- Added official pricing data for multiple AI tools including ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, Windsurf, and APIs
- Implemented savings calculation logic for monthly and annual spend optimization
- Added recommendation rules for:
  - overpaying detection
  - wrong plan selection
  - downgrade opportunities
  - cross-tool redundancy
  - credit optimization opportunities
- Refactored form data formatting to support the new audit engine structure
- Updated the results page to render the new audit response structure correctly
- Fixed hydration mismatch issues caused by localStorage access during SSR
- Debugged and resolved Vercel deployment protection issues
- Expanded Vitest coverage from a placeholder test to 7 meaningful audit engine tests
- Added TESTS.md documentation for test coverage
- Expanded ARCHITECTURE.md with:
  - tech stack overview
  - Mermaid system diagram
  - data flow explanation
  - stack rationale
  - scaling considerations
- Created scaffold markdown files for remaining assignment deliverables
- Improved README.md with setup instructions, architecture decisions, roadmap, and project overview

### What I learned
- Hydration mismatches happen when client-side localStorage data differs from server-rendered output
- Rule-based financial recommendations are more explainable and auditable than AI-generated calculations
- CI/CD pipelines help catch integration issues earlier during deployment
- Structuring engineering documentation properly significantly improves project clarity

### Blockers / challenges
- Vercel deployment protection caused debugging delays
- Refactoring the audit engine required updating results rendering and input formatting
- Multiple data structure changes temporarily broke routing and rendering logic

### Plan for tomorrow
- Build the redesigned Day 4 results page UI
- Add hero savings section and per-tool breakdown cards
- Integrate Anthropic API summary route with fallback summaries
- Create email modal and lead capture flow
- Begin environment variable setup for Anthropic, Supabase, and Resend
- Add more advanced audit rules and optimization scenarios

## Day 4 — 2026-05-09

**Hours worked:** 9

### What I did

* Redesigned the audit results page with:

  * hero savings section
  * AI summary section
  * per-tool recommendation cards
  * lead capture CTA flow
* Added fallback summary generation for cases where AI generation fails
* Implemented `/api/summary` API route using Next.js route handlers
* Integrated OpenRouter architecture for AI-generated summaries
* Added graceful error handling and fallback behavior for unavailable models/API failures
* Refactored frontend summary loading flow and state handling
* Improved form UX by replacing free-text fields with dropdown-based selections
* Implemented `/api/leads` backend route for lead capture handling
* Added Supabase integration using:

  * environment variables
  * Supabase client SDK
  * backend persistence flow
* Created and configured `leads` table in Supabase
* Successfully persisted captured leads into the database
* Configured `.env.local` for OpenRouter and Supabase credentials
* Fixed multiple deployment/runtime issues including:

  * hydration mismatches
  * undefined audit payloads
  * Supabase URL configuration
  * Row Level Security restrictions
  * Vercel environment variable deployment issues
* Successfully redeployed the application on Vercel with working production environment configuration
* Continued expanding the project toward a production-style SaaS workflow

### What I learned

* How to build backend API routes using the Next.js App Router
* How environment variables differ between local development and production deployments
* How Supabase Row Level Security policies affect database inserts
* Why resilient fallback systems are important when integrating external AI providers
* How to debug deployment/runtime issues using Vercel logs and API responses

### Blockers / what I'm stuck on

* OpenRouter free model availability and credit limitations caused unreliable AI summary generation
* Transactional email delivery and public shareable report URLs are still pending
* Current UI is functional but still needs stronger visual polish and branding consistency

### Plan for tomorrow

* Integrate Gemini API for more stable AI summary generation
* Implement transactional email sending for audit confirmations
* Add public shareable audit result URLs
* Add Open Graph/Twitter card metadata for shared reports
* Expand audit logic coverage for all required tools and pricing plans
* Improve overall UI polish, spacing, responsiveness, and loading states
* Complete PROMPTS.md and PRICING_DATA.md documentation

## Day 5 — 2026-05-10

**Hours worked:** 8

### What I did

- Migrated AI summary generation fully to Gemini 2.5 Flash after reliability issues with previous providers
- Implemented more resilient AI summary error handling and fallback logic
- Added graceful degradation behavior so audit results still render even if AI generation fails
- Built public shareable audit report URLs backed by Supabase persistence
- Implemented dynamic `/report/[id]` route rendering for public audit pages
- Added sanitized public report rendering with sensitive information excluded
- Debugged multiple production deployment issues affecting:
  - conditional rendering
  - hydration behavior
  - async state updates
  - dynamic route params
- Resolved Vercel production rendering inconsistencies for shareable report generation
- Improved loading states and conditional rendering for asynchronous report creation
- Expanded PROMPTS.md substantially with:
  - real debugging workflows
  - architecture reasoning
  - AI-assisted development examples
  - edge case handling
  - production troubleshooting documentation
- Documented where AI assistance was intentionally avoided, especially for:
  - pricing verification
  - financial calculations
  - audit recommendation logic
- Performed full production verification on deployed Vercel environment:
  - share links
  - Gemini summaries
  - Supabase persistence
  - report generation flow

### What I learned

- Production rendering behavior in Next.js can differ significantly from local development
- Hydration-safe rendering patterns are critical when async state controls UI visibility
- AI tools are most effective when used for iterative debugging and reasoning instead of one-shot generation
- Graceful degradation significantly improves perceived product reliability

### Blockers / challenges

- Production-only rendering inconsistencies on Vercel required extensive debugging
- Gemini API model/version compatibility issues caused temporary integration failures
- PROMPTS.md became significantly larger than expected due to documenting real debugging workflows in detail

### Plan for tomorrow

- Complete entrepreneurial documentation files:
  - GTM.md
  - ECONOMICS.md
  - METRICS.md
  - LANDING_COPY.md
  - REFLECTION.md
- Improve UI polish and mobile responsiveness
- Refine landing page copy and onboarding flow
- Improve loading states and disabled button handling
- Prepare final README screenshots and presentation polish

## Day 6 — 2026-05-11

**Hours worked:** 9

### What I did

- Rebranded the product fully from “Credex Audit” to “CredexIQ” across:
  - homepage
  - results page
  - metadata
  - repository naming
  - README
  - UI labels
- Redesigned the homepage UI to better match a modern SaaS product aesthetic:
  - dark gradient theme
  - glow effects
  - glassmorphism cards
  - responsive spacing improvements
  - improved typography hierarchy
  - polished CTA interactions
- Refined the audit form UX significantly:
  - dynamic plan dropdowns based on selected tool
  - improved placeholders
  - cleaner validation handling
  - better dropdown consistency
  - improved responsive behavior
- Redesigned the results dashboard UI to better align with the homepage design system:
  - premium card styling
  - improved spacing
  - stronger visual hierarchy
  - polished recommendation sections
  - improved CTA sections
- Implemented and debugged public shareable audit reports:
  - Supabase-backed report persistence
  - dynamic `/report/[id]` route rendering
  - public report sharing flow
  - copy-to-clipboard interactions
- Fully redesigned the public report page to visually match the rest of the product:
  - dark SaaS aesthetic
  - glow background effects
  - glassmorphism styling
  - consistent gradients and spacing
- Fixed multiple production issues affecting public reports:
  - missing report IDs
  - Supabase insert handling
  - async route params in Next.js
  - Vercel environment variable issues after project rename
- Implemented resilient fallback behavior for Gemini AI summaries:
  - fallback executive summaries
  - graceful quota failure handling
  - improved AI prompts
  - cleaner summary formatting
- Integrated and debugged email workflows using Resend:
  - lead persistence
  - email delivery handling
  - sandbox email limitations
  - environment variable validation
- Added favicon/logo branding support for browser tabs and metadata
- Cleaned production logs by removing temporary debugging statements
- Continued refining README structure and startup-oriented documentation

### What I learned

- Vercel project renaming can unintentionally remove environment variables
- Public sharing flows require careful handling of async rendering and persistence state
- Graceful degradation is essential when working with rate-limited AI APIs
- Small UI consistency improvements significantly increase perceived product quality
- Production debugging consumes significantly more time than feature implementation

### Blockers / challenges

- Gemini API quota exhaustion prevented consistent AI-generated summaries during testing
- Public report rendering issues required debugging both frontend state flow and backend persistence
- Resend sandbox restrictions limited email delivery to verified/testing accounts
- Several UI refactors temporarily broke conditional rendering and report generation flows

### Plan for tomorrow

- Add final README screenshots
- Complete remaining entrepreneurial documentation:
  - GTM.md
  - ECONOMICS.md
  - METRICS.md
  - LANDING_COPY.md
  - REFLECTION.md
- Perform final mobile responsiveness verification
- Finalize production cleanup and deployment polish
- Reduce remaining UI inconsistencies
- Prepare final portfolio-ready presentation polish

