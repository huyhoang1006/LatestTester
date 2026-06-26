<template>
    <div v-if="isActive" class="global-loading-mask">
        <div class="loading-modal">
            <p class="loading-text">{{ displayText }}</p>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: internalPercent + '%' }"></div>
                </div>
                <span class="progress-percent">{{ displayPercent }}%</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import store from '@/store'



const internalPercent = ref(0)
const progressInterval = ref(null)

const ACTION_TEXTS = {
    delete: 'Deleting...',
    add: 'Adding...',
    save: 'Saving...',
    move: 'Moving...',
    import: 'Importing...',
    export: 'Exporting...',
    update: 'Updating...',
    download: 'Downloading...',
    default: 'Processing...'
}

const isActive = computed(() => store.getters.isLoading)

const displayText = computed(() => {
    const text = store.getters.getLoadingText
    return text || ACTION_TEXTS[store.getters.getLoadingAction] || ACTION_TEXTS.default
})

const displayPercent = computed(() => parseInt(Math.round(internalPercent.value)))

watch(isActive, (newVal) => {
    if (newVal) {
        internalPercent.value = 0
        startProgress()
    } else {
        stopProgress()
        finishProgress()
    }
})

function startProgress() {
    stopProgress()

    progressInterval.value = setInterval(() => {
        if (internalPercent.value < 99) {
            let increment
            if (internalPercent.value < 60) {
                increment = 3
            } else if (internalPercent.value < 75) {
                increment = 2
            } else if (internalPercent.value < 85) {
                increment = 1
            } else if (internalPercent.value < 92) {
                increment = 1
            } else {
                increment = 1
            }

            internalPercent.value = Math.min(99, Math.round(internalPercent.value + increment))
        } else {
            stopProgress()
        }
    }, 80)
}

function finishProgress() {
    const finishInterval = setInterval(() => {
        if (internalPercent.value < 100) {
            internalPercent.value = Math.min(100, internalPercent.value + 10)
        } else {
            clearInterval(finishInterval)
            setTimeout(() => {
                internalPercent.value = 0
            }, 700)
        }
    }, 20)
}

function stopProgress() {
    if (progressInterval.value) {
        clearInterval(progressInterval.value)
        progressInterval.value = null
    }
}

onBeforeUnmount(() => {
    stopProgress()
})
</script>

<style scoped>
.global-loading-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2500;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
}

.loading-modal {
    background: #ffffff;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 30px 40px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 280px;
    pointer-events: auto;
}

.loading-text {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    margin: 0 0 20px 0;
    text-align: center;
}

.progress-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.progress-bar {
    width: 100%;
    height: 6px;
    background: #ebeef5;
    border-radius: 100px;
    overflow: hidden;
    position: relative;
}

.progress-fill {
    height: 100%;
    background: #409eff;
    border-radius: 100px;
    transition: width 0.3s ease;
}

.progress-percent {
    font-size: 13px;
    font-weight: 600;
    color: #409eff;
    min-width: 45px;
    text-align: center;
}

.loading-fade-enter-active {
    transition: all 0.3s ease;
}

.loading-fade-leave-active {
    transition: all 0.25s ease;
}

.loading-fade-enter,
.loading-fade-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

.loading-modal {
    animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>
