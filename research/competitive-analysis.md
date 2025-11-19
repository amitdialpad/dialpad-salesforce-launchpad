# Competitive Analysis: Salesforce Call Center Dashboards

**Date:** 2025-11-17
**Analyst:** Research Phase
**Purpose:** Identify how competitors implement dashboards and launchpad features in Salesforce integrations

---

## Executive Summary

Analyzed 8 major competitors in the call center/communication space with Salesforce integrations. Key findings:

**Common Approaches:**
1. **Native Salesforce Reports** (Aircall) - Simplest, most customizable
2. **Einstein Analytics** (NICE inContact, Talkdesk) - Advanced AI-powered insights
3. **Custom Lightning Components** - Most flexible but higher complexity

**Best Practices:**
- 15-20 pre-built reports delivered out-of-the-box
- Role-based dashboard views (Agent/Supervisor/Manager/Executive)
- Native Salesforce reporting framework for customer customization
- Real-time metrics for operational monitoring

**Recommendation:** Combine Aircall's native Salesforce Reports approach with Five9's role-based architecture.

---

## Competitor Analysis

### 1. AIRCALL ⭐ (Most Relevant)

**Dashboard Type:** Metrics Dashboard within Salesforce

**Key Features:**
- **18 pre-built reports** delivered out-of-the-box
- Dashboard accessible via: Salesforce Object Menu → Dashboards → All Folders
- Reports are fully customizable by customers
- Uses 100% native Salesforce Reports and Dashboards

**Technical Approach:**
- Custom object for call data logging
- Native Salesforce Report Builder
- Standard Salesforce Dashboard components
- No custom analytics engine required

**Metrics Displayed:**

*Agent Performance:*
- Pick-up rate by agent
- Pitch success rate by agent
- Total call volume by agent
- Average call volume by agent
- Call distribution by agent

*Call Analysis:*
- Total number of missed calls
- Missed call ratio
- Missed call by agent
- Missed call by hour
- Call distribution
- Call by country
- Call volume by account

*Timing Metrics:*
- Best times to call
- Call waiting time
- Average waiting time (seconds)
- Longest waiting time (seconds)

**Role Support:** Appears to be unified view (no role-based filtering documented)

**Strengths:**
- Extremely simple architecture
- Leverages familiar Salesforce tools
- Customers can customize without vendor support
- Lower development complexity
- Built-in Salesforce functionality (filters, scheduling, exports)

**Weaknesses:**
- No role-based views out-of-the-box
- Limited real-time capabilities
- No AI-powered insights

**Relevance to Dialpad:** HIGH - This approach is perfect for our prototype phase

---

### 2. TALKDESK

**Dashboard Type:** Embedded Analytics Dashboard + Live Dashboard

**Key Features:**
- **20+ pre-built customizable reports**
- Real-time dashboards with detailed metrics
- Salesforce Einstein integration for insights
- Custom "Talkdesk Activities" object for reporting
- New Data Model with improved granularity

**Dashboard Capabilities:**
- Intraday metrics updating virtually in real-time
- Widget-level filters
- Dashboard-level filters
- Contact monitoring
- Full-screen mode
- Drag & drop widgets
- Resizable widgets

**Technical Approach:**
- Custom Salesforce objects (Talkdesk Activities)
- Einstein Analytics integration
- Real-time data streaming
- Advanced dashboard builder

**Metrics Displayed:**
- Agent KPIs
- Call outcomes
- Queue metrics
- Contact center activities
- Digital interactions data

**Integration Benefits:**
- Combine 40+ Talkdesk data points with Salesforce records
- Create actionable dashboards mixing CRM + call data
- Real-time operational insights

**Strengths:**
- Real-time data updates
- High customization flexibility
- Strong analytics focus
- Comprehensive widget library

**Weaknesses:**
- More complex implementation
- Requires Einstein Analytics license
- Higher learning curve for admins

**Relevance to Dialpad:** MEDIUM - Good for future state, but too complex for prototype

---

### 3. NICE inContact (NICE CXone) ⭐

**Dashboard Type:** Performance Analytics for Salesforce Einstein

**Key Features:**
- Multiple pre-built analytics applications
- AI-powered recommendations to improve KPIs (FCR, agent efficiency, sales productivity)
- No coding or data specialists required
- Analytics Studio for expert mode
- Precise, actionable recommendations

