# Admin Feedback Consolidated (PM-Driven) – Salesforce Launchpad Prototype

## Overview
This document consolidates:
- Engineering feasibility feedback from the meeting transcript
- PM feedback decisions (PM has final authority)
- Prototype review
- Requirements adjustments based on feasibility + PM direction

This file represents **authoritative PM-approved Admin changes** for the Dialpad Salesforce Launchpad prototype.

---

## ✅ IMPLEMENTATION STATUS (Updated 2025-11-27)

**Status:** ✅ **100% COMPLETE** - All 21 PM requirements implemented in admin-refactor-v2 branch

**Branch:** admin-refactor-v2
**Live URL:** https://amitdialpad.github.io/dialpad-salesforce-launchpad/admin-refactor/
**Compare with North Star:** https://github.com/amitdialpad/dialpad-salesforce-launchpad/compare/main...admin-refactor-v2

**Latest Changes (2025-11-27):**
- ✅ Enhanced 6-step onboarding wizard with interactive forms
- ✅ Update consent modal with sandbox testing checkbox
- ✅ Fixed Calls page tabs per PM requirements (Admin: All Calls, My Calls)
- ✅ Fixed SMS page tabs per PM requirements (same structure as Calls)
- ✅ Wired "Launch Onboarding Wizard" action to modal
- ✅ Fixed version banner layout (removed "Update now" link)
- ✅ Added "View Reports" action to Quick Actions dropdown

**See Also:**
- [CHANGELOG.md](../CHANGELOG.md) - Detailed change history
- [VERSION.md](../VERSION.md) - Branch information and status

---

# 1. Remove (Eliminate Completely)

## 1.1 Remove Admin Left Sidebar
**Reason:** PM: Not needed. Engineering: Adds complexity and isn’t feasible to maintain as separate pages.

**Remove sections from sidebar:**
- Overview  
- Analytics  
- Users & Licenses  
- Integration Health  
- Updates & Announcements  

All content will move into a **single-page Admin Launchpad**.

---

## 1.2 Remove “Integration Health” Page (Standalone)
**Transcript:** Engineering says impossible at this stage.  
**PM Pushback:** Keep a minimal placeholder but NOT a page.

**Remove:**
- Full Integration Health page  
- Error logs  
- API usage widgets  
- Test connection widgets  

**Replace with:**  
- Small system status panel (see Section 3.1)

---

## 1.3 Remove Quick Actions That Are Not Feasible
**Delete entirely:**
- Run Health Check  
- Bulk Import  

These were explicitly called out as unclear / unbuildable at this stage.

---

# 2. Add (PM-Approved Additions)

## 2.1 Add Minimal “Dialpad System Status” Panel
**Transcript:**  
Engineering: “We can embed status page via JS API.”  
PM: “Yes, do this instead of full Integration Health.”

**Add:**
- Small panel on Admin dashboard that embeds or simulates Dialpad Status  
- Use mock or iframe (prototype only)  

---

## 2.2 Add Onboarding Checklist (Admin Setup Progress)
**PM:**  
- Must have  
- Keep simple now  
- No deep validation  
- Use static or semi-static list

**Add checklist items such as:**
- Install Dialpad Package  
- Assign Permission Sets  
- Connect Dialpad to Salesforce  
- Configure Call Logging  
- Sandbox Testing Recommended  

No backend logic required.

---

## 2.3 Add Daily Calls Line Chart
**PM Request:** “Just put a line chart of calls made for the given day.”

**Implement:**
- Line chart  
- Today’s call volume  
- Optional: Office breakdown  

This replaces the heavy analytics admin page.

---

## 2.4 Add User & License Summary Panel
PM: “Show basic counts and link to full settings.”

**Add:**
- Total Users  
- Connected Users  
- Disconnected Users  
- License Utilization  
- **View All Users → Settings (Users & Licenses tab)**  

---

## 2.5 Add Admin Announcement Panel
**PM & Transcript:**  
- Merge announcements into homepage  
- No separate page

**Add:**
- “Updates & Announcements”  
- List version updates (mock)  
- “View What’s New” → opens modal  

---

## 2.6 Add Consent Modal for Package Update
**PM directive:**  
- Must warn  
- Must enforce sandbox check (conceptually)  
- Save acknowledgment

