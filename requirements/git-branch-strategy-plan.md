# Admin Refactor - Git Branch Strategy Plan

**Date:** November 26, 2025
**Strategy:** Git Branch with Separate GitHub Pages Deployment
**Goal:** Keep north star prototype on `main`, develop admin refactor on separate branch

---

## Overview

**Approach:** Use git branches within the same repository, with both branches deployed to GitHub Pages at different URLs.

### Branch Structure

```
dialpad-salesforce-launchpad (repo)
├── main (branch)                    ← North Star (FROZEN)
│   └── prototype/
│       ├── index.html
│       ├── js/
│       └── ...
│
└── admin-refactor-v2 (branch)       ← Admin V2 (ACTIVE)
    └── prototype/
        ├── index.html
        ├── js/
        └── ... (with admin changes)
```

### Deployment URLs

**Main Branch (North Star):**
- **URL:** https://amitdialpad.github.io/dialpad-salesforce-launchpad/
- **Status:** FROZEN - No changes
- **Source:** `main` branch

**Admin Refactor Branch:**
- **URL:** https://amitdialpad.github.io/dialpad-salesforce-launchpad/admin-refactor/
- **Status:** Active development
- **Source:** `admin-refactor-v2` branch

---

## Benefits of Git Branch Approach

✅ **Single Repository:** Easier to manage, all in one place
✅ **Easy Comparison:** Can diff between branches
✅ **Simple Switching:** `git checkout main` vs `git checkout admin-refactor-v2`
✅ **Shared Resources:** Can cherry-pick fixes from main if needed
✅ **No Duplication:** Same repo, different versions
✅ **Easy Rollback:** Can always switch back to main
✅ **GitHub Actions:** Can deploy both branches automatically

---

## Setup Steps

### Step 1: Check Current Git Status

```bash
cd /Users/amitayre/dialpad-salesforce-launchpad

# Check current branch
git branch

# Check status
git status

# Ensure everything is committed on main
git add .
git commit -m "Checkpoint: North star version before admin refactor branch"
git push origin main
```

**Expected Output:**
```
* main
On branch main
nothing to commit, working tree clean
```

---

### Step 2: Create Admin Refactor Branch

```bash
# Create and switch to new branch
git checkout -b admin-refactor-v2

# Verify you're on new branch
git branch
# Should show: * admin-refactor-v2
```

**What this does:**
- Creates new branch `admin-refactor-v2` from current `main`
- Switches to the new branch
- All files are identical to `main` at this point

---

### Step 3: Create Branch Info Document

Create a file to mark this branch clearly:

```bash
# Create VERSION.md file
cat > VERSION.md << 'EOF'
# Version: Admin Refactor V2

**Branch:** admin-refactor-v2
**Based On:** North Star Prototype (main branch)
**Created:** November 26, 2025
**Status:** Active Development

## What's Different

This branch contains the admin dashboard refactor based on PM feedback.

### Key Changes
- Single-page Admin Launchpad (no sidebar)
- Dialpad System Status panel
- Admin Onboarding Checklist
- Daily Calls chart
- Simplified Quick Actions
- Settings with vertical navigation

## Links

- **This Version (Admin V2):** https://amitdialpad.github.io/dialpad-salesforce-launchpad/admin-refactor/
- **North Star Version:** https://amitdialpad.github.io/dialpad-salesforce-launchpad/
- **Compare Branches:** https://github.com/amitdialpad/dialpad-salesforce-launchpad/compare/main...admin-refactor-v2

## Documents

- PM Feedback: [requirements/admin_feedback_final.md](requirements/admin_feedback_final.md)
- Implementation Plan: [requirements/admin-refactor-implementation-plan.md](requirements/admin-refactor-implementation-plan.md)

## Development

```bash
# Switch to this branch
git checkout admin-refactor-v2

# Run dev server
cd prototype && npm run dev

# Make changes, commit, push
git add .
git commit -m "Your changes"
git push origin admin-refactor-v2
```

## Compare with North Star

```bash
# See what's different
git diff main admin-refactor-v2

# Switch to north star
git checkout main

# Switch back to admin refactor
git checkout admin-refactor-v2
```
EOF

# Commit this marker file
git add VERSION.md
git commit -m "Add VERSION.md to identify admin-refactor-v2 branch"
```

---

### Step 4: Update Prototype README for This Branch

