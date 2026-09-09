import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store'
import Layout from '../layout/index.vue'
import LoginView from '../views/LoginView/index.vue'
import TreeNavigation from '../views/TreeNode/treeNavigation.vue'
import OnlineMonitoringDataView from '../views/OnlineMonitoringDataView/index.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        meta: { title: 'Home' },
        component: TreeNavigation
      },
      {
        path: '/login',
        name: 'login',
        meta: { title: 'Login' },
        component: LoginView
      },
      {
        path: '/online-monitoring-data',
        name: 'online-monitoring-data',
        meta: { title: 'Online Monitoring Data' },
        component: OnlineMonitoringDataView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, _from, next) => {
  const isAuthenticated = store.state.isAuthenticated
  if (isAuthenticated) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (_from.path === '/manage' && to.path === '/home') {
        store.commit('CLEAR_SELECTED')
      }
      next()
    }
  } else {
    if (['/login'].indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.beforeEach((to, _from, next) => {
  if (to.path) {
    document.title = (to.meta.title as string) || 'App'
  }
  next()
})

router.onError((error) => {
  console.error('[Router Error]', error)
  if (error.message && error.message.includes('Failed to fetch dynamically imported module')) {
    console.warn('[Router] Dynamic import failed, clearing auth and redirecting to /login')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('role')
    store.commit('CLEAR_USER')
    router.replace('/login')
  }
})

export default router
