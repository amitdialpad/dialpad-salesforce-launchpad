# Dialpad for Salesforce - Launchpad Prototype

**Multi-Persona Dashboard Experience for Salesforce Integration**

> **Status**: ✅ Demo-Ready | 🔧 Prototype Phase | 📚 Fully Documented

---

## 🚀 Live Demo

**[View Live Demo →](https://amitdialpad.github.io/dialpad-salesforce-launchpad/prototype/)**

---

## Quick Start (Local Development)

```bash
cd prototype
npm install
npm run dev
```

Open [http://localhost:8000](http://localhost:8000)

**Default Persona**: Admin (Michael Chen)

---

## What This Is

A fully functional **HTML/JavaScript prototype** demonstrating the Dialpad Launchpad experience for Salesforce with three distinct personas:

- **Admin** - System-wide mission control (Michael Chen)
- **Supervisor** - Team performance monitoring (Sarah Johnson)
- **Agent** - Personal performance tracking (Sarah Chen, John Wilson, Maria Garcia, David Lee)

**Built with**: Vanilla JavaScript, SLDS 2 (Cosmos - Winter '25), Chart.js, Mock Data

---

## Key Features

### ✅ Multi-Persona Dashboards
- **Admin Dashboard** - 5 sections (Overview, Analytics, Users, Integration, Updates)
- **Supervisor Dashboard** - Team monitoring with 6-row "Bento Box" layout
- **Agent Dashboard** - Personal performance & open cases

### ✅ P0 Competitive Features
1. **Date Range Filtering** - Global filter (Today, This Week, This Month, Last 30 Days)
2. **Agent Status Board** - Real-time team status with color-coded badges
3. **CRM Integration** - Open Salesforce cases display
4. **Drilldown Navigation** - Click metrics → filtered detail pages

### ✅ Demo Controls (Admin Tools)
- Role switcher (persona selection)
- Integration Health toggle (connected/disconnected)
- Package Version banner toggle
- Environment switcher (production/sandbox)
- Keyboard shortcut: `Ctrl+Shift+D` to toggle demo panel

---

## Documentation

### 📖 For Developers
1. **[ARCHITECTURE.md](prototype/ARCHITECTURE.md)** - Complete developer guide (500+ lines)
   - File structure & module breakdown
   - API integration roadmap
   - Backend migration examples
   - 6-week production roadmap

2. **[REFACTORING-SUMMARY.md](prototype/REFACTORING-SUMMARY.md)** - Recent changes (350+ lines)
   - What changed, what didn't
   - Testing checklist
   - Risk assessment

3. **[CHANGELOG.md](prototype/CHANGELOG.md)** - Development history
   - Session-by-session breakdown
   - Complete feature list
   - Technical decisions

4. **[prototype/README.md](prototype/README.md)** - Full prototype documentation

---

## Project Structure

```
dialpad-salesforce-launchpad/
├── prototype/                      # Main prototype application
│   ├── index.html                  # Navigation shell
│   ├── css/
│   │   └── custom.css              # SLDS 2 overrides
│   ├── js/
│   │   ├── app.js                  # Main controller (6,626 lines)
│   │   ├── data-service.js         # Mock data provider
│   │   ├── app-state.js            # State management
│   │   ├── ui-helpers.js           # Reusable utilities
│   │   ├── charts.js               # Chart wrappers
│   │   └── role-manager.js         # Persona switching
│   ├── data/                       # Mock JSON data
│   └── docs/                       # Documentation
└── README.md                       # This file
```

---

## For Backend Developers

### 🚀 Integration Quick Start

1. **Read This First**: [prototype/ARCHITECTURE.md](prototype/ARCHITECTURE.md) (30 min)
2. **API Endpoints Needed**: See ARCHITECTURE.md for complete list
3. **Migration Path**: Replace `data-service.js` methods one-by-one
4. **Reusable Code**: Use `ui-helpers.js` functions in your components

**Estimated Timeline**: 6-8 weeks to production-ready

See [ARCHITECTURE.md](prototype/ARCHITECTURE.md) → "Migration Roadmap" for detailed breakdown

---

## Design System

**SLDS 2 (Cosmos) - Winter '25 Specifications**

- **Typography**: Inter font for body & navigation
- **Primary Color**: `#3A49DA` (updated blue)
- **Border Radius**: 4px-8px (more rounded)
- **Shadows**: Depth on interactive elements

All overrides in `prototype/css/custom.css`

---

## Role-Based Access

| Feature | Admin | Supervisor | Agent |
|---------|-------|------------|-------|
| Home Dashboard | ✅ System-wide | ✅ Team metrics | ✅ Personal metrics |
| Calls Page | ✅ All calls | ✅ Team calls | ✅ My calls |
| SMS Page | ✅ | ✅ | ✅ |
| Powerdialer | ✅ | ✅ | ✅ |
| Settings | ✅ Full access | ❌ | ⚠️ Limited |
| Reports | ✅ | ✅ | ⚠️ Limited |
| Admin Tools | ✅ | ❌ | ❌ |

---

## Browser Support

### Tested
- ✅ Chrome (latest)
- ✅ Safari (latest)
- ⚠️ Firefox (not fully tested)
- ⚠️ Edge (not fully tested)

### Mobile
- ⚠️ Responsive CSS applied but not tested on devices
- Recommend testing on iPad before demo

---

## Known Technical Debt

- ⚠️ **app.js is monolithic** (6,626 lines) - Intentionally preserved for demo safety
- ⚠️ **No component boundaries** - Will extract after backend integration
- ⚠️ **Mock data only** - Real API integration needed
- ⚠️ **No tests** - Prototype phase

**See [ARCHITECTURE.md](prototype/ARCHITECTURE.md) → "Known Limitations" for full list**

---

## FAQ

### Q: Is this production-ready?
**A**: No, this is a prototype. Needs API integration, auth, error handling, tests, etc. See [ARCHITECTURE.md](prototype/ARCHITECTURE.md) → "Known Limitations"

### Q: Can I use this in a Salesforce org?
**A**: Not directly. Needs conversion to Lightning Web Components (LWC) or Visualforce. See [ARCHITECTURE.md](prototype/ARCHITECTURE.md) → "Migration Roadmap"

### Q: How long to make production-ready?
**A**: ~6-8 weeks with proper backend integration. See [ARCHITECTURE.md](prototype/ARCHITECTURE.md) → "Migration Roadmap"

---

## License

Internal Dialpad prototype. Not for external distribution.

---

## Version

**Prototype Version**: 1.0.0
**SLDS Version**: 2.28.1 (Winter '25)
**Last Updated**: 2025-11-19
**Status**: Demo-Ready, Documentation Complete

---

**Built with ❤️ using Salesforce Lightning Design System**
