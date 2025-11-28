# Changelog - Admin Refactor V2

All notable changes to the admin-refactor-v2 branch are documented here.

---

## [Admin V2] - 2025-11-28 - OAuth Visibility Enhancements

### Added
- **OAuth Metrics & Tracking** ([data-service.js:413-418, 537-543](prototype/js/data-service.js))
  - Added OAuth connection metrics: `connected`, `disconnected`, `expired`, `expiringSoon`
  - Added `failedCallLogs24h` tracking for call logs that failed due to OAuth issues
  - OAuth metrics available in all admin dashboard cards via `metrics.oauth`

- **Salesforce OAuth Status Card** ([app.js:1157-1226](prototype/js/app.js#L1157-L1226))
  - New dedicated card in Row 1 showing OAuth connection health
  - 4-metric grid: Connected, Disconnected, Expired, Expiring Soon
  - Color-coded metrics (green for healthy, red/orange for issues)
  - Action link: "X users need attention →" navigates to Settings
  - Alert banner shows "Action Required" when users need to reconnect

- **Recent Failed Logs Card** ([app.js:920-981](prototype/js/app.js#L920-L981))
  - Dedicated card showing call logs that failed to sync
  - Table with Time, User, and Reason columns
  - Shows 5 most recent failed logs
  - Link to view all failed logs
  - Empty state when no failures

- **API Usage % Metric** ([app.js:1456, 1470](prototype/js/app.js#L1470))
  - New metric card showing Salesforce API usage percentage
  - Calculated from `integration.apiUsage / integration.apiLimit`
  - Color-coded: Green (<60%), Orange (60-80%), Red (>80%)

- **System Uptime % Metric** ([app.js:1459, 1471](prototype/js/app.js#L1471))
  - New metric card showing today's system uptime
  - Mock data: 99.2% uptime
  - Color-coded: Green (>99%), Orange (95-99%), Red (<95%)

- **OAuth Summary Alerts** ([data-service.js:464-470](prototype/js/data-service.js))
  - High-level alerts in Attention Required card
  - "X users not connected to Salesforce - calls not logging" (severity: high)
  - "X call logs failed to sync in last 24 hours" (severity: medium)

### Changed
- **Row 1 Layout Restructure** ([app.js:741-755](prototype/js/app.js#L741-L755))
  - Changed from 3 cards to 4 cards, each 3 columns wide
  - **Card 1:** Attention Required (alerts with collapsible INFO section)
  - **Card 2:** System Health (services, API usage, uptime)
  - **Card 3:** Recent Failed Logs (call log sync failures)
  - **Card 4:** Salesforce OAuth Status (user connection metrics)
  - Balanced layout with appropriate content in each card

- **Attention Required Card Enhancement** ([app.js:1057-1102](prototype/js/app.js#L1057-L1102))
  - Added collapsible INFO alerts section (collapsed by default)
  - Toggle arrow shows/hides INFO alerts
  - OAuth summary alerts included for high-level awareness
  - Grouped alerts by severity: CRITICAL, IMPORTANT, INFO

- **Metric Cards Expansion** ([app.js:1443-1483](prototype/js/app.js#L1443-L1483))
  - Increased from 8 to 10 metric cards
  - Added API Usage % and System Uptime % metrics
  - All cards maintain consistent styling (140px min-width, flexbox layout)

### Removed
- **Hover Animations** ([app.js:1111, 1167, 1236, 1476](prototype/js/app.js))
  - Removed `onmouseenter` and `onmouseleave` animations from all clickable cards
  - Removed `transition: all 0.2s ease` styles
  - Affected cards: User Management, OAuth Status, License Utilization, all 10 metric cards
  - Simplified interaction: cards remain clickable but no visual animation

- **OAuth Status User List**
  - Removed individual user list from OAuth Status card
  - Simplified to just metrics grid + action link
  - Reduces overwhelming detail, focuses on at-a-glance visibility

### Fixed
- **OAuth Link Text** ([app.js:1218](prototype/js/app.js#L1218))
  - Changed from "7 users need attention → Go to Settings" to "7 users need attention →"
  - Cleaner, more concise call-to-action

- **Card Height Balance**
  - Removed fixed `max-height: 500px` from cards
  - Natural sizing based on content
  - Collapsible INFO alerts help control Attention Required card height

### Information Architecture
**Implemented hierarchical OAuth visibility:**
1. **Attention Required** - High-level summary alerts for triage (10-second scan)
   - "5 users not connected - calls not logging"
   - "12 call logs failed to sync"
2. **Recent Failed Logs** - Detailed failure data table (investigate specific issues)
   - Time, User, Reason for each failure
3. **OAuth Status** - Overall connection health metrics (take action)
   - Connected: 3, Disconnected: 5, Expired: 2, Expiring Soon: 3
   - Direct link to Settings for remediation

### Validation
- ✅ **Sales Engineer Feedback Addressed** - OAuth visibility for admins implemented
- ✅ **No Redundancy** - Each card serves distinct purpose in workflow
- ✅ **At-a-Glance Visibility** - Admins can see which users need to connect to Salesforce
- ✅ **Failed Log Tracking** - Call logging failures visible with reasons
- ✅ **Simplified Interactions** - Removed distracting hover animations

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
