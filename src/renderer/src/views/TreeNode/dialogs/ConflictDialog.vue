<template>
    <el-dialog
        :title="title"
        :model-value="visible"
        width="860px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        custom-class="conflict-dialog"
        @update:model-value="handleVisibleChange"
    >
        <div class="conflict-header">
            <div class="conflict-stats">
                <span class="stat auto">
                    <el-icon><Check /></el-icon>
                    {{ autoCount }} field(s) merged automatically
                </span>
                <span class="stat conflict">
                    <el-icon><Warning /></el-icon>
                    {{ conflictCount }} conflicting field(s)
                </span>
                <span class="stat unchanged">
                    <el-icon><Minus /></el-icon>
                    {{ unchangedCount }} unchanged field(s)
                </span>
            </div>
            <div class="legend">
                <span class="legend-item base">Base</span>
                <span class="legend-item client">Client</span>
                <span class="legend-item server">Server</span>
            </div>
        </div>

        <div class="field-groups">
            <div v-for="group in fieldGroups" :key="group.label" class="field-group">
                <div class="group-title">{{ group.label }}</div>

                <div
                    v-for="field in group.fields"
                    :key="field.key"
                    class="field-row"
                    :class="field.status"
                >
                    <div class="field-label">{{ field.label }}</div>

                    <template v-if="field.status === 'unchanged'">
                        <div class="field-value unchanged-value">{{ displayValue(field.client) }}</div>
                        <div class="field-badge unchanged">Unchanged</div>
                    </template>

                    <template v-else-if="field.status === 'auto'">
                        <div class="diff-cols">
                            <div class="diff-cell base">{{ displayValue(field.base) }}</div>
                            <div
                                class="diff-cell client"
                                :class="{ changed: field.autoResolved === 'client' || field.autoResolved === 'both' }"
                            >
                                {{ displayValue(field.client) }}
                            </div>
                            <div
                                class="diff-cell server"
                                :class="{ changed: field.autoResolved === 'server' || field.autoResolved === 'both' }"
                            >
                                {{ displayValue(field.server) }}
                            </div>
                        </div>
                        <div class="field-badge auto">
                            <el-icon><Check /></el-icon>
                            {{ autoResolvedLabel(field.autoResolved) }}
                        </div>
                    </template>

                    <template v-else-if="field.status === 'conflict'">
                        <div class="diff-cols">
                            <div class="diff-cell base">{{ displayValue(field.base) }}</div>
                            <div class="diff-cell client conflict-val">{{ displayValue(field.client) }}</div>
                            <div class="diff-cell server conflict-val">{{ displayValue(field.server) }}</div>
                        </div>
                        <div class="conflict-actions">
                            <el-radio-group v-model="field.resolved" size="small">
                                <el-radio-button :label="field.client">Client</el-radio-button>
                                <el-radio-button :label="field.server">Server</el-radio-button>
                            </el-radio-group>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <div v-if="hasUnresolved" class="unresolved-warning">
            <el-icon><WarningFilled /></el-icon>
            {{ unresolvedCount }} conflicting field(s) still unresolved
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onCancel">Cancel</el-button>
                <el-button @click="onKeepAllClient" type="default">Keep all Client</el-button>
                <el-button @click="onTakeAllServer" type="default">Take all Server</el-button>
                <el-button
                    type="primary"
                    :disabled="hasUnresolved"
                    @click="onConfirm"
                >
                    Confirm merge
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { Check, Warning, WarningFilled, Minus } from '@element-plus/icons-vue'
import { resolveConflict, cancelConflict, getConflictState } from '@/store/conflictDialog'

