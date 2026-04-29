# Feathr IA Overhaul — Research Plan

**Initiative:** Usability Overhaul: App Architecture, Navigation & Onboarding Simplification
**Ticket:** [shrike#7415](https://github.com/Feathr/shrike/issues/7415)
**FigJam:** [Usability Overhaul Board](https://www.figma.com/board/3X9LLSDH68RJB8sTpxrL7e/)
**Researcher:** Andy Weir
**Date:** 2026-04-29

---

## Objective

Validate the proposed "Task Based Flat" information architecture through structured user research before committing to implementation. The proposed IA reorganizes Feathr's navigation from a project-centric model to a task-based flat structure with ~12 top-level items grouped into Programs, Library, Insights, and Utility sections.

## Research Questions

### Critical (must answer before implementation)

1. **Campaigns/Marketing vs Partner Marketing disambiguation** — Will users confuse these two top-level items? Will they look for partner invites or monetization under Campaigns?
2. **"Audience" as a label for contacts** — Do users expect "Contacts," "People," "Supporters," or "Audience" when looking for their constituent records?
3. **Forms discoverability** — Where do users expect to find Forms? (Content? Fundraising? Campaigns? Create?) Critical because forms have 5.5x retention protection but only 17% adoption.
4. **"Other" campaigns scent** — Does the "Other" label in the Campaigns section provide any useful information scent?
5. **Depth acceptability** — Are paths reaching depth 4+ (e.g., Campaigns > Flights > {{ flight }} > Report) acceptable?

### Important (should answer before implementation)

6. **Settings fragmentation** — With Settings appearing in 6 places (Campaign, Audience, Content, Account, Fundraising, Notification), will users know where to go?
7. **Custom Fields duplication** — Custom Fields appears under both Partner Marketing > Partners and Audience > Settings. Should these converge?
8. **"Content" as a grouping label** — Does "Content" make sense for Creatives + Templates + Forms + Fonts to nonprofit marketers?
9. **Quick Start persistence** — Is a persistent Quick Start nav item useful beyond onboarding, or dead space?
10. **Account Settings > General sprawl** — The General sub-section still has 16 items. Is this too many?

### Added from internal UX feedback (2026-04-29)

See [synthesis/2026-04-29-internal-ux-feedback.md](synthesis/2026-04-29-internal-ux-feedback.md) for source quotes.

11. **Subscriptions label conflict (Critical)** — The proposal adds "Subscriptions" under Email, but Account Settings > General > Subscriptions already exists for unsubscribe-page settings. Do users distinguish them, or does the duplication confuse them? *(Source: Stephanie)*
12. **Domain settings location (Critical)** — Domain settings are project-scoped today and used by landing pages, invites, and forms. Where do users expect to manage domains when projects become optional — account-level, campaign-level, or hybrid? *(Source: Stephanie)*
13. **Projects-optional comprehension (Important)** — Do users grasp "projects are optional" as a concept (campaigns can stand alone) or only as a navigation choice? *(Source: Chandler)*
14. **Migration discoverability (Important)** — How discoverable is the new structure for existing users without migration prompts or in-app onboarding? *(Source: Calvin)*

## Methods

### Week 1-2: Open Card Sort + Stakeholder Interviews

**Open card sort** — Self-hosted via prototype card sort mode
- 20-30 existing Feathr customers, mix of tiers
- ~35-40 leaf-level feature cards
- Goal: Understand unbiased mental models for feature grouping

**Stakeholder interviews** — Internal, 3-5 people (CS, Support, Sales, Onboarding)
- 30 min semi-structured each
- Focus: common user confusion, terminology usage, feature discovery gaps

### Week 3-4: Internal Tree Testing

**Tree testing** — Using prototype's built-in tree-test mode
- 8-10 internal staff (CS, marketing, sales — not product/design)
- 18 findability tasks (see [tree-test-tasks.md](tree-test-tasks.md))
- Metrics: success rate, directness, time on task, first-click accuracy

### Week 5-6: External User Testing

**Tree testing + interviews** — Moderated, 8-10 participants
- 45-min sessions via prototype
- Segments: at-risk users, active power users, newer users (<6 months)

**Tree testing** — Unmoderated, 15-20 participants
- Same tasks, shared via prototype URL

### Week 7-8: Synthesis & Recommendation

See research synthesis approach below.

## Success Criteria

| Threshold | Meaning |
|-----------|---------|
| **<60% direct success** | IA must change for that path |
| **60-80% direct success** | Workable; consider label or placement tweaks |
| **80%+ direct success** | Validated |

## Synthesis Approach

**Quantitative:** Per-task success rate table, directness scores, first-click correctness, average time. Card sort similarity matrix.

**Qualitative:** Affinity mapping of quotes and observations. Key categories: terminology mismatches, expected vs actual groupings, depth/complexity reactions, missing features.

**Deliverable:** Recommendation document in `research/synthesis/recommendation.md` with:
- Finding + evidence for each research question
- Recommended action per question: keep / modify / needs further testing
- Revised IA tree if changes warranted
