# Dialpad Salesforce Launchpad - Architecture Documentation

## Overview
This prototype demonstrates a multi-persona dashboard experience for Dialpad's Salesforce integration. The codebase is designed to be **80% reusable** by backend developers who will connect real APIs and data sources.

## Current Architecture (Prototype)

### File Structure
```
prototype/
├── index.html                  # Main HTML shell (minimal, mostly navigation)
├── css/
│   └── custom.css             # SLDS 2 (Cosmos) design system overrides
├── js/
│   ├── app.js                 # Main application controller (6,626 lines)
│   ├── data-service.js        # Mock data provider (554 lines)
│   ├── app-state.js           # Centralized state management (375 lines)
│   ├── ui-helpers.js          # Reusable UI utility functions (NEW)
│   ├── charts.js              # Chart.js wrappers (345 lines)
│   └── role-manager.js        # User role/persona management (58 lines)
└── data/
    ├── calls.json             # Mock call records
    ├── users.json             # Mock user data
    ├── cases.json             # Mock Salesforce cases
    ├── lists.json             # Mock powerdialer lists
    └── metrics.json           # Mock metrics data
```

---

## Module Breakdown

### 1. **app.js** (Main Application - 6,626 lines)
**Purpose**: Monolithic controller that handles all page rendering, navigation, and UI logic.

**Key Responsibilities**:
- Page routing and navigation
- Dashboard rendering for 3 personas (Admin, Supervisor, Agent)
- Page rendering (Calls, SMS, Settings, Reports, Powerdialer)
- Event handling and user interactions
- Chart initialization

**Structure**:
```javascript
const App = {
    // ===== INITIALIZATION =====
    init()                          // App bootstrap
    startAutoRefresh()              // 30-second data refresh

    // ===== NAVIGATION =====
    renderPage(page)                // Main router
    updateTabVisibility()           // Role-based tab visibility

    // ===== DASHBOARD RENDERING =====
    // Admin Dashboard (~1,500 lines)
    renderAdminDashboard()
    renderAdminSidebar()
    renderAdminOverview()
    renderAdminAnalytics()
    renderAdminUsers()
    renderAdminIntegration()

    // Supervisor Dashboard (~600 lines)
    renderSupervisorDashboard()
    renderTeamStatusCard()
    renderHandledCallsCard()
    renderAIScorecardsCard()

    // Agent Dashboard (~150 lines)
    renderAgentDashboard()

    // ===== PAGE RENDERING =====
    renderCallsPage()               (~150 lines)
    renderSmsPage()                 (~150 lines)
    renderPowerdialerPage()         (~150 lines)
    renderSettingsPage()            (~800 lines)
    renderReportsPage()             (~1,000 lines)

    // ===== UTILITIES =====
    formatRelativeTime()
    attachNavigationListeners()
    // ... more helper methods
};
```

**Developer Handoff Notes**:
- **DO NOT refactor this file until backend is connected**
- All `render*()` methods return HTML strings - these should be replaced with React/LWC components
- Look for `DataService.get*()` calls - these are your API integration points
- Search for `AppState.*` - these are state mutations that need proper state management

---

### 2. **data-service.js** (Mock Data Provider - 554 lines)
**Purpose**: Centralized data fetching and filtering. **This entire file will be replaced with real API calls.**

**Key Methods**:
```javascript
const DataService = {
    // Data loading
    async init()                    // Loads all JSON files

    // Role-based data filtering
    getCalls(role)                  // Filter calls by user role
    getUsers(role)                  // Filter users by role
    getLists(role)                  // Get powerdialer lists
    getCases(userId, statusFilter)  // Get Salesforce cases

    // Metrics computation
    getSupervisorMetrics()          // Team metrics for supervisor
    getAdminMetrics()               // System-wide metrics for admin
    getAgentMetrics(userId)         // Personal metrics for agent

    // Utilities
    formatDuration(seconds)         // Format call duration
    getUnloggedCalls(count)         // Get unlogged calls
};
```

**Backend Integration Plan**:
1. Replace `init()` with real authentication
2. Replace each `get*()` method with REST/GraphQL API calls
3. Keep method signatures identical to minimize changes in `app.js`
4. Add error handling and loading states
5. Implement caching strategy

**Example Migration**:
```javascript
// BEFORE (Mock)
getCalls(role) {
    return this.calls.filter(c => /* filter logic */);
}

// AFTER (Real API)
async getCalls(role) {
    try {
        const response = await fetch('/api/v1/calls?role=' + role);
        if (!response.ok) throw new Error('Failed to fetch calls');
        return await response.json();
    } catch (error) {
        console.error('Error fetching calls:', error);
        return []; // Fallback
    }
}
```

---

### 3. **app-state.js** (State Management - 375 lines)
**Purpose**: Centralized application state with event-driven updates.

