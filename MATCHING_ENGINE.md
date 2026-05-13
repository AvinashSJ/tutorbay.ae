# Matching Engine — Implementation Plan

## Overview

End-to-end matching & session pipeline across 3 sides: **Tutor**, **Parent/Client**, **Superadmin** (tutorbay/).

```
MATCHED → INTERESTED → SCHEDULED → COMPLETED → HIRED / REJECTED
```

---

## Phase 1 — Database (tutorbay.ae Supabase)

New migration files in `supabase/migrations/`:

| # | Task | File | Description |
|---|------|------|-------------|
| 1 | Create `RequirementMatch` table | `20260511..._create_requirement_match.sql` | Tracks tutor-requirement relationship, status pipeline, match scores |
| 2 | Create `MatchSession` table | (same file) | Individual demo/visit events per match with feedback & ratings |
| 3 | RPC: `admin_get_pipeline_stats` | `20260511..._admin_rpcs.sql` | Counts at each stage |
| 4 | RPC: `admin_get_requirement_matches(p_id)` | (same file) | All matches for a requirement with tutor details |
| 5 | RPC: `admin_get_match_timeline(p_id)` | (same file) | Chronological events |
| 6 | RPC: `tutor_apply_to_requirement` | (same file) | Create RequirementMatch from tutor |
| 7 | RPC: `schedule_match_session` | (same file) | Create MatchSession |
| 8 | RPC: `update_session_status` | (same file) | Mark COMPLETED/CANCELLED/NO_SHOW |
| 9 | RPC: `submit_session_feedback` | (same file) | Add feedback + rating + outcome |

---

## Phase 2 — Superadmin (tutorbay/ project)

| # | Task | Files |
|---|------|-------|
| 1 | Pipeline stats widget on `/dashboard` | `src/app/(admin)/dashboard/page.tsx` |
| 2 | Requirement detail page `/requirements/[id]` | `src/app/(admin)/requirements/[id]/page.tsx` |
| 3 | Matched tutors section (table + scores + status + actions) | `src/app/(admin)/requirements/MatchList.tsx` |
| 4 | Session timeline (chronological event log) | `src/app/(admin)/requirements/SessionTimeline.tsx` |
| 5 | Update `RequirementTable.tsx` — add pipeline column | `src/app/(admin)/requirements/RequirementTable.tsx` |
| 6 | Server actions for matches/sessions | `src/app/(admin)/requirements/actions.ts` |

---

## Phase 3 — Tutor Side (tutorbay.ae)

| # | Task | Key Files |
|---|------|-----------|
| 1 | Wire real "Apply" button in matched list | `src/components/sections/courses/TutorMatchedList.js` |
| 2 | "My Sessions" page (upcoming + past demos) | New section in instructor profile or new route |
| 3 | Demo feedback form (rating + comments) | New component, shown after session COMPLETED |
| 4 | Match count badge in sidebar (optional) | `src/components/shared/dashboards/SidebarDashboard.js` |

---

## Phase 4 — Parent Side (tutorbay.ae)

| # | Task | Key Files |
|---|------|-----------|
| 1 | "Interested Tutors" tab under requirement | New component in requirement detail page |
| 2 | "Schedule Demo/Visit" button with date/time/type picker | Modal form component |
| 3 | Feedback + rating form (after demo) | Modal after session COMPLETED |
| 4 | "Hired" outcome → auto-close requirement | Wire to update `Requirement.status = 'CLOSED'` |

---

## Phase 5 — Integration

| # | Task | Details |
|---|------|---------|
| 1 | RLS policies on new tables | service_role full, anon denied, authenticated limited |
| 2 | Apply migrations to Supabase | `supabase db push` or SQL Editor |
| 3 | Notifications (optional) | Notify tutor when parent schedules a demo |

---

## Execution Order

Phase 1 → Phase 2 → Phase 3 & 4 (parallel) → Phase 5