export default {
    name: 'ConflictDialog',

    components: {
        Check, Warning, WarningFilled, Minus,
    },

    data() {
        return {
            title:        '',
            visible:      false,
            sourceFields: [],
        }
    },

    computed: {
        fieldGroups() {
            const groups = {}
            for (const f of this.sourceFields) {
                const g = f.group || 'Other'
                if (!groups[g]) groups[g] = []
                groups[g].push(f)
            }
            return Object.keys(groups).map(label => ({ label, fields: groups[label] }))
        },
        autoCount()       { return this.sourceFields.filter(f => f.status === 'auto').length },
        conflictCount()   { return this.sourceFields.filter(f => f.status === 'conflict').length },
        unchangedCount()  { return this.sourceFields.filter(f => f.status === 'unchanged').length },
        unresolvedCount() { return this.sourceFields.filter(f => f.status === 'conflict' && (f.resolved === null || f.resolved === undefined)).length },
        hasUnresolved()   { return this.unresolvedCount > 0 },
    },

    created() {
        const state = getConflictState()
        this.$watch(
            () => ({ visible: state.visible, title: state.title, fields: state.fields }),
            (val) => {
                this.visible      = val.visible
                this.title        = val.title
                this.sourceFields = val.fields
            },
            { deep: true, immediate: true }
        )
    },

    methods: {
        displayValue(v) {
            if (v === null || v === undefined || v === '') return '—'
            if (typeof v === 'object') return JSON.stringify(v)
            return String(v)
        },
        autoResolvedLabel(v) {
            if (v === 'server') return 'Server'
            if (v === 'client') return 'Client'
            if (v === 'both')   return 'Both'
            return ''
        },
        handleVisibleChange(val) {
            if (!val) cancelConflict()
        },
        onKeepAllClient() {
            this.sourceFields.forEach(f => {
                if (f.status === 'conflict') f.resolved = f.client
            })
        },
        onTakeAllServer() {
            this.sourceFields.forEach(f => {
                if (f.status === 'conflict') f.resolved = f.server
            })
        },
        onConfirm() {
            if (this.hasUnresolved) return
            const resolved = this.sourceFields.map(f => ({ ...f }))
            resolveConflict(resolved)
        },
        onCancel() {
            cancelConflict()
        },
    },
}
</script>

<style scoped>
.conflict-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #ebeef5;
}

.conflict-stats { display: flex; gap: 16px; }
.stat { font-size: 13px; display: flex; align-items: center; gap: 4px; }
.stat.auto     { color: #67c23a; }
.stat.conflict { color: #e6a23c; }
.stat.unchanged{ color: #909399; }

.legend { display: flex; gap: 8px; }
.legend-item {
    font-size: 12px;
    padding: 2px 10px;
    border-radius: 4px;
    font-weight: 500;
}
.legend-item.base   { background: #f4f4f5; color: #909399; }
.legend-item.client { background: #ecf5ff; color: #409eff; }
.legend-item.server { background: #fdf6ec; color: #e6a23c; }

.field-groups { max-height: 520px; overflow-y: auto; padding-right: 4px; }

.field-group { margin-bottom: 20px; }

.group-title {
    font-size: 12px;
    font-weight: 600;
    color: #909399;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 6px 0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 4px;
}

.field-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 6px;
    border-radius: 6px;
    min-height: 40px;
}
.field-row:hover            { background: #fafafa; }
.field-row.conflict         { background: #fffbf0; }
.field-row.conflict:hover   { background: #fff7e6; }

.field-label {
    width: 140px;
    flex-shrink: 0;
    font-size: 13px;
    color: #606266;
}

.unchanged-value {
    flex: 1;
    font-size: 13px;
    color: #909399;
}

.field-badge {
    flex-shrink: 0;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 500;
}
.field-badge.unchanged { background: #f4f4f5; color: #909399; }
.field-badge.auto      { background: #f0f9eb; color: #67c23a; display: flex; align-items: center; gap: 3px; }

.diff-cols {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 6px;
}

.diff-cell {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    color: #606266;
    background: #f4f4f5;
    min-height: 28px;
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.diff-cell.base   { background: #f4f4f5; color: #909399; }
.diff-cell.client { background: #f4f4f5; }
.diff-cell.server { background: #f4f4f5; }
.diff-cell.changed.client { background: #ecf5ff; color: #409eff; font-weight: 500; }
.diff-cell.changed.server { background: #fdf6ec; color: #e6a23c; font-weight: 500; }
.diff-cell.conflict-val.client { background: #ecf5ff; color: #409eff; }
.diff-cell.conflict-val.server { background: #fdf6ec; color: #e6a23c; }

.conflict-actions { flex-shrink: 0; }

.unresolved-warning {
    margin-top: 12px;
    padding: 8px 12px;
    background: #fef0f0;
    border-radius: 6px;
    font-size: 13px;
    color: #f56c6c;
    display: flex;
    align-items: center;
    gap: 6px;
}

.dialog-footer { display: flex; gap: 8px; justify-content: flex-end; }
</style>
