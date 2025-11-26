# Version: Admin Refactor V2

**Branch:** admin-refactor-v2
**Based On:** North Star Prototype (main branch)
**Created:** November 26, 2025
**Status:** Active Development

---

## About This Branch

This branch contains the **admin dashboard refactor** based on PM and engineering feedback from November 2025.

The goal is to simplify the Admin experience into a single-page launchpad focused on:
- System health and status
- User management
- Setup progress
- Product updates

---

## What's Different from Main Branch

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
- ✅ Package Update consent modal
- ✅ Simplified Quick Actions (4 items)

### Changed
- 🔄 Calls page: Removed SMS direction filter
- 🔄 Voicemail: Merged into Calls as "Recorded Calls" sub-tab
- 🔄 Reports: Added note about Salesforce folder approach
- 🔄 Settings: Added vertical navigation (6 tabs)

---

## Live URLs

- **This Version (Admin V2):** https://amitdialpad.github.io/dialpad-salesforce-launchpad/admin-refactor/
- **North Star Version:** https://amitdialpad.github.io/dialpad-salesforce-launchpad/

---

## Documentation

- **PM Feedback:** [requirements/admin_feedback_final.md](requirements/admin_feedback_final.md)
- **Implementation Plan:** [requirements/admin-refactor-implementation-plan.md](requirements/admin-refactor-implementation-plan.md)
- **Branch Strategy:** [requirements/git-branch-strategy-plan.md](requirements/git-branch-strategy-plan.md)

---

## Development

### Switch to This Branch
```bash
git checkout admin-refactor-v2
```

### Run Dev Server
```bash
cd prototype
npm run dev
# Opens http://localhost:8000
```

### Make Changes
```bash
# Edit files in prototype/js/, prototype/css/, etc.
git add .
git commit -m "Your changes"
git push origin admin-refactor-v2
```

---

## Compare with North Star

### View Differences
```bash
git diff main admin-refactor-v2
```

### Compare Specific File
```bash
git diff main admin-refactor-v2 -- prototype/js/app.js
```

### List Changed Files
```bash
git diff --name-only main admin-refactor-v2
```

### Compare on GitHub
https://github.com/amitdialpad/dialpad-salesforce-launchpad/compare/main...admin-refactor-v2

---

## Implementation Status

**Phase 1: Remove & Restructure** (3-4 hours)
- [ ] Remove admin sidebar navigation
- [ ] Delete unused render functions
- [ ] Create single-page layout

**Phase 2: Add New Components** (6-8 hours)
- [ ] System Status panel
- [ ] Onboarding Checklist
- [ ] Daily Calls chart
- [ ] User & License panel
- [ ] Product Updates panel
- [ ] Package Update modal
- [ ] Update Quick Actions

**Phase 3: Modify Existing** (3-4 hours)
- [ ] Modify Calls filters
- [ ] Merge Voicemail into Calls
- [ ] Update Reports page
- [ ] Refactor Settings page

---

**Total Estimated Time:** 12-16 hours (4 days)
**Current Phase:** Setup Complete, Ready for Phase 1
