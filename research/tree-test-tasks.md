# Tree Test Task Scenarios

18 findability tasks for the Feathr IA tree test. Each task targets one or more research questions (RQ) from the research plan. Tasks are presented in random order per session via the prototype's built-in randomization.

## Campaign Tasks

### Task 1: Create an email campaign
**Prompt:** "You want to create a new email campaign. Where would you go?"
**Expected answers:** `create-campaign`, `campaigns-email`, `email-campaign-tpl`
**Tests:** Create button discoverability, Campaigns/Marketing findability

### Task 2: View running ad campaigns
**Prompt:** "You want to see all your currently running ad campaigns. Where would you find them?"
**Expected answers:** `campaigns-ads`, `ad-campaign-tpl`
**Tests:** Campaigns > Ads path

### Task 3: Invite a partner (RQ1)
**Prompt:** "You want to invite a partner organization to run ads for your cause. Where would you go?"
**Expected answers:** `pm-invites`, `pm-campaigns`, `pm-templates`
**Tests:** Partner Marketing vs Campaigns confusion

### Task 4: Set up sponsorships (RQ1)
**Prompt:** "A partner wants to sell sponsorships for your event. Where would you set that up?"
**Expected answers:** `pm-monetization`, `pm-monetization-tpl`
**Tests:** Monetization findability under Partner Marketing

## Audience/Contact Tasks

### Task 5: Upload contacts (RQ2)
**Prompt:** "You need to upload a spreadsheet of supporter contacts. Where would you go?"
**Expected answers:** `audience-imports`, `audience-settings`
**Tests:** "Audience" label recognition, Imports path

### Task 6: Create a donor segment (RQ2)
**Prompt:** "You want to create a segment of donors who gave more than $100. Where would you go?"
**Expected answers:** `audience-segments`, `segment-tpl`
**Tests:** Audience > Segments path, "Audience" as label for people

### Task 7: Add a custom field (RQ7)
**Prompt:** "You want to add a custom field to track supporter volunteer status. Where would you go?"
**Expected answers:** `audience-custom-fields`, `pm-custom-fields`
**Tests:** Custom Fields location ambiguity

## Forms/Content Tasks

### Task 8: Create a donation form (RQ3) — CRITICAL
**Prompt:** "You want to create a new donation form for your website. Where would you go?"
**Expected answers:** `content-forms`, `donation-form-tpl`, `fundraising`
**Tests:** Forms discoverability — the most important task in this study

### Task 9: Edit a saved template (RQ8)
**Prompt:** "You want to edit an email template you saved previously. Where would you find it?"
**Expected answers:** `content-templates-saved`, `content-templates`
**Tests:** Content > Templates path

### Task 10: Upload ad creatives (RQ8)
**Prompt:** "You want to upload new ad creative images. Where would you go?"
**Expected answers:** `content-creatives`
**Tests:** Content > Creatives findability

## Settings Tasks

### Task 11: Add a team member (RQ6)
**Prompt:** "You need to add a new team member to your Feathr account. Where would you go?"
**Expected answers:** `as-users`, `as-permissions`
**Tests:** Account Settings > Permissions path

### Task 12: Install Super Pixel (RQ5)
**Prompt:** "You want to install the Super Pixel tracking code on your website. Where would you go?"
**Expected answers:** `super-pixel-install`, `super-pixel`
**Tests:** Audience > Settings > Super Pixel (depth 4 path)

### Task 13: Update billing — CONTROL
**Prompt:** "You want to update your organization's billing information. Where would you go?"
**Expected answers:** `as-billing`, `as-configurations`, `as-billing-license`
**Tests:** Straightforward path (control task for baseline)

## Reports Tasks

### Task 14: View campaign conversions
**Prompt:** "You want to see how many people visited your website from your campaigns. Where would you go?"
**Expected answers:** `reports-conversions`, `reports-conv-dashboard`
**Tests:** Reports > Conversions path

### Task 15: Review audience engagement
**Prompt:** "You want to review the overall engagement of your audience. Where would you go?"
**Expected answers:** `reports-engagement`, `reports`
**Tests:** Reports vs Dashboard disambiguation

## Tasks added from internal UX feedback (2026-04-29)

See [synthesis/2026-04-29-internal-ux-feedback.md](synthesis/2026-04-29-internal-ux-feedback.md).

### Task 16: Manage unsubscribe page settings (RQ11)
**Prompt:** "You want to manage the unsubscribe page settings for your supporter emails. Where would you go?"
**Expected answers:** `email-subscriptions`, `as-subscriptions`
**Tests:** Subscriptions label conflict — does Email > Subscriptions read as the unsubscribe-page settings, or do users still go to Account Settings > General? Both locations are accepted as success during the migration window; observe which wins.

### Task 17: Configure sender email address (RQ6)
**Prompt:** "You need to configure the sender email address used for an outgoing campaign email. Where would you go?"
**Expected answers:** `as-sender-emails`
**Tests:** Whether burying Sender Email Addresses under Account Settings > General is acceptable, or whether users expect this near Email. Stephanie's specific complaint about feeling disjointed.

### Task 18: Update domain settings for a landing page (RQ12)
**Prompt:** "You want to update the domain settings for a landing page. Where would you go?"
**Expected answers:** `as-domains`
**Tests:** Domain settings location when projects are optional. Observe whether users wander into Campaigns/Marketing or Content first (mirroring today's project-scoped behavior).
