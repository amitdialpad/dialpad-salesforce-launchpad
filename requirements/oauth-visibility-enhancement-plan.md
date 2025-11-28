# OAuth Visibility & Connection Management Enhancement Plan

**Date:** November 27, 2025
**Source:** Sales Engineer feedback from large Salesforce customer
**Priority:** HIGH - Addresses recurring operational issues

---

## 📋 Executive Summary

Customer feedback identified 3 critical operational pain points with the current Salesforce OAuth integration:

1. **Admin Visibility** - No way to see which users are/aren't connected
2. **User Prompts/Guards** - No proactive nudges to connect before using features
3. **Error Surfacing** - Silent failures when call logging fails due to auth issues

**Impact:** These gaps cause silent failures, incorrect call attribution, and increase support burden.

**Goal:** Align with enterprise SaaS best practices for OAuth management.

---

## 🎯 Three Core Enhancement Areas

### 1. Admin Visibility: OAuth Connection Dashboard

**Problem:**
> "Ability for admins to see which Dialpad users are/aren't connected to Salesforce (OAuth token status, last connection). Helps prevent silent failures and incorrect call attribution."

**Current State in Prototype:**
- ✅ We have `renderAdminUserConnectionCard()` (line 972-1050)
- ✅ Shows users with "connection issues"
- ❌ Generic "offline" status - not OAuth-specific
- ❌ No token expiry information
- ❌ No last sync timestamp
- ❌ No bulk actions for admins

**What We Need to Add:**

#### A. Enhanced OAuth Status Table
New section in Admin dashboard with detailed OAuth information:

| Column | Data | Purpose |
|--------|------|---------|
| **User** | Name + Email | Identify user |
| **Role** | Admin/Supervisor/Agent | Context |
| **OAuth Status** | Connected / Disconnected / Expired | Clear status |
| **Token Expiry** | Date/time or "Expired" | Proactive renewal |
| **Last Sync** | Timestamp | Detect stale connections |
| **Call Logs (24h)** | Success/Failed count | Impact visibility |
| **Actions** | Revoke / Resend Link / Test | Admin tools |

**Visual Design:**
```
┌─────────────────────────────────────────────────────────────┐
│ OAuth Connection Status                          🔄 Refresh  │
├─────────────────────────────────────────────────────────────┤
│ ⚠️ 3 users disconnected • 2 tokens expiring soon            │
├─────────────────────────────────────────────────────────────┤
│ Filters: [All ▼] [Connected] [Disconnected] [Expired]       │
│ Search: [________________]                                   │
├─────────────────────────────────────────────────────────────┤
│ User          Role    Status      Token Expiry   Last Sync  │
│ John Smith    Admin   ✅ Connected  30 days       2 min ago  │
│ Sarah Lee     Agent   ❌ Disconnected  -          Never      │
│ Mike Chen     Sup     ⚠️ Expired     Expired      2 days ago │
│ ...                                                           │
├─────────────────────────────────────────────────────────────┤
│ Bulk Actions: [ Remind Selected ] [ Export Report ]         │
└─────────────────────────────────────────────────────────────┘
```

#### B. Metrics Card for Dashboard
Update existing User Connection card to show OAuth-specific metrics:

```javascript
{
    totalUsers: 147,
    oauthConnected: 142,
    oauthDisconnected: 3,
    oauthExpired: 2,
    expiringIn7Days: 5,
    failedCallLogs24h: 23,
    connectionRate: 96.6  // (connected / total) * 100
}
```

**Visual:**
```
┌──────────────────────────────┐
│ OAuth Connection Health      │
├──────────────────────────────┤
│ 142 / 147 Connected (96.6%)  │
│                               │
│ ✅ 142 Connected              │
│ ❌ 3 Disconnected             │
│ ⚠️ 2 Expired                  │
│ 🔔 5 Expiring Soon            │
│                               │
│ Failed Logs (24h): 23        │
│ [View Details →]             │
└──────────────────────────────┘
```

---

### 2. User Prompts/Guards: Proactive Connection Nudges

**Problem:**
> "In-app prompts or soft-blocks that require users to connect their Salesforce account before call logging/CTI features work. Minimises reliance on users remembering to log in."

