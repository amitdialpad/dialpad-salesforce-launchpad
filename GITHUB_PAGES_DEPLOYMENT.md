# GitHub Pages Deployment - Setup & Troubleshooting Guide

**Last Updated:** November 27, 2025
**Status:** ✅ Working
**Context:** Dual deployment of main (north star) and admin-refactor-v2 branches

---

## 🎯 Deployment Structure

We deploy **two versions** of the prototype simultaneously:

| Version | Branch | Deployed To | URL |
|---------|--------|-------------|-----|
| **North Star** | `main` | Root (`/`) | https://amitdialpad.github.io/dialpad-salesforce-launchpad/ |
| **Admin V2** | `admin-refactor-v2` | `/admin-refactor/` | https://amitdialpad.github.io/dialpad-salesforce-launchpad/admin-refactor/ |

---

## 📁 File Structure

### Repository Structure
```
dialpad-salesforce-launchpad/
├── .github/
│   └── workflows/
│       └── deploy-both-branches.yml    # GitHub Actions workflow
├── prototype/
│   ├── index.html                       # Main HTML (with base path detection)
│   ├── js/
│   ├── css/
│   ├── public/
│   │   └── assets/
│   └── data/
├── requirements/
└── README.md
```

### Deployed Structure (GitHub Pages)
```
_site/
├── index.html                  # From main branch
├── js/
├── css/
├── public/
│   └── assets/
├── data/
└── admin-refactor/             # From admin-refactor-v2 branch
    ├── index.html
    ├── js/
    ├── css/
    ├── public/
    │   └── assets/
    └── data/
```

---

## ⚙️ GitHub Actions Workflow

**File:** `.github/workflows/deploy-both-branches.yml`

### How It Works

1. **Triggers on:**
   - Push to `main` branch
   - Push to `admin-refactor-v2` branch
   - Manual trigger via `workflow_dispatch`

2. **Workflow Steps:**
   ```yaml
   - Checkout with fetch-depth: 0 (get all history)
   - Fetch all branches (git fetch --all)
   - Checkout main → Copy prototype/* to _site/
   - Checkout admin-refactor-v2 → Copy prototype/* to _site/admin-refactor/
   - Upload _site/ as artifact
   - Deploy to GitHub Pages
   ```

3. **Key Configuration:**
   ```yaml
   concurrency:
     group: "pages-${{ github.ref }}"
     cancel-in-progress: true
   ```
   This allows each branch push to deploy independently.

### Important Notes

- **Both branches need this workflow file** - Changes must be in both `main` and `admin-refactor-v2`
- **Workflow runs on EVERY push** to either branch
- **Both versions deploy together** - The workflow checks out both branches regardless of which one triggered it
- **Deployment takes ~30-60 seconds** after push

---

## 🔧 Base Path Configuration

**File:** `prototype/index.html` (Lines 14-41)

### The Problem

GitHub Pages serves files at:
- Main: `/dialpad-salesforce-launchpad/`
- Admin: `/dialpad-salesforce-launchpad/admin-refactor/`

But assets are in `/public/assets/`, so we need different base paths for each deployment.

### The Solution

```javascript
const isGitHubPages = window.location.hostname === 'amitdialpad.github.io';
const isAdminRefactor = window.location.pathname.includes('/admin-refactor/');

if (isGitHubPages) {
    if (isAdminRefactor) {
        // Admin V2 deployment
        window.BASE_PATH = '/dialpad-salesforce-launchpad/admin-refactor/public/';
        window.CSS_PATH = '/dialpad-salesforce-launchpad/admin-refactor/';
    } else {
        // North Star deployment
        window.BASE_PATH = '/dialpad-salesforce-launchpad/public/';
        window.CSS_PATH = '/dialpad-salesforce-launchpad/';
    }
} else {
    // Local development
    window.BASE_PATH = '/public/';
    window.CSS_PATH = '/';
}
```

### Why This Works

1. **Detects environment** - GitHub Pages vs Local
2. **Detects version** - Admin V2 vs North Star (by checking URL path)
3. **Sets correct base paths** - All asset references use `window.BASE_PATH` and `window.CSS_PATH`

### Files Using Base Path

- `prototype/index.html` - CSS loading
- `prototype/js/app.js` - All icon references via `getAssetPath()`

---

## 🚨 Common Issues & Fixes

### Issue 1: Workflow Fails - "Cannot checkout branch"

**Symptoms:**
```
error: could not apply commit...
CONFLICT (content): Merge conflict
```

**Cause:** Git can't switch branches in the workflow.

**Fix:**
```yaml
- name: Checkout
  uses: actions/checkout@v4
  with:
    fetch-depth: 0    # ← Must be 0 to get all history

- name: Fetch all branches
  run: git fetch --all    # ← Explicit fetch before checkout
```

### Issue 2: Assets Return 404 on Deployed Site

**Symptoms:**
```
GET .../prototype/public/assets/... 404 (Not Found)
```

**Cause:** Base path detection is wrong or not detecting deployment correctly.

**Fix:**
1. Check `prototype/index.html` lines 14-41
2. Verify path detection logic:
   ```javascript
   const isAdminRefactor = window.location.pathname.includes('/admin-refactor/');
   ```
3. Test locally first: http://localhost:8000

### Issue 3: Old Version Shows After Deployment

**Symptoms:** Changes pushed but old code still showing on deployed site.

**Causes & Fixes:**
1. **Browser cache:**
   - Hard refresh: Ctrl+Shift+R (Win/Linux) or Cmd+Shift+R (Mac)
   - Incognito/private window

