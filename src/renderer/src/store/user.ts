import { createStore } from 'vuex'

interface User {
    id?: string
    user_id?: string
    username?: string
    email?: string
    role?: string
    token?: string
}

interface UserState {
    user: User | null
    isAuthenticated: boolean
    token: string | null
    role: string | null
    serverAddr: string
    selectedLocation: string[]
    selectedAsset: string[]
    selectedJob: string[]
    selectedLocationSync: string[]
    selectedAssetSync: string[]
    selectedJobSync: string[]
}

export const useUserStore = createStore({
    namespaced: true,

    state: (): UserState => ({
        user: null,
        isAuthenticated: false,
        token: null,
        role: null,
        serverAddr: '',
        selectedLocation: [],
        selectedAsset: [],
        selectedJob: [],
        selectedLocationSync: [],
        selectedAssetSync: [],
        selectedJobSync: []
    }),

    getters: {
        getUser: (state: UserState) => state.user,
        getSelectedLocation: (state: UserState) => state.selectedLocation,
        getSelectedAsset: (state: UserState) => state.selectedAsset,
        getSelectedJob: (state: UserState) => state.selectedJob,
        getSelectedLocationSync: (state: UserState) => state.selectedLocationSync,
        getSelectedAssetSync: (state: UserState) => state.selectedAssetSync,
        getSelectedJobSync: (state: UserState) => state.selectedJobSync,
        getIsAuthenticated: (state: UserState) => state.isAuthenticated,
        getToken: (state: UserState) => state.token,
        getRole: (state: UserState) => state.role,
        getServerAddr: (state: UserState) => state.serverAddr,
        getUserId: (state: UserState) => state.user?.user_id || state.user?.id
    },

    mutations: {
        SET_USER(state: UserState, user: User | null) {
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

        SET_SELECTED_LOCATION(state: UserState, selectedLocation: string[]) {
            state.selectedLocation = [...selectedLocation]
        },

        SET_SELECTED_ASSET(state: UserState, selectedAsset: string[]) {
            state.selectedAsset = [...selectedAsset]
        },

        SET_SELECTED_JOB(state: UserState, selectedJob: string[]) {
            state.selectedJob = [...selectedJob]
        },

        SET_SELECTED_LOCATION_SYNC(state: UserState, selectedLocationSync: string[]) {
            state.selectedLocationSync = [...selectedLocationSync]
        },

        SET_SELECTED_ASSET_SYNC(state: UserState, selectedAssetSync: string[]) {
            state.selectedAssetSync = [...selectedAssetSync]
        },

        SET_SELECTED_JOB_SYNC(state: UserState, selectedJobSync: string[]) {
            state.selectedJobSync = [...selectedJobSync]
        },

        SET_IS_AUTHENTICATED(state: UserState, isAuthenticated: boolean) {
            state.isAuthenticated = isAuthenticated
        },

        SET_TOKEN(state: UserState, token: string | null) {
            state.token = token
        },

        SET_ROLE(state: UserState, role: string | null) {
            state.role = role
        },

        SET_SERVER_ADDR(state: UserState, serverAddr: string) {
            state.serverAddr = serverAddr
        },

        CLEAR_SELECTED(state: UserState) {
            state.selectedLocation = []
            state.selectedAsset = []
            state.selectedJob = []
        },

        CLEAR_USER(state: UserState) {
            state.user = null
            state.isAuthenticated = false
            state.token = null
            state.role = null
        }
    },

    actions: {
        setUser({ commit }: { commit: Function }, user: User | null) {
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

        clearSelected({ commit }: { commit: Function }) {
            commit('CLEAR_SELECTED')
        },

        clearUser({ commit }: { commit: Function }) {
            commit('CLEAR_USER')
        }
    }
})