# Design Crit — Usability Review of Feathr IA Prototype

**Date:** 2026-04-29
**Source:** Internal design crit ([Granola notes](https://notes.granola.ai/t/e2682718-1a86-4ad4-ad92-3fe7c6ec5d2a-008umkv4))
**Participants:** Andy Weir, Emily Greaves, Abhay Khurana, Misty Dingus

This synthesis captures decisions and open items from the crit. It complements [2026-04-29-internal-ux-feedback.md](./2026-04-29-internal-ux-feedback.md), which captured async Loom-thread feedback earlier the same day.

---

## Decisions

### Projects and Flights consolidate into Projects

Both serve similar organizational purposes in the new IA, and projects lose their other functions (billing-as-folder, top-level prominence) under the proposed structure. Recommendation accepted: merge.

- **Projects absorb Flights' funnel/Kanban view** as a Project Overview
- The current flight visualization is less effective than competitor funnel reports — opportunity to redesign as part of the Overview
- New `{{ project }}` template children: **Overview, Campaigns, Report, Billing**
- "Information" view removed (absorbed into Overview)

Prototype updated: `src/pages/feathr-ia/data.ts` — `campaigns-flights` node removed, `campaigns-projects` enhanced.

### Account-level campaign and content management are critical dev areas

The IA overhaul is no longer just a navigation reorganization — it requires novel development to support workflows that today require project context. Two areas explicitly called out:

1. **Account-level campaign management** — campaigns must be creatable and managed outside any project
2. **Account-level content management** — templates, creatives, and forms must live at the account level

Both require **written specifications from Abhay before further prototyping.** Hints added to `campaigns` and `content` IA nodes.

---

## Blocked items (awaiting Abhay)

| Item | Owner | Status |
|---|---|---|
| Account-level Content Manager scope (previously designed twice) | Abhay | Pending written spec |
| Account-level Marketing Campaign Management spec | Abhay | Pending written spec |

Until these specs land, the prototype shows the IA placement but cannot demonstrate full workflow depth (create/edit/delete for templates, ads, forms; full marketing workflow).

---

## Open questions

- **Migration strategy** for existing project-based workflows — how do users with deep project hierarchies move to the new structure? (Reinforces RQ14 from research plan.)
- **Tag-based campaign assignment** (raised in async thread, see prior synthesis) — could this replace the merged Projects concept in a future iteration if validation supports decoupling?
- **Project-level billing retention** — Abhay noted this could remain optional even if billing decouples from project-as-folder. Spec needed.

---

## Next steps

| Action | Owner | Timing |
|---|---|---|
| Continue prototype development; synthesize UX feedback channel input | Andy | In progress (this doc + prior synthesis) |
| Deliver written specs for Content and Campaign areas | Abhay | Before next prototype iteration |
| Schedule prototype review session | Team | End of May fallback |
| Contribute usability testing suggestions | Emily, Misty | TBD |
| Plan structured usability testing approach | Andy + Emily + Misty | TBD |

---

## Limitations

Internal four-person crit. Captures team alignment on direction, not external validation. Decisions here shape what gets tested in the formal research plan, but the research plan (tree test, card sort, stakeholder interviews) is what validates them with end users.
