# Dialpad for Salesforce - Launchpad

## Overview

A production-ready prototype of the Dialpad for Salesforce integration built with TypeScript, Vite, and Salesforce Lightning Design System (SLDS). Features role-based dashboards, comprehensive call management, and a modern development architecture.

**Live Demo:** https://amitdialpad.github.io/dialpad-salesforce-launchpad/

## Key Features

### Role-Based Access Control
- **3 User Roles**: Admin, Supervisor, Agent
- **Dynamic Navigation**: 14 tabs for Admin, 13 for Supervisor, 10 for Agent
- **Role-Specific Dashboards**: Customized metrics and data views per role

### Core Functionality
- **Call Management**: View, filter, and manage calls with role-based access
- **SMS Integration**: Message history and management
- **Powerdialer**: List management and calling campaigns
- **Analytics Dashboard**: Real-time metrics and team performance
- **Voicemail & Recordings**: Access to call recordings and voicemail
- **Salesforce Integration**: Contacts, Accounts, Leads, Opportunities views
- **Team Management**: Supervisor tools for monitoring and coaching
- **Settings & Configuration**: Admin controls for system setup

### Production-Ready Architecture
- **TypeScript**: Full type safety and better developer experience
- **Vite**: Lightning-fast hot module replacement and optimized builds
- **Modular Design**: Clean separation of concerns with organized file structure
- **State Management**: Centralized store pattern for predictable state updates
- **Error Handling**: Comprehensive logging and error tracking infrastructure
- **Code Quality**: ESLint + Prettier for consistent, maintainable code

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:8000 in your browser
```

### Available Commands

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues automatically
npm run format       # Format code with Prettier
npm run type-check   # Validate TypeScript types
```

## Architecture

### Hybrid Architecture (Transitional)

The application currently runs in a hybrid mode during migration:

- **Legacy JavaScript** (`js/app.js`, etc.): Handles UI rendering and user interactions
- **New TypeScript** (`src/`): Provides infrastructure (state management, logging, services)

This approach ensures:
- ✅ Zero functionality loss during migration
- ✅ Production-ready TypeScript foundation
- ✅ Gradual component migration path
- ✅ Hot module replacement during development

### Project Structure

```
prototype/
├── src/                        # TypeScript source (new architecture)
│   ├── components/             # Reusable UI components
│   │   ├── Dashboard/          # Dashboard widgets
│   │   ├── Navigation/         # Navigation components
│   │   ├── Modals/             # Modal dialogs
│   │   └── shared/             # Shared components
│   ├── pages/                  # Page-level components
│   │   ├── HomePage/           # Dashboard views
│   │   ├── CallsPage/          # Call management
│   │   ├── SMSPage/            # SMS management
│   │   ├── PowerdialerPage/    # Powerdialer interface
│   │   └── SettingsPage/       # Configuration
│   ├── services/               # Business logic
│   │   ├── dataService.ts      # Data fetching (mock → API ready)
│   │   └── roleService.ts      # Role management
│   ├── state/                  # State management
│   │   └── store.ts            # Centralized state store
│   ├── utils/                  # Utility functions
│   │   ├── constants.ts        # Application constants
│   │   ├── formatting.ts       # Data formatting utilities
│   │   └── logger.ts           # Logging infrastructure
│   ├── types/                  # TypeScript type definitions
│   │   └── models.d.ts         # Data models
│   ├── styles/                 # Application styles
│   │   └── main.css            # Main stylesheet
│   └── main.ts                 # Application entry point
├── js/                         # Legacy JavaScript (transitional)
│   ├── app.js                  # Main app logic
│   ├── app-state.js            # Application state
│   ├── charts.js               # Chart rendering
│   ├── data-service.js         # Data service
│   └── role-manager.js         # Role management
├── css/
│   └── custom.css              # SLDS customizations
├── data/                       # Mock data (JSON files)
├── index.html                  # Application shell
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
├── .eslintrc.json              # ESLint rules
└── .prettierrc                 # Prettier formatting

```

## Role-Specific Features

### Admin Dashboard (14 Tabs)
**Visible Tabs:** Home, Calls, SMS, Powerdialer, Reports, Voicemail, Recordings, Contacts, Accounts, Leads, Opportunities, Analytics, Team, Settings

**Features:**
- Company-wide metrics and KPIs
- User management and status monitoring
- Integration health monitoring
- Product announcements and version updates
- System configuration and settings
- Full access to all features

**Dashboard Metrics:**
- Total Calls Today
- Active Users
- Connected Users
- Missed Calls
- Average Talk Time
- SMS Sent Today
- Powerdialer Lists Active
- Average Handle Time

### Supervisor Dashboard (13 Tabs)
**Visible Tabs:** Home, Calls, SMS, Powerdialer, Reports, Voicemail, Recordings, Contacts, Accounts, Leads, Opportunities, Analytics, Team

**Features:**
- Team performance metrics
- Agent monitoring and coaching
- Real-time call supervision
- Team analytics and reporting
- Powerdialer campaign management

