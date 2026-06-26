# 🔧 PLAN: FIX CONTEXT MENU - KHÔNG THỂ TẠO NODE MỚI

**Issue:** Context menu không hoạt động → không thể tạo node mới (Add Substation, Add Transformer, etc.)

---

## 🔍 ROOT CAUSE ANALYSIS

### Problem 1: Missing `openContextMenu` Method in TreeNode.vue

**Bản cũ (Vue 2):**
```javascript
// TreeNode.vue - Vue 2
methods: {
    openContextMenu(event, node) {
        this.$emit("open-context-menu", event, node);
    }
}
```

**Bản mới (Vue 3):**
```javascript
// TreeNode.vue - Vue 3 (MISSING METHOD!)
// No openContextMenu method defined
```

**Impact:**
- Line 15: `@contextmenu.prevent="openContextMenu($event, node)"` → Calls undefined method
- Line 56: `@open-context-menu="openContextMenu"` → Tries to handle undefined method
- **Result:** Right-click event is never handled → Context menu never shows

---

### Problem 2: ContextMenu Script Issues in New Version

**New version ContextMenu.vue line 15:**
```javascript
v-if="this.selectedNode && this.selectedNode.mode == 'organisation'"
```

**Should be:**
```javascript
v-if="selectedNode && selectedNode.mode == 'organisation'"
```

(Unnecessary `this.` prefix in template)

---

## 📋 STEP-BY-STEP FIX PLAN

### STEP 1: Add `openContextMenu` Method to TreeNode.vue

**File:** `src/renderer/src/views/Common/TreeNode.vue`

**Location:** In the `<script>` section, add to `methods` object

**Code to add:**
```javascript
methods: {
    // ... existing methods ...
    
    openContextMenu(event, node) {
        this.$emit("open-context-menu", event, node);
    },
    
    // ... rest of methods ...
}
```

**Before (around line 188):**
```javascript
methods: {
    getChildUniqueKey(child) {
        // ...
    },
    
    async toggle(event) {
        // ...
    }
    // NO openContextMenu method!
}
```

**After:**
```javascript
methods: {
    getChildUniqueKey(child) {
        // ...
    },
    
    async toggle(event) {
        // ...
    },
    
    openContextMenu(event, node) {
        this.$emit("open-context-menu", event, node);
    }
}
```

---

### STEP 2: Verify ClientTree Listener (Already Correct)

**File:** `src/renderer/src/views/TreeNode/Client/ClientTree/index.vue`

**Check line 20:**
```vue
@open-context-menu="openContextMenuClient"
```

✅ This should already exist and work correctly.

---

### STEP 3: Fix ContextMenu.vue Template (Optional but Recommended)

**File:** `src/renderer/src/views/Common/ContextMenu.vue`

**Fix lines 15, 18, 21, 24, 27, 43, 46:**

**Before:**
```vue
<li v-if="this.selectedNode && this.selectedNode.mode == 'organisation'" @click="addOrganisation">
```

**After:**
```vue
<li v-if="selectedNode && selectedNode.mode == 'organisation'" @click="addOrganisation">
```