```bash
# Update prototype/README.md to indicate this is the admin v2 branch
cat > prototype/README-ADMIN-V2.md << 'EOF'
# Dialpad for Salesforce - Admin Refactor V2

**Version:** Admin Refactor (November 2025)
**Branch:** admin-refactor-v2
**Live URL:** https://amitdialpad.github.io/dialpad-salesforce-launchpad/admin-refactor/

---

## About This Branch

This branch contains the **refactored Admin dashboard** based on PM and engineering feedback from November 2025.

### Differences from Main Branch

See [VERSION.md](../VERSION.md) in the root directory for complete list of changes.

**Quick Summary:**
- ❌ Removed: Admin sidebar navigation
- ❌ Removed: Separate Analytics/Integration/Users pages
- ✅ Added: Single-page Admin Launchpad
- ✅ Added: System Status panel
- ✅ Added: Onboarding Checklist
- ✅ Added: Daily Calls chart

---

## Development

This branch is actively being developed. See [admin-refactor-implementation-plan.md](../requirements/admin-refactor-implementation-plan.md) for the implementation plan.

---

## Compare with North Star

- **North Star (main):** https://amitdialpad.github.io/dialpad-salesforce-launchpad/
- **Admin V2 (this branch):** https://amitdialpad.github.io/dialpad-salesforce-launchpad/admin-refactor/
- **GitHub Comparison:** https://github.com/amitdialpad/dialpad-salesforce-launchpad/compare/main...admin-refactor-v2

EOF

git add prototype/README-ADMIN-V2.md
git commit -m "Add README for admin-refactor-v2 branch"
```

---

### Step 5: Push Branch to GitHub

```bash
# Push the new branch to GitHub
git push -u origin admin-refactor-v2
```

**Expected Output:**
```
To https://github.com/amitdialpad/dialpad-salesforce-launchpad.git
 * [new branch]      admin-refactor-v2 -> admin-refactor-v2
Branch 'admin-refactor-v2' set up to track remote branch 'admin-refactor-v2' from 'origin'.
```

**Result:** Branch is now on GitHub, visible at:
https://github.com/amitdialpad/dialpad-salesforce-launchpad/tree/admin-refactor-v2

---

### Step 6: Set Up GitHub Pages for Both Branches

GitHub Pages can only deploy from one branch at a time by default, but we can use **GitHub Actions** to deploy both branches to different paths.

#### Option A: Use GitHub Actions (Recommended) ⭐

**Create `.github/workflows/deploy-branches.yml`:**

```bash
# Switch to admin-refactor-v2 branch (if not already there)
git checkout admin-refactor-v2

# Create GitHub Actions workflow directory
mkdir -p .github/workflows

# Create deployment workflow
cat > .github/workflows/deploy-branches.yml << 'EOF'
name: Deploy Both Branches to GitHub Pages

on:
  push:
    branches:
      - main
      - admin-refactor-v2

permissions:
  contents: write
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Fetch all branches

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        working-directory: ./prototype
        run: npm ci

      - name: Build main branch
        run: |
          git checkout main
          cd prototype
          npm run build
          mkdir -p ../dist-main
          mv dist/* ../dist-main/

      - name: Build admin-refactor-v2 branch
        run: |
          git checkout admin-refactor-v2
          cd prototype
          npm run build
          mkdir -p ../dist-admin
          mv dist/* ../dist-admin/

      - name: Prepare deployment directory
        run: |
          mkdir -p deploy
          mv dist-main/* deploy/
          mkdir -p deploy/admin-refactor
          mv dist-admin/* deploy/admin-refactor/

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./deploy
          cname: false
EOF

git add .github/workflows/deploy-branches.yml
git commit -m "Add GitHub Actions workflow to deploy both branches"
git push origin admin-refactor-v2
```

**What this does:**
1. Builds `main` branch → deploys to root (`/`)
2. Builds `admin-refactor-v2` → deploys to `/admin-refactor/`
3. Both are live at same time
4. Auto-deploys when you push to either branch

**Enable GitHub Pages:**
1. Go to repo Settings → Pages
2. Source: "GitHub Actions"
3. Save

**URLs after deployment:**
- Main: `https://amitdialpad.github.io/dialpad-salesforce-launchpad/`
- Admin V2: `https://amitdialpad.github.io/dialpad-salesforce-launchpad/admin-refactor/`

---

#### Option B: Manual Deployment (Simpler, but requires manual steps)

If GitHub Actions is too complex, you can manually build and deploy:

**For Main Branch:**
```bash
git checkout main
cd prototype
npm run build
# Manually upload dist/ to GitHub Pages
```

**For Admin Branch:**
```bash
git checkout admin-refactor-v2
cd prototype
npm run build
# Manually upload dist/ to GitHub Pages under /admin-refactor/
```

