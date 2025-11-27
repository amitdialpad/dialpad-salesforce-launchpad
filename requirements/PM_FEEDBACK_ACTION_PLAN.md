# Nihar's Feedback - Action Plan & Implementation Roadmap
**Date:** 2025-01-17

---

## Executive Summary

After PM review of the Dialpad Salesforce Launchpad prototype, key feedback focuses on:
1. Validating native Salesforce capabilities vs custom builds
2. Linking all metrics to real Salesforce reports
3. Customer validation before finalizing PRD
4. Enhancing onboarding and upgrade flows
5. Aligning with Salesforce app navigation patterns

**Timeline:** 6 weeks of validation before development starts

---

## IMMEDIATE PROTOTYPE TODOS (For Customer Validation)

### 1. Deploy to GitHub Pages
**Priority:** HIGH
**Owner:** Amit
**Effort:** 30 minutes

**Tasks:**
- [ ] Push prototype to GitHub repository
- [ ] Enable GitHub Pages in repo settings
- [ ] Test deployed URL
- [ ] Share URL with Bala, Ravindra, and Nihar
- [ ] Document deployment steps in README

**Why:** Needed for customer validation sessions

---

### 2. Enhance Onboarding Flow
**Priority:** HIGH
**Owner:** Amit
**Effort:** 4 hours

**Current State:**
```
Step 1: Welcome to Dialpad
Step 2: Connect your account
Step 3: Start making calls
```

**Required Enhancement:**
```
Step 1: Welcome
  - Welcome message with version number
  - "Let's get you set up in 5 minutes"

Step 2: Environment Check ⚠️
  - Display current environment (Production/Sandbox)
  - Warning: "You are in Production. We recommend testing in Sandbox first"
  - Buttons: [Test in Sandbox] [Continue in Production]

Step 3: Recommended Settings
  - ☐ Enable automatic call logging
  - ☐ Set default call duration to 5 minutes
  - ☐ Enable SMS notifications
  - ☐ Configure call recording consent
  - ☐ Enable click-to-dial
  - [Apply Recommended Settings] [Customize]

Step 4: Configure Integrations
  - Connect to Dialpad account
  - [Authorize Dialpad] button with OAuth flow
  - Status indicator: Connected ✓ / Not Connected ✗
  - API key validation

Step 5: Set Up Permissions
  - "Who can access Dialpad features?"
  - Multi-select: System Admin, Sales User, Service User, Custom Profiles
  - Permission preview for each profile

Step 6: Ready to Go!
  - Summary of configuration
  - "You're all set! Here's what we configured:"
  - List of enabled features
  - [View Dashboard] [View Settings] [Start Tour]
```

**Files to Modify:**
- `js/app.js` - `showOnboardingModal()` function (around line 1978)
- `js/app-state.js` - Add new state properties for onboarding progress
- May need new functions: `renderOnboardingStep2()`, `renderOnboardingStep3()`, etc.

**Implementation Notes:**
- Add validation for each step before allowing "Next"
- Save progress to localStorage in case user closes modal
- Add "Skip for now" option with warning
- Track which settings were applied for analytics

---

### 3. Improve Update/Upgrade Flow
**Priority:** HIGH
**Owner:** Amit
**Effort:** 3 hours

**Current State:**
```
Banner: "Package Update Available v2.5.0"
[View Changelog] [Dismiss]
```

**Required Enhancement:**

**A. Version Banner (Persistent)**
```html
<div class="version-banner">
  <span>Update Available: v2.3.0 → v2.5.0</span>
  <div class="actions">
    [Learn More] [Update Now]
  </div>
</div>
```

**B. Click "Learn More" → Enhanced Changelog Modal**
```
Modal: "What's New in v2.5.0"

Tabs:
  - New Features (3 items)
  - Improvements (5 items)
  - Bug Fixes (7 items)
  - Known Issues (1 item)

Bottom Section:
  ⚠️ Critical Question:
  "Have you tested this update in a Sandbox environment?"

  [ ] Yes, I've tested in Sandbox
  [ ] No, I need to test first

  If "No" selected:
    [Take Me to Sandbox Guide] [Remind Me Later]

  If "Yes" selected:
    [Proceed to Update] button enabled
```

**C. Click "Update Now" → Pre-Update Checklist Modal**
```
Modal: "Before You Update"

Pre-Update Checklist:
☐ I have tested this update in a Sandbox environment
☐ I have reviewed the complete changelog
☐ I have notified my team about this update
☐ I have backed up my Dialpad settings
☐ I understand this may cause brief downtime (< 5 minutes)

Required Acknowledgment:
☐ I acknowledge that untested updates may affect production operations

[Cancel] [Proceed to Update] (disabled until all checked)
```

**D. After Acknowledgment → Update Flow**
```
Option A: External Update (AppExchange)
  - "Redirecting to Salesforce AppExchange..."
  - Show URL: https://appexchange.salesforce.com/...
  - Open in new tab

Option B: In-App Update (if possible)
  - Progress bar: "Updating Dialpad package..."
  - Steps shown: Download → Install → Configure → Complete
  - "Update complete! Refreshing page..."
  - Auto-refresh after 5 seconds
```

