# PRICING_DATA.md
## Complete AI Tools Pricing Reference
Last Updated: 2026-05-10

---

## ChatGPT
Verification Date: 2026-05-10
Official Sources:
- https://chatgpt.com/pricing

| Plan | Price | Notes |
|---|---|---|
| Free | $0 | Limited access, basic features |
| Go | ₹399/mo (~$5) | India regional plan |
| Plus | $20/mo | GPT-4o access, priority support |
| Pro | $120/mo | Heavy developer usage, advanced features |
| Business | $25/user/mo | Minimum 2 seats, team management |
| Enterprise | Custom | Custom pricing for large orgs |
| API Direct | Pay-as-you-go | Token-based pricing |

Reasoning:
- Used for team size optimization recommendations
- Detects redundancy with Claude and Gemini
- Flags overspend on Pro when Plus would suffice
- Identifies API vs subscription overlap

---

## Claude (Anthropic)
Verification Date: 2026-05-10
Official Sources:
- https://claude.ai/pricing
- https://console.anthropic.com/pricing

| Plan | Price | Notes |
|---|---|---|
| Free | $0 | Limited daily messages |
| Pro | $20/mo | Unlimited messages, best for general use |
| Max (5 seats) | $100/mo | Heavy usage, 1M token context |
| Max (20 seats) | $200/mo | Team pricing for Max tier |
| Team | $25/user/mo | Minimum 5 seats, shared workspace |
| Enterprise | Custom | Custom pricing, admin controls |
| API Direct | Pay-as-you-go | Token-based, no monthly fee |

Reasoning:
- Detects Team plan misuse (minimum seat requirement)
- Identifies Max overspend for non-coding use cases
- Flags redundancy with ChatGPT for coding tasks
- Catches API + subscription overlap
- Recommends downgrade from Max to Pro for general use

---

## Cursor
Verification Date: 2026-05-10
Official Sources:
- https://cursor.com/pricing

| Plan | Price | Notes |
|---|---|---|
| Hobby | $0 | Free tier, limited requests |
| Pro | $20/user/mo | Full access for individuals |
| Pro Plus | $60/user/mo | Advanced AI features |
| Ultra | $200/user/mo | Enterprise-grade coding |
| Teams | $40/user/mo | Team collaboration |
| Enterprise | Custom | Custom enterprise pricing |

Reasoning:
- Detects Business plan misuse for small teams (< 2 users)
- Recommends Pro for teams under 5 users
- Identifies redundancy with GitHub Copilot
- Flags v0 overlap for frontend developers

---

## GitHub Copilot
Verification Date: 2026-05-10
Official Sources:
- https://github.com/features/copilot/pricing

| Plan | Price | Notes |
|---|---|---|
| Individual | $10/user/mo | Personal use |
| Business | $19/user/mo | Organization billing |
| Enterprise | $39/user/mo | Advanced controls |

Reasoning:
- Identifies redundancy with Cursor (both provide IDE integration)
- Flags as secondary choice for coding teams using Cursor
- Detects overspend when Cursor provides better value
- Recommends consolidation for coding teams

---

## Gemini (Google AI)
Verification Date: 2026-05-10
Official Sources:
- https://gemini.google.com/pricing
- https://ai.google.dev/pricing

| Plan | Price | Notes |
|---|---|---|
| Free | $0 | Limited daily usage |
| AI Plus | ₹399/mo (~$5) | India plan, enhanced access |
| AI Pro | ₹1950/mo (~$23) | India plan, advanced features |
| AI Ultra | ₹24500/mo (~$290) | India plan, maximum capabilities |
| Business | $20/user/mo | Team plans (non-India) |
| Enterprise | $30/user/mo | Enterprise (non-India) |
| API | Pay-as-you-go | Token-based pricing |

Reasoning:
- Flags AI Ultra as excessive for most workflows
- Detects redundancy with ChatGPT (general-purpose overlap)
- Identifies 50% savings potential by consolidating
- Catches API + subscription double-spend
- Recommends downgrade from Ultra to Pro for typical users

---

## Windsurf
Verification Date: 2026-05-10
Official Sources:
- https://codeium.com/windsurf

