Dựa trên phân tích dự án, đây là thứ tự ưu tiên ĐÚNG cho migration:
---
🏗️ THỨ TỰ ƯU TIÊN (Bottom-Up Approach)
┌─────────────────────────────────────────────────────────┐
│  BƯỚC 1: CONVERT MAIN PROCESS                          │
│  └── background.js → src/main/index.ts                 │
│  ↓                                                        │
│  BƯỚC 2: CONVERT PRELOAD                                │
│  └── preload.js → src/preload/index.ts                  │
│  ↓                                                        │
│  BƯỚC 3: CONVERT VUE ENTRY (CRITICAL)                  │
│  └── main.js → src/renderer/src/main.ts                  │
│  ↓                                                        │
│  BƯỚC 4: CONVERT ROUTER                                 │
│  └── router/index.js → router/index.ts                  │
│  ↓                                                        │
│  BƯỚC 5: CONVERT STORE                                  │
│  └── store/index.js → store/index.ts                    │
│  ↓                                                        │
│  BƯỚC 6: CONVERT APP.VUE                                │
│  └── App.vue → App.vue (update syntax)                  │
│  ↓                                                        │
│  BƯỚC 7: COPY COMPONENTS                                │
│  └── GlobalLoading, TopBar, LogBar                      │
│  ↓                                                        │
│  BƯỚC 8: COPY VIEWS (theo priority)                     │
│  └── LoginView → Tree → Common → Jobs                    │
└───────────────────────────────────────────
🎯 TẠI SAO PHẢI THEO THỨ TỰ NÀY?
Bước	Lý do
1. Main Process	Electron cần chạy trước để load window
2. Preload	Preload cung cấp IPC bridge cho renderer
3. Vue Entry	Vue app cần entry point để mount
4. Router	Navigation phụ thuộc router
5. Store	State management cần có trước khi render views
6. App.vue	Root component chứa router-view
7-8. Views	Cuối cùng vì phụ thuộc tất cả trên
---
⚠️ CÁCH TIẾP CẬN SAI (NÊN TRÁNH)
❌ Copy views trước rồi mới fix core
   → View sẽ crash vì thiếu router, store, IPC
❌ Bỏ qua main process  
   → Electron không load được window
❌ Copy preload trước main process
   → Preload cần main process đã import
---
### 📋 BẮT ĐẦU TỪ ĐÂY
**Bạn nên bắt đầu với việc đọc và convert theo thứ tự:**
1. **`src/background.js`** (544 lines) - Đọc trước để hiểu Electron main process
2. **`src/preload.js`** (148 lines) - Đọc để hiểu IPC bridge
3. **`src/main.js`** (39 lines) - Vue entry point cần convert trước
4. **`src/router/index.js`** - Router config
5. **`src/store/index.js`** - Store config
Sau khi đọc và hiểu 5 files này → Convert theo thứ tự.
# MIGRATION PLAN: Vue 2 (Tester_client) → Vue 3 (LatestTester)

## MỤC TIÊU

Migrate toàn bộ code và chức năng từ dự án Vue 2 cũ sang dự án Vue 3 electron-vite mới, giữ nguyên 100% functionality và giao diện.

---

## DỰ ÁN NGUỒN (CŨ)

**Path:** `C:\tester\Tester_client`

| Thông tin | Chi tiết |
|-----------|----------|
| Vue | 2.6.14 |
| Node | 16 |
| Build Tool | Vue CLI |
| Electron | 13.0.0 |
| Router | Vue Router 3.6.5 |
| Store | Vuex 3.6.2 |
| UI Framework | Element UI 2.15.8 |
| CSS Preprocessor | node-sass 7.0.1 |

### Cấu trúc dự án cũ:
```
Tester_client/
├── public/
│   ├── index.html
│   ├── style/
│   ├── img/
│   └── fontawesome/
├── src/
│   ├── main.js                    ← Vue entry point
│   ├── App.vue                    ← Root component
│   ├── background.js             ← Electron main process
│   ├── preload.js                 ← Electron preload
│   ├── router/
│   │   └── index.js              ← Vue Router
│   ├── store/
│   │   └── index.js              ← Vuex store
│   ├── views/                    ← Tất cả views (~100 files)
│   ├── components/
│   ├── assets/
│   ├── ipcmain/                   ← Electron IPC handlers
│   ├── preload/                   ← Preload modules
│   ├── utils/
│   └── config/
├── package.json
├── vue.config.js
├── babel.config.js
└── database/
    └── database.db               ← SQLite database
```

---

## DỰ ÁN ĐÍCH (MỚI)

