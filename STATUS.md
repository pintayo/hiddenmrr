---
status: active
priority: high
now: Deploy webhook fix, then distribution (ReplyQueue daily loop) — product is done, marketing is the gap
blockers: on side branch claude/market-readiness-plan-PftgY — decide merge to main; webhook fix local-only until deployed
updated: 2026-07-19
---
# hiddenmrr

€19 Pro (lifetime) repo-analyzer for technical founders. Free tier: 1 scan on
server Gemini key. Checkout via Lemon Squeezy with checkout[custom][user_id].

Fixed 2026-07-19 (commit 7f6fad6) — payment webhook money bugs:
1. Order without user_id (e.g. direct store link) was silently dropped:
   customer PAID, never unlocked, nothing logged. Now: falls back to matching
   buyer email against profiles.email; logs "PAYMENT NOT FULFILLED" loudly if
   still unmatched.
2. Refunds never handled → refunded users kept lifetime access. Now
   order_refunded revokes has_paid via lemon_squeezy_order_id.

Known minor (not fixed, needs atomic SQL RPC): free-scan counter race — two
parallel scans can both pass the free check. Worst case: one extra free scan
on the server Gemini key. Low priority.
