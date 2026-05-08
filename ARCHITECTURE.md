# Architecture

## System Diagram

```mermaid
graph TD
    A[User visits homepage] --> B[Spend Input Form]
    B --> C{Form Validation}
    C -->|Invalid| B
    C -->|Valid| D[localStorage: save audit data]
    D --> E[Navigate to /results]
    E --> F[auditEngine.js]
    F --> G[Rule Evaluation]
    G --> H[Savings Calculation]
    H --> I[Results Rendered]
    I --> J[Future: AI Summary API]
    I --> K[Future: Lead Capture]


-->Data Flow
1.User enters tool, plan, seats, spend, and use case on the homepage form.
2.Form validation ensures all required fields are filled.
3.Input data is formatted and passed into runAudit() inside src/lib/auditEngine.js.
4.The audit engine compares pricing against official pricing rules and recommendation logic.
5.Savings opportunities and recommendations are calculated client-side.
6.Results are saved into localStorage.
7.User is redirected to /results.
8.Results page reads saved audit data and renders recommendations and savings.

--->Stack Choices and Justification
Next.js (App Router)

Chosen because it provides:

file-based routing
API routes
simple deployment on Vercel
scalable project structure

The App Router architecture also keeps frontend and backend logic organized in a single codebase.

--->JavaScript instead of TypeScript

JavaScript was chosen over TypeScript to optimize development speed and reduce implementation complexity within the assignment timeline. Priority was placed on shipping a complete, maintainable MVP with clear architecture and functional audit logic.

Tradeoff:

less type safety

Mitigation:

extensive unit testing with Vitest
--->Tailwind CSS

Tailwind enables rapid UI development without writing large CSS files.

Benefits:

fast prototyping
utility-first styling
responsive design support

--->Vitest

Vitest was selected because it integrates well with modern Vite/Next.js tooling and provides lightweight testing for the audit engine logic.

--->Vercel

Vercel was chosen because:

zero-config Next.js deployment
automatic GitHub deployments
fast preview deployments
integrated CI/CD workflow
Current Architecture Decisions
Client-side Audit Engine

The audit engine currently runs client-side because:

calculations are deterministic
results are fast
no backend required yet
simplifies MVP architecture
localStorage Persistence

Audit inputs and results are temporarily stored in localStorage to:

persist data across refreshes
avoid backend complexity during MVP stage
improve user experience