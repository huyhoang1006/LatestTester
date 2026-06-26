<template>
    <el-dialog 
        title="Add Bay Level" 
        :model-value="visible" 
        @close="handleClose"
        @update:model-value="$emit('update:visible', $event)"
        :modal="modal"
        :show-close="showClose"
        :transition="transition"
        :custom-class="customClass"
    >
        <Bay :locationId="locationId" :parent="parentOrganization" ref="bay" />
        <template #footer>
    <span class="dialog-footer custom-footer">
            <el-button class="footer-btn" size="small" type="danger" @click="handleCancel">Cancel</el-button>
            <el-button class="footer-btn" size="small" type="primary" @click="handleConfirm" :disabled="isSaving">Save</el-button>
        </span>
</template>
    </el-dialog>
</template>

<script>
import Bay from '@/views/Bay/index.vue'

export default {
    name: 'BayDialog',
    components: {
        Bay
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        isSaving: {
            type: Boolean,
            default: false
        },
        locationId: {
            type: String,
            default: ''
        },
        parentOrganization: {
            type: Object,
            default: null
        },
        modal: {
            type: Boolean,
            default: true
        },
        showClose: {
            type: Boolean,
            default: true
        },
        transition: {
            type: String,
            default: 'dialog-fade'
        },
        customClass: {
            type: String,
            default: 'app-dialog'
        }
    },
    methods: {
        handleClose() {
            this.$emit('close')
        },
        handleCancel() {
            this.$emit('cancel')
        },
        handleConfirm() {
            this.$emit('confirm')
        },
        // Expose bay ref to parent
        getBayRef() {
            return this.$refs.bay
        },
        // Alternative method name for consistency
        getComponentRef() {
            return this.$refs.bay
        }
    }
}
</script>
<style lang="scss" scoped>
:deep(.app-dialog) {
    box-sizing: border-box;
}

:deep(.app-dialog.el-dialog) {
    width: 50%;
    margin-top: 5vh !important;
    border-radius: 6px;
    max-height: 90vh;
    height: auto !important;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

:deep(.app-dialog .el-dialog__body) {
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    flex: 1;
}

:deep(.app-dialog .el-dialog__body::-webkit-scrollbar) {
    width: 0px;
    height: 0px;
}

:deep(.app-dialog .el-dialog__footer) {
    padding: 10px 20px;
    border-top: 1px solid #ebeef5;
}

:deep(.custom-footer) {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

:deep(.custom-footer .footer-btn) {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
}

@media (max-width: 767px) {
    :deep(.custom-footer) {
        justify-content: center;
    }
}
</style>