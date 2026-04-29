# Internal UX Feedback — Loom Walkthrough Reactions

**Date:** 2026-04-29
**Source:** UX feedback channel (asynchronous Loom + thread)
**Method:** Andy shared a ~2-min Loom walkthrough of the proposed task-based flat IA, with FigJam link, and asked for gut-check feedback on three things:
1. Does this structure feel clearer than what we have today?
2. Does making projects optional feel like the right decision?
3. Do the top-level navigation groupings make sense (and: marketing as separate top-level vs. one place with tabs/filters)?

**Participants:** Chandler, Graham, Abhay (PM, on-thread), Calvin, Stephanie

This is the first synthesis artifact for the IA overhaul. It captures pre-formal-research signal from internal customer-facing colleagues. It is **not** a substitute for tree testing or external user research — directional only.

---

## Themes

### Validated (no change needed)

- **Overall direction reads as a clear improvement.** Calvin: *"This new structure is pretty solid imo."* Chandler: *"As a baseline navigation concept, I like how you have projects in the new scheme."*
- **Settings-near-feature is welcome.** Stephanie: *"I love the idea of moving settings for features to be where the feature is. When I lead an email marketing tutorial, I have to bounce around to the Sender Email Address Setting back in settings which feels disjointed."* — Validates the core proposal but also surfaces specific friction points (see flagged items below).

### Flagged (folded into prototype hints + research questions)

| Catch | Source | Prototype change | Research question |
|---|---|---|---|
| "Subscriptions" appears under Email in the proposal but the label already exists in Account Settings > General for unsubscribe-page settings — risk of conflation. | Stephanie | Added Email > Subscriptions to match FigJam; added IA notes on both locations. | RQ11 (Critical) + Task 16 |
| Domain settings are project-scoped today and used by landing pages, invites, and forms. Stephanie's team recently had to change them at the project level for a Feathr Form on a Feathr landing page. Unclear how this works when projects are optional. | Stephanie | Added IA note on `as-domains`. | RQ12 (Critical) + Task 18 |
| Sender Email Address being far from Email is the disjointedness Stephanie called out. The proposed IA doesn't move it. | Stephanie | Added IA note on `as-sender-emails` flagging this as a tested complaint. | Reinforces RQ6 + Task 17 |
| Initial confusion about what "optional projects" means: navigationally vs. as an entire concept. | Chandler | Added IA note on `campaigns-projects` clarifying it's an optional folder, not just nav placement. | RQ13 (Important) |
| Existing users will need migration prompts and discovery aids to find things in the new structure. | Calvin | No prototype change. | RQ14 (Important) |

### Future direction (captured, not in prototype scope)

**Multi-project / tag-based campaign assignment.** Graham raised that some on the dev team have been kicking around an idea to replace projects (and possibly flights) with a flexible tag system: a campaign could carry multiple tags, each tag could get its own report page and be pinnable as a nav item. Abhay liked it, with the caveat of keeping the "Projects" label to minimize jarring change for existing users, and explicitly noted it would *decouple billing from projects*.

**Decisions recorded from the thread:**
- Project-level billing **could** be retained as an optional feature even if billing decouples from project-as-folder (Abhay).
- Subscription settings would have to move/duplicate to Email — confirmed (Abhay to Stephanie).

This idea is **not on the roadmap** and is **not added to the prototype tree** because mixing it into the current IA validation would conflate testing the proposed structure with testing speculative changes. If formal research validates the projects-optional direction, this is a natural next-iteration question.

---

## Open questions seeded into the research plan

- **RQ11** Subscriptions label conflict (Email vs Account Settings)
- **RQ12** Domain settings location with optional projects
- **RQ13** Projects-optional comprehension (concept vs nav)
- **RQ14** Migration discoverability for existing users

## Open questions still uncovered

- **Subscription scope under Project today.** Stephanie noted that subscriptions are project-based currently. If projects become optional, the subscription record itself (not just the settings page) needs a new home. This is a data/architecture question more than an IA question, but it should be flagged to engineering.
- **Landing page + invites domain settings interaction.** Stephanie's concrete example (Feathr Form on a Feathr landing page requiring project-level domain change) should be documented as a representative cross-feature workflow when scoping the implementation.

## Limitations

- Five participants, all internal customer-facing or technical staff. Not representative of end customers.
- Asynchronous text feedback — no probing follow-ups, body-language signals, or shared-screen observation.
- Self-selected (responded to the Slack thread); selection bias toward those most engaged with the topic.

Use this signal to **shape research questions and tasks**, not to validate decisions.
