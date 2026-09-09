/**
 * Cầu nối giữa bảng Compare và panel Object Properties.
 * Thay thế Vue 2 EventBus (new Vue()) bằng emitter thuần.
 */

class EventBus {
  constructor() {
    this._listeners = {}
  }

  $on(event, fn) {
    ;(this._listeners[event] = this._listeners[event] || []).push(fn)
  }

  $emit(event, ...args) {
    const fns = this._listeners[event]
    if (fns) fns.forEach((fn) => fn(...args))
  }

  $off(event, fn) {
    const fns = this._listeners[event]
    if (!fns) return
    this._listeners[event] = fn ? fns.filter((f) => f !== fn) : []
  }
}

export const COMPARE_ACTIVE = 'compare-active'

const bus = new EventBus()

let openCount = 0

export const notifyCompareOpened = () => {
  openCount += 1
  if (openCount === 1) bus.$emit(COMPARE_ACTIVE, true)
}

export const notifyCompareClosed = () => {
  if (openCount === 0) return
  openCount -= 1
  if (openCount === 0) bus.$emit(COMPARE_ACTIVE, false)
}

export const compareOpenCount = () => openCount

export default bus
