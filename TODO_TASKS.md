# 📌 CÔNG VIỆC CẦN HOÀN THÀNH

## GIAI ĐOẠN 1: FIX CRITICAL ERRORS (30 phút)

### ✏️ TASK 1.1: Fix TypeScript Database Module
**File:** `src/main/ipcmain/database.ts`  
**Priority:** 🔴 CRITICAL

**Lỗi cần sửa:**
```
- TS2339: Property 'Database' does not exist
- TS18047: 'db' is possibly 'null'
- TS2339: Property 'close/run/get/all' does not exist
- TS2683: 'this' implicitly has type 'any'
- TS18046: 'err' is of type 'unknown'
```

**Sửa như sau:**
1. Import type từ sqlcipher
2. Add type annotation cho `db` variable
3. Fix error handling types
4. Add proper `this` context typing

---

### ✏️ TASK 1.2: Fix TypeScript Window Module
**File:** `src/main/window.ts`  
**Priority:** 🔴 CRITICAL

**Lỗi cần sửa:**
```
TS2322: Type 'null' is not assignable to type 'string | undefined'
```

**Giải pháp:** Check line 26, fix preload path type

---

## GIAI ĐOẠN 2: BUILD & VERIFY (20 phút)

### ✅ TASK 2.1: Type Check
```bash
npm run typecheck
```
**Mục tiêu:** 0 lỗi  
**Dấu hiệu thành công:** Command returns without error TS errors

---

### ✅ TASK 2.2: Build Project
```bash
npm run build
```
**Mục tiêu:** Build passes  
**Dấu hiệu thành công:** Output folder created

---

## GIAI ĐOẠN 3: TEST RUNTIME (2 giờ)

### 🧪 TASK 3.1: Start Dev Server
```bash
npm run dev
```
**Kiểm tra:**
- [ ] Electron window opens
- [ ] No errors in console
- [ ] preload API available (`window.electronAPI`)
- [ ] Database initialized
- [ ] LoginView renders without errors

---

### 🧪 TASK 3.2: Test Login
**Actions:**
1. Open app
2. Enter username: `EVN_HCM`
3. Enter password: `evn_admin`
4. Click Login

**Kiểm tra:**
- [ ] Form validates
- [ ] API call succeeds
- [ ] Redirects to TreeNavigation
- [ ] User info stored in store
- [ ] No console errors

---

### 🧪 TASK 3.3: Test Tree Navigation
**Actions:**
1. From LoginView, log in
2. TreeNavigation opens
3. Expand tree nodes
4. Click on different assets

**Kiểm tra:**
- [ ] Tree renders all locations/assets
- [ ] Expanding/collapsing works
- [ ] Selection updates store state
- [ ] No errors when clicking items

---

### 🧪 TASK 3.4: Test Asset Views
**Actions:**
1. From tree, click on an asset (e.g., Transformer)
2. View the asset detail page

**Kiểm tra:**
- [ ] Asset properties display
- [ ] All 11 asset types can be opened:
  - [ ] Bushing
  - [ ] Capacitor
  - [ ] CircuitBreaker
  - [ ] CurrentTransformer
  - [ ] Disconnector
  - [ ] PowerCable
  - [ ] Reactor
  - [ ] RotatingMachine
  - [ ] SurgeArrester
  - [ ] Transformer
  - [ ] VoltageTransformer

---

### 🧪 TASK 3.5: Test Job Views
**Actions:**
1. From tree, open job section
2. View jobs for different asset types

**Kiểm tra:**
- [ ] Jobs display for each asset type
- [ ] Job details can be opened
- [ ] Procedure list shows
- [ ] No errors in console

---

### 🧪 TASK 3.6: Test Database Operations
**Actions:**
1. Verify database is being used
2. Check browser DevTools → Application → Storage

**Kiểm tra:**
- [ ] Database file exists at: `~/.config/ATDigitalTester/database.db`
- [ ] Tables have data
- [ ] IPC queries work (`db-run`, `db-get`, `db-all`)

---

### 🧪 TASK 3.7: Test UI Components
**Kiểm tra:**
- [ ] TopBar renders and functions
- [ ] Loading overlay shows on data fetch
- [ ] All Element Plus components work
- [ ] Forms validate properly
- [ ] Buttons respond to clicks