---

### Step 7: Update Base Path for Admin Branch

Update `vite.config.ts` on the admin branch to use correct base path:

```bash
# Make sure you're on admin-refactor-v2 branch
git checkout admin-refactor-v2

# Edit vite.config.ts
cat > prototype/vite.config.ts << 'EOF'
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/dialpad-salesforce-launchpad/admin-refactor/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false
      }
    }
  },
  server: {
    port: 8000,
    open: true
  }
});
EOF

git add prototype/vite.config.ts
git commit -m "Update base path for admin-refactor deployment"
git push origin admin-refactor-v2
```

**Note:** Main branch keeps `base: '/dialpad-salesforce-launchpad/'`

---

## Development Workflow

### Working on Admin Refactor

```bash
# 1. Switch to admin branch
git checkout admin-refactor-v2

# 2. Pull latest changes
git pull origin admin-refactor-v2

# 3. Start dev server
cd prototype
npm run dev
# Opens http://localhost:8000

# 4. Make changes to files
# Edit js/app.js, etc.

# 5. Test locally
# Verify changes in browser

# 6. Commit changes
git add .
git commit -m "Phase 1: Remove admin sidebar"

# 7. Push to GitHub
git push origin admin-refactor-v2

# 8. GitHub Actions auto-deploys to:
# https://amitdialpad.github.io/dialpad-salesforce-launchpad/admin-refactor/
```

---

### Switching Between Versions

**View North Star (Main):**
```bash
git checkout main
cd prototype
npm run dev
# Opens http://localhost:8000 (north star version)
```

**View Admin V2:**
```bash
git checkout admin-refactor-v2
cd prototype
npm run dev
# Opens http://localhost:8000 (admin refactor version)
```

**Compare Side-by-Side:**
```bash
# Terminal 1 (North Star)
git checkout main
cd prototype
PORT=8000 npm run dev

# Terminal 2 (Admin V2)
git checkout admin-refactor-v2
cd prototype
PORT=8001 npm run dev

# Now view both:
# http://localhost:8000 - North Star
# http://localhost:8001 - Admin V2
```

---

### Comparing Changes

**See what files changed:**
```bash
git diff main admin-refactor-v2
```

**See specific file changes:**
```bash
git diff main admin-refactor-v2 -- prototype/js/app.js
```

**List changed files:**
```bash
git diff --name-only main admin-refactor-v2
```

**View commits on admin branch not on main:**
```bash
git log main..admin-refactor-v2
```

---

## Branch Protection

### Protect Main Branch (North Star)

To ensure main stays frozen:

1. Go to GitHub repo → Settings → Branches
2. Add rule for `main`
3. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Lock branch (optional - prevents all direct pushes)

**Result:** No one can push directly to main without PR review

---

### Allow Direct Pushes to Admin Branch

Admin refactor branch stays flexible:
- No protection rules
- Direct pushes allowed
- Fast iteration

---

## Merging Strategy (Future)

If admin refactor is approved and should replace north star:

```bash
# 1. Review all changes
git checkout main
git diff main admin-refactor-v2

# 2. Create PR on GitHub
# Go to: https://github.com/amitdialpad/dialpad-salesforce-launchpad/compare/main...admin-refactor-v2

# 3. Review, approve, merge
# Click "Create Pull Request"
# Review changes
# Merge to main

# 4. Delete admin branch (optional)
git branch -d admin-refactor-v2
git push origin --delete admin-refactor-v2
```

**Alternative:** Keep both branches permanently
- Main = current production version
- Admin-refactor-v2 = next version
- Create new branches for future features

---

## Directory Structure (Same for Both Branches)

```
dialpad-salesforce-launchpad/
├── .github/
│   └── workflows/
│       └── deploy-branches.yml    # Deploys both branches
├── prototype/
│   ├── js/
│   ├── css/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts            # Different base path per branch
├── requirements/
│   ├── admin_feedback_final.md
│   ├── admin-refactor-implementation-plan.md
│   └── git-branch-strategy-plan.md
├── research/
├── VERSION.md                     # Only on admin-refactor-v2 branch
└── README.md
```

---

## Sharing with Developers

### Email Template

