# Changelog - Admin Refactor V2

All notable changes to the admin-refactor-v2 branch are documented here.

---

## [Admin V2] - 2025-11-27 - PM Feedback Compliance Phase

### Added
- **Update Consent Modal** ([app.js:5667-5777](prototype/js/app.js#L5667-L5777))
  - Modal with sandbox testing warning before package updates
  - Required checkbox: "I confirm that I have tested this update in a Sandbox environment"
  - "Proceed with Update" button disabled until checkbox checked
  - Saves acknowledgment to `AppState.hasTestedInSandbox`
  - Triggered from "View what's new" → Changelog → "Update to 2.5.0" button

- **Enhanced 6-Step Onboarding Wizard** ([app.js:5307-5476](prototype/js/app.js#L5307-L5476))
  - Step 1: Welcome message with overview
  - Step 2: Sandbox warning with best practices
  - Step 3: Recommended Settings (interactive checkboxes for call logging, recordings, SMS, screen pop)
  - Step 4: Connect Your Dialpad Account (API key and Office ID inputs)
  - Step 5: Set Up Permissions (Admin, Supervisor, Agent checkboxes with descriptions)
  - Step 6: Complete with next steps guide
  - Accessible via Demo Controls → "Show Onboarding Wizard" or Quick Actions → "Launch Onboarding Wizard"

- **View Reports Action** ([app.js:696-704](prototype/js/app.js#L696-L704))
  - Added "View Reports" link to Quick Actions dropdown
  - Navigates to Reports page (#/reports)
  - Includes chart icon for visual consistency

### Fixed
- **Calls Page Tabs Structure** ([app.js:2264-2278](prototype/js/app.js#L2264-L2278))
  - **Agent:** My Calls only
  - **Supervisor:** My Team, My Calls
  - **Admin:** All Calls, My Calls (previously missing "My Calls")
  - Removed extra tabs that didn't match PM requirements

- **SMS Page Tabs Structure** ([app.js:2513-2527](prototype/js/app.js#L2513-L2527))
  - **Agent:** My Calls only
  - **Supervisor:** My Team, My Calls
  - **Admin:** All Calls, My Calls
  - Changed to match Calls structure per PM: "Same for SMS as well"

- **Launch Onboarding Wizard Action** ([app.js:707, 4430-4437](prototype/js/app.js#L707))
  - Changed from showing alert to properly opening the 6-step onboarding modal
  - Added event listener to wire up `showOnboardingModal()` method
  - Now fully functional from Quick Actions dropdown

- **Version Banner Layout** ([app.js:263-293](prototype/js/app.js#L263-L293))
  - Removed "Update now" link that was causing broken layout
  - Simplified from complex grid structure to single-line paragraph flow
  - Updated close button to use proper SLDS icon
  - Update workflow still accessible via "View what's new" → Changelog modal

### Changed
- **Reports Table Standardization**
  - Made all cells clickable (not just folder name column)
  - Removed different color for folder column
  - Consistent with other table patterns in prototype
  - Added proper spacing for dropdown icons

- **Reports Page Structure**
  - Matched Powerdialer page layout for consistency
  - Moved blue info message above table
  - Standardized page header structure

### Validation
- ✅ **100% PM Feedback Compliance** - All 21 requirements from `admin_feedback_final.md` implemented
- ✅ **Calls/SMS Tabs** - Match exact PM specification
- ✅ **Update Consent Modal** - Implements sandbox testing workflow
- ✅ **Onboarding Wizard** - Enhanced 6-step flow with interactive forms
- ✅ **Quick Actions** - All 4 actions working (Add User, Manage Permission Sets, View Calls, Launch Onboarding)

---

## [Admin V2] - 2025-11-26 - Initial Admin Refactor

### Removed
- ❌ Admin sidebar navigation
- ❌ Separate Analytics page
- ❌ Separate Integration Health page
- ❌ Separate Users page
- ❌ Separate Updates page
- ❌ "Run Health Check" quick action
- ❌ "Bulk Import" quick action

### Added
- ✅ Single-page Admin Launchpad
- ✅ Dialpad System Status panel
- ✅ Admin Onboarding Checklist (5 items)
- ✅ Daily Calls line chart
- ✅ User & License summary panel
- ✅ Product Updates panel
- ✅ Simplified Quick Actions (4 items)

### Changed
- 🔄 Calls page: Removed SMS direction filter
- 🔄 Voicemail: Merged into Calls as "Recorded Calls" sub-tab
- 🔄 Reports: Added note about Salesforce folder approach
- 🔄 Settings: Added vertical navigation (6 tabs)

---

## Key Files Modified

### prototype/js/app.js
**Total Changes:** ~500 lines modified/added

**Key Sections:**
- Lines 263-293: Version banner with "View what's new" link
- Lines 641-1500: Single-page Admin dashboard with 7 sections
- Lines 2264-2278: Calls page tabs (role-based)
- Lines 2513-2527: SMS page tabs (role-based)
- Lines 4430-4437: Launch Onboarding event listener
- Lines 5307-5476: Enhanced 6-step onboarding wizard
- Lines 5667-5777: Update consent modal with sandbox checkbox

### prototype/data/report-folders.json
- Mock data for 3 Salesforce report folders
- Dialpad Reports, Dialpad Call Analytics, Dialpad Agent Performance

### prototype/data/lists.json
- Mock data for 5 Powerdialer lists
- Q4 Prospects, Follow Up - November, Support Callbacks, New Leads, Expired Trials

---

## Branch Information

**Branch:** admin-refactor-v2
**Based On:** North Star Prototype (main branch)
**Created:** November 26, 2025
**Latest Update:** November 27, 2025
**Status:** ✅ All phases completed, 100% PM feedback compliance achieved

---

## URLs

- **Admin V2 (This Branch):** https://amitdialpad.github.io/dialpad-salesforce-launchpad/admin-refactor/
- **North Star (Main):** https://amitdialpad.github.io/dialpad-salesforce-launchpad/
- **Compare Branches:** https://github.com/amitdialpad/dialpad-salesforce-launchpad/compare/main...admin-refactor-v2

---

## Documentation

- [VERSION.md](VERSION.md) - Branch version and implementation status
- [requirements/admin_feedback_final.md](requirements/admin_feedback_final.md) - PM-approved requirements
- [requirements/PM_FEEDBACK_ACTION_PLAN.md](requirements/PM_FEEDBACK_ACTION_PLAN.md) - Implementation action plan
- [requirements/git-branch-strategy-plan.md](requirements/git-branch-strategy-plan.md) - Git branching strategy