**E. Post-Update Experience**
```
Success Banner:
"✓ Successfully updated to v2.5.0"

Options:
  [What's New Tour] [Dismiss]

If "What's New Tour" clicked:
  - 3-step spotlight tour highlighting new features
  - Step 1: "New SMS feature in the navigation"
  - Step 2: "Improved call logging with AI summaries"
  - Step 3: "Enhanced reports with custom filters"
```

**Files to Modify:**
- `js/app.js` - `showChangelogModal()` function (around line 2153)
- `js/app-state.js` - Add `hasTestedInSandbox`, `updateAcknowledged` properties
- New function: `showPreUpdateChecklist()`
- New function: `showPostUpdateTour()`

**Implementation Notes:**
- Store acknowledgment timestamp in localStorage
- Prevent update if not all checkboxes are checked
- Add analytics tracking for update flow completion
- Handle update failures gracefully

---

### 4. Add Implementation Indicators (Optional)
**Priority:** LOW
**Owner:** Amit
**Effort:** 2 hours

**Purpose:** Help customers understand what's native vs custom during validation

**Implementation:**
Add small badges to each major component:

```html
<!-- Native Salesforce Component -->
<div class="slds-card">
  <span class="slds-badge slds-theme_success">
    Native: Salesforce Dashboard
  </span>
  <div class="slds-card__header">
    <h2>Calls Today</h2>
  </div>
</div>

<!-- Custom Component -->
<div class="slds-card">
  <span class="slds-badge slds-theme_warning">
    Custom: Lightning Component
  </span>
  <div class="slds-card__header">
    <h2>Powerdialer</h2>
  </div>
</div>

<!-- Partial/Hybrid -->
<div class="slds-card">
  <span class="slds-badge slds-theme_info">
    Hybrid: Native Chart + Custom Data
  </span>
  <div class="slds-card__header">
    <h2>Call Volume</h2>
  </div>
</div>
```

**Badge Key:**
- 🟢 **Native** - Uses standard Salesforce features
- 🟡 **Hybrid** - Combines native + custom
- 🟠 **Custom** - Requires custom Lightning component

**Where to Add:**
- Dashboard metric cards (6 places)
- Charts (3 places)
- Data tables (4 places)
- Powerdialer interface (1 place)
- Settings page sections (5 places)

**Files to Modify:**
- `js/app.js` - Add badges to render functions
- `css/custom.css` - Add `.implementation-badge` styles if needed

**Toggle Option:**
Add to Demo Controls:
```
☐ Show Implementation Badges
```

---

## TECHNICAL VALIDATION TODOS (For Engineering Team)

### 5. Component Feasibility Audit
**Priority:** HIGH
**Owner:** Bala + Engineering
**Effort:** 1 week

**Tasks:**
- [ ] Audit all 42 UI components in prototype
- [ ] Test each component in Salesforce Lightning environment
- [ ] Classify each as: Native / Partial / Custom / Not Possible
- [ ] Document Salesforce limitations for each component
- [ ] Estimate development effort (S/M/L/XL)
- [ ] Identify required Salesforce editions (Professional/Enterprise/Unlimited)
- [ ] Check API limits and governor limits impact

**Deliverable:** Technical Feasibility Report (TFR)

**Questions to Answer:**
1. Can we customize the Salesforce Home tab completely?
2. Can we embed dashboard components in custom Lightning pages?
3. Does Salesforce support multiple persistent banners?
4. Can we access Tasks (calls) data in real-time for notifications?
5. What's the best approach for role-based dashboards?
6. Can we create custom notification types?
7. How do we handle CTI integration for Powerdialer?
8. What's the data retention limit for call history?

---

### 6. Data Model & Reports Design
**Priority:** HIGH
**Owner:** Bala + Salesforce Architect
**Effort:** 1 week

**Custom Objects Needed:**
```
Dialpad_Call_Quota__c
  - User__c (Lookup to User)
  - Daily_Target__c (Number)
  - Weekly_Target__c (Number)
  - Daily_Made__c (Number)
  - Weekly_Made__c (Number)
  - Status__c (Picklist: On Track / At Risk / Behind)
  - Last_Updated__c (DateTime)

Dialpad_Integration_Status__c
  - Status__c (Picklist: Connected / Disconnected)
  - Last_Sync__c (DateTime)
  - API_Key_Valid__c (Checkbox)
  - Error_Message__c (Text Area)
  - Health_Score__c (Number 0-100)

Dialpad_Settings__c (Custom Settings)
  - Auto_Log_Calls__c (Checkbox)
  - Default_Call_Duration__c (Number)
  - Enable_SMS__c (Checkbox)
  - Recording_Consent__c (Checkbox)
  - Click_To_Dial__c (Checkbox)
```

