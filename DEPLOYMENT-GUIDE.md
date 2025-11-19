# Deployment Guide - GitHub Pages

## Critical Path Configuration

### The Problem

This project has a **split folder structure** that requires careful path management:

```
prototype/
├── css/                    # Custom styles (NOT in public/)
│   └── custom.css
├── public/                 # Static assets
│   └── assets/
│       ├── icons/
│       └── styles/
├── js/                     # Application code
└── index.html             # Entry point
```

### Why This Matters

**Local Development (Vite)**:
- Vite automatically serves `public/` folder at root
- Paths like `/assets/...` work because Vite maps them to `public/assets/...`
- Custom CSS at `/css/custom.css` works because it's in the prototype root

**GitHub Pages (Static Hosting)**:
- Serves files exactly as they exist in the repository
- No automatic remapping of `public/` folder
- Paths must match actual file locations

### The Solution

**Two separate path variables in [index.html](prototype/index.html#L15-28)**:

```javascript
// For assets in public/ folder (SLDS, icons, sprites)
window.BASE_PATH = window.location.hostname === 'amitdialpad.github.io'
    ? '/dialpad-salesforce-launchpad/prototype/public/'
    : '/';

// For CSS in prototype root (custom.css)
window.CSS_PATH = window.location.hostname === 'amitdialpad.github.io'
    ? '/dialpad-salesforce-launchpad/prototype/'
    : '/';
```

### Path Usage Rules

| File Type | Variable to Use | Local Path | GitHub Pages Path |
|-----------|----------------|------------|-------------------|
| SLDS CSS | `BASE_PATH` | `/assets/styles/...` | `/dialpad-salesforce-launchpad/prototype/public/assets/styles/...` |
| SLDS Icons | `BASE_PATH` | `/assets/icons/...` | `/dialpad-salesforce-launchpad/prototype/public/assets/icons/...` |
| Custom CSS | `CSS_PATH` | `/css/custom.css` | `/dialpad-salesforce-launchpad/prototype/css/custom.css` |
| JavaScript | Relative | `js/app.js` | `js/app.js` |

---

## Before Making Path Changes

**STOP and check:**

1. Is the file in `public/` folder? → Use `BASE_PATH`
2. Is the file in `prototype/` root? → Use `CSS_PATH` (or relative path for JS)
3. Are you adding new assets? → Put them in `public/` and use `BASE_PATH`
4. Are you adding new styles? → Put them in `css/` and use `CSS_PATH`

---

## Testing Checklist

Before pushing to GitHub, verify BOTH environments work:

### Local Testing
```bash
cd prototype
npm run dev
```

1. Open http://localhost:8000
2. Check browser console for errors
3. Verify styles load (banner color should be yellow)
4. Verify icons render (not blue boxes)
5. Verify demo controls work

### GitHub Pages Testing

After pushing:
1. Wait 1-2 minutes for GitHub Pages rebuild
2. Open https://amitdialpad.github.io/dialpad-salesforce-launchpad/prototype/
3. **Hard refresh**: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
4. Check browser console for 404 errors
5. Verify styles match local (banner color, demo controls)
6. Verify icons render correctly

---

## Common Issues & Fixes

### Issue: Icons showing as blue boxes on GitHub Pages

**Cause**: Icon paths using wrong BASE_PATH or referencing sprite that doesn't exist

**Fix**:
1. Check icon sprite path uses `window.BASE_PATH` or `getAssetPath()`
2. Verify icon exists in the sprite file (use standard-sprite or utility-sprite correctly)
3. Example: `${window.BASE_PATH}assets/icons/utility-sprite/svg/symbols.svg#user`

### Issue: CSS 404 errors on GitHub Pages

**Cause**: Using `BASE_PATH` for files not in `public/` folder

**Fix**:
1. Check if CSS file is in `public/` or `prototype/` root
2. Use `CSS_PATH` for `custom.css`
3. Use `BASE_PATH` for SLDS CSS

### Issue: Styles look different between local and GitHub Pages

**Cause**: Custom CSS not loading on GitHub Pages due to wrong path

**Fix**:
1. Verify `custom.css` loads with `CSS_PATH` not `BASE_PATH`
2. Check browser Network tab for CSS 404s
3. Hard refresh to bypass cache

### Issue: Everything works locally but broken on GitHub Pages

**Cause**: Vite dev server abstracts `public/` folder, GitHub Pages doesn't

**Fix**:
1. Review ALL asset paths in code
2. Ensure using `BASE_PATH` or `CSS_PATH` appropriately
3. Never hardcode paths like `/assets/...` - always use path variables

---

## Path Helper Functions

### In index.html (lines 15-28)

```javascript
window.BASE_PATH = window.location.hostname === 'amitdialpad.github.io'
    ? '/dialpad-salesforce-launchpad/prototype/public/'
    : '/';

window.CSS_PATH = window.location.hostname === 'amitdialpad.github.io'
    ? '/dialpad-salesforce-launchpad/prototype/'
    : '/';
```

### In app.js (lines 4-7)

```javascript
function getAssetPath(path) {
    const basePath = window.BASE_PATH || '/';
    return basePath + path;
}
```

**Usage**:
```javascript
// Correct - for assets in public/
`${getAssetPath('assets/icons/utility-sprite/svg/symbols.svg#phone')}`

// Correct - for SLDS CSS in public/
`${window.BASE_PATH}assets/styles/salesforce-lightning-design-system.min.css`

// Correct - for custom CSS in prototype root
`${window.CSS_PATH}css/custom.css`

// Wrong - hardcoded path
`/assets/icons/...` // This breaks on GitHub Pages!
```

---

## Quick Reference

### Adding New Files

| File Type | Location | Path Variable | Example |
|-----------|----------|---------------|---------|
| Images | `public/assets/images/` | `BASE_PATH` | `${window.BASE_PATH}assets/images/logo.png` |
| Icons | `public/assets/icons/` | `BASE_PATH` | `${getAssetPath('assets/icons/...')}` |
| Fonts | `public/assets/fonts/` | `BASE_PATH` | `${window.BASE_PATH}assets/fonts/...` |
| SLDS CSS | `public/assets/styles/` | `BASE_PATH` | `${window.BASE_PATH}assets/styles/...` |
| Custom CSS | `css/` | `CSS_PATH` | `${window.CSS_PATH}css/custom.css` |
| JavaScript | `js/` | Relative | `js/app.js` |
| Mock Data | `data/` | Relative | `data/calls.json` |

---

## GitHub Pages Deployment

### Automatic Deployment

Changes to `main` branch automatically trigger GitHub Pages rebuild:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Wait 1-2 minutes, then check: https://amitdialpad.github.io/dialpad-salesforce-launchpad/prototype/

### Cache Busting

If changes don't appear:
1. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Open in incognito/private window
4. Check Network tab for 304 (cached) vs 200 (fresh) responses

### Meta Tag in index.html (line 6)

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
```

This helps reduce caching issues but doesn't eliminate them completely.

---

## Historical Issues (Learn from Past Mistakes)

### Incident 1: Icons showing blue boxes (2025-11-19)

**What happened**: Icons rendered as blue boxes instead of SVG icons

**Root cause**: Code used `standard-sprite` but returned icon names that only exist in `utility-sprite`

**Fix**: Removed icons completely per user request

**Lesson**: Always verify icon names exist in the target sprite file

### Incident 2: CSS 404 errors (2025-11-19)

**What happened**: SLDS CSS returned 404 on GitHub Pages

**Root cause**: `BASE_PATH` was `/dialpad-salesforce-launchpad/prototype/` but assets are in `public/` subfolder

**Fix**: Changed `BASE_PATH` to include `public/`

**Lesson**: Understand folder structure before setting path variables

### Incident 3: Style inconsistencies (2025-11-19)

**What happened**: Banner yellow on local, red on GitHub Pages. Demo controls broken on GitHub Pages.

**Root cause**: `custom.css` is NOT in `public/` folder, but was loading with `BASE_PATH` which points to `public/`

**Fix**: Created separate `CSS_PATH` for files in prototype root

**Lesson**: Not all files are in `public/` - check actual file locations

---

## Production Migration Considerations

When moving to production Salesforce environment:

1. **Remove path detection logic** - Use Salesforce static resources
2. **Convert to Lightning Web Components (LWC)** - Use `@salesforce/resourceUrl`
3. **Use Lightning Locker** - Different path resolution rules
4. **Consider Content Security Policy (CSP)** - May affect inline styles

See [ARCHITECTURE.md](prototype/ARCHITECTURE.md) for full migration roadmap.

---

## Support

**If deployment breaks**:
1. Check browser console for errors
2. Compare local vs GitHub Pages behavior
3. Review this guide's "Common Issues" section
4. Check git history: `git log --oneline -10`
5. Revert if needed: `git revert <commit-hash>`

**Contact**: Amit Ayre (Product)

---

**Last Updated**: 2025-11-19
**Status**: Active deployment configuration
**Next Review**: Before any path-related changes