---

### 🧪 TASK 3.8: Test File Operations
**Actions:**
1. Try file upload feature
2. Try export feature
3. Try import feature

**Kiểm tra:**
- [ ] File upload works (if applicable)
- [ ] File conversion via Python worker
- [ ] No IPC message errors

---

## GIAI ĐOẠN 4: COMPARE WITH OLD VERSION

### 📋 TASK 4.1: Feature Parity Check
**Mục tiêu:** Bản mới có tất cả chức năng của bản cũ

**Compare:**
- [ ] All asset types present
- [ ] All job types present
- [ ] All views accessible
- [ ] Same keyboard shortcuts work
- [ ] Same color scheme/styling

**Files để check:**
- Bản cũ: `C:\tester\Tester_client\src\views`
- Bản mới: `c:\update_2\LatestTester\src\renderer\src\views`

---

### 🎨 TASK 4.2: UI Parity Check
**Kiểm tra:**
- [ ] LoginView looks identical
- [ ] TopBar layout same
- [ ] Tree navigation same
- [ ] Asset detail view same
- [ ] Job view same
- [ ] All forms look correct

---

## GIAI ĐOẠN 5: PERFORMANCE & POLISH

### ⚡ TASK 5.1: Performance Check
**Kiểm tra:**
- [ ] App launches in < 3 seconds
- [ ] Tree renders fast (< 1 second)
- [ ] Asset detail loads fast
- [ ] No lag when scrolling
- [ ] Memory usage stable

---

### 🎯 TASK 5.2: Error Handling
**Kiểm tra:**
- [ ] Handle network errors gracefully
- [ ] Database errors caught
- [ ] IPC timeouts handled
- [ ] User gets error messages

---

### 🧹 TASK 5.3: Console Cleanup
**Kiểm tra:**
- [ ] No warning messages
- [ ] No deprecation warnings
- [ ] Only expected logs shown
- [ ] Error logs clear

---

## GIAI ĐOẠN 6: FINAL VERIFICATION

### ✨ TASK 6.1: Build Release Version
```bash
npm run build:win
```
**Kiểm tra:**
- [ ] Build succeeds
- [ ] .exe file created
- [ ] Can run standalone

---

### 🧪 TASK 6.2: Test .exe File
**Actions:**
1. Run compiled .exe
2. Go through all features

**Kiểm tra:**
- [ ] App launches
- [ ] All features work
- [ ] Database persists
- [ ] No runtime errors

---

## 📊 COMPLETION CHECKLIST

### Phase 1: TypeScript Fixes
- [ ] database.ts fixed
- [ ] window.ts fixed
- [ ] Type check passes

### Phase 2: Build
- [ ] npm run build succeeds
- [ ] No build errors

### Phase 3: Runtime Testing
- [ ] Dev server launches
- [ ] Login works
- [ ] Navigation works
- [ ] All asset types work
- [ ] All job types work
- [ ] Database operations work
- [ ] UI matches old version

### Phase 4: Feature Parity
- [ ] All features from old version present
- [ ] All UI looks correct
- [ ] Performance acceptable

### Phase 5: Release
- [ ] Release build succeeds
- [ ] .exe runs successfully

---

## 📝 NOTES FOR COMPLETION

### Debugging Tips
- **Console logs:** Check DevTools F12
- **IPC issues:** Look for `[IPC]` prefixed logs
- **Database issues:** Look for `[DB]` prefixed logs
- **Route issues:** Check Vue Router logs

### Common Issues to Watch
1. **Preload API not available:** Check if preload script loaded (logs show `[Main] electronAPI available`)
2. **Database errors:** Check if database.db exists and is readable
3. **Form validation fails:** Check Element Plus validator configuration
4. **Styling broken:** Ensure CSS imports in main.ts work

### Resources
- Old project: `C:\tester\Tester_client`
- New project: `c:\update_2\LatestTester`
- Configuration: `src/renderer/src/config/app-config.json`
- Procedures: `src/renderer/src/config/procedures/`

---

**Status:** Ready to start fixes!  
**Estimated Total Time:** 3-4 hours  
**Priority:** Fix TypeScript → Build → Test