**Key Features**:
- User onboarding states
- Package version tracking
- Environment (production/sandbox)
- Alert states
- Integration health
- Quota tracking
- Demo controls
- Date range filtering

**State Change Flow**:
```
User Action → State Setter → localStorage → Event Dispatch → UI Re-render
```

**Example**:
```javascript
// State mutation
AppState.setEnvironment('sandbox');

// Triggers event
window.dispatchEvent(new CustomEvent('appStateChanged', {
    detail: { type: 'environment', value: 'sandbox' }
}));

// App listens and re-renders
window.addEventListener('appStateChanged', (e) => {
    if (e.detail.type === 'environment') {
        this.renderCurrentPage();
    }
});
```

**Developer Notes**:
- Replace `localStorage` with your state management solution (Redux, Zustand, etc.)
- Keep the event-driven architecture - it decouples components
- All state mutations go through setter methods - never modify state directly

---

### 4. **ui-helpers.js** (UI Utilities - NEW)
**Purpose**: Reusable utility functions for consistent UI rendering.

**Key Methods**:
```javascript
const UIHelpers = {
    // Status & State
    getStatusClass(status)          // Badge CSS classes
    getAgentStateClass(state)       // Agent state colors
    getAlertIcon(type)              // Alert icon names

    // Formatting
    formatRelativeTime(date)        // "5m ago", "2h ago"
    getUtilizationColor(percent)    // Color based on threshold

    // Rendering
    renderCardHeader(title, subtitle, actions)
    renderMetric(value, label, subtext)
    renderProgressBar(percent, label, color)
    renderBadge(text, cssClass)
    renderIcon(iconName, size, color)
    makeClickableCard(content, href)
};
```

**Why This Exists**:
- **Consistency**: Ensures all cards, badges, and metrics look the same
- **Reusability**: Use these in your React/LWC components
- **Maintainability**: Update UI patterns in one place

---

### 5. **charts.js** (Chart.js Wrappers - 345 lines)
**Purpose**: Wrapper functions for Chart.js visualizations.

**Key Methods**:
```javascript
const ChartHelpers = {
    destroy(canvasId)                           // Clean up old chart
    createCallActivityChart(canvasId, data)     // Line chart for call volume
    createDailyQuotaChart(canvasId, made, target)
    createCallTypeBreakdownChart(canvasId, inbound, outbound)
    createAICsatTrendChart(canvasId, trendData)
};
```

**Migration Path**:
- Replace with D3.js, Recharts, or native Salesforce charts
- Keep the same data structure for easy migration

---

### 6. **role-manager.js** (Persona Management - 58 lines)
**Purpose**: Manages user role/persona for demo purposes.

**Key Methods**:
```javascript
const RoleManager = {
    getRole()                       // Get current role ('admin', 'supervisor', 'agent')
    setRole(role)                   // Switch persona (demo only)
    init()                          // Initialize role switcher UI
};
```

**Backend Integration**:
- Replace with real user authentication
- Fetch user role from Salesforce user object
- Keep role-based access control logic

---

## Data Flow

### Page Load
```
1. index.html loads
2. Scripts load in order:
   - data-service.js (loads mock data)
   - role-manager.js (sets persona)
   - ui-helpers.js (utility functions)
   - charts.js (chart helpers)
   - app-state.js (initializes state)
   - app.js (renders initial page)
3. App.init() called
4. Data loaded from JSON files
5. Initial page rendered based on role
```

### Navigation
```
User clicks tab
→ App.renderPage(page)
→ Updates active tab state
→ Calls appropriate render method
→ HTML injected into #main-content
→ Event listeners attached
→ Charts initialized if needed
```

### State Changes
```
User toggles demo control
→ AppState.setter() called
→ State updated in memory + localStorage
→ CustomEvent dispatched
→ App listens to event
→ Page re-rendered with new state
```

---

## Design Patterns Used

### 1. **Single-Page Application (SPA)**
- No server-side routing
- All pages rendered client-side
- Hash-based navigation (`#/calls`, `#/settings`)

### 2. **Template String Rendering**
- All HTML generated via template literals
- **This should be replaced with JSX/LWC components**

### 3. **Event-Driven Architecture**
- State changes dispatch CustomEvents
- Components listen and respond
- Decoupled, reactive design

### 4. **Mock Data Layer**
- All data comes from `data-service.js`
- Easy to swap with real APIs
- No business logic in UI code

---

## Critical Integration Points

### For Backend Developers

#### 1. **Replace Mock Data Service**
File: `js/data-service.js`

**Priority API Endpoints Needed**:
```
GET  /api/v1/calls?role={role}&date_range={range}
GET  /api/v1/users?role={role}
GET  /api/v1/metrics/admin
GET  /api/v1/metrics/supervisor
GET  /api/v1/metrics/agent/{userId}
GET  /api/v1/cases?userId={userId}&status={status}
GET  /api/v1/powerdialer/lists?role={role}
GET  /api/v1/integration/health
POST /api/v1/integration/test-connection
```

