# Admin Refactor V2 - Separate Repository Setup Plan

**Date:** November 26, 2025
**Strategy:** Separate GitHub Repository
**Goal:** Create independent admin refactor version without touching north star prototype

---

## Repository Structure Plan

### Current Repository (Keep Untouched)
**Repo:** `dialpad-salesforce-launchpad`
**URL:** https://amitdialpad.github.io/dialpad-salesforce-launchpad/
**Status:** **FROZEN - No changes**
**Purpose:** North star prototype, production-ready demo

### New Repository (Admin Refactor)
**Repo:** `dialpad-salesforce-launchpad-admin-v2`
**URL:** https://amitdialpad.github.io/dialpad-salesforce-launchpad-admin-v2/
**Status:** Active development
**Purpose:** Admin dashboard refactor per PM feedback

---

## Setup Steps

### Step 1: Create New Repository on GitHub

**Manual Steps:**
1. Go to https://github.com/amitdialpad
2. Click "New Repository"
3. Repository name: `dialpad-salesforce-launchpad-admin-v2`
4. Description: "Dialpad Salesforce Admin Dashboard - Refactored Version (Nov 2025)"
5. Public repository
6. **Do NOT initialize with README** (we'll copy from existing)
7. Click "Create repository"

**Result:** Empty repo ready at `https://github.com/amitdialpad/dialpad-salesforce-launchpad-admin-v2`

---

### Step 2: Copy Current Prototype to New Location

**Commands:**
```bash
# Navigate to parent directory
cd /Users/amitayre

# Create new directory for admin v2
mkdir dialpad-salesforce-launchpad-admin-v2

# Copy prototype folder contents
cp -r dialpad-salesforce-launchpad/prototype/* dialpad-salesforce-launchpad-admin-v2/

# Copy relevant docs
cp dialpad-salesforce-launchpad/requirements/admin_feedback_final.md dialpad-salesforce-launchpad-admin-v2/
cp dialpad-salesforce-launchpad/requirements/admin-refactor-implementation-plan.md dialpad-salesforce-launchpad-admin-v2/

# Navigate to new directory
cd dialpad-salesforce-launchpad-admin-v2
```

**Result:** Complete copy of prototype ready for modifications

---

### Step 3: Update README for New Repo

**Create new README.md:**
```markdown
# Dialpad for Salesforce - Admin Dashboard V2

**Version:** Admin Refactor (November 2025)
**Based on:** PM Feedback Session
**Status:** In Development

---

## About This Version

This is a **refactored version** of the Admin dashboard based on PM and engineering feedback. This version focuses on simplifying the Admin experience into a single-page launchpad.

### What's Different from North Star Version

**Removed:**
- Admin sidebar navigation
- Separate Analytics page
- Separate Integration Health page
- Separate Users page
- Heavy analytics components

**Added:**
- Single-page Admin Launchpad
- Dialpad System Status panel
- Admin Onboarding Checklist
- Daily Calls chart
- User & License summary
- Package Update consent modal
- Simplified Quick Actions

**Changed:**
- Settings page with vertical navigation
- Calls page filters (removed SMS direction)
- Voicemail merged into Calls
- Reports page with Salesforce folder note

---

## Links

- **This Version (Admin V2):** https://amitdialpad.github.io/dialpad-salesforce-launchpad-admin-v2/
- **North Star Version:** https://amitdialpad.github.io/dialpad-salesforce-launchpad/
- **PM Feedback Document:** [admin_feedback_final.md](admin_feedback_final.md)
- **Implementation Plan:** [admin-refactor-implementation-plan.md](admin-refactor-implementation-plan.md)

---

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:8001 in your browser
# (Note: Using port 8001 to avoid conflict with main prototype)
\`\`\`

---

## Development Status

**Current Phase:** Planning Complete
**Next Phase:** Phase 1 - Remove & Restructure
**Estimated Completion:** 4 days (16 hours)

See [admin-refactor-implementation-plan.md](admin-refactor-implementation-plan.md) for detailed plan.

---

## Feedback & Questions

This version is being developed based on feedback from:
- PM team
- Engineering team
- Admin user interviews

For questions or feedback, contact: [Your Email]

---

## Copyright

Copyright © 2024-2025 Dialpad. All rights reserved.
```

---

### Step 4: Update package.json (Use Different Port)

**Modify `package.json`:**
```json
{
  "name": "dialpad-salesforce-launchpad-admin-v2",
  "version": "2.0.0",
  "description": "Dialpad Salesforce Admin Dashboard - Refactored Version",
  "scripts": {
    "dev": "vite --port 8001",
    "build": "vite build",
    "preview": "vite preview --port 8001"
  }
}
```

**Why different port:** So you can run both versions simultaneously for comparison

---

### Step 5: Initialize Git and Push

**Commands:**
```bash
# Initialize git
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Admin V2 starting point (copied from north star prototype)

- Copied complete prototype structure
- Added PM feedback documents
- Added implementation plan
- Updated README for admin refactor version
- Changed dev port to 8001

This is the starting point BEFORE any refactor changes.
North star version remains at: github.com/amitdialpad/dialpad-salesforce-launchpad"

# Add remote
git remote add origin https://github.com/amitdialpad/dialpad-salesforce-launchpad-admin-v2.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Result:** New repo initialized with clean starting point

---

### Step 6: Set Up GitHub Pages

**Manual Steps:**
1. Go to repo Settings
2. Navigate to "Pages" section
3. Source: Deploy from a branch
4. Branch: `main`
5. Folder: `/ (root)`
6. Click "Save"
7. Wait 2-3 minutes for deployment

**Result:** Live at `https://amitdialpad.github.io/dialpad-salesforce-launchpad-admin-v2/`

---

### Step 7: Update Deployment Configuration

**Update `vite.config.ts`:**
```typescript
export default defineConfig({
  base: '/dialpad-salesforce-launchpad-admin-v2/',
  // ... rest of config
});
```

**Why:** GitHub Pages serves from subdirectory, not root

**Rebuild and push:**
```bash
npm run build
git add .
git commit -m "Configure for GitHub Pages deployment"
git push
```

---

### Step 8: Add Badge to Both READMEs

**Add to North Star README:**
```markdown
## Other Versions

- **Admin Refactor V2:** [View Admin V2](https://amitdialpad.github.io/dialpad-salesforce-launchpad-admin-v2/) | [Repo](https://github.com/amitdialpad/dialpad-salesforce-launchpad-admin-v2)
```

**Add to Admin V2 README:**
```markdown
## Other Versions

- **North Star Prototype:** [View North Star](https://amitdialpad.github.io/dialpad-salesforce-launchpad/) | [Repo](https://github.com/amitdialpad/dialpad-salesforce-launchpad)
```

---

## Directory Structure After Setup

```
/Users/amitayre/
├── dialpad-salesforce-launchpad/          # ORIGINAL - UNTOUCHED
│   ├── prototype/
│   ├── requirements/
│   ├── research/
│   └── README.md
│
└── dialpad-salesforce-launchpad-admin-v2/  # NEW - FOR REFACTOR
    ├── js/
    ├── css/
    ├── public/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── admin_feedback_final.md
    ├── admin-refactor-implementation-plan.md
    └── README.md
```

---

## Development Workflow

### Working on Admin V2

```bash
# Navigate to admin v2
cd ~/dialpad-salesforce-launchpad-admin-v2

# Start dev server (port 8001)
npm run dev

# Make changes
# ...

# Commit changes
git add .
git commit -m "Phase 1: Remove admin sidebar"
git push

# GitHub Pages auto-deploys
```

### Viewing Both Versions

**Terminal 1 (North Star):**
```bash
cd ~/dialpad-salesforce-launchpad/prototype
npm run dev
# Runs on http://localhost:8000
```

**Terminal 2 (Admin V2):**
```bash
cd ~/dialpad-salesforce-launchpad-admin-v2
npm run dev
# Runs on http://localhost:8001
```

**Compare side-by-side in browser**

---

## Git Branch Strategy (Within Admin V2 Repo)

### Main Branch
- Always deployable
- Protected
- Only merge from feature branches

### Feature Branches
```bash
# Phase 1
git checkout -b feature/remove-sidebar
# ... make changes ...
git commit -m "Remove admin sidebar navigation"
git push origin feature/remove-sidebar

# Phase 2
git checkout -b feature/add-status-panel
# ... make changes ...
git commit -m "Add Dialpad system status panel"
git push origin feature/add-status-panel

# Etc.
```

### Merge Strategy
- Create PR for each phase
- Review before merging to main
- Main branch auto-deploys to GitHub Pages

---

## Sharing with Developers

### Email Template

```
Subject: Admin Dashboard Refactor - New Prototype Available

Hi Team,

I've created a new version of the Dialpad Salesforce prototype based on
the PM feedback from our last meeting. This version focuses on simplifying
the Admin dashboard.

🔗 Admin Refactor V2 (New):
https://amitdialpad.github.io/dialpad-salesforce-launchpad-admin-v2/

🔗 North Star Version (Original):
https://amitdialpad.github.io/dialpad-salesforce-launchpad/

📄 PM Feedback Document:
https://github.com/amitdialpad/dialpad-salesforce-launchpad-admin-v2/blob/main/admin_feedback_final.md

📋 Implementation Plan:
https://github.com/amitdialpad/dialpad-salesforce-launchpad-admin-v2/blob/main/admin-refactor-implementation-plan.md

Key Changes:
✅ Single-page Admin dashboard (no sidebar)
✅ Simplified system status panel
✅ Admin onboarding checklist
✅ Daily calls chart
✅ Streamlined quick actions

Please review and provide feedback. The north star version remains
available for reference and comparison.

Thanks,
[Your Name]
```

---

## Comparison Table

| Aspect | North Star Version | Admin V2 Version |
|--------|-------------------|------------------|
| **URL** | amitdialpad.github.io/dialpad-salesforce-launchpad/ | amitdialpad.github.io/dialpad-salesforce-launchpad-admin-v2/ |
| **Repo** | dialpad-salesforce-launchpad | dialpad-salesforce-launchpad-admin-v2 |
| **Port** | 8000 | 8001 |
| **Status** | Frozen / Reference | Active Development |
| **Admin Layout** | Sidebar + Multiple Pages | Single Page |
| **Purpose** | Demo full vision | Show simplified admin per PM feedback |

---

## Benefits of This Approach

✅ **Safety:** North star prototype completely untouched
✅ **Clarity:** Developers see two distinct versions
✅ **Comparison:** Easy to view side-by-side
✅ **Independence:** Each version can evolve separately
✅ **Rollback:** Can always reference original
✅ **Clean History:** Each repo has clear purpose
✅ **Different Teams:** Can assign different reviewers
✅ **Version Control:** Clear versioning strategy

---

## Next Steps

1. ✅ Review this plan
2. ⬜ Create new GitHub repository
3. ⬜ Copy prototype to new location
4. ⬜ Initialize git and push
5. ⬜ Set up GitHub Pages
6. ⬜ Verify both versions are accessible
7. ⬜ Share links with team
8. ⬜ Begin Phase 1 implementation

---

## Rollback Plan

If we need to abandon Admin V2:
1. Keep north star version (unchanged)
2. Archive admin-v2 repo
3. No impact on main prototype

---

**Status:** Ready for approval
**Next Action:** Create GitHub repository
**Estimated Setup Time:** 30 minutes