**Path:** `C:\update_2\LatestTester`

| Thông tin | Chi tiết |
|-----------|----------|
| Vue | 3.5.25 |
| Node | 24 |
| Build Tool | electron-vite + Vite 7.x |
| Electron | 39.2.6 |
| Router | Vue Router 4.x |
| Store | Vuex 4.x (hoặc Pinia) |
| UI Framework | Element Plus |
| CSS Preprocessor | sass |
| TypeScript | Có (tsconfig) |

### Cấu trúc dự án mới:
```
LatestTester/
├── electron.vite.config.ts        ← Electron-vite config
├── src/
│   ├── main/
│   │   └── index.ts              ← Electron main process (MỚI)
│   ├── preload/
│   │   └── index.ts              ← Preload script (MỚI)
│   └── renderer/
│       ├── index.html            ← HTML entry
│       └── src/
│           ├── main.ts           ← Vue entry point (MỚI)
│           ├── App.vue           ← Root component (MỚI)
│           ├── router/           ← Vue Router (MỚI)
│           ├── store/            ← Vuex store (MỚI)
│           ├── views/            ← Views (COPY)
│           ├── components/       ← Components (COPY)
│           ├── assets/          ← Assets (COPY)
│           └── ...other
├── package.json
└── tsconfig.json
```

---

## SO SÁNH TRƯỚC SAU

### File Mapping (Old → New)

| Dự án Cũ | Dự án Mới | Action |
|----------|------------|--------|
| `src/main.js` | `src/renderer/src/main.ts` | **CONVERT + COPY** |
| `src/App.vue` | `src/renderer/src/App.vue` | **CONVERT + COPY** |
| `src/background.js` | `src/main/index.ts` | **CONVERT + COPY** |
| `src/preload.js` | `src/preload/index.ts` | **CONVERT + COPY** |
| `src/router/index.js` | `src/renderer/src/router/index.ts` | **CONVERT + COPY** |
| `src/store/index.js` | `src/renderer/src/store/index.ts` | **CONVERT + COPY** |
| `src/views/` | `src/renderer/src/views/` | **COPY** |
| `src/components/` | `src/renderer/src/components/` | **COPY** |
| `src/assets/` | `src/renderer/src/assets/` | **COPY** |
| `src/utils/` | `src/renderer/src/utils/` | **COPY** |
| `src/config/` | `src/renderer/src/config/` | **COPY** |
| `src/ipcmain/` | `src/main/` (merge) | **MERGE + CONVERT** |
| `src/preload/entity/` | `src/preload/` (merge) | **MERGE + CONVERT** |
| `public/index.html` | `src/renderer/index.html` | **MERGE** |

### Dependencies Mapping

| Old (Vue 2) | New (Vue 3) | Action |
|------------|------------|--------|
| `vue: ^2.6.14` | `vue: ^3.5.25` | **UPDATE** |
| `vue-router: ^3.6.5` | `vue-router: ^4.5.0` | **UPDATE** |
| `vuex: ^3.6.2` | `vuex: ^4.1.0` | **UPDATE** |
| `element-ui: ^2.15.8` | `element-plus: ^2.9.0` | **REPLACE** |
| `node-sass: ^7.0.1` | `sass: ^1.84.0` | **REPLACE** |
| `ag-grid-vue: ^28.2.1` | `ag-grid-vue: ^28.2.1` | **KEEP** |
| `axios: ^0.27.2` | `axios: ^1.x` | **UPDATE** |
| `vue-cli-service` | **BỎ** | **REMOVE** |
| `vue-cli-plugin-electron-builder` | **BỎ** | **REMOVE** |

### Libs GIỮ NGUYÊN (có Vue 3 support):
- axios
- knex
- exceljs
- docx
- csv
- uuid
- semver
- qs

### Libs CẦN CHECK:
- `@journeyapps/sqlcipher` - native module, rebuild needed
- `puppeteer` - check version compatible
- `edge` - native module
- `leaflet` + `vue2-leaflet` - cần tìm alternative

---

## CÁC BƯỚC THỰC HIỆN CHI TIẾT

---

### BƯỚC 1: BACKUP DỰ ÁN CŨ

```bash
# 1. Copy folder Tester_client ra nơi an toàn
xcopy "G:\working\tester_client\Tester_client" "G:\working\tester_client\Tester_client_backup" /E /I /Y

# 2. Hoặc tạo git branch (nếu có git)
cd G:\working\tester_client\Tester_client
git checkout -b migrate-vue3
```

---

### BƯỚC 2: ANALYSIS DỰ ÁN CŨ

Đọc và hiểu các file quan trọng trước:

