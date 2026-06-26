/**
 * UpdateSchedulerService
 * Quản lý việc check update định kỳ (6 giờ)
 * Chỉ check khi app khởi động lần đầu hoặc sau 6h kể từ lần check cuối
 */

import fs from 'fs'
import path from 'path'
import { app } from 'electron'

const DEFAULT_CHECK_INTERVAL = 6 * 60 * 60 * 1000 // 6 giờ tính bằng milliseconds

export class UpdateSchedulerService {
    stateFile: string
    checkInterval: number
    scheduledTimer: any

    constructor() {
        this.stateFile = path.join(app.getPath('userData'), 'update-scheduler.json')
        this.checkInterval = DEFAULT_CHECK_INTERVAL
        this.scheduledTimer = null
    }

    getCheckInterval() {
        return this.checkInterval
    }

    setCheckInterval(ms: number) {
        this.checkInterval = ms
    }

    getState() {
        try {
            if (fs.existsSync(this.stateFile)) {
                return JSON.parse(fs.readFileSync(this.stateFile, 'utf-8'))
            }
        } catch (e: any) {
            console.warn('[Scheduler] Failed to read state:', e.message)
        }

        return {
            lastCheckTime: null,
            lastCheckResult: null,
            notifiedVersion: null,
            dismissedVersions: [] as string[]
        }
    }

    saveState(state: any) {
        try {
            fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2))
        } catch (e: any) {
            console.warn('[Scheduler] Failed to save state:', e.message)
        }
    }

    shouldCheckUpdate() {
        const state = this.getState()
        const now = Date.now()

        if (!state.lastCheckTime) {
            return true
        }

        const timeSinceLastCheck = now - state.lastCheckTime
        return timeSinceLastCheck >= this.checkInterval
    }

    getTimeUntilNextCheck() {
        const state = this.getState()

        if (!state.lastCheckTime) {
            return 0
        }

        const nextCheckTime = state.lastCheckTime + this.checkInterval
        const remaining = nextCheckTime - Date.now()

        return Math.max(0, remaining)
    }

    formatTimeUntilNextCheck() {
        const remaining = this.getTimeUntilNextCheck()

        if (remaining === 0) {
            return 'Now'
        }

        const hours = Math.floor(remaining / (1000 * 60 * 60))
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))

        if (hours > 0) {
            return `${hours}h ${minutes}m`
        }
        return `${minutes}m`
    }

    markChecked(result: any = null) {
        const state = this.getState()
        state.lastCheckTime = Date.now()
        state.lastCheckResult = result
        this.saveState(state)
    }

    markNotified(version: string) {
        const state = this.getState()
        state.notifiedVersion = version
        this.saveState(state)
    }

    hasNotified(version: string) {
        const state = this.getState()
        return state.notifiedVersion === version
    }

    dismissVersion(version: string) {
        const state = this.getState()
        if (!state.dismissedVersions.includes(version)) {
            state.dismissedVersions.push(version)
        }
        this.saveState(state)
    }

    isDismissed(version: string) {
        const state = this.getState()
        return state.dismissedVersions.includes(version)
    }

    reset() {
        try {
            if (fs.existsSync(this.stateFile)) {
                fs.unlinkSync(this.stateFile)
            }
        } catch (e: any) {
            console.warn('[Scheduler] Failed to reset:', e.message)
        }
    }

    scheduleCheck(updateCallback: any) {
        if (this.scheduledTimer) {
            clearTimeout(this.scheduledTimer)
        }

        const shouldCheck = this.shouldCheckUpdate()

        if (shouldCheck) {
            console.log('[Scheduler] Will check update now')
            updateCallback()
        } else {
            const timeUntilNext = this.getTimeUntilNextCheck()
            console.log(`[Scheduler] Next check in ${this.formatTimeUntilNextCheck()}`)

            this.scheduledTimer = setTimeout(() => {
                updateCallback()
            }, timeUntilNext)
        }
    }

    scheduleNextCheck(updateCallback: any) {
        if (this.scheduledTimer) {
            clearTimeout(this.scheduledTimer)
        }

        this.scheduledTimer = setTimeout(() => {
            updateCallback()
        }, this.checkInterval)

        console.log(`[Scheduler] Scheduled next check in ${this.formatTimeUntilNextCheck()}`)
    }

    cancelSchedule() {
        if (this.scheduledTimer) {
            clearTimeout(this.scheduledTimer)
            this.scheduledTimer = null
        }
    }

    getStatusInfo() {
        const state = this.getState()
        const shouldCheck = this.shouldCheckUpdate()

        return {
            lastCheckTime: state.lastCheckTime ? new Date(state.lastCheckTime).toLocaleString() : 'Never',
            timeUntilNext: this.formatTimeUntilNextCheck(),
            shouldCheckNow: shouldCheck,
            notifiedVersion: state.notifiedVersion,
            dismissedVersions: state.dismissedVersions
        }
    }
}

export default UpdateSchedulerService