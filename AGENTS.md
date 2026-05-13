# Jira Story Progress — 42 stories

## Done (30)
US-001, US-002, US-003, US-004, US-005, US-101, US-102, US-103, US-104, US-105,
US-201, US-202, US-203, US-204, US-205, US-301, US-302, US-303, US-304, US-305,
US-307, US-308, US-309, US-401, US-403, US-405, US-501, US-502,
Superadmin payments list (Stripe workflow, /payments)

## Partial (3)
- **US-306** Tutor recharge credits — Stripe modal exists, test credit button works, Edge Functions deployed (create-payment, stripe-webhook), real Stripe webhook secret not configured yet
- **US-402** Superadmin assign admin roles — page exists at /assign-role, verify full functionality
- **US-404** Admin CRUD requirements — viewing/matches/timeline works, actions.ts exists

## Not Done (11) — all Medium/Low priority
| Story | Description | Priority | Pts |
|-------|-------------|----------|-----|
| US-006 | Security audit trail | Medium | 5 |
| US-309 | Tutor feedback for parent/student | Medium | 3 |
| US-310 | Tutor blog article submission | Low | 5 |
| US-311 | Tutor support ticket | Medium | 5 |
| US-406 | Admin moderate blogs | Medium | 5 |
| US-407 | Admin support ticket handling | Medium | 5 |
| US-503 | Admin override/rerun match | Medium | 5 |
| US-601 | Download user reports | Medium | 5 |
| US-602 | Download requirement reports | Medium | 5 |
| US-603 | Download match reports | Medium | 5 |
| US-604 | Filtered CSV/XLSX exports | Medium | 8 |

## Recent Non-Jira Work
- **HeroDashboard** — background image IS the hero (dark overlay), bg color only as fallback; camera icon at top-right for bg upload, hover overlay on avatar for profile upload; replaced `<Image>` with `<img>` to fix "Objects not valid as React child" error; fixed state leakage to non-profile pages
- **CoursesFilter2** — `profileImage` added to matchedTutors mapping; `<Image>` replaced with `<img>` to avoid external URL optimization error; `get_all_tutors` RPC now returns `profileImage` + nested `tutorProfile` (JSONB); `find_matching_tutors` RPC now includes `profileImage`
- **US-309** — Tutor feedback for parent/student: `get_tutor_sessions` RPC now returns `ownerId`/`ownerName`; `TutorSessionList.js` shows ReviewForm for COMPLETED sessions with duplicate-prevention via review lookup; `reviewSlice.js` now exports `useCheckExistingReviewQuery`
- **/tutors route** — Created `src/app/tutors/page.js` (metadata + layout) and `src/components/layout/main/TutorsMain.js` (client component with `useGetAllTutorsQuery()` → responsive TutorCard grid with HeroPrimary banner, loading/error/empty states). Fixes the "All Tutors" CTA 404 in CoursesFilter2.js.

## Pipeline Next Steps (non-Jira)
1. Notifications (Phase 5) — fully planned, on hold
2. Cancel Session / No Show quick actions for parent & superadmin
3. Notification bell icon in navbar for application count