**Current State:**
- ✅ Onboarding wizard has "Connect Dialpad Account" step (line 5307-5476)
- ❌ No in-app prompts for disconnected users
- ❌ No feature guards that block usage
- ❌ No persistent banner reminders

**What We Need to Add:**

#### A. Persistent Banner for Disconnected Users
Show at top of every page until user connects:

```html
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ Action Required: Connect your Salesforce account          │
│ Call logging and CTI features are disabled.                  │
│ [Connect Now] [Learn More] [Remind Me Later]                │
└─────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Shows on every page load if `oauthStatus === 'disconnected'`
- Persists until user clicks "Connect Now" or connects
- "Remind Me Later" → snooze for 24 hours
- Animates in subtly, not intrusive

#### B. Feature Guards (Soft Blocks)
When user tries to use features requiring OAuth:

**Example 1: Click-to-Dial from Contact**
```
┌────────────────────────────────────┐
│ Connect Salesforce to Make Calls   │
├────────────────────────────────────┤
│ To use click-to-dial and automatic │
│ call logging, connect your         │
│ Salesforce account first.          │
│                                     │
│ [Connect Now] [Cancel]             │
└────────────────────────────────────┘
```

**Example 2: View Call History**
```
┌────────────────────────────────────┐
│ Calls Page                          │
├────────────────────────────────────┤
│ ℹ️ Limited View                     │
│ Connect your Salesforce account to │
│ see synced call logs and use       │
│ advanced features.                  │
│                                     │
│ [Connect Now] [Continue Anyway]   │
└────────────────────────────────────┘
```

**Feature Guard Locations:**
1. Calls page - show limited data
2. SMS page - disable sending
3. Click-to-dial buttons - show modal
4. Call logging toggle - show modal
5. Reports page - show reduced data

#### C. First-Time Setup Modal
After successful login, if no OAuth connection:

```
┌─────────────────────────────────────────┐
│ Welcome to Dialpad for Salesforce! 👋   │
├─────────────────────────────────────────┤
│ To get started, connect your Salesforce │
│ account to enable:                       │
│                                          │
│ ✓ Automatic call logging                │
│ ✓ Click-to-dial from contacts           │
│ ✓ Real-time call sync                   │
│ ✓ Activity tracking                     │
│                                          │
│ [Connect Salesforce] [Skip for Now]    │
│                                          │
│ You can always connect later from       │
│ Settings → Integrations                 │
└─────────────────────────────────────────┘
```

**Trigger:** On first app load OR if `hasSeenOAuthPrompt === false`

---

### 3. Error Surfacing: Call Logging Failure Alerts

**Problem:**
> "Alerts or notifications when call logging fails due to missing/expired Salesforce auth, instead of defaulting to an incorrect user or silently dropping the activity."

**Current State:**
- ❌ No error notification system
- ❌ Silent failures when OAuth expires
- ❌ No failed log tracking
- ❌ No admin alerts for systemic issues

**What We Need to Add:**

#### A. Toast Notifications (User-Facing)
Real-time alerts when call logging fails:

**Failed Call Log - OAuth Issue**
```
┌─────────────────────────────────────┐
│ ⚠️ Call Log Failed                   │
│ Your Salesforce connection expired.  │
│ [Reconnect] [View Details] [✕]      │
└─────────────────────────────────────┘
```

**Failed Call Log - Permission Issue**
```
┌─────────────────────────────────────┐
│ ⚠️ Call Log Failed                   │
│ Missing Salesforce permissions.      │
│ [Contact Admin] [Learn More] [✕]    │
└─────────────────────────────────────┘
```

**Position:** Top-right corner, auto-dismiss after 10 seconds unless interacted with

#### B. Error History Page
New page showing all failed logs with details:

**URL:** `#/errors` or `#/activity-errors`