**Pre-built Applications:**
1. First Contact Resolution (Case Analysis)
2. Sales Productivity
3. Agent Occupancy Efficiency
4. Lead Conversion Analysis
5. Omnichannel Effectiveness
6. Digital Contact Handling Details

**Access Method:**
1. Select "Analytics for Salesforce Einstein"
2. Click "Analytics Studio" under Expert Mode
3. Browse All Items → Dashboards
4. Select dashboard to view
5. Use drop-down filters to narrow metrics

**Technical Approach:**
- Einstein Analytics platform
- Pre-built analytics apps (not just reports)
- AI/ML-powered insights
- Unified agent workspace

**Role Support:**
- Unified agent workspace combining voice + digital + scheduling + performance
- All accessible without leaving Salesforce

**Strengths:**
- Sophisticated AI-powered insights
- Comprehensive suite of pre-built analytics apps
- Deep Einstein Analytics integration
- Business outcome focus (FCR, efficiency, productivity)

**Weaknesses:**
- Requires Einstein Analytics license
- More complex setup
- Higher cost

**Relevance to Dialpad:** MEDIUM - Great inspiration for metrics, but Einstein dependency is a barrier

---

### 4. FIVE9 ⭐ (Role-Based Architecture)

**Dashboard Type:** Supervisor Desktop + Performance Management Dashboard

**Key Features:**
- Browser-based, fully customizable supervisor desktop
- Real-time monitoring capabilities
- **Role-based dashboards:** Agents, Supervisors, Managers, Executives ✅
- Custom alerts for SLA/KPI violations
- Silent coaching and monitoring

**Supervisor Dashboard Components:**
- Upper left table: Real-time logged-in agents, their states, call status
- Progress bars with color coding as teams approach daily goals
- Agent performance statistics (call handling, idle time)
- Dashboard views to monitor agent state by channel
- Ability to make adjustments based on current conditions

**Monitoring Capabilities:**
- Monitor agents in real time
- Listen to calls
- Silent coaching
- Queue monitoring
- SLA tracking

**Technical Approach:**
- Role-based dashboard architecture ✅
- Aggregates data from external systems
- Consolidates Five9 + Salesforce information
- Layouts present business data alongside call center metrics

**Role Support:** ✅ **EXPLICITLY SUPPORTS MULTIPLE ROLE-BASED VIEWS**
- Agents: Personal performance metrics
- Supervisors: Team monitoring and coaching tools
- Managers: Department/region analytics
- Executives: High-level KPIs and trends

**Strengths:**
- Strong role-based architecture (MATCHES OUR REQUIREMENTS!)
- Real-time supervisor tools
- Comprehensive monitoring capabilities
- Combines Salesforce + external data
- Proven multi-level dashboard approach

**Weaknesses:**
- Complex supervisor desktop setup
- May be overkill for agents who just need basic metrics

**Relevance to Dialpad:** VERY HIGH - Role-based architecture is exactly what we need

---

### 5. GENESYS CLOUD

**Dashboard Type:** Embedded Analytics within Salesforce

**Key Features:**
- Developer blueprint: "Visualize Genesys Cloud Analytics data within Salesforce"
- Real-time analytics from common data layer
- Works with Service Cloud, Lightning Experience, Omni-Channel
- Interactive Agent Dashboard for transparency into performance metrics

**Technical Approach:**
- Common data layer for real-time analytics
- Native Lightning Experience integration
- Advanced metrics and analytics engine
- Real-time monitoring

**Metrics Focus:**
- Contact center efficiency
- Trend identification
- Performance transparency for agents
- Agent morale and performance tracking

**Integration Capabilities:**
- Contact center services inside Salesforce
- Real-time analytics pulled from common data layer
- Actionable insights for maximizing customer journeys
- Data-driven decision making

**Strengths:**
- Native Lightning Experience integration
- Real-time data layer approach
- Strong analytics focus
- Proven at scale