#### 2. **Implement Real State Management**
File: `js/app-state.js`

Replace `localStorage` with:
- Redux/Zustand for React
- LDS (Lightning Data Service) for LWC
- Apex controllers for Salesforce backend

#### 3. **Add Authentication**
Current: Role switcher in header (demo only)
Needed: Salesforce OAuth → User profile → Role detection

#### 4. **Connect Chart Data**
Files: `js/charts.js`, various `render*Chart()` methods

Replace mock trend data with real time-series data from backend.

---

## Role-Based Features

### Admin (Michael Chen)
**Dashboard**: System-wide mission control
- System health monitoring
- User & license management
- Integration health
- Setup progress tracking
- Company-wide metrics

**Pages**: All pages accessible + Settings with admin-only sections

### Supervisor (Sarah Johnson)
**Dashboard**: Team performance monitoring
- Real-time agent status board
- Team metrics (calls, handle time, CSAT)
- AI scorecard averages
- Unlogged calls tracking
- Rankings (by CCs, by agents)

**Pages**: Calls, Powerdialer, Reports

### Agent (Sarah Chen, John Wilson, Maria Garcia, David Lee)
**Dashboard**: Personal performance tracking
- Personal call quota progress
- Open cases (by priority)
- Daily call stats
- Personal CSAT score
- Unlogged calls

**Pages**: Calls, SMS, Powerdialer, Settings (limited)

---

## SLDS 2 (Cosmos) Design System

### Key Changes from SLDS 1
- **Typography**: Inter font for body text, navigation
- **Colors**: Updated primary blue (`#3A49DA`)
- **Rounded corners**: More prominent (4px-8px)
- **Drop shadows**: Added depth to interactive elements

### Custom CSS Overrides
File: `css/custom.css`

**Do NOT modify** - these styles match Salesforce Winter '25 design specs.

---

## Testing Strategy

### Current Demo Flow
1. **Role Switching**: Click user avatar → Select persona
2. **Date Range Filter**: Test "Today", "This Week", "This Month"
3. **Navigation**: Click tabs, navigate between pages
4. **Demo Controls**: Toggle version banner, integration status
5. **Drilldown**: Click metric cards → Navigate to detail page
6. **Responsive**: Resize browser, test mobile breakpoints

### Post-Integration Testing
1. **API Error Handling**: Disconnect network, verify graceful degradation
2. **Loading States**: Add spinners for async operations
3. **Permission Checks**: Verify role-based access control
4. **Data Refresh**: Test 30-second auto-refresh
5. **Offline Mode**: Test with service worker (if applicable)

---

## Migration Roadmap

### Phase 1: Component Extraction (Week 1-2)
- [ ] Convert `renderAdminDashboard()` → AdminDashboard component
- [ ] Convert `renderSupervisorDashboard()` → SupervisorDashboard component
- [ ] Convert `renderAgentDashboard()` → AgentDashboard component
- [ ] Extract card components (MetricCard, AlertCard, etc.)

### Phase 2: API Integration (Week 3-4)
- [ ] Replace DataService.getCalls() with real API
- [ ] Replace DataService.getMetrics() with real API
- [ ] Add authentication flow
- [ ] Implement error boundaries

### Phase 3: State Management (Week 5)
- [ ] Migrate AppState to Redux/Zustand
- [ ] Add optimistic updates
- [ ] Implement caching strategy

### Phase 4: Polish & Performance (Week 6)
- [ ] Add loading skeletons
- [ ] Optimize chart rendering
- [ ] Add error retry logic
- [ ] Implement infinite scroll for tables

---

## Common Pitfalls to Avoid

### 1. **Don't Break Role-Based Access Control**
```javascript
// GOOD: Check role before rendering
if (RoleManager.getRole() === 'admin') {
    return this.renderAdminDashboard();
}

// BAD: Hardcode checks everywhere
if (currentUser.name === 'Michael Chen') { ... }
```

### 2. **Don't Couple UI to Mock Data Structure**
```javascript
// GOOD: Use data-service abstraction
const calls = DataService.getCalls(role);

// BAD: Access mock data directly
const calls = this.calls.filter(...);
```

### 3. **Don't Ignore Loading States**
```javascript
// GOOD: Show loading spinner
this.setState({ loading: true });
const data = await DataService.getCalls();
this.setState({ loading: false, data });

// BAD: Assume instant data
const data = DataService.getCalls(); // Sync call
```

### 4. **Don't Remove Demo Controls Yet**
Keep demo controls functional until real backend is connected. They're useful for testing different scenarios.

---

## Contact & Questions

**For questions about this prototype, contact**:
- Product: Amit Ayre
- Design: [Designer Name]
- Engineering Lead: [Engineering Lead]

**Documentation maintained by**: Claude Code (2025-11-19)