```
┌─────────────────────────────────────────────────────────────┐
│ Failed Activity Logs                                         │
├─────────────────────────────────────────────────────────────┤
│ Showing 23 failed logs in last 24 hours                     │
│                                                               │
│ Filters: [Last 24h ▼] [All Types] [OAuth Errors]           │
├─────────────────────────────────────────────────────────────┤
│ Time        Type    Contact       Error Reason      Actions │
│ 2m ago      Call    John Smith    OAuth Expired    [Retry]  │
│ 15m ago     Call    Sarah Lee     Token Invalid    [Retry]  │
│ 1h ago      SMS     Mike Chen     No Permission    [View]   │
│ ...                                                           │
├─────────────────────────────────────────────────────────────┤
│ [Retry All] [Export Report] [Clear History]                │
└─────────────────────────────────────────────────────────────┘
```

**Error Details Modal:**
```
┌────────────────────────────────────┐
│ Failed Call Log Details            │
├────────────────────────────────────┤
│ Contact: John Smith                │
│ Number: +1 (555) 123-4567          │
│ Duration: 5:23                     │
│ Time: Today at 2:15 PM             │
│                                     │
│ Error: OAuth token expired         │
│ Error Code: OAUTH_TOKEN_EXPIRED    │
│                                     │
│ Suggested Action:                  │
│ Reconnect your Salesforce account  │
│ to retry logging this call.        │
│                                     │
│ [Reconnect & Retry] [Dismiss]     │
└────────────────────────────────────┘
```

#### C. Admin Alert System
For admins to see systemic issues:

**Alert Banner (Admin Dashboard):**
```
┌─────────────────────────────────────────────────────────────┐
│ 🚨 High Error Rate Detected                                  │
│ 23 call logs failed in the last hour due to OAuth issues.   │
│ 3 users need to reconnect their accounts.                   │
│ [View Affected Users] [Send Reminders] [Dismiss]           │
└─────────────────────────────────────────────────────────────┘
```

**Trigger Conditions:**
- More than 10 failed logs in 1 hour
- More than 5 users with OAuth errors
- More than 20% failure rate

**Email Digest (Optional):**
Daily summary email for admins:
- Total failed logs
- Users affected
- Error breakdown by type
- Recommended actions

---

## 📊 Current Prototype Coverage

### What We Already Have ✅

1. **User Connection Card** (line 972-1050)
   - Shows count of users with issues
   - Lists disconnected users
   - Basic connection status

2. **Onboarding Wizard** (line 5307-5476)
   - Step 4: Connect Dialpad Account
   - API key input
   - Office ID input

3. **System Health Card** (line 795-857)
   - Overall system status
   - Could add OAuth health

### What's Missing ❌

1. **OAuth-Specific Details**
   - Token expiry dates
   - Last sync timestamps
   - OAuth vs general "offline" distinction

2. **User-Facing Prompts**
   - No persistent banners
   - No feature guards
   - No modal nudges

3. **Error Tracking**
   - No failed log history
   - No toast notifications
   - No admin alerts

---

## 🎨 Implementation Plan

### Phase 1: Admin Visibility (4-6 hours)

**Priority:** HIGH
**Customer Impact:** Direct visibility into OAuth health

**Tasks:**
1. **Enhance User Connection Card** (2 hours)
   - Add OAuth-specific metrics
   - Show token expiry warnings
   - Add "View Details" link

2. **Create OAuth Status Table** (3 hours)
   - New component: `renderOAuthStatusTable()`
   - Mock data with token expiry, last sync
   - Filters: All/Connected/Disconnected/Expired
   - Search functionality
   - Click row → show user details

3. **Add Bulk Actions** (1 hour)
   - "Remind Selected Users" button
   - "Export Report" for auditing
   - Mock email sending functionality

**Files to Modify:**
- `prototype/js/app.js` - Update `renderAdminUserConnectionCard()` (line 972)
- `prototype/js/data-service.js` - Add OAuth status to user data
- `prototype/data/users.json` - Add OAuth fields

**New Functions:**
```javascript
renderOAuthStatusTable() {
    // Detailed table with all OAuth info
}

getOAuthMetrics() {
    // Calculate connection rates, expiring tokens, etc.
}

sendConnectionReminders(userIds) {
    // Mock bulk reminder functionality
}
```

---

### Phase 2: User Prompts & Guards (6-8 hours)

**Priority:** MEDIUM-HIGH
**Customer Impact:** Reduces support burden, proactive