| Plan | Price | Notes |
|---|---|---|
| Free | $0 | Community tier |
| Pro | $15/user/mo | Individual developers |
| Teams | $35/user/mo | Team collaboration |

Reasoning:
- Emerging alternative to Cursor
- Detects if cheaper than Cursor Pro ($20)
- Flags Teams plan for solo users (Pro is better)
- Identifies redundancy with other coding assistants

---

## v0 (Vercel)
Verification Date: 2026-05-10
Official Sources:
- https://v0.dev/pricing

| Plan | Price | Notes |
|---|---|---|
| Free | $0 | Limited UI generations |
| Premium | $20/user/mo | Unlimited generations |
| Team | Custom | Team collaboration |
| Enterprise | Custom | Enterprise pricing |

Reasoning:
- Detects redundancy with Cursor for frontend developers
- Identifies overlap with Claude (both can generate UI code)
- Flags as secondary tool when Cursor available
- Recommends consolidation for frontend-focused teams

---

## Anthropic API
Verification Date: 2026-05-10
Official Sources:
- https://console.anthropic.com/pricing
- https://docs.anthropic.com/pricing

| Plan | Price | Notes |
|---|---|---|
| Pay-as-you-go | Variable | Token-based billing |

Reasoning:
- Detects overlap with Claude subscription
- Flags when both API and Claude Max are used
- Recommends consolidation for heavy usage
- Can be cheaper than subscription for light usage
- ~$0.001-$0.02 per 1K tokens (varies by model)

---

## OpenAI API
Verification Date: 2026-05-10
Official Sources:
- https://openai.com/api/pricing/
- https://platform.openai.com/account/billing/overview

| Plan | Price | Notes |
|---|---|---|
| Pay-as-you-go | Variable | Token-based billing |

Reasoning:
- Detects overlap with ChatGPT subscription
- Flags redundancy with ChatGPT Plus/Pro
- Identifies cases where API is more cost-effective
- Can be cheaper than subscription for occasional use
- ~$0.0005-$0.02 per 1K tokens (varies by model)

---

## Audit Engine Logic

### Cross-Tool Redundancy Detection
| Tool Combination | Recommendation | Savings |
|---|---|---|
| ChatGPT + Claude (coding) | Keep Claude, drop ChatGPT | Full ChatGPT cost |
| Cursor + GitHub Copilot | Keep Cursor, drop Copilot | Full Copilot cost |
| v0 + Cursor (frontend) | Keep Cursor, drop v0 | Full v0 cost |
| Gemini + ChatGPT | Keep one, drop other | 50% of duplicate |
| Claude API + Claude Max | Optimize usage pattern | 20% savings estimate |
| OpenAI API + ChatGPT | Optimize usage pattern | 20% savings estimate |

### Overspend Detection Rules
1. **Retail Overpay**: Paying >10% above official rates
2. **Wrong Plan**: Using higher tier than needed (e.g., Claude Team < 5 seats)
3. **Excessive Tier**: Using Ultra/Max/Pro when Plus/Pro sufficient
4. **Redundant Tools**: Running duplicate capabilities
5. **Credits Opportunity**: Spending ≥$100/mo eligible for 20-40% discounts via Credex

### Team Size Optimization
- Claude Team: Minimum 5 seats (recommend Pro for < 5 users)
- ChatGPT Team: Minimum 2 seats
- Cursor Teams: Minimum 2 users (recommend Pro for solo)
- GitHub Copilot Business: No minimum, but Team pricing better at scale

### Use Case Specific Recommendations
| Use Case | Recommended | Avoid |
|---|---|---|
| Coding | Cursor or Claude Pro | ChatGPT alone |
| Frontend Dev | Cursor + v0 OR just Cursor | v0 alone |
| General AI | ChatGPT Plus OR Claude Pro | Both + Gemini |
| API Integration | OpenAI API or Anthropic API | Subscription + API combo |
| Enterprise | Claude Team or ChatGPT Business | Multiple individual plans |

---

## Notes
- All prices verified as of May 10, 2026
- Regional pricing (India) converted at ~₹83 = $1 USD
- API pricing is approximate and varies by model selection
- Enterprise pricing requires direct contact with vendors
- Recommendations assume typical workload; heavy users may need higher tiers