**Remove `this.` from all template v-if conditions** (Vue 3 doesn't need `this.` in templates)

---

## ✅ VERIFICATION STEPS

### Test 1: Right-click on Tree Node
1. App running (`npm run dev`)
2. Navigate to home/tree
3. **Right-click on any node** (e.g., Substation, Bay)
4. **Expected:** Context menu appears

### Test 2: Create New Node
1. Right-click on "Organisation"
2. Click "Add substation"
3. **Expected:** Dialog opens

### Test 3: Add Asset to Bay
1. Right-click on "Bay"
2. Hover over "Add asset"
3. **Expected:** Submenu appears with asset types (Transformer, Bushing, etc.)
4. Click "Add Transformer"
5. **Expected:** Transformer dialog opens

---

## 📝 FILES TO MODIFY

| File | Change | Lines | Priority |
|------|--------|-------|----------|
| `TreeNode.vue` | Add `openContextMenu` method | After line 187 | 🔴 CRITICAL |
| `ContextMenu.vue` | Remove `this.` from template | 15, 18, 21, 24, 27, 43, 46, etc. | 🟡 RECOMMENDED |

---

## 🚀 QUICK FIX CHECKLIST

- [ ] **Step 1:** Add `openContextMenu` method to TreeNode.vue
  - [ ] Find methods section
  - [ ] Add the method before closing brace
  - [ ] Save file

- [ ] **Step 2:** Verify ClientTree has listener (no change needed)
  - [ ] Check line 20 has `@open-context-menu="openContextMenuClient"`

- [ ] **Step 3:** Optional - Clean up ContextMenu.vue template
  - [ ] Remove `this.` from v-if conditions
  - [ ] Save file

- [ ] **Test:** Right-click tree node
  - [ ] Context menu appears
  - [ ] Can click "Add substation"
  - [ ] Dialog opens

---

## 📊 COMPARISON: WHY CONTEXT MENU BROKE

| Vue 2 | Vue 3 | Status |
|-------|-------|--------|
| TreeNode has `openContextMenu` method | TreeNode missing `openContextMenu` method | ❌ BROKEN |
| Method emits `open-context-menu` event | No event emission | ❌ BROKEN |
| ClientTree listens to event | Listener exists but event never fires | ❌ EVENT NOT TRIGGERED |
| ContextMenu gets called | ContextMenu never gets called | ❌ NO CONTEXT MENU |

---

## 🎯 EXPECTED FLOW AFTER FIX

```
User right-clicks node
    ↓
TreeNode @contextmenu handler fires
    ↓
Calls openContextMenu method (NOW FIXED!)
    ↓
Emits open-context-menu event
    ↓
ClientTree listener catches it: @open-context-menu="openContextMenuClient"
    ↓
Calls openContextMenuClient with event & node
    ↓
Calculates menu position
    ↓
Calls this.$refs.contextMenuClient.openContextMenu()
    ↓
ContextMenu becomes visible = true
    ↓
✅ Context menu appears!
```

---

## 📋 ADDITIONAL NOTES

### Why This Happened
- In Vue 2, TreeNode had `openContextMenu` method that emitted events
- During Vue 2→Vue3 migration, this method was accidentally removed
- Template still called the method, but it didn't exist
- Silent failure = no error, just broken functionality

### Why It's Important
- Users can't right-click to add nodes
- Must use alternative methods (buttons, etc.)
- Trees can't be modified easily

### Prevention
- Run `npm run typecheck` to catch missing methods
- Test right-click functionality after migration
- Add e2e tests for context menu

---

## ⏱️ TIME TO FIX

- **Step 1:** 2 minutes (add one method)
- **Step 2:** 1 minute (verification only)
- **Step 3:** 3 minutes (optional cleanup)
- **Testing:** 5 minutes
- **TOTAL:** ~10 minutes

---

## 🔧 EXACT CODE TO ADD

**File:** `src/renderer/src/views/Common/TreeNode.vue`

**Find this section (around line 187):**
```javascript
    methods: {
        getChildUniqueKey(child) {
            if (!child.mrid) return Math.random().toString(36).substr(2, 9)
            if (child.mode === 'asset') {
                return `${child.mrid}_${child.asset}`
            }
            return `${child.mrid}_${child.mode}`
        },
        async toggle(event) {
```

**Add this method BEFORE `getChildUniqueKey`:**
```javascript
    methods: {
        openContextMenu(event, node) {
            this.$emit("open-context-menu", event, node);
        },
        
        getChildUniqueKey(child) {
```

**OR add it AFTER `getChildUniqueKey`:**
```javascript
        getChildUniqueKey(child) {
            if (!child.mrid) return Math.random().toString(36).substr(2, 9)
            if (child.mode === 'asset') {
                return `${child.mrid}_${child.asset}`
            }
            return `${child.mrid}_${child.mode}`
        },
        
        openContextMenu(event, node) {
            this.$emit("open-context-menu", event, node);
        },
        
        async toggle(event) {
```

---

## ✨ AFTER FIX

✅ Right-click on any tree node → Context menu appears  
✅ Click "Add Substation" → Dialog opens  
✅ Click "Add Transformer" → Dialog opens  
✅ All context menu features work  
✅ Can create new nodes again!

---

**Ready to apply this fix?** 🚀

Start with Step 1 - adding the `openContextMenu` method to TreeNode.vue