**Tasks:**
1. **Persistent Banner Component** (2 hours)
   - New component: `renderOAuthDisconnectedBanner()`
   - Shows on all pages if disconnected
   - "Connect Now" → OAuth flow
   - "Remind Later" → localStorage snooze

2. **Feature Guards** (3 hours)
   - Modal: `showOAuthRequiredModal(feature)`
   - Check OAuth status before feature usage
   - Add guards to:
     - Click-to-dial buttons
     - Call logging toggle
     - SMS sending
     - Calls page (partial)

3. **First-Time Setup Modal** (2 hours)
   - Trigger on first login without OAuth
   - Track with `AppState.hasSeenOAuthPrompt`
   - Skip option with warning

4. **OAuth Connection Flow** (1 hour)
   - Mock OAuth flow (opens new window)
   - Success callback → dismiss prompts
   - Save status to AppState

**Files to Modify:**
- `prototype/js/app.js` - Add banner rendering, guards
- `prototype/js/app-state.js` - Add OAuth tracking fields

**New Functions:**
```javascript
renderOAuthDisconnectedBanner() {
    // Persistent top banner
}

showOAuthRequiredModal(featureName) {
    // Feature guard modal
}

checkOAuthAndProceed(callback) {
    // Helper to check before actions
}

initiateOAuthFlow() {
    // Mock OAuth connection
}
```

---

### Phase 3: Error Surfacing (4-6 hours)

**Priority:** HIGH
**Customer Impact:** Transparency, no silent failures

**Tasks:**
1. **Toast Notification System** (2 hours)
   - New component: `showToast(type, message, actions)`
   - Position: top-right
   - Auto-dismiss after 10s
   - Stack multiple toasts
   - Types: error, warning, success, info

2. **Failed Logs Tracking** (2 hours)
   - Add to AppState: `failedLogs[]`
   - Track: timestamp, type, contact, error reason
   - Persist to localStorage
   - Max 100 entries (rolling)

3. **Error History Page** (3 hours)
   - New route: `#/errors`
   - Table of failed logs
   - Filters: time range, error type
   - Details modal per error
   - "Retry" button (mock)

4. **Admin Alert System** (2 hours)
   - Check error rate on admin dashboard load
   - Show alert banner if threshold exceeded
   - "Send Reminders" bulk action
   - "View Affected Users" → OAuth table filtered

**Files to Modify:**
- `prototype/js/app.js` - Add toast system, error page
- `prototype/js/app-state.js` - Add failedLogs array
- `prototype/js/router.js` - Add #/errors route

**New Functions:**
```javascript
showToast(type, message, actions) {
    // Toast notification UI
}

trackFailedLog(type, contact, error) {
    // Save to AppState.failedLogs
}

renderErrorHistoryPage() {
    // Failed logs table page
}

checkErrorRateAlert() {
    // For admin dashboard
}
```

---

## 🔍 Mock Data Requirements

### OAuth Status Fields (Add to Users)
```javascript
{
    id: "user_1",
    name: "John Smith",
    email: "john.smith@acme.com",
    role: "admin",
    // NEW FIELDS:
    oauthStatus: "connected" | "disconnected" | "expired",
    oauthTokenExpiry: "2025-12-27T10:30:00Z",  // ISO timestamp
    oauthLastSync: "2025-11-27T14:23:00Z",
    oauthConnectedAt: "2025-01-15T09:00:00Z",
    callLogsSuccess24h: 45,
    callLogsFailed24h: 0
}
```

### Failed Log Entry
```javascript
{
    id: "fail_123",
    timestamp: "2025-11-27T14:25:00Z",
    type: "call" | "sms",
    contact: "John Smith",
    contactPhone: "+1 (555) 123-4567",
    duration: 323,  // seconds, for calls
    errorCode: "OAUTH_TOKEN_EXPIRED",
    errorMessage: "OAuth token expired",
    userId: "user_1",
    retryable: true
}
```

---

## 📐 Design Patterns to Follow

### 1. SLDS Components to Use
- **Table:** `slds-table` with sortable columns
- **Badges:** `slds-badge` for status (connected/disconnected/expired)
- **Alerts:** `slds-notify` for banners
- **Toasts:** Custom implementation mimicking SLDS style
- **Modals:** `slds-modal` for feature guards
- **Progress Indicators:** `slds-progress-ring` for connection health