```
Subject: Admin Dashboard Refactor - New Branch Available

Hi Team,

I've created a new git branch with the admin dashboard refactor based on
PM feedback. Both versions are now live for comparison.

🔗 Admin Refactor V2 (New):
https://amitdialpad.github.io/dialpad-salesforce-launchpad/admin-refactor/
Branch: admin-refactor-v2

🔗 North Star Version (Original):
https://amitdialpad.github.io/dialpad-salesforce-launchpad/
Branch: main

📊 Compare Changes:
https://github.com/amitdialpad/dialpad-salesforce-launchpad/compare/main...admin-refactor-v2

📄 Documents (on admin branch):
- PM Feedback: requirements/admin_feedback_final.md
- Implementation Plan: requirements/admin-refactor-implementation-plan.md
- Branch Strategy: requirements/git-branch-strategy-plan.md

Key Changes:
✅ Single-page Admin dashboard (no sidebar)
✅ Simplified system status panel
✅ Admin onboarding checklist
✅ Daily calls chart
✅ Streamlined quick actions

Please review the admin-refactor-v2 branch and provide feedback.
The main branch (north star) remains unchanged for reference.

Thanks,
[Your Name]
```

---

## Comparison Table

| Aspect | Main Branch (North Star) | Admin-Refactor-V2 Branch |
|--------|--------------------------|--------------------------|
| **URL** | amitdialpad.github.io/dialpad-salesforce-launchpad/ | amitdialpad.github.io/dialpad-salesforce-launchpad/admin-refactor/ |
| **Branch** | `main` | `admin-refactor-v2` |
| **Status** | FROZEN | Active Development |
| **Protection** | Protected (no direct push) | Unprotected (fast iteration) |
| **Admin Layout** | Sidebar + Multiple Pages | Single Page |
| **Purpose** | Production-ready demo | PM feedback implementation |
| **Base Path** | `/dialpad-salesforce-launchpad/` | `/dialpad-salesforce-launchpad/admin-refactor/` |

---

## Benefits Summary

✅ **Single Repo:** All in one place, easier to manage
✅ **Easy Comparison:** `git diff` to see changes
✅ **Fast Switching:** One command to switch versions
✅ **Shared Fixes:** Can cherry-pick fixes between branches
✅ **GitHub Actions:** Auto-deploy both branches
✅ **Clear Separation:** Different URLs for each version
✅ **Protected Main:** North star can't be accidentally modified
✅ **Easy Rollback:** `git checkout main` anytime

---

## Potential Issues & Solutions

### Issue 1: Both Branches Update Main URL

**Problem:** Only one branch can deploy to root URL

**Solution:** Use GitHub Actions to deploy:
- Main → `/` (root)
- Admin → `/admin-refactor/` (subfolder)

---

### Issue 2: Vite Base Path Conflicts

**Problem:** Both branches need different `base` in vite.config.ts

**Solution:** Each branch has its own vite.config.ts:
- Main branch: `base: '/dialpad-salesforce-launchpad/'`
- Admin branch: `base: '/dialpad-salesforce-launchpad/admin-refactor/'`

---

### Issue 3: Accidentally Pushing to Main

**Problem:** Developer pushes changes to main by mistake

**Solution:**
1. Enable branch protection on main
2. Always check branch before committing: `git branch`
3. Use git hooks to prevent direct push to main

---

### Issue 4: Merge Conflicts Later

**Problem:** If main and admin diverge too much, merging is hard

**Solution:**
1. Keep changes focused on admin dashboard only
2. Don't modify shared components unnecessarily
3. Regularly rebase admin branch on main (optional)

---

## Next Steps

### Immediate Actions (30 minutes)

1. ✅ Review this plan
2. ⬜ Commit all current changes to main
3. ⬜ Create `admin-refactor-v2` branch
4. ⬜ Add VERSION.md and README files
5. ⬜ Push branch to GitHub
6. ⬜ Set up GitHub Actions workflow (or manual deployment)
7. ⬜ Verify both URLs are accessible
8. ⬜ Share links with team

### Development Phase (4 days)

1. ⬜ Switch to admin-refactor-v2 branch
2. ⬜ Begin Phase 1: Remove & Restructure
3. ⬜ Commit and push changes regularly
4. ⬜ Test on live URL after each push
5. ⬜ Continue through all phases

---

## Quick Reference Commands

```bash
# Current branch
git branch

# Switch to north star
git checkout main

# Switch to admin refactor
git checkout admin-refactor-v2

# Create admin branch (first time only)
git checkout -b admin-refactor-v2

# See what changed
git diff main admin-refactor-v2

# Commit changes
git add .
git commit -m "Your message"
git push origin admin-refactor-v2

# Compare on GitHub
# https://github.com/amitdialpad/dialpad-salesforce-launchpad/compare/main...admin-refactor-v2
```

---

**Status:** Ready for implementation
**Estimated Setup Time:** 30 minutes
**Next Action:** Commit main, create admin-refactor-v2 branch
