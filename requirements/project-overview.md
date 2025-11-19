# Salesforce - Launchpad for Salesforce / Dialpad for Salesforce 2.0

**Project Type:** Prototype Development
**Status:** Research & Planning Phase
**Date:** 2025-11-17

## Related Resources
- JIRA: DP-148164: [Salesforce] Launchpad for Salesforce / Dialpad for Salesforce 2.0
- Figma: Dialpad for Salesforce Next Steps | FY26

## Project Goals

Build a working prototype within Salesforce using Lightning UI Design System to demonstrate a comprehensive launchpad/dashboard solution for Dialpad for Salesforce 2.0. This prototype will be used by EPD (Engineering/Product/Design) to evaluate and refine the concept.

**Note:** This is NOT about final architecture or production planning - focus is on creating a functional prototype in Salesforce environment.

---

## Problem Statements

### Business Problems

1. **Feature Communication Gap**
   - No easy way to communicate with admins/supervisors about newly available features and packages
   - Many customers use older package versions
   - Lack of visibility into product updates

2. **Onboarding Challenges**
   - No structured onboarding after package installation
   - Admins and agents must self-educate via Help Center or rely on SAs/SEs
   - Poor first-time user experience

3. **Sandbox Testing**
   - No way to enforce or promote sandbox testing before production updates
   - Risk of production issues from untested updates

### Customer Problems

#### For All Users
- **Difficult to locate calls/SMS messages** - No centralized, easy-to-navigate interface
- **No performance visibility** - Users can't see their metrics (calls made, quotas, etc.)
- **Unlogged calls** - No easy way to identify and fix unlogged calls
- **Report discrepancies** - No ready-made reports that match Dialpad analytics numbers

#### For Supervisors
- **Team performance blindness** - Cannot easily see how their team is performing
- **No granular insights** - Difficult to drill down to agent or department level

#### For Admins
- **List management overhead** - Want supervisors to manage lists (not currently in their KRA)
- Need special permissions for this delegation

---

## Proposed Solutions

### 1. New Role: Supervisor

**Current State:** Only Admin and Agent roles exist

**Proposed:** Introduce "Supervisor" role with:
- Ability to manage lists (Powerdialer)
- Cannot modify Dialpad app settings
- Middle-tier permissions between Admin and Agent

### 2. Proper Salesforce App Structure

**Current Problem:** Integration is disconnected pages found via App Launcher search

**Proposed Solution:** Create proper Salesforce app under "Apps" menu with organized tabs:

#### Proposed Tabs:
1. **Home** - Dashboard/Launchpad (role-based views)
2. **Calls** - Call history and analytics
   - Agents: Their own calls
   - Supervisors: Filtered by departments/offices/contact centers
   - Admins: Full view with all filters
3. **SMS** - SMS message history (similar filtering as Calls)
4. **Powerdialer** - List management and calling queue
   - Agents: Lists assigned to them + next record to call
   - Supervisors: Manage lists
5. **Settings** - Configuration (Admin-only, with select supervisor options)

**Open Question:** Should standard Salesforce tabs (Opportunities, Accounts, Leads) be shown in the app? Need to research if this is a Salesforce requirement or vendor choice.

### 3. Home Page / Launchpad / Dashboard

**Critical Research Question:** Can custom content be loaded in the "Home" tab, or does Salesforce mandate default home page? If mandate exists, may need custom "Dialpad Launchpad" tab instead.

#### Admin Dashboard Requirements

**Success Metrics:** Ensure Dialpad works properly for all users

**Dashboard Components:**
- Company-wide call metrics (filterable by offices/departments)
- Product updates and announcements for planning (especially for enterprises)
- Onboarding checklist to ensure proper configuration
- User management view:
  - List of Salesforce users using Dialpad
  - Their roles
  - Connection status (for troubleshooting)
- Admin console (future): Stream of error logs for self-service debugging
- Package update reminders with sandbox-first emphasis

**Reports to Include:**
- Number of calls made by company
- User connection status
- System health indicators

#### Supervisor Dashboard Requirements

**Success Metrics:** Ensure team meets targets and identify discrepancies

**Dashboard Components:**
- Team performance reports (calls made, missed calls, dispositions, call status)
- Agent/department-level breakdowns
- Powerdialer stats (if applicable):
  - Active lists
  - Calls made from lists
- Product updates relevant to supervisors
- Onboarding checklist for team configuration

**Customization:** Allow supervisors to customize reports using Salesforce Reports

#### Agent Dashboard Requirements

**Success Metrics:** Track personal performance and call outcomes

**Dashboard Components:**
- Personal call metrics and outcomes
- Powerdialer assigned lists + next caller info
- Product updates relevant to agents
- Onboarding checklist for Dialpad usage

**Reports to Include:**
- Number of calls made
- Call outcomes
- Performance against targets

### 4. Reporting Strategy

**Approach:** Use Salesforce Reports as foundation
- Create reports using Salesforce native reporting
- Allow customers to customize to their preferences
- Enable customers to add modified reports to dashboards
- Ensure numbers match Dialpad analytics

**Benefits:**
- Familiar tools for Salesforce users
- Built-in customization capability
- No need for custom reporting engine

---

## Key Design Principles

1. **Role-Based Experience** - Different views for Admin/Supervisor/Agent
2. **Salesforce-Native** - Use Lightning Design System and native components
3. **Customizable** - Leverage Salesforce Reports for user customization
4. **Integrated** - Proper app structure, not disconnected pages
5. **Proactive** - Surface product updates, onboarding help, and alerts
6. **Self-Service** - Enable troubleshooting without contacting support

---

## Success Criteria for Prototype

- Demonstrate role-based dashboard views
- Show proper Salesforce app structure with tabs
- Prove feasibility of custom home page/launchpad
- Display mock data in Lightning components
- Demonstrate Salesforce Reports integration
- Show navigation and filtering capabilities

---

## Out of Scope for Prototype

- Real Dialpad API integration
- Production-ready data synchronization
- Complete settings implementation
- Admin console with real error logs
- Mobile app optimization
- Package deployment and distribution