**Dashboard Metrics:**
- Team Calls Today
- Average Call Duration
- Missed Calls
- Team Size
- Team Performance indicators
- At-risk agent alerts

### Agent Dashboard (10 Tabs)
**Visible Tabs:** Home, Calls, SMS, Powerdialer, Reports, Voicemail, Recordings, Contacts, Accounts, Leads, Opportunities

**Features:**
- Personal call metrics
- Call history and recordings
- SMS conversations
- Assigned Powerdialer lists
- Quick actions and shortcuts
- Performance tips

**Dashboard Metrics:**
- Calls Today
- Average Call Duration
- Total Talk Time
- Completed Calls
- Personal performance indicators

## Technical Details

### Tech Stack

**Core:**
- TypeScript 5.9+
- Vite 7.2+ (build tool)
- Salesforce Lightning Design System 2.28.0
- Chart.js 4.4.0 (data visualization)

**Development:**
- ESLint (code quality)
- Prettier (code formatting)
- Terser (minification)

**Architecture:**
- Modular TypeScript design
- Centralized state management
- Service-oriented architecture
- Component-based UI (migration in progress)

### Build Performance

**Production Build:**
- HTML: 17.5 KB (2.53 KB gzipped)
- CSS: 5.24 KB (1.58 KB gzipped)
- JS: 7.19 KB (2.75 KB gzipped)
- **Total: ~7 KB gzipped**
- Build time: ~320ms

**Features:**
- Tree shaking
- Code splitting
- Minification
- Source maps
- Hot module replacement

## Design System

### SLDS 2 Cosmos Theme

The application uses SLDS 2.28.0 with Cosmos theme inspiration:

**Visual Enhancements:**
- Rounded corners (4-6px border radius)
- Vibrant primary color: `#3A49DA`
- Drop shadows for depth
- Smooth hover animations
- Modern, accessible design

## Demo Controls

Use the "Demo Controls" panel (top-right) to:
- Switch between roles (Admin, Supervisor, Agent)
- Trigger onboarding wizard
- Show/hide version banners
- Simulate integration states
- Adjust agent quotas
- Control environment settings

## Mock Data

### Users (5 users)
- Mix of Admin, Supervisor, and Agent roles
- Various agent states (On Call, Available, Wrap-Up, Break, Offline)
- Realistic call metrics and performance data

### Calls
- Sample call history with timestamps
- Inbound/Outbound directions
- Various call dispositions
- Duration and status information

### Features
- Auto-refresh: Dashboard updates every 30 seconds
- Notifications: System alerts and updates
- Smooth transitions: No page flashes during updates

## Development Workflow

### Making Changes

1. **Start dev server**: `npm run dev`
2. **Make changes**: Edit TypeScript files in `src/`
3. **Hot reload**: Changes appear instantly in browser
4. **Check types**: `npm run type-check`
5. **Lint code**: `npm run lint:fix`
6. **Format code**: `npm run format`

### Code Quality

The project enforces quality standards:
- TypeScript strict mode enabled
- ESLint checks for common issues
- Prettier ensures consistent formatting
- No unused variables or imports allowed
- Type safety throughout

## Migration Path

The application is in transition from vanilla JavaScript to TypeScript:

**Phase 1: Foundation** ✅ (Complete)
- TypeScript + Vite setup
- Modular project structure
- State management
- Error handling & logging
- Code quality tools

**Phase 2: Component Migration** (Next)
- Migrate UI components to TypeScript
- Implement component library
- Add comprehensive tests
- Setup CI/CD pipeline

**Phase 3: API Integration** (Future)
- Replace mock data with real APIs
- Implement authentication
- Add caching layer
- WebSocket for real-time updates

## Deployment

### GitHub Pages
The prototype is automatically deployed to GitHub Pages:
https://amitdialpad.github.io/dialpad-salesforce-launchpad/

### Production Build

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# Deploy dist/ folder to your hosting service
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern browsers with ES2020 support

## Troubleshooting

### Port 8000 already in use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill

# Or use a different port
npm run dev -- --port 3000
```

### TypeScript errors
```bash
# Check for type errors
npm run type-check

# Rebuild node_modules if needed
rm -rf node_modules package-lock.json
npm install
```

### Build failures
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Future Enhancements

### Planned Features
- Comprehensive test coverage (Jest + Playwright)
- CI/CD pipeline (GitHub Actions)
- Real API integration
- Component documentation (Storybook)
- Performance monitoring
- Error tracking (Sentry)

### Salesforce Integration
- Lightning Web Components (LWC) version
- Salesforce API integration
- OAuth authentication
- Platform Events for real-time updates
- Custom metadata for configuration

## Contributing

This is an internal prototype. For questions or suggestions, contact the Dialpad Salesforce integration team.

## Resources

- [Salesforce Lightning Design System](https://www.lightningdesignsystem.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Dialpad API Documentation](https://developers.dialpad.com/)

## License

Copyright © 2024 Dialpad. All rights reserved.