### 2. Status Colors (Consistent with SLDS)
- ✅ **Connected:** `#04844b` (green)
- ❌ **Disconnected:** `#c23934` (red)
- ⚠️ **Expired:** `#fe9339` (orange)
- 🔔 **Expiring Soon:** `#0176d3` (blue, informational)

### 3. Interaction Patterns
- **Hover states** on table rows
- **Click anywhere on row** to see details
- **Checkbox selection** for bulk actions
- **Smooth animations** for banners (slide down)
- **Non-blocking toasts** (don't interrupt workflow)

---

## ✅ Acceptance Criteria

### Admin Visibility
- [ ] Admin can see list of all users with OAuth status
- [ ] Admin can see token expiry dates
- [ ] Admin can see last sync timestamps
- [ ] Admin can filter by connection status
- [ ] Admin can search for specific users
- [ ] Admin can send connection reminders
- [ ] Admin can export status report
- [ ] Dashboard shows connection rate metric
- [ ] Dashboard highlights users needing attention

### User Prompts
- [ ] Disconnected users see persistent banner
- [ ] Banner has "Connect Now", "Learn More", "Remind Later"
- [ ] "Remind Later" snoozes for 24h
- [ ] First-time users see setup modal
- [ ] Click-to-dial shows guard if not connected
- [ ] Call logging toggle shows guard if not connected
- [ ] Guards explain why connection is needed
- [ ] Guards offer "Connect Now" button

### Error Surfacing
- [ ] Failed call logs trigger toast notification
- [ ] Toast shows error reason clearly
- [ ] Toast offers "Reconnect" action
- [ ] Failed logs stored in history
- [ ] User can view failed log details
- [ ] User can retry failed logs
- [ ] Admin sees alert if error rate high
- [ ] Admin can view affected users
- [ ] Error page shows filterable log history

---

## 🎯 Success Metrics

**Customer Impact:**
1. **Reduce support tickets** related to "calls not logging"
2. **Increase OAuth connection rate** from ~92% to ~98%
3. **Decrease time to resolve** OAuth issues (admin visibility)
4. **Prevent silent failures** (100% error surfacing)

**Measurable in Prototype:**
- Connection rate displayed in admin dashboard
- Failed log count tracked and displayed
- Time since last sync visible
- Expiring tokens proactively flagged

---

## 🚀 Quick Win: MVP Implementation

If time is limited, prioritize these for maximum customer impact:

### MVP Scope (6-8 hours)

1. **Enhanced User Connection Card** (2h)
   - Add OAuth-specific metrics
   - Show token expiry warnings
   - Clear status badges

2. **OAuth Status Table** (3h)
   - Detailed user list with OAuth info
   - Basic filters (Connected/Disconnected)
   - Click for details

3. **Toast Notifications** (2h)
   - Show error when call log fails
   - "Reconnect" action button
   - Store in failed logs array

4. **Persistent Banner** (1h)
   - Show if disconnected
   - "Connect Now" button
   - Dismissible with snooze

**Defer to v2:**
- Feature guards (can add incrementally)
- Error history page (can start with just toast)
- Admin bulk actions (nice-to-have)
- Email digests (optional)

---

## 📝 Next Steps

1. **Review with team** - Validate approach aligns with technical capabilities
2. **Prioritize phases** - Decide MVP vs full implementation
3. **Create mock data** - Add OAuth fields to users.json
4. **Implement Phase 1** - Admin visibility (highest customer impact)
5. **Test with SE** - Get feedback before Phase 2/3
6. **Document for customers** - Create setup guide for admins

---

## 🔗 Related Documents

- [admin_feedback_final.md](admin_feedback_final.md) - Original PM feedback
- [PM_FEEDBACK_ACTION_PLAN.md](PM_FEEDBACK_ACTION_PLAN.md) - Implementation plan
- [VERSION.md](../VERSION.md) - Current prototype status

---

**Status:** PLANNING
**Owner:** TBD
**Estimated Total Time:** 14-20 hours (all phases) or 6-8 hours (MVP)