2. **Workflow still running:**
   - Check: https://github.com/amitdialpad/dialpad-salesforce-launchpad/actions
   - Wait for green checkmark (✅)

3. **Workflow failed:**
   ```bash
   gh run list --branch admin-refactor-v2 --limit 1
   ```
   - If status is "failure", check logs:
   ```bash
   gh run view <run-id> --log-failed
   ```

### Issue 4: Changes Only on One Branch

**Symptoms:** Fixed issue on `admin-refactor-v2` but main still broken (or vice versa).

**Cause:** Workflow file not synced between branches.

**Fix:**
```bash
# On admin-refactor-v2
git add .github/workflows/deploy-both-branches.yml
git commit -m "Update workflow"
git push origin admin-refactor-v2

# Cherry-pick to main
git checkout main
git cherry-pick <commit-hash>
git push origin main
git checkout admin-refactor-v2
```

**If cherry-pick fails (merge conflict):**
```bash
git cherry-pick --abort
# Manually copy the workflow file to main
```

---

## 📋 Deployment Checklist

Before pushing changes that affect deployment:

### 1. Local Testing
- [ ] Test on http://localhost:8000
- [ ] Verify assets load correctly
- [ ] Check all pages render properly

### 2. File Changes
- [ ] If modified `index.html` base path logic → Test both URLs after deploy
- [ ] If modified `.github/workflows/` → Push to BOTH branches
- [ ] If modified asset paths in `app.js` → Verify `getAssetPath()` usage

### 3. Push & Verify
```bash
# Push to admin-refactor-v2
git push origin admin-refactor-v2

# Wait 30-60 seconds for deployment
sleep 60

# Check workflow status
gh run list --branch admin-refactor-v2 --limit 1

# If success, test URLs:
# 1. https://amitdialpad.github.io/dialpad-salesforce-launchpad/admin-refactor/
# 2. Hard refresh (Cmd+Shift+R)
# 3. Verify changes appear
```

### 4. If Issues
- [ ] Check GitHub Actions logs: https://github.com/amitdialpad/dialpad-salesforce-launchpad/actions
- [ ] Review error messages in workflow logs
- [ ] Compare with this document's troubleshooting section

---

## 🔍 Debugging Commands

### Check Workflow Status
```bash
# List recent runs
gh run list --branch admin-refactor-v2 --limit 5

# View specific run
gh run view <run-id>

# View failed logs
gh run view <run-id> --log-failed
```

### Monitor Deployment
```bash
# Watch for workflow completion
watch -n 5 'gh run list --branch admin-refactor-v2 --limit 1'
```

### Test Locally
```bash
cd prototype
npm run dev
# Opens http://localhost:8000
```

---

## 🎓 Key Lessons Learned

### 1. Git Checkout in Workflows
**Problem:** Simple `git checkout <branch>` doesn't work in GitHub Actions by default.

**Solution:**
- Use `fetch-depth: 0` in `actions/checkout@v4`
- Explicitly run `git fetch --all` before checkout
- Verify branches with `git branch -a`

### 2. Dual Deployment Architecture
**Problem:** GitHub Pages typically deploys one branch.

**Solution:**
- Single workflow that checks out BOTH branches
- Copy main → root, admin-refactor-v2 → subfolder
- Works because workflow has access to all branches via `fetch-depth: 0`

### 3. Base Path Detection
**Problem:** Same HTML file needs different asset paths depending on deployment location.

**Solution:**
- Runtime detection via `window.location.pathname`
- Check for `/admin-refactor/` in path
- Set global `window.BASE_PATH` and `window.CSS_PATH` variables

### 4. Workflow Must Be in Both Branches
**Problem:** Pushing to main didn't trigger deployment of admin-refactor-v2.

**Solution:**
- The workflow file MUST exist in the branch that's being pushed
- Push to main → workflow runs from main branch's `.github/workflows/`
- Push to admin → workflow runs from admin branch's `.github/workflows/`
- Both workflows do the same thing: deploy both branches

---

## 📝 Maintenance

### When Adding New Features

1. **Develop on admin-refactor-v2**
2. **Test locally first**
3. **Push and verify deployment**
4. **If approved, optionally merge to main**

### When Modifying Workflow

1. **Test on admin-refactor-v2 first**
2. **Cherry-pick to main**
3. **Verify both branches deploy correctly**

### When Modifying Base Paths

1. **Update `prototype/index.html`**
2. **Test locally (http://localhost:8000)**
3. **Test on deployed admin URL**
4. **Test on deployed main URL**
5. **Document changes in this file**

---

## 🔗 Quick Links

- **Actions Dashboard:** https://github.com/amitdialpad/dialpad-salesforce-launchpad/actions
- **Admin V2 (Live):** https://amitdialpad.github.io/dialpad-salesforce-launchpad/admin-refactor/
- **North Star (Live):** https://amitdialpad.github.io/dialpad-salesforce-launchpad/
- **Compare Branches:** https://github.com/amitdialpad/dialpad-salesforce-launchpad/compare/main...admin-refactor-v2

---

## ✅ Current Status

**Working Configuration:**
- ✅ Workflow deploys both branches simultaneously
- ✅ Base path detection works for both deployments
- ✅ Assets load correctly on both URLs
- ✅ Workflow runs on push to either branch
- ✅ Deployment takes ~30-60 seconds

**Last Successful Deployment:** November 27, 2025
**Last Modified Workflow:** November 27, 2025 (Commit: d381e80)