**Custom Fields on Standard Objects:**
```
Task (to track Dialpad calls)
  - Dialpad_Call_ID__c (Text, External ID)
  - Dialpad_Recording_URL__c (URL)
  - Dialpad_Duration__c (Number - seconds)
  - Dialpad_Type__c (Picklist: Inbound/Outbound/Missed)
  - Dialpad_Logged__c (Checkbox)
  - Dialpad_Agent__c (Lookup to User)
```

**Reports to Create:**
1. **Dialpad - Calls This Week**
   - Report Type: Tasks
   - Filters: Type = Call, CreatedDate = THIS_WEEK
   - Grouping: Date
   - Chart: Bar Chart (Calls by Day)

2. **Dialpad - Agent Performance**
   - Report Type: Tasks
   - Filters: Type = Call, Status = Completed
   - Grouping: Owner
   - Summary: COUNT(Id), AVG(Duration)

3. **Dialpad - Unlogged Calls**
   - Report Type: Tasks (Custom Report Type)
   - Filters: Type = Call, Dialpad_Logged__c = FALSE
   - Grouping: Owner, Date
   - Alert: If Count > 5

4. **Dialpad - Call Volume by Hour**
   - Report Type: Tasks
   - Filters: Type = Call, CreatedDate = TODAY
   - Grouping: HOUR(CreatedDate)
   - Chart: Line Chart

5. **Dialpad - Department Performance**
   - Report Type: Tasks with Users
   - Filters: Type = Call
   - Grouping: User.Department
   - Summary: COUNT(Id), AVG(Duration)

6. **Dialpad - Missed Calls**
   - Report Type: Tasks
   - Filters: Type = Call, Status = Missed
   - Grouping: Assigned To
   - Alert: If Count > 10

7. **Dialpad - Call Recordings**
   - Report Type: Tasks
   - Filters: Dialpad_Recording_URL__c != NULL
   - Display: Recording links

8. **Dialpad - Quota Tracking**
   - Report Type: Dialpad Call Quota (Custom)
   - Grouping: User
   - Summary: Progress percentage

