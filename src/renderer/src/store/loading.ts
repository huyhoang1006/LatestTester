import { createStore } from 'vuex'

interface LoadingState {
    isLoading: boolean
    text: string
    action: string
    failsafeTimer: ReturnType<typeof setTimeout> | null
    timeouts: {
        default: number
        heavy: number
    }
}

export const useLoadingStore = createStore({
    namespaced: true,

    state: (): LoadingState => ({
        isLoading: false,
        text: '',
        action: 'default',
        failsafeTimer: null,
        timeouts: {
            default: 10000,
            heavy: 30000
        }
    }),

    mutations: {
        START_LOADING(state, payload: { text?: string; action?: string; isHeavy?: boolean }) {
            if (state.failsafeTimer) {
                clearTimeout(state.failsafeTimer)
            }

            state.isLoading = true
            state.text = payload.text || ''
            state.action = payload.action || 'default'

            const timeout = payload.isHeavy ? state.timeouts.heavy : state.timeouts.default
            state.failsafeTimer = setTimeout(() => {
                state.failsafeTimer = null
                state.isLoading = false
                state.text = ''
            }, timeout)
        },

        STOP_LOADING(state) {
            state.isLoading = false
            state.text = ''
            state.action = 'default'
            if (state.failsafeTimer) {
                clearTimeout(state.failsafeTimer)
                state.failsafeTimer = null
            }
        },

        INIT_LOADING(state) {
            state.isLoading = false
            state.text = ''
            state.action = 'default'
            state.failsafeTimer = null
        }
    },

    actions: {
        start({ commit }: { commit: Function }, text: string = 'Loading...', action: string = 'default', isHeavy: boolean = false) {
            commit('START_LOADING', { text, action, isHeavy })
        },

        stop({ commit }: { commit: Function }) {
            commit('STOP_LOADING')
        },

        initLoading({ commit }: { commit: Function }) {
            commit('INIT_LOADING')
        }
    },

    getters: {
        isLoading: (state: LoadingState) => state.isLoading,
        text: (state: LoadingState) => state.text,
        action: (state: LoadingState) => state.action
    }
})