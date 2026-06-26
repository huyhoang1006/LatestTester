# ✅ DANH SÁCH CÔNG VIỆC CHI TIẾT - HOÀN THÀNH MIGRATION

**Mục tiêu:** Hoàn thành migration Vue 2 → Vue 3 đầy đủ chức năng  
**Thời gian ước lượng:** 2-3 giờ  
**Ưu tiên:** HIGH

---

## 🟢 PHASE 1: BUILD & TYPE CHECK (30 phút)

### TASK 1.1: Type Check Project
**Status:** 🔄 PENDING  
**Command:**
```bash
cd c:\update_2\LatestTester
npm run typecheck
```

**Acceptance Criteria:**
- [ ] Command completes without error TS errors
- [ ] No "error TS" messages in output
- [ ] Success message appears

**What to do if fails:**
- Check error messages
- Fix type issues in flagged files
- Rerun typecheck

---

### TASK 1.2: Build Project
**Status:** 🔄 PENDING  
**Command:**
```bash
npm run build
```

**Acceptance Criteria:**
- [ ] Build completes successfully
- [ ] No build errors in console
- [ ] Output folder created with compiled files

**Expected Output:**
```
✓ built successfully
```

---

### TASK 1.3: Build Windows Installer
**Status:** 🔄 PENDING  
**Command:**
```bash
npm run build:win
```

**Acceptance Criteria:**
- [ ] Build completes
- [ ] .exe file created in release/

**Note:** Can skip this for now, focus on dev first

---

## 🟡 PHASE 2: DEVELOPMENT SERVER (30 phút)

### TASK 2.1: Start Dev Server
**Status:** 🔄 PENDING  
**Command:**
```bash
npm run dev
```

