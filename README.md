# Dialpad for Salesforce - Launchpad Prototype

## Overview

This is a lo-fi prototype of the Dialpad for Salesforce Launchpad built using Salesforce Lightning Design System (SLDS). It demonstrates role-based dashboard views and key features without requiring an actual Salesforce org.

## Features

- **3 Role-Based Dashboards**: Admin, Supervisor, Agent views
- **Role Switcher**: Top-right dropdown to switch between roles
- **5 Main Tabs**: Home, Calls, SMS, Powerdialer, Settings
- **Mock Data**: Realistic sample data for calls, users, metrics, and Powerdialer lists
- **Responsive Design**: Uses SLDS components and grid system

## Running the Prototype

https://amitdialpad.github.io/dialpad-salesforce-launchpad/

Open this URL in your browser to view the prototype.

## How to Use

1. **Switch Roles**: Click the "Role: [Current Role]" dropdown in the top-right corner
2. **Navigate**: Click tabs to switch between pages
3. **Observe Changes**: Different roles see different data and UI elements

## Role-Specific Views

### Admin Dashboard
- Company-wide metrics (Calls Today, Active Users, Connected Users, Missed Calls)
- User status table showing all users and their connection status
- Product announcements
- Admin onboarding checklist
- Calls by department chart (placeholder)

### Supervisor Dashboard
- Team performance metrics (Team Calls, Avg Duration, Missed Calls, Team Size)
- Recent team calls table
- Active Powerdialer lists
- Quick actions

### Agent Dashboard
- Personal metrics (Calls Today, Avg Duration, Talk Time, Completed Calls)
- Recent personal calls table
- Assigned Powerdialer lists
- Tips widget

## Pages

### Home (Dashboard)
Role-specific landing page with KPIs, charts, and widgets

### Calls
- Shows call history with role-based filtering
- Admin: All calls
- Supervisor: Team calls
- Agent: Personal calls only
- Filter controls (date, status, direction)

### SMS
Placeholder page (structure similar to Calls)

### Powerdialer
- **Agent View**: Assigned lists and "Next Up" card
- **Supervisor/Admin View**: Manage lists table with create/edit options

### Settings
Admin-only page with configuration options

## Technical Details

### Tech Stack
- HTML5/CSS3/JavaScript
- Salesforce Lightning Design System 2.24.0 (via CDN)
- Vanilla JavaScript (no frameworks)
- JSON files for mock data

### File Structure
```
prototype/
├── index.html              # Main app shell
├── css/
│   └── custom.css         # Custom styles
├── js/
│   ├── app.js             # Main app logic and rendering
│   ├── role-manager.js    # Role switching logic
│   └── data-service.js    # Data loading and filtering
└── data/
    ├── calls.json         # 15 mock call records
    ├── users.json         # 10 mock users
    ├── metrics.json       # Company/team/personal metrics
    └── lists.json         # 5 Powerdialer lists
```

## Mock Data

### Users
- 10 users across 3 roles: Admin, Supervisor, Agent
- 3 departments: Sales, Support, IT
- 3 offices: San Francisco, Austin, New York
- 1 user is disconnected (Rachel Kim)

### Calls
- 15 call records
- Mix of Inbound/Outbound
- Various statuses: Completed, Missed
- Different dispositions: Interested, Closed Won, Follow Up, etc.

### Powerdialer Lists
- 5 lists with various completion rates
- Lists assigned to different agents

## Stopping the Server

To stop the local server:
```bash
lsof -ti:8000 | xargs kill
```

## Next Steps

Based on this prototype, you can:
1. Validate the UX and dashboard layouts
2. Refine the role-based views
3. Decide on additional metrics or widgets
4. Plan the real Salesforce Lightning Web Components (LWC) implementation
5. Define data model requirements

## Limitations (UI Only)

- Filters don't actually filter (just UI)
- Export buttons non-functional
- Charts are placeholders
- Settings form doesn't save
- No actual Dialpad integration
- Search bar non-functional