**Core Files cần đọc:**
1. `src/main.js` - Vue entry point
2. `src/App.vue` - Root component
3. `src/router/index.js` - Router config
4. `src/store/index.js` - Store config
5. `src/background.js` - Electron main process
6. `src/preload.js` - Preload script

**Deps Files cần đọc:**
7. `package.json` - Dependencies
8. `vue.config.js` - Vue CLI config

**IPC Handlers (nhiều files):**
9. `src/ipcmain/index.js`
10. `src/ipcmain/entity/*`
11. `src/ipcmain/cim/*`

---

### BƯỚC 3: SETUP DỰ ÁN MỚI

```bash
# 1. Kiểm tra Node version
node --version  # Nên là 24.x

# 2. Cài dependencies cho dự án mới
cd G:\update_2\LatestTester

# Cài Vue 3 + Router + Store
npm install vue@^3.5.25 vue-router@^4.5.0 vuex@^4.1.0

# Cài UI framework
npm install element-plus

# Cài CSS preprocessor
npm install -D sass

# Cài các libs cần thiết (giữ từ dự án cũ)
npm install axios knex exceljs docx csv uuid semver qs
npm install ag-grid-vue ag-grid-community

# Cài native modules (nếu cần)
npm install @journeyapps/sqlcipher
npm install sqlite3

# Rebuild native modules cho Node 24
npm rebuild
```

---

### BƯỚC 4: CONVERT MAIN PROCESS

**File cũ:** `src/background.js` (544 lines)

**Chuyển thành:** `src/main/index.ts`

**Changes cần thiết:**

```typescript
// OLD (background.js)
import {app, protocol, BrowserWindow, ipcMain, screen} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'
import sqlite3 from '@journeyapps/sqlcipher'

// NEW (main/index.ts)
import {app, protocol, BrowserWindow, ipcMain, screen} from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import sqlite3 from '@journeyapps/sqlcipher'

// Các IPC handlers giữ nguyên pattern
// Database operations giữ nguyên
// Python worker spawn giữ nguyên
```

**Checklist cho main process:**
- [ ] Import statements update
- [ ] electronApp setup
- [ ] Window creation update
- [ ] IPC handlers giữ nguyên
- [ ] Database connection giữ nguyên
- [ ] Python worker giữ nguyên
- [ ] preload path update

---

### BƯỚC 5: CONVERT PRELOAD

**File cũ:** `src/preload.js` (148 lines)

**Chuyển thành:** `src/preload/index.ts`

**Changes cần thiết:**

```typescript
// OLD (preload.js)
const { contextBridge, ipcRenderer } = require('electron')
const windowControlAPI = { ... }

// NEW (preload/index.ts)
import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  // Copy all APIs từ preload.js
  // Thay đổi: require() → import hoặc giữ nguyên object
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
```

**Checklist cho preload:**
- [ ] Convert CommonJS → ES Module
- [ ] Import statements update
- [ ] contextBridge giữ nguyên pattern
- [ ] Tất cả API methods giữ nguyên
- [ ] Test: window.electronAPI có accessible không

---

### BƯỚC 6: CONVERT VUE ENTRY

**File cũ:** `src/main.js` (39 lines)

**Chuyển thành:** `src/renderer/src/main.ts`

```typescript
// OLD (main.js)
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'

Vue.use(ElementUI)

const app = new Vue({
  router,
  store,
  render: h => h(App)
})
app.$mount('#app')

// NEW (main.ts)
import { createApp } from 'vue'
import { createRouter } from 'vue-router'
import { createStore } from 'vuex'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.mount('#app')
```

**Checklist cho main.ts:**
- [ ] createApp thay new Vue
- [ ] Vue Router 4 import
- [ ] Vuex 4 import
- [ ] Element Plus import (thay Element UI)
- [ ] Global components register
- [ ] Global prototypes (.$config, .$helper, etc.)

---

### BƯỚC 7: CONVERT ROUTER

**File cũ:** `src/router/index.js`

**Chuyển thành:** `src/renderer/src/router/index.ts`

```typescript
// OLD (Vue Router 3)
import VueRouter from 'vue-router'
const router = new VueRouter({ mode: 'hash', routes })

// NEW (Vue Router 4)
import { createRouter, createWebHashHistory } from 'vue-router'
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
```

**Checklist cho router:**
- [ ] createRouter thay new VueRouter
- [ ] createWebHashHistory() thay mode: 'hash'
- [ ] Routes array giữ nguyên
- [ ] Navigation guards giữ nguyên pattern
- [ ] Import paths update

---

### BƯỚC 8: CONVERT STORE

