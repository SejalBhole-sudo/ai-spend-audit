# Tests

All tests use Vitest.

Run tests with:

```bash
npm run test

## Test File

src/__tests__/audit.test.js

| Test | What it covers |
|------|----------------|
| Returns optimal for correct spend | Ensures no false savings flags |
| Flags overpaying vs official rate | Detects excessive spend |
| Flags Claude Team for under 5 seats | Validates minimum seat logic |
| Flags Copilot redundant with Cursor | Detects overlapping coding tools |
| Calculates savings correctly | Verifies monthly and annual calculations |
| Flags Claude Max downgrade | Suggests lower-tier plan for writing |
| Returns isOptimal true | Detects already optimized stack |