**Add modal:**
- Warning about Sandbox first  
- Checkbox: “I have tested in Sandbox”  
- Update button disabled until checked  
- Close / View Sandbox Guide option  

Backend not needed.

---

## 2.7 Add Quick Actions (Final PM-Approved List)
Keep:
- Add User  
- Manage Permission Sets  
- View Calls  
- Launch Onboarding Wizard  

---

# 3. Change (Modify Instead of Delete)

## 3.1 Replace Integration Health with Lightweight System Status
**Engineering:** Cannot show real integration health  
**PM:** Show something minimal

**Change to:**
- Embedded fake or static Dialpad Status  
- Basic “Integration Connected/Disconnected” tag  
- Last Sync (mock)  

---

## 3.2 Modify Calls Page Filters for Admin
**PM directive:**
- Admin sees only:  
  - All Calls  
  - My Calls  
- Remove SMS direction filter  
  - “SMS can’t have direction”

**Change:**
- Remove direction filter  
- Simplify tabs: All Calls, My Calls  

---

## 3.3 Merge Voicemail Into Calls
**PM:**  
- No separate voicemail module  
- New view should be “Recorded Calls” or “Voicemails”

**Change:**
- Add sub-tab “Recorded Calls”
- Reuse same table structure  

---

## 3.4 Replace Reports Page With Simplified Version
PM:  
> “Reports view would not be what is suggested. Use Salesforce folder-based approach.”

**Change:**
- Keep your grid for prototype  
- Add note or visual cue indicating:
  - “These will become Salesforce report folders in production.”

Later:  
- Real Salesforce Reports UI

---

## 3.5 Settings Page → Vertical Navigation
PM directive:
- Settings should have vertical nav  
- One page = Users & Licenses  
- Rest = map to real settings

**Change:**
Add nav items:
- Users & Licenses  
- Screen Pop  
- Call Logging  
- Powerdialer Settings  
- Onboarding  
- Data Sync  

Keep content minimal and static.

---

# 4. Reorganize (Restructure Entire Admin Page)

## Final PM-Approved Admin Dashboard Layout

### **Section 1 — Alerts**
- Update available banner  
- Sandbox warning if needed  
- Integration Disconnected (if simulated)

### **Section 2 — System Status**
- Dialpad Status Embed  
- Integration Connected / Disconnected tag  
- Last sync time (mock)

### **Section 3 — Usage Metrics**
- Daily calls (line chart)  
- Total Calls Today  
- Missed Calls  
- SMS Count  
- Unlogged Calls card (keep from prototype)

### **Section 4 — Users & Licenses**
- Total Users  
- Connected Users  
- Disconnected Users  
- License Usage bar  
- Button: View All Users → Settings

### **Section 5 — Quick Actions**
- Add User  
- Manage Permission Sets  
- View Calls  
- Launch Onboarding Wizard  

### **Section 6 — Setup Progress**
- Onboarding checklist with 5–6 items

### **Section 7 — Product Updates**
- Announcements  
- What’s New modal  
- Version update consent modal  

---

# 5. What PM Rejected (Avoid Implementing)

- Heavy analytics page for Admin  
- Deep Integration Health  
- Logs viewer  
- Multi-layer settings simulator  
- Full report builder  
- Multiple dashboards for Admin  
- Powerdialer redesign (for Admin)  
- Supervisor-only analytic components  

---

# 6. What PM Explicitly Approved (Do Implement)

- Single-page Admin Launchpad  
- Status embed (lightweight)  
- Simple onboarding checklist  
- Daily calls chart  
- User & license panel  
- Quick actions (updated list)  
- Consent modal for updates  
- Consolidated announcements panel  
- Merge calls & voicemails  
- Simplified Reports tab  
- Vertical Settings nav  

---

# 7. Optional Enhancements (Safe to Add But Not Required)

- Reorder panels using drag-and-drop (prototype only)  
- Add mock API failure messages  
- Collapsible sections  
- “View all Reports” button that leads to placeholder  

---

# 8. Summary of PM Intent

The PM intent is to:
- Reduce complexity  
- Focus Admin on **health + users + setup + updates**  
- Leave analytics to Supervisor  
- Make Admin dashboard a **single place for high-signal info**  
- Avoid engineering-heavy or Salesforce-unsupported components  

This markdown file is the **authoritative specification** for the Admin part of the prototype moving forward.