**File cũ:** `src/store/index.js`

**Chuyển thành:** `src/renderer/src/store/index.ts`

```typescript
// OLD (Vuex 3)
import Vuex from 'vuex'
export default new Vuex.Store({ ... })

// NEW (Vuex 4)
import { createStore } from 'vuex'
export default createStore({
  state() { return { ... } },
  // ... rest giữ nguyên syntax
})
```

**Checklist cho store:**
- [ ] createStore thay new Vuex.Store
- [ ] state phải là function: `state() { return {...} }`
- [ ] modules giữ nguyên
- [ ] getters, mutations, actions giữ nguyên

---

### BƯỚC 9: CONVERT APP.VUE

**File cũ:** `src/App.vue`

**Chuyển thành:** `src/renderer/src/App.vue`

```vue
<!-- OLD -->
<template>
  <div id="app">
    <router-view />
    <GlobalLoading />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: { GlobalLoading }
}
</script>

<!-- NEW -->
<template>
  <div id="app">
    <router-view />
    <GlobalLoading />
  </div>
</template>

<script setup lang="ts">
import GlobalLoading from '@/components/GlobalLoading.vue'
</script>
```

**Checklist cho App.vue:**
- [ ] Options API → `<script setup>` (tùy chọn, có thể giữ Options API với vue-compat)
- [ ] Component imports giữ nguyên
- [ ] Template giữ nguyên

---

### BƯỚC 10: COPY VIEWS VÀ COMPONENTS

**Thứ tự ưu tiên:**

```
1. Auth Module (LoginView)
2. Core Navigation (treeNavigation, Layout)
3. Server/Client Trees
4. Common Components (TreeNode, Tabs, CustomInput, Attachment)
5. Job Views (Transformer, CircuitBreaker, VoltageTransformer, etc.)
6. Asset Views
7. Tree Dialogs
8. Less Critical (Flattens, Mappings, CimEntities)
```

**Copy structure:**
```bash
# Copy views
xcopy "G:\working\tester_client\Tester_client\src\views" "G:\update_2\LatestTester\src\renderer\src\views" /E /I /Y

# Copy components
xcopy "G:\working\tester_client\Tester_client\src\components" "G:\update_2\LatestTester\src\renderer\src\components" /E /I /Y

# Copy assets
xcopy "G:\working\tester_client\Tester_client\src\assets" "G:\update_2\LatestTester\src\renderer\src\assets" /E /I /Y

# Copy utils
xcopy "G:\working\tester_client\Tester_client\src\utils" "G:\update_2\LatestTester\src\renderer\src\utils" /E /I /Y

# Copy config
xcopy "G:\working\tester_client\Tester_client\src\config" "G:\update_2\LatestTester\src\renderer\src\config" /E /I /Y
```

---

### BƯỚC 11: MERGE HTML ENTRY

**File cũ:** `public/index.html`

**Chuyển thành:** `src/renderer/index.html`

```html
<!-- OLD (public/index.html) -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>AT Digital Tester</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>

<!-- NEW (src/renderer/index.html) -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>AT Digital Tester</title>
    <!-- Copy CSS links từ public/style/ vào đây hoặc main.ts -->
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./src/main.ts"></script>
  </body>
</html>
```

---

### BƯỚC 12: UPDATE VITE CONFIG

**File:** `electron.vite.config.ts`

```typescript
import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts')
        }
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [vue()]
  }
})
```

---

### BƯỚC 13: CONVERT IPC HANDLERS

**Source:** `src/ipcmain/` (nhiều files)

**Destination:** `src/main/` (merge vào main/index.ts hoặc tách ra)

```typescript
// Các files ipcmain cần convert:
// - ipcmain/index.js
// - ipcmain/cim/*
// - ipcmain/entity/*

// Pattern mới trong main/index.ts:
import { ipcCim, ipcEntity, ipcAppOption } from './ipc'

// Register handlers:
ipcMain.handle('channel-name', async (event, ...args) => {
  // ...
})
```

---

### BƯỚC 14: CONVERT PRELOAD MODULES

**Source:** `src/preload/entity/*`, `src/preload/userPreload.js`

**Destination:** `src/preload/index.ts` (merge)

```typescript
// OLD pattern (preload.js)
import { userPreload } from '@/preload/index.js'

// NEW pattern - merge all vào preload/index.ts
const userAPI = { /* copy from userPreload */ }
const entityAPI = { /* copy from entityPreload */ }
const cimAPI = { /* copy from cimPreload */ }

// contextBridge all
contextBridge.exposeInMainWorld('electronAPI', {
  ...userAPI,
  ...entityAPI,
  ...cimAPI,
  // window controls, file converter, etc.
})
```

