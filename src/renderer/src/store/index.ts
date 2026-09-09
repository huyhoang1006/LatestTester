import { createStore } from 'vuex'

export default createStore({
  state: () => ({
    user: null,
    isAuthenticated: false,
    token: null,
    role: null,
    serverAddr: '',
    loginAddr: '',
    serviceAddr: '',
    selectedLocation: [],
    selectedAsset: [],
    selectedJob: [],
    selectedLocationSync: [],
    selectedAssetSync: [],
    selectedJobSync: [],

    loadingIsLoading: false,
    loadingText: '',
    loadingAction: 'default',
    loadingFailsafeTimer: null,
    loadingTimeouts: {
      default: 10000,
      heavy: 30000
    }
  }),

  getters: {
    getUser: (state: any) => state.user,
    getSelectedLocation: (state: any) => state.selectedLocation,
    getSelectedAsset: (state: any) => state.selectedAsset,
    getSelectedJob: (state: any) => state.selectedJob,
    getSelectedLocationSync: (state: any) => state.selectedLocationSync,
    getSelectedAssetSync: (state: any) => state.selectedAssetSync,
    getSelectedJobSync: (state: any) => state.selectedJobSync,
    getIsAuthenticated: (state: any) => state.isAuthenticated,
    getToken: (state: any) => state.token,
    getRole: (state: any) => state.role,
    getServerAddr: (state: any) => state.serverAddr,
    getLoginAddr: (state: any) => state.loginAddr,
    getServiceAddr: (state: any) => state.serviceAddr,
    getUserId: (state: any) => state.user?.user_id || state.user?.id,
    isLoading: (state: any) => state.loadingIsLoading,
    getLoadingText: (state: any) => state.loadingText,
    getLoadingAction: (state: any) => state.loadingAction
  },

  mutations: {
    SET_USER(state: any, user: any) {
      if (user !== null) {
        state.user = { ...user }
        state.isAuthenticated = true
        state.token = user.token || null
        state.role = user.role || null
      } else {
        state.user = null
        state.isAuthenticated = false
        state.token = null
        state.role = null
      }
    },

    SET_SELECTED_LOCATION(state: any, selectedLocation: string[]) {
      state.selectedLocation = [...selectedLocation]
    },

    SET_SELECTED_ASSET(state: any, selectedAsset: string[]) {
      state.selectedAsset = [...selectedAsset]
    },

    SET_SELECTED_JOB(state: any, selectedJob: string[]) {
      state.selectedJob = [...selectedJob]
    },

    SET_SELECTED_LOCATION_SYNC(state: any, selectedLocationSync: string[]) {
      state.selectedLocationSync = [...selectedLocationSync]
    },

    SET_SELECTED_ASSET_SYNC(state: any, selectedAssetSync: string[]) {
      state.selectedAssetSync = [...selectedAssetSync]
    },

    SET_SELECTED_JOB_SYNC(state: any, selectedJobSync: string[]) {
      state.selectedJobSync = [...selectedJobSync]
    },

    SET_IS_AUTHENTICATED(state: any, isAuthenticated: boolean) {
      state.isAuthenticated = isAuthenticated
    },

    SET_TOKEN(state: any, token: string | null) {
      state.token = token
    },

    SET_ROLE(state: any, role: string | null) {
      state.role = role
    },

    SET_SERVER_ADDR(state: any, serverAddr: string) {
      state.serverAddr = serverAddr
    },

    SET_LOGIN_ADDR(state: any, loginAddr: string) {
      state.loginAddr = loginAddr
    },

    SET_SERVICE_ADDR(state: any, serviceAddr: string) {
      state.serviceAddr = serviceAddr
    },

    CLEAR_SELECTED(state: any) {
      state.selectedLocation = []
      state.selectedAsset = []
      state.selectedJob = []
    },

    CLEAR_USER(state: any) {
      state.user = null
      state.isAuthenticated = false
      state.token = null
      state.role = null
    },

    START_LOADING(state: any, payload: { text?: string; action?: string; isHeavy?: boolean }) {
      if (state.loadingFailsafeTimer) {
        clearTimeout(state.loadingFailsafeTimer)
      }

      state.loadingIsLoading = true
      state.loadingText = payload.text || ''
      state.loadingAction = payload.action || 'default'

      const timeout = payload.isHeavy ? state.loadingTimeouts.heavy : state.loadingTimeouts.default
      state.loadingFailsafeTimer = setTimeout(() => {
        state.loadingFailsafeTimer = null
        state.loadingIsLoading = false
        state.loadingText = ''
      }, timeout)
    },

    STOP_LOADING(state: any) {
      state.loadingIsLoading = false
      state.loadingText = ''
      state.loadingAction = 'default'
      if (state.loadingFailsafeTimer) {
        clearTimeout(state.loadingFailsafeTimer)
        state.loadingFailsafeTimer = null
      }
    },

    INIT_LOADING(state: any) {
      state.loadingIsLoading = false
      state.loadingText = ''
      state.loadingAction = 'default'
      state.loadingFailsafeTimer = null
    }
  },

  actions: {
    setUser({ commit }: { commit: Function }, user: any) {
      commit('SET_USER', user)
    },

    setSelectedLocation({ commit }: { commit: Function }, selectedLocation: string[]) {
      commit('SET_SELECTED_LOCATION', selectedLocation)
    },

    setSelectedAsset({ commit }: { commit: Function }, selectedAsset: string[]) {
      commit('SET_SELECTED_ASSET', selectedAsset)
    },

    setSelectedJob({ commit }: { commit: Function }, selectedJob: string[]) {
      commit('SET_SELECTED_JOB', selectedJob)
    },

    setSelectedLocationSync({ commit }: { commit: Function }, selectedLocationSync: string[]) {
      commit('SET_SELECTED_LOCATION_SYNC', selectedLocationSync)
    },

    setSelectedAssetSync({ commit }: { commit: Function }, selectedAssetSync: string[]) {
      commit('SET_SELECTED_ASSET_SYNC', selectedAssetSync)
    },

    setSelectedJobSync({ commit }: { commit: Function }, selectedJobSync: string[]) {
      commit('SET_SELECTED_JOB_SYNC', selectedJobSync)
    },

    setIsAuthenticated({ commit }: { commit: Function }, isAuthenticated: boolean) {
      commit('SET_IS_AUTHENTICATED', isAuthenticated)
    },

    setToken({ commit }: { commit: Function }, token: string | null) {
      commit('SET_TOKEN', token)
    },

    setRole({ commit }: { commit: Function }, role: string | null) {
      commit('SET_ROLE', role)
    },

    setServerAddr({ commit }: { commit: Function }, serverAddr: string) {
      commit('SET_SERVER_ADDR', serverAddr)
    },

    setLoginAddr({ commit }: { commit: Function }, loginAddr: string) {
      commit('SET_LOGIN_ADDR', loginAddr)
    },

    setServiceAddr({ commit }: { commit: Function }, serviceAddr: string) {
      commit('SET_SERVICE_ADDR', serviceAddr)
    },

    clearSelected({ commit }: { commit: Function }) {
      commit('CLEAR_SELECTED')
    },

    clearUser({ commit }: { commit: Function }) {
      commit('CLEAR_USER')
    },

    startLoading(
      { commit }: { commit: Function },
      text: string = 'Loading...',
      action: string = 'default',
      isHeavy: boolean = false
    ) {
      commit('START_LOADING', { text, action, isHeavy })
    },

    stopLoading({ commit }: { commit: Function }) {
      commit('STOP_LOADING')
    },

    initLoading({ commit }: { commit: Function }) {
      commit('INIT_LOADING')
    }
  }
})