**Acceptance Criteria:**
- [ ] Server starts without crashes
- [ ] URL appears in console (usually http://localhost:5173)
- [ ] Electron window opens automatically
- [ ] No TypeScript errors in console
- [ ] No "electronAPI is undefined" error

**What to monitor:**
```
Watch console for:
✓ [Main] App instance created
✓ [Main] electronAPI available: true
✓ [Main] Mounting app to #app...
✓ [Main] App mounted successfully
```

**If window doesn't open:**
- Check if app is loading
- Open DevTools with F12
- Check console for errors

---

### TASK 2.2: Verify Preload Script Loaded
**Status:** 🔄 PENDING  
**Action:** Dev server running from TASK 2.1

**Manual Test:**
1. Open DevTools (F12)
2. Go to Console tab
3. Type: `window.electronAPI`
4. Should show object with API methods

**Acceptance Criteria:**
- [ ] `window.electronAPI` exists
- [ ] Contains methods like `dbRun`, `dbGet`, `dbAll`
- [ ] No errors in console

---

### TASK 2.3: Test Database IPC
**Status:** 🔄 PENDING  
**Action:** Dev server running, DevTools open

**Manual Test:**
1. Console: `await window.electronAPI.dbAll('SELECT * FROM PRAGMA_TABLE_INFO')`
2. Should return something or error with table not found

**Acceptance Criteria:**
- [ ] No "dbAll is not a function" error
- [ ] IPC call goes through
- [ ] Response returns (even if no data)

---

### TASK 2.4: Check Store Initialization
**Status:** 🔄 PENDING  
**Manual Test:**
1. Console: `window.$nuxt` or app state
2. Or check localStorage keys

**Acceptance Criteria:**
- [ ] Store initialized
- [ ] No store errors
- [ ] Helper.js initApp ran (check console for logs)

---

## 🟠 PHASE 3: LOGIN FLOW TESTING (45 phút)

### TASK 3.1: Test Domain Configuration Dialog
**Status:** 🔄 PENDING  
**Action:** Dev server running, app open

**Manual Test:**
1. App should show LoginView
2. Look for domain configuration button/dialog in TopBar
3. Enter Login Domain: (from old config if needed)
4. Enter Service Domain: (from old config)
5. Click Save

**Acceptance Criteria:**
- [ ] Dialog appears and closable
- [ ] Domains save to localStorage
- [ ] Domains update store state
- [ ] No errors in console

---

### TASK 3.2: Test Login Form
**Status:** 🔄 PENDING  
**Manual Test:**
1. LoginView visible
2. Enter username: `EVN_HCM`
3. Enter password: `evn_admin`
4. Click Login

**Expected Behavior:**
- [ ] Loading overlay appears
- [ ] API call sent to LOGIN_ADDR
- [ ] Response received
- [ ] Token saved to localStorage
- [ ] Redirect to /home page
- [ ] TopBar visible with user info

**If login fails:**
- Check console for API error
- Verify LOGIN_ADDR is correct
- Check if OAuth2 server is running

---

### TASK 3.3: Verify Token Storage
**Status:** 🔄 PENDING  
**Manual Test:**
1. After successful login, press F12
2. Go to Application → LocalStorage
3. Check keys exist:
   - `user` (JSON string)
   - `token` (JWT)
   - `role` (role code)
   - `LOGIN_ADDR`
   - `SERVICE_ADDR`

**Acceptance Criteria:**
- [ ] All 5 keys exist
- [ ] `token` is non-empty
- [ ] `user` is valid JSON

---

### TASK 3.4: Test Session Persistence
**Status:** 🔄 PENDING  
**Manual Test:**
1. After login, press F5 (refresh)
2. App should:
   - Restore session from localStorage
   - Not redirect to login
   - Show logged-in state

**Acceptance Criteria:**
- [ ] No redirect to login after F5
- [ ] User info still visible in TopBar
- [ ] Tree navigation shows

---

## 🔵 PHASE 4: FEATURE TESTING (60 phút)

### TASK 4.1: Test Tree Navigation
**Status:** 🔄 PENDING  
**Manual Test:**
1. From home page, look at left tree
2. Should show locations/substations
3. Try expanding/collapsing nodes
4. Click on items

**Acceptance Criteria:**
- [ ] Tree renders with data
- [ ] Can expand/collapse nodes
- [ ] Selection highlights
- [ ] No errors on click

---

### TASK 4.2: Test Asset View (One Type)
**Status:** 🔄 PENDING  
**Manual Test:**
1. From tree, click on a Transformer asset
2. Asset detail page opens
3. Properties visible

**Acceptance Criteria:**
- [ ] Asset view loads
- [ ] Asset properties display
- [ ] Page shows correct asset name
- [ ] No errors in console

**Repeat for at least 3 asset types:**
- [ ] Bushing
- [ ] Transformer
- [ ] CircuitBreaker

---

### TASK 4.3: Test Job View
**Status:** 🔄 PENDING  
**Manual Test:**
1. Navigate to Job section
2. See list of jobs
3. Open a job detail

**Acceptance Criteria:**
- [ ] Jobs list shows
- [ ] Can open job detail
- [ ] Job procedures visible
- [ ] No errors

---

### TASK 4.4: Test Database Queries
**Status:** 🔄 PENDING  
**Manual Test:**
1. DevTools Console
2. Run: `await window.electronAPI.dbGet('SELECT * FROM asset LIMIT 1')`
3. Should return asset data

**Acceptance Criteria:**
- [ ] Query executes without error
- [ ] Data returns successfully
- [ ] No database errors

---

### TASK 4.5: Test Loading Overlay
**Status:** 🔄 PENDING  
**Manual Test:**
1. Trigger loading: In console:
   ```javascript
   store.commit('START_LOADING', { 
       text: 'Testing...', 
       action: 'test' 
   })
   ```
2. Should see overlay
3. After 10 seconds, overlay disappears (failsafe)

**Acceptance Criteria:**
- [ ] Loading overlay appears
- [ ] Text displays
- [ ] Auto-hides after timeout
- [ ] Can manually stop: `store.commit('STOP_LOADING')`

---

### TASK 4.6: Test All Asset Types (Quick)
**Status:** 🔄 PENDING  
**Manual Test:**
For each asset type, open one asset:

- [ ] **Bushing** - Open detail
- [ ] **Capacitor** - Open detail
- [ ] **CircuitBreaker** - Open detail
- [ ] **CurrentTransformer** - Open detail
- [ ] **Disconnector** - Open detail
- [ ] **PowerCable** - Open detail
- [ ] **Reactor** - Open detail
- [ ] **RotatingMachine** - Open detail
- [ ] **SurgeArrester** - Open detail
- [ ] **Transformer** - Open detail
- [ ] **VoltageTransformer** - Open detail

**Acceptance Criteria:**
For each: Asset view opens, properties show, no errors

---

## 🟢 PHASE 5: COMPARISON WITH OLD VERSION (45 phút)

### TASK 5.1: UI/UX Parity Check
**Status:** 🔄 PENDING  
**Action:** Compare with C:\tester\Tester_client running side-by-side

**Compare these elements:**
- [ ] LoginView layout identical
- [ ] Color scheme same
- [ ] Font sizes same
- [ ] Component styling same
- [ ] TopBar layout same
- [ ] Tree navigation layout same
- [ ] Asset view layout same

**For each difference:**
- Note if it's a bug or intentional change
- Fix CSS if needed

---

### TASK 5.2: Feature Parity Check
**Status:** 🔄 PENDING  

**Test each feature exists:**
- [ ] User login
- [ ] User logout
- [ ] Asset browsing
- [ ] Asset details
- [ ] Job creation
- [ ] Job management
- [ ] Data export
- [ ] Data import
- [ ] File upload
- [ ] Search/filter

---

### TASK 5.3: Performance Comparison
**Status:** 🔄 PENDING  

**Metrics to check:**
- [ ] App startup time < 3 seconds
- [ ] Asset view load < 1 second
- [ ] Tree rendering smooth
- [ ] No lag when scrolling
- [ ] No lag when filtering

---

## 🔴 PHASE 6: FINAL VERIFICATION (30 phút)

### TASK 6.1: Console Cleanup
**Status:** 🔄 PENDING  
**Action:** Dev server running, app fully used

**Check console for:**
- [ ] No TypeScript errors
- [ ] No Vue warnings
- [ ] No IPC errors
- [ ] No database errors
- [ ] All logs are informational

**If warnings exist:**
- Note the warning
- Decide if it needs fixing
- Document or fix

---

### TASK 6.2: Error Boundary Test
**Status:** 🔄 PENDING  

**Test error scenarios:**
1. Try accessing invalid asset
2. Try creating invalid data
3. Try network error (disconnect)

**Acceptance Criteria:**
- [ ] Errors handled gracefully
- [ ] No white screen errors
- [ ] Error messages shown to user

---

### TASK 6.3: Production Build Test
**Status:** 🔄 PENDING  

**Build for production:**
```bash
npm run build
npm run build:win
```

**Test the .exe file:**
1. Extract/install from release/
2. Run the app
3. Test login
4. Test features

**Acceptance Criteria:**
- [ ] .exe installs without error
- [ ] App runs
- [ ] All features work
- [ ] No console errors

---

## 🚀 PHASE 7: LAUNCH PREPARATION (15 phút)

### TASK 7.1: Version Update
**Status:** 🔄 PENDING  

**Update version:**
1. Open `package.json`
2. Update version number (e.g., 26.0.3)
3. Save

**Command:**
```bash
git add package.json
git commit -m "chore: bump version to 26.0.3"
```

---

### TASK 7.2: Tag Release
**Status:** 🔄 PENDING  

**Create git tag:**
```bash
git tag -a v26.0.3 -m "Vue 3 migration complete"
git push origin v26.0.3
```

---

### TASK 7.3: Final Checklist
**Status:** 🔄 PENDING  

- [ ] Type check passes
- [ ] Build succeeds
- [ ] All features work
- [ ] UI matches old version
- [ ] Performance acceptable
- [ ] No critical errors
- [ ] Version updated
- [ ] Release tagged

---

## 📊 PROGRESS TRACKING

### Overall Progress
- **Phase 1 (Build):** 0% → ___% 
- **Phase 2 (Dev):** 0% → ___% 
- **Phase 3 (Login):** 0% → ___% 
- **Phase 4 (Features):** 0% → ___% 
- **Phase 5 (Comparison):** 0% → ___% 
- **Phase 6 (Verification):** 0% → ___% 
- **Phase 7 (Launch):** 0% → ___% 

**Overall:** 0% → _____%

---

## 📝 NOTES & ISSUES LOG

### Issues Found:
(Document any issues here as you find them)

1. **Issue:** ...
   **Status:** OPEN/FIXED
   **Notes:** ...

---

## ✅ SUCCESS CRITERIA

Migration is **COMPLETE** when:

- [x] All phases completed
- [x] No TypeScript errors
- [x] No Vue errors
- [x] All features working
- [x] UI matches old version
- [x] Performance acceptable
- [x] Ready for production

---

## 🎯 IMMEDIATE NEXT STEPS

1. **Start PHASE 1:**
   ```bash
   npm run typecheck
   npm run build
   ```

2. **Start PHASE 2:**
   ```bash
   npm run dev
   ```

3. **Test PHASE 3:**
   - Open app
   - Login with EVN_HCM / evn_admin

4. **Test PHASE 4:**
   - Navigate features
   - Check database

5. **Compare PHASE 5:**
   - Open old version
   - Compare UI side-by-side

---

**Begin Phase 1 now?** 🚀