**Weaknesses:**
- Developer blueprint requires JavaScript (couldn't access full docs)
- Implementation complexity unclear

**Relevance to Dialpad:** MEDIUM - Good technical approach, but documentation limited

---

### 6. RINGCENTRAL

**Dashboard Type:** Analytics Dashboard + Cloud Phone Report

**Key Features:**
- Complete performance dashboard for team viewing
- Native Salesforce reports integration
- Customizable RingCentral Analytics data as native Salesforce report
- "Cloud Phone Report" concept

**Technical Approach:**
- Native Salesforce reporting
- Analytics data exposed as Salesforce reports
- Standard dashboard embedding

**Recent Updates (2024):**
- Version 6.27.0 (March 2024): RingCentral Webinar Integration
- December 2024: Call queue status in call history, host controls for conferences

**Strengths:**
- Simple native Salesforce integration
- Familiar reporting tools
- Regular updates and improvements

**Weaknesses:**
- Limited documentation on dashboard specifics
- No clear role-based approach mentioned

**Relevance to Dialpad:** MEDIUM - Similar to Aircall approach but less documented

---

### 7. 8x8 CONTACT CENTER

**Dashboard Type:** Home Page Dashboard Link + Communication Panel

**Key Features:**
- 8x8 Contact Center link on Salesforce home page dashboard
- Phone button brings communication panel into view
- Real-time queue status and agent presence
- Screen pop behavior in Service Console (separate tabs in tabbed mode)

**Analytics & Reporting:**
- Insightful dashboards
- Flexible reporting options
- Call activity detail
- Sentiment analysis
- Team communication effectiveness metrics

**Technical Approach:**
- Dashboard link on home page
- Communication panel integration
- Multi-platform support (Classic, Console, Lightning)
- Search CRM records from 8x8 app
- Click-to-dial from native Salesforce

**Strengths:**
- Multi-platform support
- Real-time monitoring
- Sentiment analysis capability
- Good CRM integration

**Weaknesses:**
- Dashboard details limited
- Appears more focused on calling than analytics

**Relevance to Dialpad:** LOW - More CTI-focused than dashboard-focused

---

### 8. ZOOM PHONE

**Dashboard Type:** Soft Phone Widget

**Key Features:**
- Zoom phone widget within Salesforce
- Initiate and record calls without leaving Salesforce
- Auto-creates new lead/contact entries for unknown numbers
- Call metrics tracking
- Auto-logging of call details and outcomes

**Technical Approach:**
- Native Salesforce app from AppExchange (free)
- Soft phone dialer integration
- Native widget embedding
- Auto-logging to contact records

**Strengths:**
- Free native app
- Simple setup
- Good call logging

**Weaknesses:**
- Very limited dashboard/analytics focus
- More about calling than reporting

**Relevance to Dialpad:** LOW - Not dashboard-focused

---

## Agent Dashboard Implementations (2025 Research)

### Five9 Agent Workspace
**Focus:** Unified omnichannel interface within Salesforce Console

**Key Features:**
- 360-degree customer view with previous interaction history
- Unified interface for voice, digital, email, chat, social media
- Personal performance reports and productivity metrics
- Real-time contact center status
- Schedule management without leaving Salesforce
- Lightning Experience fully integrated option

**What Agents See:**
- Current status (available, in call, on break)
- Live CSAT scores from recent calls
- Personal KPIs and targets
- Queue status and waiting calls

### Talkdesk Agent Dashboard
**Focus:** Detailed call analytics with time-based visualizations

**Key Metrics Displayed:**
- Total inbound calls (handled, missed, voicemail)
- Total outbound calls (connected, not connected)
- Average Speed to Answer
- Call visualizations by time intervals (segmented by type)
- Filters: date, timezone, aggregation by minute/hour/day/week/month

**Integration Benefits:**
- Customer context from CRM records alongside call handling
- Interaction history visible on contact/lead/case records
- Unified workspace experience

### Aircall Agent Metrics (Supervisor View - Not Agent)
**Note:** Aircall provides metrics dashboards for *supervisors* to view agent performance, not personal agent dashboards

**Agent-Level Reports (Viewed by Supervisors):**
- Pick-up rate by agent
- Pitch success rate by agent (unsuccessful <30s, partial 30-120s, successful >120s)
- Missed calls by agent
- Total call volume by agent (time in minutes)
- Call distribution by agent (dispositions/results)
- Average call duration by agent

**Takeaway:** Aircall focuses on supervisor monitoring rather than agent self-service dashboards

### NICE CXone Agent Workspace
**Focus:** Omnichannel unified agent desktop

**Key Features:**
- Personal reports for performance and productivity
- Current contact center status for pacing contact handling
- Real-time insights into queue and team status
- Handles voice + digital contacts + scheduling + performance - all in Salesforce
- Performance Analytics for Salesforce Einstein (separate product)

**What Agents See:**
- Personal performance dashboards
- Real-time contact center metrics
- Customer 360-degree view
- Interaction history across all channels

### Genesys Cloud Agent Desktop
**Focus:** Personal statistics with real-time refresh

**My Reports Dashboard Metrics:**
- Total active calls
- Call type breakdown (inbound, outbound, internal, consult)
- Work time tracking:
  - Talk time (minutes)
  - Wrap-up time
  - Ready time
  - Hold time
- Average call time
- Average calls per hour

**Features:**
- Auto-refresh every 20 seconds
- Manual refresh button
- Personalized performance insights (evaluations, scorecards, coaching)

### RingCentral Agent Dashboard
**Focus:** In-app calling with performance reporting

**Key Features:**
- Complete team performance dashboard
- Native Salesforce reports (Cloud Phone Report)
- Real-time call results display
- Analytics and reports customizable as native Salesforce reports
- In-app calling without leaving Salesforce
- Voicemail and e-fax access within Salesforce

**What Agents See:**
- Team performance metrics
- Personal call history
- Real-time call status

---

## Common Agent Dashboard Patterns (2025)

### 1. **Core Metrics (Top of Dashboard)**
Almost all vendors display 4-6 key metrics prominently:
- Calls handled today
- Average handle time OR Average call duration
- CSAT score OR Service score
- Missed calls OR Queue status
- Quota progress (if applicable)

### 2. **Real-Time Status Indicators**
- Current agent status (available, on call, wrap-up, break)
- Waiting calls in queue
- Live CSAT feedback from recent interactions
- Service level adherence

### 3. **Personal Performance vs Goals**
- Daily/weekly quota tracking with progress bars
- Target adherence indicators (on track, at risk, behind)
- Historical trend comparisons

### 4. **Work Activity Breakdown**
- Time spent in different states (talk, wrap-up, ready, break)
- Inbound vs outbound call distribution
- Call outcomes and dispositions

### 5. **Quality Metrics**
- First Call Resolution (FCR) rate
- Customer Satisfaction (CSAT) scores
- Call success rates
- Average handling time vs target

### 6. **Customer Context Integration**
- 360-degree customer view
- Interaction history across channels
- Open cases or tasks related to calls
- CRM data alongside call metrics

---

## Key Findings for Dialpad Agent Dashboard

### What's Common Across Competitors:
1. ✅ **Personal call metrics** (calls today, average duration, missed calls)
2. ✅ **CSAT/Service score** prominently displayed
3. ✅ **Quota tracking** with visual progress indicators
4. ✅ **Real-time status** (waiting calls, queue status)
5. ❌ **CRM integration** - Open cases/tasks related to calls
6. ❌ **Omnichannel view** - Not just calls, but email, chat, SMS in one view

### What's Unique to Contact Center Apps (Not Core to Dialpad):
- Agent state management (available, break, wrap-up) - This is for *inbound* call centers
- Queue monitoring and waiting calls - Dialpad is more *outbound* focused
- Speed to answer metrics - Inbound metric
- Schedule management - Complex workforce management feature

### What Makes Sense for Dialpad (Outbound Sales Focus):
1. ✅ **Powerdialer lists and queue** - Critical for outbound sales
2. ✅ **Quota progress** - Sales-driven metric
3. ✅ **Call outcomes/dispositions** - Track pitch success
4. ✅ **Open cases by priority/channel** - CRM integration for follow-ups
5. ✅ **Unlogged calls** - Data quality monitoring
6. ✅ **AI CSAT** - Quality metric for sales interactions

### Key Differences:
- **Five9/NICE/Genesys:** Inbound service focus (queues, wait times, FCR)
- **Dialpad:** Outbound sales focus (powerdialer, quotas, pitch success)
- **Aircall:** No agent self-service dashboard (supervisor-only reports)
- **Talkdesk/RingCentral:** Balanced inbound/outbound with native Salesforce reports

---

## Key Patterns & Common Features

### Dashboard Architecture Approaches

| Approach | Examples | Complexity | Customizability | Cost |
|----------|----------|------------|-----------------|------|
| Native Salesforce Reports | Aircall, RingCentral | Low | High | Low |
| Einstein Analytics | NICE, Talkdesk | High | Very High | High |
| Custom Lightning Components | Most vendors | Medium | Medium | Medium |
| Role-Based Dashboards | Five9 | Medium | High | Medium |

### Common Metrics by Role

#### Agent Metrics (Updated 2025 Research)

**Core Call Metrics:**
- Total calls (inbound + outbound)
- Calls today/this week/this month
- Average Handle Time (AHT) - talk time + hold time + after-call work
- Average call duration
- Total talk time
- Pick-up rate / Answer rate
- Missed calls count

**Performance & Quality:**
- First Call Resolution (FCR) rate
- Customer Satisfaction (CSAT) score (real-time from recent calls)
- Service level adherence
- Call success rate (by duration or outcome)
- Call dispositions/outcomes breakdown
- Pitch success rate (categorized by call length)

**Time Tracking:**
- Ready time / Available time
- Wrap-up time
- Hold time
- Break time / Idle time
- Average calls per hour

**Queue & Waiting:**
- Waiting calls (in queue)
- Average waiting time
- Speed to answer

**Daily Goals:**
- Quota progress (calls made vs target)
- Personal performance vs targets
- Status indicators (on track / at risk / behind)

#### Supervisor Metrics
- Team performance overview
- Agent state monitoring (real-time)
- Queue metrics and wait times
- Missed call tracking
- Department/team breakdowns
- Agent comparison reports
- SLA compliance
- Coaching opportunities

#### Admin/Manager Metrics
- Company-wide call volume
- Department comparisons
- Office breakdowns
- SLA compliance across organization
- System health indicators
- Trends and analytics
- User adoption metrics
- Integration status

### Common UI Patterns

1. **Home Page Dashboard**
   - Most vendors provide dashboard accessible from Salesforce home
   - Typically via Apps menu or dedicated home page

2. **Embedded Reports**
   - Charts embedded directly in Salesforce pages
   - Tables with sortable columns
   - Summary cards with key metrics

3. **Customizable Widgets**
   - Drag-and-drop positioning
   - Resizable components
   - Widget-level filters

4. **Real-time Updates**
   - Live data refresh for monitoring
   - Color-coded alerts and thresholds
   - Progress indicators

5. **Filtering Capabilities**
   - Date range pickers
   - Agent/user filters
   - Team/department filters
   - Office/location filters
   - Status filters

6. **Tabs Organization**
   - Multiple views organized in tabs
   - Consistent navigation
   - Breadcrumbs for context

---

## Technical Implementation Patterns

### Data Storage Options

1. **Custom Objects**
   - Store call/SMS records as Salesforce objects
   - Enable native reporting
   - Allow relationship with standard objects (Contacts, Leads, Accounts)
   - Example: Aircall's call logging, Talkdesk Activities

2. **External Data**
   - Keep data in external system
   - Use External Objects in Salesforce
   - Real-time data access
   - Less Salesforce storage used

3. **Hybrid Approach**
   - Key data in Salesforce (for reporting)
   - Detailed data external (for deep analysis)
   - Balance storage vs functionality

### Dashboard Rendering Options

1. **Native Dashboards**
   - Use Salesforce Dashboard Builder
   - Standard components
   - Familiar to admins
   - Easy customization

2. **Lightning Components**
   - Custom Lightning Web Components
   - More control over UX
   - Can fetch data from external APIs
   - Requires development skills

3. **Einstein Analytics**
   - Advanced analytics capabilities
   - AI-powered insights
   - Requires license
   - Steeper learning curve

### Role-Based View Implementation

**Option 1: Salesforce Profiles/Permission Sets**
- Different profiles for Admin/Supervisor/Agent
- Dashboard visibility controlled by permissions
- Use standard Salesforce security model

**Option 2: Dynamic Components**
- Single dashboard with dynamic content
- Components check current user role
- Show/hide sections based on permissions

**Option 3: Multiple Home Pages**
- Different home page layouts per role
- Assigned via App or Profile
- Cleaner separation of concerns

---

## Recommendations for Dialpad Launchpad

### Architecture Recommendation: Hybrid Approach

**Phase 1 (Prototype):** Native Salesforce Reports
- Use Aircall's approach
- 15-20 pre-built reports
- Native Salesforce Dashboards
- Lightning page embedding

**Phase 2 (Production):** Add Custom Components
- Custom Lightning Web Components for:
  - Product announcements
  - Onboarding checklists
  - User status monitoring
  - Unlogged call alerts
- Keep native reports for metrics

**Phase 3 (Future):** Consider Einstein Analytics
- Advanced analytics and AI insights
- Predictive analytics
- Custom analytics apps

### Role-Based Implementation

**Follow Five9's Pattern:**
- Admin Dashboard: System health, user management, onboarding, updates
- Supervisor Dashboard: Team performance, list management, agent monitoring
- Agent Dashboard: Personal metrics, assigned lists, next caller

**Technical Approach:**
- Multiple home page layouts
- Assign via Lightning App
- Use permission sets for feature access
- Dynamic components where needed

### Pre-built Reports (Inspired by Aircall's 18)

**Agent Reports (6):**
1. My Calls Today
2. My Call Volume by Week
3. My Call Outcomes
4. My Average Call Duration
5. My Missed Calls
6. My Powerdialer Progress

**Supervisor Reports (6):**
7. Team Call Volume
8. Team Performance by Agent
9. Missed Calls by Agent
10. Call Distribution by Department
11. Powerdialer List Status
12. Agent State Overview

**Admin Reports (6):**
13. Company-wide Call Volume
14. User Connection Status
15. Unlogged Calls
16. Calls by Office
17. Calls by Department
18. Integration Health

### UI Components Needed

**Lightning Components:**
- Dashboard cards (summary metrics)
- Data tables (call/SMS lists)
- Filter panels (date, user, team)
- Chart components (bars, lines, donuts)
- Alert/notification banners
- Onboarding checklist cards
- Product update feed
- User status indicators

**Standard Salesforce:**
- Report Chart component
- Dashboard component
- Tabs component
- Rich text component

---

## Differentiators for Dialpad

Based on competitive analysis, these would be **unique to Dialpad**:

1. **Product Update Announcements**
   - None of the competitors have this built into dashboard
   - Proactive communication channel
   - Can be role-filtered

2. **Role-Based Onboarding Checklists**
   - Different checklists for Admin/Supervisor/Agent
   - Track completion progress
   - Link to help resources

3. **Unlogged Call Detection**
   - Proactive alerts for data quality issues
   - Helps with analytics accuracy
   - Troubleshooting aid

4. **Sandbox Update Reminders**
   - Admin-specific nudges
   - Promote best practices
   - Reduce production issues

5. **Supervisor Role (Middle Tier)**
   - New permission level between Admin and Agent
   - List management without full admin rights
   - Matches organizational structure

6. **Powerdialer Integration in Dashboard**
   - Next caller preview
   - List assignment visibility
   - Progress tracking

7. **Analytics Parity Validation**
   - Reports match Dialpad analytics numbers
   - Cross-system validation
   - Trust in reporting

---

## Key Takeaways

1. **Simple is Better for Prototype** - Use native Salesforce Reports (Aircall approach)

2. **Role-Based is Essential** - Follow Five9's multi-level dashboard pattern

3. **Customization is Expected** - Customers want to modify reports to their needs

4. **Pre-built Library** - 15-20 out-of-the-box reports accelerate time-to-value

5. **Real-time is Nice-to-Have** - Start with standard refresh, add real-time later

6. **Lightning Design System** - Use standard components for familiar UX

7. **Proper App Structure** - Move away from disconnected pages to unified app

---

## Next Research Questions

1. **Can we customize the Home tab content?**
   - Or do we need a custom "Dialpad Launchpad" tab?

2. **What Lightning Web Components are available?**
   - Which can we use vs need to build custom?

3. **How do we implement role-based views?**
   - Profiles? Permission Sets? Dynamic components?

4. **What's the best way to create 15-20 reports?**
   - Manual? Metadata API? Report templates?

5. **How do we embed dashboards in Lightning pages?**
   - Dashboard component? Report chart component?

---

## References

- Aircall Support: How to Use the Aircall Metrics Dashboard in Salesforce
- Talkdesk AppExchange Listing
- NICE inContact CXone Performance Analytics Documentation
- Five9 Supervisor Dashboard Features
- Genesys Cloud Developer Blueprints
- Salesforce Ben: How to Add Reports and Dashboards on Lightning Pages
