import store from '@/store'

const buildLoadingProxy = () => ({
    start: (text = 'Loading...', isHeavy = false) => {
        store.dispatch('startLoading', text, 'default', !!isHeavy)
    },
    stop: () => {
        store.dispatch('stopLoading')
    },
    get text() {
        return store.state.loadingText
    },
    set text(value) {
        store.dispatch('startLoading', value, store.state.loadingAction || 'default', false)
    },
    get isLoading() {
        return store.state.loadingIsLoading
    },
    get action() {
        return store.state.loadingAction
    },
    get timeouts() {
        return store.state.loadingTimeouts || { default: 10000, heavy: 30000 }
    }
})

export const startLoading = (vm, { action = 'default', customText = null, type = 'default' } = {}) => {
    const text = customText || action
    const isHeavy = type === 'heavy'
    store.dispatch('startLoading', text, action, isHeavy)

    const timeouts = store.state.loadingTimeouts || { default: 10000, heavy: 30000 }
    const timeoutValue = timeouts[type] || timeouts.default || 10000

    return {
        close: () => stopLoading(vm),
        timeoutValue: timeoutValue
    }
}

export const stopLoading = (vm) => {
    return new Promise((resolve) => {
        store.dispatch('stopLoading')
        setTimeout(() => {
            resolve()
        }, 700)
    })
}

export const forceCloseLoading = (vm) => {
    return stopLoading(vm)
}

export const useLoadingStore = () => buildLoadingProxy()