**Dashboards to Create:**
1. **Dialpad Admin Dashboard** (6 components)
   - Calls Today (metric)
   - Active Agents (metric)
   - Avg Call Duration (metric)
   - Call Volume Chart (line chart from Report #4)
   - Agent Performance Table (table from Report #2)
   - Unlogged Calls Alert (table from Report #3)

2. **Dialpad Supervisor Dashboard** (4 components)
   - Team Calls (metric)
   - Team Avg Duration (metric)
   - Department Performance (chart from Report #5)
   - At-Risk Agents (table from Report #8)

3. **Dialpad Agent Dashboard** (3 components)
   - My Calls Today (metric)
   - My Quota Progress (gauge chart)
   - My Recent Calls (table)

---

### 7. Chart Implementation Strategy
**Priority:** MEDIUM
**Owner:** Engineering
**Effort:** 3 days

**Current State:** Chart.js implementation
**Target State:** Native Salesforce charts

**Mapping:**

| Prototype Chart | Salesforce Chart Type | Data Source | Implementation |
|-----------------|----------------------|-------------|----------------|
| Call Volume (Line) | Line Chart | Report #4 | Native dashboard component |
| Calls by Department (Bar) | Bar Chart | Report #5 | Native dashboard component |
| Call Distribution (Donut) | Donut Chart | Report with grouping | Native dashboard component |
| Agent Performance (Table) | Table Component | Report #2 | lightning:datatable |
| Quota Progress (Bar) | Horizontal Bar | Custom Quota object | Custom LWC or native gauge |

**Tasks:**
- [ ] Replace all `<canvas>` elements with dashboard component references
- [ ] Create placeholder images showing Salesforce chart UI
- [ ] Add "Powered by Salesforce Reports" caption
- [ ] Link each chart to underlying report
- [ ] Test chart refresh rates and real-time updates

**Implementation Notes:**
- Salesforce charts auto-refresh every 60 seconds
- Custom LWC can refresh more frequently if needed
- Charts embedded in Lightning pages can link to full reports

---

## CUSTOMER VALIDATION TODOS

### 8. Customer Recruitment
**Priority:** HIGH
**Owner:** Nihar + Sales/CSM Team
**Effort:** 1 week

**Tasks:**
- [ ] Identify target customer segments:
  - Large enterprise (500+ sales reps)
  - Mid-market (50-500 reps)
  - SMB (10-50 reps)
- [ ] Email Sales team with recruitment criteria
- [ ] Email CSM team to nominate existing customers
- [ ] Target: 8-10 volunteer customers (3 enterprise, 3 mid-market, 2 SMB)
- [ ] Schedule 30-minute feedback sessions with each
- [ ] Prepare incentive: Early access to new features

**Email Template:**
```
Subject: Volunteer Needed: Salesforce Integration Beta Feedback

Hi [Name],

We're building a new Salesforce integration for Dialpad and would love
your input on the design.

What we need:
- 30 minutes of your time
- Review a working prototype
- Share feedback on features and usability

What you get:
- Early access to new features
- Influence on final design
- Direct line to product team

Interested? Reply with your availability.

Thanks,
Nihar
```

---

### 9. Customer Interview Guide
**Priority:** HIGH
**Owner:** Nihar + Amit
**Effort:** 4 hours

**Interview Structure (30 minutes):**

**Introduction (5 min)**
- Thank you for volunteering
- Purpose: Get feedback on new Salesforce integration
- No wrong answers, honest feedback is best
- Session will be recorded for notes

**Prototype Walkthrough (10 min)**
- Share screen: Prototype URL
- Walk through each page:
  - Home dashboard
  - Calls page
  - SMS page
  - Powerdialer
  - Reports
  - Settings
- Explain: This is a prototype, not final product

**Feedback Questions (12 min)**

**Dashboard & Metrics:**
1. "Looking at the Home dashboard, which metrics are most valuable to you?"
2. "Are there any metrics missing that you'd want to see?"
3. "Is the 3-column layout easy to read, or too crowded?"
4. "How often would you check this dashboard? Daily? Weekly?"

**Unlogged Calls:**
5. "We show 'Unlogged Calls' at the top. Is this useful?"
6. "How do you currently track calls that haven't been logged?"
7. "What would you do when you see this alert?"

**Call History:**
8. "Looking at the Calls page, which columns are most important?"
9. "Are there any filters or sorting options you'd need?"
10. "Would you want to bulk-edit or bulk-log calls from this view?"

**Notifications:**
11. "We have a notifications button in the header. Would you use this?"
12. "Or would you prefer email/Slack notifications instead?"

**Powerdialer:**
13. "For high-volume calling, would you use the Powerdialer feature?"
14. "What's most important: speed, call quality, or logging accuracy?"

**Reports:**
15. "Which types of reports do you run most often?"
16. "Would you use Salesforce's native reporting, or prefer custom reports?"

**Navigation:**
17. "How do you feel about the tab layout at the top?"
18. "Would you prefer Dialpad features in a separate app or integrated with standard Salesforce?"

**Wrap-up (3 min)**
19. "What's your overall impression? Scale 1-10"
20. "What's the ONE thing we must get right?"
21. "Anything else we didn't cover?"

**Deliverable:** Interview Notes Document per customer

---

### 10. Feedback Synthesis
**Priority:** HIGH
**Owner:** Nihar + Amit
**Effort:** 1 week (after all interviews)

**Tasks:**
- [ ] Compile all interview notes
- [ ] Identify common themes (3+ customers mention same thing)
- [ ] Categorize feedback:
  - Must Have (blocking for MVP)
  - Should Have (important but not blocking)
  - Nice to Have (future enhancement)
  - Won't Have (out of scope)
- [ ] Quantify feedback:
  - % of customers who want feature X
  - Average importance rating per feature
- [ ] Create prioritized feature list
- [ ] Identify any deal-breaker issues

**Deliverable:** Customer Validation Report with:
- Executive summary
- Key findings (top 10)
- Feature priority matrix
- Direct customer quotes
- Recommendations for PRD

---

## PRD FINALIZATION TODOS

### 11. PRD Structure & Content
**Priority:** HIGH
**Owner:** Nihar + Amit
**Effort:** 1 week

**PRD Sections:**

**1. Executive Summary**
- Problem statement
- Solution overview
- Success metrics
- Timeline

**2. User Personas**
- Admin
- Supervisor
- Agent

**3. User Stories**
Format: "As a [persona], I want to [action] so that [benefit]"

Examples:
- "As an Admin, I want to see unlogged calls at the top of my dashboard so that I can ensure data quality"
- "As a Supervisor, I want to see which agents are behind on quota so that I can provide coaching"
- "As an Agent, I want to click-to-dial from any Salesforce record so that I can call faster"

**4. Functional Requirements**
- Feature list with acceptance criteria
- Data model (objects, fields, relationships)
- Workflows and automations
- Integrations and APIs

**5. Technical Architecture**
- Native Salesforce components (list each)
- Custom Lightning components (list each)
- Apex classes needed
- External integrations (Dialpad API)
- Data flow diagrams

**6. UI/UX Design**
- Wireframes (link to prototype)
- User flows (step-by-step)
- Navigation structure
- Responsive design requirements

**7. Reports & Dashboards**
- List of all reports (8 reports)
- List of all dashboards (3 dashboards)
- Report types and groupings
- Chart specifications

**8. Security & Permissions**
- Profile requirements
- Permission sets
- Field-level security
- Sharing rules

**9. Implementation Phases**
- Phase 1: MVP (list features)
- Phase 2: Enhancements
- Phase 3: Advanced features
- Timeline and milestones

**10. Success Metrics**
- Adoption rate (% of users)
- Call logging rate (% increase)
- Time saved per agent per day
- User satisfaction score

**11. Risks & Mitigations**
- Technical risks
- User adoption risks
- Data quality risks
- Mitigation strategies

**12. Appendix**
- Glossary
- Customer feedback summary
- Technical feasibility report
- Competitive analysis

**Deliverable:** PRD v1.0 (40-60 pages)

---

## APP NAVIGATION DESIGN TODOS

### 12. Salesforce App Structure Design
**Priority:** MEDIUM
**Owner:** Amit + Bala
**Effort:** 1 week

**Research Required:**
- [ ] Review DocuSign CLM app structure
- [ ] Review Zoom Phone app structure
- [ ] Review Salesforce Service Cloud Voice
- [ ] Document best practices for ISV apps

**Options to Evaluate:**

**Option A: Dedicated Lightning App**
```
Create new app: "Dialpad for Salesforce"

Tabs (in order):
1. Home (Custom Lightning page - Dashboard)
2. Calls (Custom object: Dialpad_Call__c)
3. SMS (Custom Lightning component)
4. Powerdialer (Custom Lightning component)
5. Reports (Standard Reports with Dialpad folder)
6. Settings (Custom Lightning page)

Also include standard tabs:
- Accounts
- Contacts
- Leads
- Opportunities

Utility Bar:
- Dialpad Softphone (CTI integration)
- Notifications
```

**Option B: Utility Bar Only**
```
Add to existing Salesforce apps (Sales, Service)

Utility Bar Items:
- Dialpad Dialer (persistent softphone)
- Call History (quick view)
- Settings

No custom tabs, all features in utility bar
```

**Option C: Hybrid Approach**
```
Custom app with limited tabs + Utility bar

Tabs:
1. Home (Dashboard)
2. Settings

Utility Bar:
- Dialpad Dialer
- Call History
- SMS
- Notifications

Everything else uses standard Salesforce pages
```

**Decision Criteria:**
- User workflow (do they stay in Dialpad or switch between apps?)
- Screen real estate (how much space do features need?)
- Salesforce best practices (what do users expect?)
- Technical constraints (what's possible?)

**Tasks:**
- [ ] Create comparison matrix for 3 options
- [ ] Build quick prototypes of each approach
- [ ] Get feedback from 3 power users
- [ ] Document recommendation with rationale

**Deliverable:** App Navigation Design Document

---

### 13. Tab Visibility & Permissions
**Priority:** MEDIUM
**Owner:** Bala
**Effort:** 2 days

**Questions to Answer:**
1. Can we hide standard Salesforce tabs in the Dialpad app?
   - Yes, via App Manager settings
   - Each app has its own tab configuration

2. Should we hide standard tabs or keep them?
   - Recommendation: Keep Accounts, Contacts, Leads, Opportunities
   - Hide: Cases, Campaigns, Dashboards (use Dialpad-specific instead)

3. How do we handle permissions?
   - Create custom permission set: "Dialpad User"
   - Include: Read/Write on Dialpad objects, Execute Dialpad Apex
   - Assign to profiles: Sales User, Service User

4. What happens if user switches to different app?
   - Utility bar persists (Dialpad Dialer stays open)
   - Custom tabs disappear (back to standard Salesforce)

**Tasks:**
- [ ] Define tab list for Dialpad app
- [ ] Define tab list for Sales app (with Dialpad utility)
- [ ] Create permission set matrix
- [ ] Document tab switching behavior

**Deliverable:** Tab & Permissions Configuration Guide

---

## PROTOTYPE REFINEMENT TODOS (Post-PRD)

### 14. Remove Demo-Only Features
**Priority:** MEDIUM
**Owner:** Amit
**Effort:** 2 hours

**Features to Remove:**
- [ ] Demo Controls panel (entire panel)
- [ ] Role switcher (production uses real profiles)
- [ ] Mock data controls (sliders for unlogged calls, quotas)
- [ ] "Reset All States" button
- [ ] Any console.log statements

**Features to Keep:**
- Keyboard shortcut (Ctrl+Shift+D) for showing implementation notes
- Can repurpose for admin debugging mode

**Files to Modify:**
- `index.html` - Remove demo controls panel HTML (lines 93-220)
- `js/app.js` - Remove demo control functions
- `js/role-manager.js` - Remove mock role switching
- `css/custom.css` - Remove `.demo-controls-panel` styles

---

### 15. Add "View Report" Links
**Priority:** HIGH
**Owner:** Amit
**Effort:** 2 hours

**Current State:** Metrics show static numbers
**Target State:** Metrics link to Salesforce reports

**Implementation:**
```html
<!-- Before -->
<div class="metric-card">
  <div class="metric-value">127</div>
  <div class="metric-label">Calls Today</div>
</div>

<!-- After -->
<div class="metric-card">
  <div class="metric-value">127</div>
  <div class="metric-label">Calls Today</div>
  <button class="slds-button slds-button_neutral slds-m-top_small"
          onclick="viewReport('00O...')">
    View Full Report
  </button>
</div>
```

**Where to Add (19 locations):**
- Dashboard metric cards (6)
- Supervisor dashboard (4)
- Agent dashboard (3)
- Charts (3)
- Tables (3)

**Button Behavior:**
```javascript
function viewReport(reportId) {
  // In prototype: Show alert
  alert('In production, this would open Salesforce report: ' + reportId);

  // In production: Navigate to report
  // window.open(`/lightning/r/Report/${reportId}/view`, '_blank');
}
```

---

### 16. Replace Charts with Native Mockups
**Priority:** MEDIUM
**Owner:** Amit
**Effort:** 4 hours

**Current State:** Chart.js canvas elements
**Target State:** Images showing Salesforce chart UI

**Steps:**
1. Create Salesforce report with sample data
2. Take screenshots of each chart type:
   - Bar chart
   - Line chart
   - Donut chart
3. Save as images: `img/salesforce-chart-bar.png`, etc.
4. Replace `<canvas>` with `<img>` tags
5. Add caption: "Powered by Salesforce Reports"

**Example:**
```html
<!-- Before -->
<canvas id="callVolumeChart"></canvas>

<!-- After -->
<div class="chart-container">
  <img src="img/salesforce-chart-line.png"
       alt="Call Volume Chart"
       style="width: 100%;">
  <p class="slds-text-body_small slds-text-align_center slds-m-top_x-small">
    Powered by Salesforce Reports
  </p>
</div>
```

**Files to Modify:**
- `js/app.js` - Remove Chart.js initialization code
- `index.html` - Remove Chart.js CDN link
- Add images to new `img/` directory

---

### 17. Add Technical Implementation Notes
**Priority:** LOW
**Owner:** Amit
**Effort:** 4 hours

**Purpose:** Document how each component should be built in Salesforce

**Create New Page: `technical-notes.html`**

**Structure:**
```html
<table class="slds-table">
  <thead>
    <tr>
      <th>Component</th>
      <th>Current (Prototype)</th>
      <th>Target (Salesforce)</th>
      <th>Type</th>
      <th>Effort</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dashboard Metrics</td>
      <td>Custom HTML + Mock Data</td>
      <td>Dashboard Components + Reports</td>
      <td>Native</td>
      <td>Small</td>
    </tr>
    <tr>
      <td>Call Volume Chart</td>
      <td>Chart.js Canvas</td>
      <td>Salesforce Line Chart</td>
      <td>Native</td>
      <td>Small</td>
    </tr>
    <tr>
      <td>Notifications Dropdown</td>
      <td>Custom HTML Dropdown</td>
      <td>Custom LWC or Native Notifications</td>
      <td>Hybrid</td>
      <td>Medium</td>
    </tr>
    <tr>
      <td>Powerdialer Interface</td>
      <td>Custom HTML Interface</td>
      <td>Custom LWC + CTI API</td>
      <td>Custom</td>
      <td>Large</td>
    </tr>
    <!-- ... 38 more rows ... -->
  </tbody>
</table>
```

**Add Link in Navigation:**
```html
<li class="slds-context-bar__item">
  <a href="technical-notes.html">Tech Notes</a>
</li>
```

---

## TIMELINE & MILESTONES

### Week 1-2: Technical Validation
**Owner:** Bala + Engineering

- [ ] Complete component feasibility audit
- [ ] Answer critical technical questions
- [ ] Design data model (objects, fields, reports)
- [ ] Create Technical Feasibility Report
- [ ] Review TFR with Nihar and Amit

**Milestone:** TFR Approved

---

### Week 2-3: Customer Validation
**Owner:** Nihar + CSM Team

- [ ] Recruit 8-10 volunteer customers
- [ ] Conduct customer interviews
- [ ] Synthesize feedback
- [ ] Create Customer Validation Report
- [ ] Present findings to team

**Milestone:** Customer Validation Complete

---

### Week 4: PRD Finalization
**Owner:** Nihar + Amit

- [ ] Incorporate technical feasibility findings
- [ ] Incorporate customer feedback
- [ ] Write PRD v1.0 (all sections)
- [ ] Review PRD with engineering team
- [ ] Review PRD with leadership
- [ ] Get PRD approval

**Milestone:** PRD v1.0 Approved

---

### Week 5: Prototype Refinement
**Owner:** Amit

- [ ] Deploy prototype to GitHub Pages (TODO #1)
- [ ] Enhance onboarding flow (TODO #2)
- [ ] Improve upgrade flow (TODO #3)
- [ ] Remove demo-only features (TODO #14)
- [ ] Add "View Report" links (TODO #15)
- [ ] Replace charts with native mockups (TODO #16)
- [ ] Add implementation badges (TODO #4)
- [ ] Create technical notes page (TODO #17)

**Milestone:** Prototype v2.0 Ready

---

### Week 6: Implementation Planning
**Owner:** Engineering Team

- [ ] Break down PRD into epics
- [ ] Create user stories with acceptance criteria
- [ ] Estimate story points
- [ ] Define sprint structure (2-week sprints)
- [ ] Identify dependencies and risks
- [ ] Create development timeline (Gantt chart)
- [ ] Assign teams and owners

**Milestone:** Implementation Roadmap Complete

---

### Week 7+: Development Begins
**Owner:** Engineering Team

- Sprint 1: Core data model + basic dashboard
- Sprint 2: Call logging + CTI integration
- Sprint 3: Reports + advanced features
- ...

---

## QUESTIONS FOR ENGINEERING (Bala/Ravindra)

### Critical Path Questions

**1. Home Tab Customization**
Q: Can we completely replace the Salesforce Home tab with our custom dashboard?
A: [PENDING]
Impact: Determines if we need separate "Dialpad Home" tab

**2. Dashboard Component Embedding**
Q: Can we embed native Salesforce dashboard components in custom Lightning pages?
A: [PENDING]
Impact: Determines if metrics can link to real reports

**3. Multiple Persistent Banners**
Q: Does Salesforce support multiple alert banners at the top of the page?
A: [PENDING]
Impact: Current prototype has 2 banners (version + sandbox)

**4. Real-Time Notifications**
Q: Can we access Tasks (calls) data in real-time to trigger notifications?
A: [PENDING]
Impact: Needed for "unlogged calls" alerts

**5. Role-Based Dashboard Strategy**
Q: Should we create 3 separate Lightning pages or 1 dynamic page?
A: [PENDING]
Options:
- Option A: 3 pages (Admin Home, Supervisor Home, Agent Home)
- Option B: 1 page with visibility rules

**6. Custom Notification Types**
Q: Can we create custom notification types in Salesforce notification center?
A: [PENDING]
Alternative: Build custom notification component (LWC)

**7. CTI Integration Approach**
Q: For Powerdialer, should we use utility bar component or full page?
A: [PENDING]
Impact: Determines screen real estate and user workflow

**8. Data Retention & Storage**
Q: What's the data retention limit for call history in Salesforce?
A: [PENDING]
Q: Do we need external storage for call recordings?
A: [PENDING]

**9. Governor Limits**
Q: How many API calls per hour for real-time call data sync?
A: [PENDING]
Q: Will we hit SOQL query limits for dashboard metrics?
A: [PENDING]

**10. Salesforce Edition Requirements**
Q: What's the minimum Salesforce edition required?
A: [PENDING]
Options: Professional, Enterprise, Unlimited

---

## SUCCESS METRICS

### Customer Validation Phase
- [ ] 8-10 customers interviewed
- [ ] Average satisfaction score: 8/10 or higher
- [ ] Top 5 features validated by 70%+ of customers
- [ ] Zero deal-breaker issues identified

### Technical Validation Phase
- [ ] 90%+ of components classified (Native/Custom/Hybrid)
- [ ] All 10 critical questions answered
- [ ] Data model approved by Salesforce architect
- [ ] No technical blockers identified

### PRD Quality
- [ ] All sections complete (12 sections)
- [ ] Approved by PM, Engineering Lead, Design
- [ ] User stories have acceptance criteria
- [ ] Implementation timeline defined

### Prototype Refinement
- [ ] All 4 TODOs completed
- [ ] Deployed to public URL
- [ ] Zero broken links or console errors
- [ ] Loading time < 2 seconds

---

## RISKS & MITIGATIONS

### Risk 1: Native Salesforce Limitations
**Risk:** Some prototype features may not be possible with native Salesforce
**Likelihood:** Medium
**Impact:** High
**Mitigation:**
- Complete technical validation early (Week 1-2)
- Have backup plan for custom Lightning components
- Set customer expectations during validation

### Risk 2: Customer Feedback Conflicts
**Risk:** Customers may request conflicting features
**Likelihood:** High
**Impact:** Medium
**Mitigation:**
- Prioritize by frequency (if 70%+ want it, it's a must-have)
- Create "Future Enhancements" section in PRD
- Communicate trade-offs clearly

### Risk 3: Timeline Slippage
**Risk:** 6-week validation timeline may extend
**Likelihood:** Medium
**Impact:** Medium
**Mitigation:**
- Run technical and customer validation in parallel (Week 2-3)
- Have backup customers identified
- Set hard deadline for PRD (Week 4 end)

### Risk 4: Scope Creep
**Risk:** New features added during validation
**Likelihood:** High
**Impact:** Medium
**Mitigation:**
- Define MVP scope clearly in PRD
- Create "Phase 2" section for enhancements
- Get leadership sign-off on scope

### Risk 5: Technical Blockers
**Risk:** Salesforce API limits or governor limits hit
**Likelihood:** Low
**Impact:** High
**Mitigation:**
- Design for efficiency (batch API calls, cache data)
- Test with production-scale data volumes
- Have engineering review data flow early

---

## DEPENDENCIES

### External Dependencies
- **Bala (Engineering):** Technical feasibility, architecture decisions
- **Ravindra (Engineering):** Salesforce expertise, governor limit analysis
- **Nihar (PM):** Customer recruitment, PRD approval
- **Sales/CSM Teams:** Customer nominations for validation
- **Leadership:** PRD approval, timeline approval

### Internal Dependencies
- Technical validation must complete before PRD finalization
- Customer validation informs PRD feature priority
- PRD must be approved before prototype refinement
- Prototype v2.0 needed before implementation planning

### Technical Dependencies
- Salesforce org access (sandbox for testing)
- Dialpad API documentation
- Sample production data for realistic testing
- Salesforce Lightning Design System (SLDS) guidelines

---

## COMMUNICATION PLAN

### Weekly Status Update
**Audience:** Nihar, Bala, Ravindra, Leadership
**Format:** Email summary
**Content:**
- Progress on current week's tasks
- Blockers and risks
- Next week's plan
- Ask for help/decisions

### Customer Validation Readout
**Audience:** Full team + Leadership
**Format:** 30-min presentation
**Content:**
- Customer demographics
- Top 10 findings
- Feature priority matrix
- Recommendations

### PRD Review Sessions
**Audience:** Cross-functional team
**Format:** 3 x 1-hour sessions
**Content:**
- Session 1: User stories and requirements
- Session 2: Technical architecture
- Session 3: Implementation plan

### Prototype Demo
**Audience:** Customers, Partners, Internal
**Format:** Recorded 10-min video
**Content:**
- Overview of all features
- Walk through user flows
- Highlight key capabilities

---

## APPENDIX

### File Structure (Current Prototype)
```
prototype/
├── index.html              # Main entry point
├── css/
│   └── custom.css         # Custom SLDS overrides
├── js/
│   ├── app.js             # Main application logic (2700+ lines)
│   ├── app-state.js       # State management
│   ├── role-manager.js    # Role switching (demo only)
│   ├── data-service.js    # Mock data provider
│   └── charts.js          # Chart.js initialization
├── data/
│   ├── calls.json         # Mock call data
│   ├── users.json         # Mock user data
│   ├── metrics.json       # Mock metrics
│   └── lists.json         # Mock powerdialer lists
└── README.md              # Setup instructions
```

### Key Files to Modify (By TODO)

**TODO #1 (GitHub Pages):**
- Add `README.md` with deployment steps
- Create `.github/workflows/deploy.yml` for auto-deploy

**TODO #2 (Onboarding):**
- `js/app.js` - `showOnboardingModal()` function
- `js/app-state.js` - Add onboarding state properties

**TODO #3 (Upgrade Flow):**
- `js/app.js` - `showChangelogModal()` function
- `js/app.js` - New `showPreUpdateChecklist()` function
- `js/app-state.js` - Add update acknowledgment properties

**TODO #4 (Implementation Badges):**
- `js/app.js` - Add badges to all render functions
- `css/custom.css` - Badge styling

**TODO #14 (Remove Demo):**
- `index.html` - Remove demo controls panel
- `js/app.js` - Remove demo-related functions
- `js/role-manager.js` - Simplify or remove

**TODO #15 (View Report Links):**
- `js/app.js` - Add buttons to metric cards (19 locations)

**TODO #16 (Native Charts):**
- Add `img/` directory with chart screenshots
- `js/app.js` - Replace `<canvas>` with `<img>`
- `index.html` - Remove Chart.js CDN

**TODO #17 (Tech Notes):**
- Create new `technical-notes.html`
- Add link in navigation

### Component Inventory (42 Total)

**Native Salesforce (18):**
1. Page headers (6 pages)
2. Metric cards (6 metrics)
3. Data tables (4 tables)
4. Standard buttons (2 types)

**Hybrid (12):**
5. Charts (3 charts)
6. Dashboard layout (1)
7. Notifications dropdown (1)
8. Alert banners (2 banners)
9. Settings form (5 sections)

**Custom Build (12):**
10. Powerdialer interface (1)
11. Onboarding wizard (1)
12. Changelog modal (1)
13. SMS interface (1)
14. Call detail view (1)
15. Quota progress bars (3)
16. Agent status indicators (4)

---

## CONTACT & ESCALATION

**Project Owner:** Nihar (PM)
**Technical Lead:** Bala (Engineering)
**Prototype Owner:** Amit (Product Design)
**Salesforce Architect:** Ravindra

**Escalation Path:**
1. Issue/Blocker identified
2. Notify project owner (Nihar)
3. If urgent: Schedule alignment call within 24 hours
4. If critical: Escalate to leadership immediately

**Slack Channels:**
- #dialpad-salesforce-integration (daily updates)
- #product-eng-alignment (weekly syncs)
- #customer-feedback (validation insights)

**Meeting Cadence:**
- Daily standup: 15 min (Mon-Fri 10am)
- Weekly sprint planning: 1 hour (Mondays 2pm)
- Bi-weekly leadership review: 30 min (Fridays 3pm)

---

## DOCUMENT HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-17 | Amit | Initial draft based on PM feedback |
| 1.1 | [TBD] | [TBD] | After technical validation |
| 1.2 | [TBD] | [TBD] | After customer validation |
| 2.0 | [TBD] | [TBD] | Final version with PRD |

---

**END OF DOCUMENT**

---

## QUICK REFERENCE: IMMEDIATE TODOS

For easy reference, here are the 4 prototype TODOs that need to be done soon:

1. **Deploy to GitHub Pages** (30 min) - For customer validation
2. **Enhance Onboarding Flow** (4 hours) - 6-step wizard with sandbox warning
3. **Improve Upgrade Flow** (3 hours) - Pre-update checklist with acknowledgment
4. **Add Implementation Badges** (2 hours, optional) - Show native vs custom

**Total Effort:** ~9-10 hours of development work

**Timeline:** Complete by end of Week 1 for customer validation sessions in Week 2-3