---

### BƯỚC 15: BUILD VÀ TEST

**Commands:**

```bash
# 1. Type check
npm run typecheck

# 2. Dev server
npm run dev

# 3. Fix lỗi nếu có

# 4. Build production
npm run build

# 5. Build Electron
npm run build:win
```

**Test checklist:**
- [ ] App launch được
- [ ] Login hoạt động
- [ ] Navigation hoạt động
- [ ] Tree hiển thị đúng
- [ ] Job views load được
- [ ] Database operations hoạt động
- [ ] File upload/download hoạt động
- [ ] Export/Import hoạt động

---

## FILES ĐỌC TRƯỚC KHI BẮT ĐẦU

### Dự án cũ - Core Files:
1. `G:\working\tester_client\Tester_client\src\main.js`
2. `G:\working\tester_client\Tester_client\src\App.vue`
3. `G:\working\tester_client\Tester_client\src\router\index.js`
4. `G:\working\tester_client\Tester_client\src\store\index.js`
5. `G:\working\tester_client\Tester_client\src\background.js`
6. `G:\working\tester_client\Tester_client\src\preload.js`

### Dự án cũ - IPC và Preload:
7. `G:\working\tester_client\Tester_client\src\ipcmain\index.js`
8. `G:\working\tester_client\Tester_client\src\preload\index.js`
9. `G:\working\tester_client\Tester_client\src\preload\entity\index.js`

### Dự án cũ - Package và Config:
10. `G:\working\tester_client\Tester_client\package.json`
11. `G:\working\tester_client\Tester_client\vue.config.js`

### Dự án mới - Template:
12. `G:\update_2\LatestTester\package.json`
13. `G:\update_2\LatestTester\electron.vite.config.ts`
14. `G:\update_2\LatestTester\src\main\index.ts`
15. `G:\update_2\LatestTester\src\preload\index.ts`
16. `G:\update_2\LatestTester\src\renderer\src\main.ts`

---

## CHECKLIST HOÀN THÀNH

- [ ] Backup dự án cũ
- [ ] Đọc và hiểu tất cả core files
- [ ] Setup dependencies mới
- [ ] Convert main process (background.js → main/index.ts)
- [ ] Convert preload (preload.js → preload/index.ts)
- [ ] Convert Vue entry (main.js → main.ts)
- [ ] Convert router (router/index.js → router/index.ts)
- [ ] Convert store (store/index.js → store/index.ts)
- [ ] Convert App.vue
- [ ] Copy tất cả views
- [ ] Copy tất cả components
- [ ] Copy assets, utils, config
- [ ] Merge HTML entry
- [ ] Update electron.vite.config.ts
- [ ] Convert và merge IPC handlers
- [ ] Convert và merge preload modules
- [ ] Type check pass
- [ ] Dev server chạy được
- [ ] Build production thành công
- [ ] Test toàn bộ chức năng

---

## TIMELINE

| Ngày | Công việc |
|------|-----------|
| Day 1 | Backup + Analysis + Setup dependencies |
| Day 2 | Convert main process + preload |
| Day 3 | Convert Vue entry + router + store |
| Day 4 | Copy views theo priority (Auth → Tree → Common) |
| Day 5 | Copy remaining views (Jobs, Assets, Dialogs) |
| Day 6 | Fix lỗi + HTML merge + config update |
| Day 7 | Build + Test + Fix bugs |
| Day 8 | Final testing + cleanup |

---

## COMMANDS CHEATSHEET

```bash
# Backup
xcopy "G:\working\tester_client\Tester_client" "G:\working\tester_client\Tester_client_backup" /E /I /Y

# Copy views
xcopy "G:\working\tester_client\Tester_client\src\views" "G:\update_2\LatestTester\src\renderer\src\views" /E /I /Y

# Copy components
xcopy "G:\working\tester_client\Tester_client\src\components" "G:\update_2\LatestTester\src\renderer\src\components" /E /I /Y

# Copy assets
xcopy "G:\working\tester_client\Tester_client\src\assets" "G:\update_2\LatestTester\src\renderer\src\assets" /E /I /Y

# Copy utils
xcopy "G:\working\tester_client\Tester_client\src\utils" "G:\update_2\LatestTester\src\renderer\src\utils" /E /I /Y

# Install Vue 3 deps
cd G:\update_2\LatestTester
npm install vue@^3.5.25 vue-router@^4.5.0 vuex@^4.1.0
npm install element-plus
npm install -D sass

# Dev
npm run dev

# Build
npm run build && npm run build:win
```