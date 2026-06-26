<template>
    <el-dialog 
        title="Select Parent Node for Downloaded Asset"
        :model-value="visible" 
        @close="handleClose"
        @update:model-value="$emit('update:visible', $event)"
        :modal="modal"
        :show-close="showClose"
        :transition="transition"
        :custom-class="customClass"
    >
        <div style="height: 300px; overflow-y: auto">
            <el-tree 
                :data="moveTreeData" 
                :props="moveTreeProps" 
                :expanded-keys="expandedMoveKeys"
                :highlight-current="true" 
                node-key="mrid" 
                @node-click="handleNodeClick"
                @node-expand="handleNodeExpand" 
                ref="downloadTree"
            >
                <template #default="{ data }">
                    <span class="custom-tree-node">
                        <span class="tree-node-content">
                            <icon
                                v-if="data.mode === 'substation'"
                                size="12px"
                                folderType="location"
                                assetDetail="Unknown"
                                badgeColor="146EBE"
                            />
                            <icon
                                v-else-if="data.mode === 'voltageLevel'"
                                size="12px"
                                folderType="voltageLevel"
                                assetDetail="Unknown"
                                badgeColor="146EBE"
                            />
                            <icon
                                v-else-if="data.mode === 'bay'"
                                size="12px"
                                folderType="bay"
                                assetDetail="Unknown"
                                badgeColor="146EBE"
                            />
                            <icon
                                v-else-if="data.mode === 'asset'"
                                size="12px"
                                folderType="asset"
                                assetDetail="Unknown"
                                badgeColor="146EBE"
                            />
                            <icon
                                v-else-if="data.mode === 'test'"
                                size="12px"
                                folderType="test"
                                assetDetail="Unknown"
                                badgeColor="008001"
                            />
                            <icon
                                v-else
                                size="12px"
                                folderType="building"
                                assetDetail="Unknown"
                                badgeColor="008001"
                            />
                            <span class="node-label">{{ data.name || data.serial_number || data.serial_no || 'Unknown' }}</span>
                        </span>
                    </span>
                </template>
            </el-tree>
        </div>
        <template #footer>
    <span class="dialog-footer custom-footer">
            <el-button class="footer-btn" size="small" type="danger" @click="handleCancel">Cancel</el-button>
            <el-button 
                class="footer-btn" 
                size="small" 
                type="primary" 
                @click="handleConfirm"
                :disabled="!selectedDownloadTargetNode"
            >
                Confirm Download
            </el-button>
        </span>
</template>
    </el-dialog>
</template>

<script>
import Icon from '@/views/Common/Icon.vue'

export default {
    name: 'DownloadDialog',
    components: {
        Icon
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        moveTreeData: {
            type: Array,
            default: () => []
        },
        moveTreeProps: {
            type: Object,
            default: () => ({
                children: 'children',
                label: 'name',
                disabled: 'disabled'
            })
        },
        expandedMoveKeys: {
            type: Array,
            default: () => []
        },
        selectedDownloadTargetNode: {
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
        handleNodeClick(data) {
            this.$emit('node-click', data)
        },
        // eslint-disable-next-line vue/no-unused-vars
        handleNodeExpand(data, node, instance) {
            this.$emit('node-expand', data, node, instance)
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