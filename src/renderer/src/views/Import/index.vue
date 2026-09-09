<template>
  <div>
    <template-manager
      :template-list="templateList"
      v-model="selectedTemplateName"
      @change="onTemplateChange"
      @add-template="openAddTemplateDialog"
      @refresh="loadTemplates"
    >
      <template #actions>
        <el-button type="primary" size="small" :disabled="!selectedTemplateName" @click="addRow()"
          >Add Row</el-button
        >
        <el-button
          v-if="importType === 'excel'"
          type="success"
          size="small"
          :disabled="!selectedTemplateName"
          @click="handleUploadExcel"
          >Excel File</el-button
        >
        <el-button
          v-if="importType === 'word'"
          type="success"
          size="small"
          :disabled="!selectedTemplateName"
          @click="handleUploadWord"
          >Word File</el-button
        >
        <el-button
          type="danger"
          size="small"
          :disabled="!selectedTemplateName"
          @click="handleDelete"
          >Delete</el-button
        >
        <el-button type="warning" size="small" :disabled="!selectedTemplateName" @click="handleSave"
          >Save</el-button
        >
        <el-button
          type="info"
          size="small"
          :disabled="!selectedTemplateName"
          @click="handleImportJson"
          >Import JSON</el-button
        >
        <el-button
          type="info"
          size="small"
          :disabled="!selectedTemplateName || !tableData.length"
          @click="handleExportJson"
          >Export JSON</el-button
        >
        <el-button
          v-if="importType === 'excel'"
          type="warning"
          size="small"
          :disabled="!selectedTemplateName || !currentFilePath"
          @click="handleImportExcel"
        >
          <i class="fa-solid fa-file-import"></i> Import Excel
        </el-button>
        <el-button
          v-if="importType === 'word'"
          type="warning"
          size="small"
          :disabled="!selectedTemplateName || !currentFilePath"
          @click="handleImportWord"
        >
          <i class="fa-solid fa-file-import"></i> Import Word
        </el-button>
      </template>
    </template-manager>

    <div v-if="currentFilePath" style="margin: 4px 0 8px; font-size: 12px; color: #909399">
      <span
        @click="openTemplateFile"
        title="Click to open file"
        style="cursor: pointer; display: inline-flex; align-items: center; gap: 5px"
      >
        <i
          :class="importType === 'word' ? 'fa-solid fa-file-word' : 'fa-solid fa-file-excel'"
          :style="{ color: importType === 'word' ? '#2B579A' : '#67C23A' }"
        ></i>
        {{ currentFilePath.split(/[\\\/]/).pop() }}
        <el-icon style="font-size: 10px"><TopRight /></el-icon>
      </span>
    </div>

    <div>
      <template v-if="selectedTemplateName">
        <data-table
          :table-data="tableData"
          :category-options="categoryOptions"
          :get-options="getFeatureOptionsByLevel"
          @add-row="addRow"
          @clear-all="clearAll"
          @remove-row="removeRow"
          @category-change="onCategoryChange"
          @feature-change="onFeatureLevelChange"
        />
      </template>
      <div v-else style="padding: 30px; text-align: center; color: #c0c4cc; font-size: 13px">
        Select a template or click <b>Add Template</b> to get started
      </div>
    </div>

    <el-dialog
      v-model="showAddDialog"
      title="Add new template"
      width="420px"
      append-to-body
      @close="resetAddDialog"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addRules"
        size="small"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="Template name" prop="name"
          ><el-input v-model="addForm.name" placeholder="e.g. EVN Report" clearable
        /></el-form-item>
        <el-form-item label="Template file">
          <div style="display: flex; align-items: center; gap: 8px">
            <el-input
              v-model="addForm.filePath"
              placeholder="No file selected"
              readonly
              size="small"
              style="flex: 1"
            />
            <el-button size="small" type="success" @click="uploadTemplateForNew"
              ><i class="fa-solid fa-upload"></i> Upload</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="showAddDialog = false">Cancel</el-button>
        <el-button
          size="small"
          type="primary"
          :disabled="!addForm.name"
          :loading="addLoading"
          @click="confirmAddTemplate"
          >Create</el-button
        >
      </template>
    </el-dialog>

    <el-dialog
      v-model="showExportDialog"
      title="Select data to export"
      width="520px"
      append-to-body
    >
      <div v-if="exportCategories.length === 0" style="color: #909399; padding: 20px 0">
        No categories in template rows.
      </div>
      <div v-else>
        <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 8px">
          <el-button size="small" type="primary" plain @click="nodePickerVisible = true">
            Add asset / job
          </el-button>
          <span style="font-size: 11px; color: #909399"
            >Each item can be used as data source for different codes in the template</span
          >
        </div>
        <div v-if="selectedItems.length > 0">
          <div
            v-for="(item, idx) in selectedItems"
            :key="item.id"
            style="
              display: flex;
              align-items: center;
              gap: 6px;
              padding: 5px 8px;
              margin-bottom: 4px;
              background: #f5f7fa;
              border-radius: 4px;
              border: 1px solid #ebeef5;
            "
          >
            <span
              style="
                font-size: 11px;
                color: #fff;
                background: #409eff;
                border-radius: 3px;
                padding: 1px 6px;
                min-width: 54px;
                text-align: center;
              "
            >
              Sheet {{ idx + 1 }}
            </span>
            <i :class="itemIcon(item)" style="font-size: 12px; color: #606266"></i>
            <span
              style="
                font-size: 12px;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
              :title="item.label"
              >{{ item.label }}</span
            >
            <el-input
              v-model="item.sheetName"
              size="small"
              placeholder="Sheet name"
              style="width: 120px"
              :maxlength="31"
            />
            <el-button size="small" type="danger" plain circle @click="removeSelectedItem(item.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
        <div
          v-else
          style="
            font-size: 11px;
            color: #e6a23c;
            padding: 6px 10px;
            background: #fdf6ec;
            border-radius: 4px;
          "
        >
          <i class="fa-solid fa-exclamation-triangle"></i> No selection yet — click "Add asset /
          job" to begin
        </div>
        <div
          v-if="selectedItems.length > 0"
          style="margin-top: 8px; font-size: 11px; color: #909399"
        >
          {{ selectedItems.length }} source{{ selectedItems.length > 1 ? 's' : '' }} selected.
        </div>
      </div>
      <template #footer>
        <el-button size="small" @click="showExportDialog = false">Cancel</el-button>
        <el-button size="small" type="primary" :loading="exportLoading" @click="doExport"
          >Export</el-button
        >
      </template>
    </el-dialog>

    <el-dialog v-model="nodePickerVisible" title="Select Node" width="540px" append-to-body>
      <div
        style="
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <span style="font-size: 12px; color: #909399"
          >Navigate the tree: Organisation → Substation → VoltageLevel → Bay → Asset → Job</span
        >
        <el-button size="small" @click="refreshPickerTree" style="padding: 4px 8px"
          >Refresh</el-button
        >
      </div>
      <el-tree
        :key="pickerTreeKey"
        ref="pickerTreeRef"
        :props="{ label: 'displayName', children: 'children', isLeaf: 'pickerIsLeaf' }"
        :load="loadPickerNode"
        lazy
        node-key="mrid"
        highlight-current
        style="
          max-height: 380px;
          overflow-y: auto;
          border: 1px solid #ebeef5;
          border-radius: 4px;
          padding: 4px;
        "
        @node-click="onPickerNodeClick"
      >
        <template #default="{ data }">
          <span style="display: flex; align-items: center; gap: 6px; font-size: 12px">
            <i
              :class="pickerNodeIcon(data)"
              style="font-size: 11px; width: 14px; text-align: center"
            ></i>
            <span
              :style="{
                fontWeight: data.mode === 'asset' || data.mode === 'job' ? '600' : 'normal'
              }"
              >{{ data.displayName }}</span
            >
            <el-tag v-if="data.mode === 'asset'" size="small" type="info" style="font-size: 10px">{{
              data.assetType
            }}</el-tag>
          </span>
        </template>
      </el-tree>
      <div
        v-if="pickerTempSelected"
        style="
          margin-top: 8px;
          padding: 6px 10px;
          background: #f0f9eb;
          border-radius: 4px;
          font-size: 12px;
        "
      >
        <i class="fa-solid fa-check" style="color: #67c23a"></i>
        <strong>{{ pickerTempSelected.displayName }}</strong>
        <span style="color: #909399; margin-left: 4px"
          >({{ pickerModeLabel(pickerTempSelected.mode) }})</span
        >
      </div>
      <template #footer>
        <span style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 11px; color: #909399"
            >{{ selectedItems.length }} item{{ selectedItems.length !== 1 ? 's' : '' }} in
            list</span
          >
          <span>
            <el-button size="small" @click="nodePickerVisible = false">Done</el-button>
            <el-button
              size="small"
              type="primary"
              :disabled="!pickerTempSelected"
              @click="addPickerSelectionToList"
              >Add to list</el-button
            >
          </span>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      :title="importType === 'word' ? 'Import from Word' : 'Import from Excel'"
      v-model="showImportDialog"
      width="600px"
      append-to-body
      @close="resetImportDialog"
    >
      <div v-if="importStep === 1">
        <div style="margin-bottom: 14px">
          <div style="font-size: 12px; font-weight: 600; color: #606266; margin-bottom: 6px">
            <i
              :class="importType === 'word' ? 'fa-solid fa-file-word' : 'fa-solid fa-file-excel'"
              :style="{ color: importType === 'word' ? '#2B579A' : '#67C23A' }"
            >
            </i>
            {{ importType === 'word' ? 'Filled Word file' : 'Filled Excel file' }}
          </div>
          <div style="display: flex; gap: 8px">
            <el-input
              :model-value="importFilePath ? importFilePath.split(/[\\\/]/).pop() : ''"
              readonly
              size="small"
              placeholder="No file selected"
              style="flex: 1"
            />
            <el-button size="small" type="primary" @click="pickImportFile">Browse</el-button>
          </div>
        </div>

        <div style="margin-bottom: 14px">
          <div style="font-size: 12px; font-weight: 600; color: #606266; margin-bottom: 6px">
            <el-icon><Share /></el-icon> Parent node
            <span style="font-weight: normal; color: #909399; margin-left: 4px"
              >(optional — selects where to start inserting)</span
            >
          </div>
          <div style="display: flex; align-items: center; gap: 8px">
            <el-button size="small" plain @click="importNodePickerVisible = true">
              {{
                importSelectedNode
                  ? importSelectedNode.label.split(' / ').pop()
                  : 'Insert from root (no parent)'
              }}
            </el-button>
            <el-button
              v-if="importSelectedNode"
              size="small"
              type="danger"
              plain
              circle
              @click="importSelectedNode = null"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          <div
            v-if="importSelectedNode"
            style="margin-top: 4px; font-size: 11px; color: #909399; padding-left: 2px"
          >
            Path: {{ importSelectedNode.label }}
          </div>
          <div
            style="
              margin-top: 6px;
              padding: 8px 10px;
              background: #f5f7fa;
              border-radius: 4px;
              font-size: 11px;
              color: #606266;
              line-height: 1.6;
            "
          >
            <i class="fa-solid fa-info-circle" style="color: #909399"></i>
            <span v-if="!importSelectedNode"
              >No node selected → import entire hierarchy from <b>Organisation</b> level</span
            >
            <span v-else-if="importSelectedNode.mode === 'organisation'"
              >Organisation selected → Org data in file = <b>child Organisation</b></span
            >
            <span v-else-if="importSelectedNode.mode === 'substation'"
              >Substation selected → import from <b>Voltage Level / Bay</b> downward</span
            >
            <span v-else-if="importSelectedNode.mode === 'voltageLevel'"
              >Voltage Level selected → import from <b>Bay</b> downward</span
            >
            <span v-else-if="importSelectedNode.mode === 'bay'"
              >Bay selected → import <b>Asset</b> only</span
            >
            <span v-else-if="importSelectedNode.mode === 'asset'"
              >Asset selected → import <b>Job</b> only</span
            >
          </div>
        </div>

        <div style="margin-bottom: 8px">
          <div style="font-size: 12px; font-weight: 600; color: #606266; margin-bottom: 8px">
            <i class="fa-solid fa-cog"></i> Duplicate handling (when same name already exists)
          </div>
          <el-radio-group v-model="importOverwrite" size="small">
            <el-radio-button :value="false">Use existing as parent (no overwrite)</el-radio-button>
            <el-radio-button :value="true">Overwrite fields (keep MRID)</el-radio-button>
          </el-radio-group>
          <div style="margin-top: 6px; font-size: 11px; color: #909399">
            <span v-if="!importOverwrite"
              >If a node with same name exists → use it as parent context, do NOT change its
              data</span
            >
            <span v-else
              >If a node with same name exists → keep MRID, overwrite fields with values from
              file</span
            >
          </div>
        </div>
      </div>

      <div v-else-if="importStep === 2">
        <div style="font-size: 12px; color: #606266; margin-bottom: 10px">
          Review data extracted from file. Adjust generated values if needed.
        </div>
        <div
          v-if="importDecisions.length === 0"
          style="
            font-size: 11px;
            color: #67c23a;
            padding: 8px;
            background: #f0f9eb;
            border-radius: 4px;
          "
        >
          All values present in file. Click Next to import.
        </div>
        <div v-else style="max-height: 380px; overflow-y: auto">
          <div
            v-for="(d, i) in importDecisions"
            :key="i"
            style="
              padding: 8px 10px;
              margin-bottom: 6px;
              background: #fdf6ec;
              border: 1px solid #faecd8;
              border-radius: 4px;
            "
          >
            <div style="font-size: 11px; color: #e6a23c; margin-bottom: 4px">
              <i class="fa-solid fa-exclamation-triangle"></i> {{ d.message }}
            </div>
            <div
              v-if="d.type === 'missing_name'"
              style="display: flex; gap: 8px; align-items: center"
            >
              <span style="font-size: 11px; min-width: 90px">Use name:</span>
              <el-input v-model="d.generatedValue" size="small" style="flex: 1" />
            </div>
            <div
              v-else-if="d.type === 'shortcut'"
              style="display: flex; flex-direction: column; gap: 4px"
            >
              <div style="display: flex; gap: 8px; align-items: center">
                <span style="font-size: 11px; min-width: 90px">Substation name:</span>
                <el-input v-model="d.generatedValues.sub_name" size="small" style="flex: 1" />
              </div>
              <div style="display: flex; gap: 8px; align-items: center">
                <span style="font-size: 11px; min-width: 90px">Asset serial:</span>
                <el-input v-model="d.generatedValues.asset_serial" size="small" style="flex: 1" />
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 10px">
          <div style="font-size: 12px; font-weight: 600; color: #606266; margin-bottom: 6px">
            Preview of data to import
          </div>
          <div
            style="
              max-height: 200px;
              overflow-y: auto;
              border: 1px solid #ebeef5;
              border-radius: 4px;
            "
          >
            <table cellpadding="6" width="100%" style="border-collapse: collapse; font-size: 11px">
              <thead>
                <tr style="background: #f5f7fa">
                  <th style="text-align: left; padding: 6px">Level</th>
                  <th style="text-align: left; padding: 6px">Key value</th>
                  <th style="text-align: left; padding: 6px">Other fields</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(p, i) in importPreview"
                  :key="i"
                  style="border-bottom: 1px solid #ebeef5"
                >
                  <td style="padding: 6px">{{ p.label }}</td>
                  <td style="padding: 6px">
                    {{ p.keyValue || (p.isJobWithTests ? '(job with tests)' : '—') }}
                  </td>
                  <td style="padding: 6px; color: #909399">{{ p.otherFieldsSummary }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else-if="importStep === 3">
        <div style="font-size: 12px; color: #606266; margin-bottom: 10px">
          Import complete. See results below.
        </div>
        <div style="max-height: 400px; overflow-y: auto">
          <div
            v-for="(r, i) in importResults"
            :key="i"
            style="padding: 6px 10px; margin-bottom: 4px; border-radius: 4px; font-size: 12px"
            :style="{
              background: r.success ? '#f0f9eb' : r.skipped ? '#f5f7fa' : '#fef0f0',
              border: '1px solid ' + (r.success ? '#e1f3d8' : r.skipped ? '#EBEEF5' : '#fde2e2')
            }"
          >
            <i
              :class="
                r.success
                  ? 'fa-solid fa-check'
                  : r.skipped
                    ? 'fa-solid fa-minus'
                    : 'fa-solid fa-xmark'
              "
              :style="{ color: r.success ? '#67C23A' : r.skipped ? '#909399' : '#F56C6C' }"
            ></i>
            <strong>{{ r.label }}</strong>
            <span v-if="r.skipped" style="color: #909399; margin-left: 6px"
              >— skipped: {{ r.reason }}</span
            >
            <span v-else-if="r.error" style="color: #f56c6c; margin-left: 6px"
              >— {{ r.error }}</span
            >
          </div>
        </div>
      </div>

      <template #footer>
        <el-button size="small" @click="showImportDialog = false">Cancel</el-button>
        <el-button
          v-if="importStep === 1"
          size="small"
          type="primary"
          :loading="importLoading"
          :disabled="!importFilePath"
          @click="runImportPreview"
          >Next</el-button
        >
        <el-button
          v-if="importStep === 2"
          size="small"
          type="primary"
          :loading="importLoading"
          @click="confirmImport"
          >Import</el-button
        >
        <el-button
          v-if="importStep === 3"
          size="small"
          type="primary"
          @click="
            showImportDialog = false
            resetImportDialog()
          "
          >Done</el-button
        >
      </template>
    </el-dialog>

    <el-dialog
      v-model="importNodePickerVisible"
      title="Select Parent Node"
      width="540px"
      append-to-body
    >
      <div style="font-size: 12px; color: #909399; margin-bottom: 8px">
        Choose where to insert imported hierarchy
      </div>
      <el-tree
        :key="'import-' + pickerTreeKey"
        ref="importPickerTreeRef"
        :props="{ label: 'displayName', children: 'children', isLeaf: 'pickerIsLeaf' }"
        :load="loadPickerNode"
        lazy
        node-key="mrid"
        highlight-current
        style="
          max-height: 350px;
          overflow-y: auto;
          border: 1px solid #ebeef5;
          border-radius: 4px;
          padding: 4px;
        "
        @node-click="(data: any) => (importPickerTemp = data)"
      >
        <template #default="{ data }">
          <span style="font-size: 12px; display: flex; align-items: center; gap: 6px">
            <i
              :class="pickerNodeIcon(data)"
              style="font-size: 11px; width: 14px; text-align: center"
            ></i>
            {{ data.displayName }}
            <el-tag v-if="data.mode === 'asset'" size="small" type="info" style="font-size: 10px">{{
              data.assetType
            }}</el-tag>
          </span>
        </template>
      </el-tree>
      <div
        v-if="importPickerTemp"
        style="
          margin-top: 8px;
          padding: 5px 10px;
          background: #f0f9eb;
          border-radius: 4px;
          font-size: 12px;
        "
      >
        <i class="fa-solid fa-check" style="color: #67c23a"></i>
        <strong>{{ importPickerTemp.displayName }}</strong>
        <span style="color: #909399; font-size: 11px; margin-left: 6px"
          >({{ pickerModeLabel(importPickerTemp.mode) }})</span
        >
      </div>
      <template #footer>
        <el-button size="small" @click="importNodePickerVisible = false">Cancel</el-button>
        <el-button
          size="small"
          type="primary"
          :disabled="!importPickerTemp"
          @click="confirmImportNode"
          >Select</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { TopRight, Delete, Share, Close } from '@element-plus/icons-vue'
import { ASSET_TYPE_TO_KEY, CATEGORY_OPTION, FEATURE_TREE } from '../Common/constants'
import { exportService } from '../Export/services/exportService'
import { deepImportService } from './services/deepImportService'
import TemplateManager from './components/TemplateManager.vue'
import DataTable from './components/DataTable.vue'

const props = defineProps<{
  importType?: string
}>()

const importType = computed(() => props.importType || 'excel')

const templateList = ref<any[]>([])
const selectedTemplateName = ref<string>('')
const currentFilePath = ref<string>('')
const tableData = ref<any[]>([])

const showAddDialog = ref(false)
const addLoading = ref(false)
const addForm = reactive({ name: '', filePath: '' })
const addFormRef = ref()
const addRules = {
  name: [{ required: true, message: 'Please enter template name', trigger: 'blur' }]
}

const showExportDialog = ref(false)
const exportLoading = ref(false)

const showImportDialog = ref(false)
const importStep = ref(1)
const importFilePath = ref('')
const importSelectedNode = ref<any>(null)
const importNodePickerVisible = ref(false)
const importPickerTemp = ref<any>(null)
const importPreview = ref<any[]>([])
const importResults = ref<any[]>([])
const importLoading = ref(false)
const importCachedCodeValueMap = ref<any>(null)
const importOverwrite = ref(false)
const importDecisions = ref<any[]>([])

const nodePickerVisible = ref(false)
const pickerTempSelected = ref<any>(null)
const pickerTreeKey = ref(0)
const pickerTreeRef = ref()
const importPickerTreeRef = ref()
void pickerTreeRef
void importPickerTreeRef

const selectedItems = ref<any[]>([])
const categoryOptions = CATEGORY_OPTION
const FEATURE_TREE_LOCAL = FEATURE_TREE
const assetTypeToKey = ASSET_TYPE_TO_KEY

const exportCategories = computed(() => {
  const seen = new Set()
  const result: any[] = []
  for (const row of tableData.value) {
    if (!row.category) continue
    if (row.category === 'Asset') {
      const assetType = row.featureLevels && row.featureLevels[0] ? row.featureLevels[0].key : null
      if (!assetType) continue
      const key = 'Asset_' + assetType
      if (seen.has(key)) continue
      seen.add(key)
      const node = FEATURE_TREE_LOCAL.Asset?.children?.[assetType]
      result.push({ key, label: (node && node.label) || assetType, category: 'Asset', assetType })
    } else if (row.category === 'Job') {
      const jobType = row.featureLevels && row.featureLevels[0] ? row.featureLevels[0].key : null
      if (!jobType) continue
      const key = 'Job_' + jobType
      if (seen.has(key)) continue
      seen.add(key)
      const node = FEATURE_TREE_LOCAL.Job?.children?.[jobType]
      result.push({
        key,
        label: (node && node.label) || jobType,
        category: 'Job',
        assetType: jobType
      })
    } else {
      if (seen.has(row.category)) continue
      seen.add(row.category)
      const opt = categoryOptions.find((c: any) => c.value === row.category)
      result.push({
        key: row.category,
        label: (opt && opt.label) || row.category,
        category: row.category,
        assetType: null
      })
    }
  }
  return result
})

onMounted(async () => {
  await loadTemplates()
})

watch(importType, async () => {
  clearAllDialog()
  await loadTemplates()
})

const loadTemplates = async () => {
  try {
    const rs = await (window as any).electronAPI.getAllTemplatesByType(importType.value, 'import')
    if (rs?.success)
      templateList.value = rs.data.map((t: any) => ({
        ...t,
        variable: t.variable ? JSON.parse(t.variable) : []
      }))
  } catch (e) {
    console.error(e)
  }
}

const onTemplateChange = (name: string) => {
  if (!name) {
    currentFilePath.value = ''
    tableData.value = []
    return
  }
  const tmpl = templateList.value.find((t: any) => t.name === name)
  if (!tmpl) return
  currentFilePath.value = tmpl.path || ''
  tableData.value = (tmpl.variable || []).map((v: any) => ({
    code: v.code || '',
    category: v.category || '',
    featureLevels: (v.featureLevels || []).map((f: any) => ({ key: f.key || '' })),
    coordinates: v.coordinates || []
  }))
}

const openAddTemplateDialog = () => {
  resetAddDialog()
  showAddDialog.value = true
}
const resetAddDialog = () => {
  addForm.name = ''
  addForm.filePath = ''
  addLoading.value = false
}

const uploadTemplateForNew = async () => {
  if (!addForm.name) {
    ElMessage.warning('Please enter template name first')
    return
  }
  try {
    let rs: any
    if (importType.value === 'word')
      rs = await (window as any).electronAPI.uploadWordTemplate(addForm.name)
    else rs = await (window as any).electronAPI.uploadExcelTemplate(addForm.name)
    if (rs?.success) {
      addForm.filePath = rs.filePath
      ElMessage.success('Uploaded')
    } else if (!rs.canceled) ElMessage.error('Upload failed')
  } catch (e: any) {
    ElMessage.error(e.message)
  }
}

const confirmAddTemplate = async () => {
  if (!addFormRef.value) return
  const valid = await addFormRef.value.validate().catch(() => false)
  if (!valid) return
  addLoading.value = true
  try {
    const exists = await (window as any).electronAPI.checkNameTemplateExist(addForm.name)
    if (exists?.data === true) {
      ElMessage.error(`Template "${addForm.name}" already exists`)
      return
    }
    const rs = await (window as any).electronAPI.insertTemplate({
      name: addForm.name,
      path: addForm.filePath || '',
      variable: JSON.stringify([]),
      type: importType.value || '',
      category: 'import'
    })
    if (rs?.success) {
      ElMessage.success(`Created "${addForm.name}"`)
      showAddDialog.value = false
      await loadTemplates()
      selectedTemplateName.value = addForm.name
      currentFilePath.value = addForm.filePath || ''
      tableData.value = []
    } else ElMessage.error('Create failed')
  } catch (e: any) {
    ElMessage.error(e.message)
  } finally {
    addLoading.value = false
  }
}

const handleUploadExcel = async () => {
  if (!selectedTemplateName.value) return
  try {
    const rs = await (window as any).electronAPI.uploadExcelTemplate(selectedTemplateName.value)
    if (!rs || rs.canceled) return
    if (rs.success) {
      currentFilePath.value = rs.filePath
      await saveWithScan()
    }
  } catch (e: any) {
    ElMessage.error(e.message)
  }
}

const handleUploadWord = async () => {
  if (!selectedTemplateName.value) return
  try {
    const rs = await (window as any).electronAPI.uploadWordTemplate(selectedTemplateName.value)
    if (!rs || rs.canceled) return
    if (rs.success) {
      currentFilePath.value = rs.filePath
      await saveWithScan()
    }
  } catch (e: any) {
    ElMessage.error(e.message)
  }
}

const handleSave = async () => {
  await saveWithScan()
}

const saveWithScan = async () => {
  if (!selectedTemplateName.value || !currentFilePath.value) {
    ElMessage.warning('Please upload a Template file first')
    return
  }
  const variables = tableData.value.map((r: any) => ({
    code: r.code,
    category: r.category,
    featureLevels: r.featureLevels,
    coordinates: r.coordinates || []
  }))
  try {
    const rs = await (window as any).electronAPI.saveTemplateWithScan({
      name: selectedTemplateName.value,
      filePath: currentFilePath.value,
      variables,
      type: importType.value,
      category: 'import'
    })
    if (rs?.success) {
      ElMessage.success('Saved')
      await loadTemplates()
      onTemplateChange(selectedTemplateName.value)
    } else ElMessage.error('Save failed')
  } catch (e: any) {
    ElMessage.error(e.message)
  }
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(`Delete template "${selectedTemplateName.value}"?`, 'Warning', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
  } catch {
    return
  }
  try {
    const rs = await (window as any).electronAPI.deleteTemplate(selectedTemplateName.value)
    if (rs?.success) {
      ElMessage.success('Deleted')
      selectedTemplateName.value = ''
      currentFilePath.value = ''
      tableData.value = []
      await loadTemplates()
    }
  } catch (e: any) {
    ElMessage.error(e.message)
  }
}

const handleImportJson = async () => {
  try {
    const rs = await (window as any).electronAPI.importJSON()
    if (!rs?.success || !rs.data) return
    const variables = Array.isArray(rs.data) ? rs.data[0] : rs.data
    if (!Array.isArray(variables)) {
      ElMessage.error('Invalid template config file')
      return
    }
    tableData.value = variables.map((v: any) => ({
      code: v.code || '',
      category: v.category || '',
      featureLevels: (v.featureLevels || []).map((f: any) => ({ key: f.key || '' })),
      coordinates: v.coordinates || []
    }))
    ElMessage.success('Imported')
  } catch (e: any) {
    ElMessage.error(e.message)
  }
}

const handleExportJson = async () => {
  try {
    const variables = tableData.value.map((v: any) => ({
      code: v.code || '',
      category: v.category || '',
      featureLevels: (v.featureLevels || []).map((f: any) => ({ key: f.key || '' })),
      coordinates: v.coordinates || []
    }))
    const defaultFileName = (selectedTemplateName.value || 'template') + '-config.json'
    const rs = await (window as any).electronAPI.exportJSON([variables], {
      defaultFileName,
      title: 'Save template config as JSON'
    })
    if (rs?.success) ElMessage.success('Exported: ' + rs.filePath)
    else if (rs?.message !== 'Export cancelled') ElMessage.error(rs?.message || 'Export failed')
  } catch (e: any) {
    ElMessage.error(e.message)
  }
}

const handleImportExcel = () => {
  resetImportDialog()
  showImportDialog.value = true
}
const handleImportWord = () => {
  resetImportDialog()
  showImportDialog.value = true
}

const resetImportDialog = () => {
  importStep.value = 1
  importFilePath.value = ''
  importSelectedNode.value = null
  importNodePickerVisible.value = false
  importPickerTemp.value = null
  importPreview.value = []
  importResults.value = []
  importLoading.value = false
  importCachedCodeValueMap.value = null
  importOverwrite.value = false
  importDecisions.value = []
}

const pickImportFile = async () => {
  let rs: any
  if (importType.value === 'word') rs = await (window as any).electronAPI.pickWordFileForImport()
  else rs = await (window as any).electronAPI.pickExcelFileForImport()
  if (rs && rs.filePath) importFilePath.value = rs.filePath
}

const confirmImportNode = () => {
  if (!importPickerTemp.value) return
  const node = importPickerTemp.value
  const pathParts = [...(node.parentArr || []).map((p: any) => p.name), node.displayName]
  importSelectedNode.value = {
    label: pathParts.join(' / '),
    mode: node.mode,
    context: buildContextFromNode(node)
  }
  importNodePickerVisible.value = false
  importPickerTemp.value = null
}

const runImportPreview = async () => {
  if (!importFilePath.value) return
  importLoading.value = true
  try {
    const tmpl = templateList.value.find((t: any) => t.name === selectedTemplateName.value)
    const variables = tmpl ? tmpl.variable || [] : []
    let rs: any
    if (importType.value === 'word') {
      rs = await (window as any).electronAPI.readWordForImport({
        filePath: importFilePath.value,
        templatePath: currentFilePath.value,
        variables
      })
    } else {
      rs = await (window as any).electronAPI.readExcelForImport({
        filePath: importFilePath.value,
        templatePath: currentFilePath.value,
        variables
      })
    }
    if (!rs || !rs.success) {
      ElMessage.error(rs?.message || 'Failed to read file')
      return
    }
    importCachedCodeValueMap.value = rs.codeValueMap

    const allLevelData = deepImportService.buildAllLevelData(rs.codeValueMap, tableData.value)
    const selectedMode = importSelectedNode.value ? importSelectedNode.value.mode : null
    const levelsToProcess = deepImportService.getLevelsToProcess(selectedMode, allLevelData)

    const preview: any[] = []
    for (const lv of levelsToProcess) {
      const data = allLevelData[lv.catKey] || {}
      const hasData = Object.keys(data).length > 0
      const keyValue = hasData ? data[lv.reqField] : null
      const isJobWithTests = lv.id === 'job' && !keyValue && hasData
      const otherFields = hasData
        ? Object.keys(data)
            .filter((k) => k !== lv.reqField)
            .slice(0, 5)
            .join(', ')
        : ''
      preview.push({
        catKey: lv.catKey,
        label: lv.label,
        hasData,
        keyValue,
        isJobWithTests,
        otherFieldsSummary: otherFields || (hasData ? '...' : '')
      })
    }
    importPreview.value = preview

    const rawDecisions = deepImportService.analyzeDecisionsNeeded(allLevelData, levelsToProcess)
    importDecisions.value = rawDecisions.map((d: any) => {
      if (d.type === 'missing_name') {
        return { ...d, generatedValue: deepImportService._randomId(d.levelId.toUpperCase() + '-') }
      } else if (d.type === 'shortcut') {
        return {
          ...d,
          generatedValues: {
            sub_name: deepImportService._randomId('SUB-'),
            asset_serial: deepImportService._randomId('ASSET-')
          }
        }
      }
      return d
    })

    importStep.value = 2
  } catch (e: any) {
    ElMessage.error('Preview error: ' + e.message)
    console.error('runImportPreview error:', e)
  } finally {
    importLoading.value = false
  }
}

const confirmImport = async () => {
  if (!importCachedCodeValueMap.value) return
  importLoading.value = true
  try {
    const userStore = (window as any).$nuxt?.$store || null
    const userId = userStore?.state?.user?.user_id || null
    const rs = await deepImportService.importHierarchy(
      importCachedCodeValueMap.value,
      tableData.value,
      importSelectedNode.value,
      importOverwrite.value,
      importDecisions.value,
      userId
    )
    importResults.value = rs.results || []
    importStep.value = 3
    const ok = importResults.value.filter((r: any) => r.success && !r.skipped).length
    const fail = importResults.value.filter((r: any) => !r.success && !r.skipped).length
    if (fail === 0)
      ElMessage.success(ok + ' level' + (ok !== 1 ? 's' : '') + ' imported successfully')
    else ElMessage.warning(ok + ' OK, ' + fail + ' failed')
  } catch (e: any) {
    ElMessage.error('Import error: ' + e.message)
    console.error('confirmImport error:', e)
  } finally {
    importLoading.value = false
  }
}

const openTemplateFile = () => {
  if (!currentFilePath.value) return
  ;(window as any).electronAPI.openFileTemplate(currentFilePath.value).then((err: any) => {
    if (err) ElMessage.error('Cannot open file: ' + err)
  })
}

const handleExport = () => {
  selectedItems.value = []
  pickerTempSelected.value = null
  showExportDialog.value = true
}
void handleExport

const doExport = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('Please add at least one asset or job')
    return
  }
  exportLoading.value = true
  try {
    const tmpl = templateList.value.find((t: any) => t.name === selectedTemplateName.value)
    const variables = tmpl ? tmpl.variable || [] : []
    const codeMap: any = {}
    for (const cat of exportCategories.value) {
      const matchingItems = getMatchingItems(cat)
      if (cat.key.startsWith('Asset_') || cat.key.startsWith('Job_')) {
        for (const item of matchingItems) {
          const { flatMap, arrayMap } = await exportService.buildDtoForCat(cat, item.context)
          const partial = exportService.extractFromMaps(cat, flatMap, arrayMap, tableData.value)
          for (const code in partial) {
            if (!codeMap[code]) codeMap[code] = []
            const vals = partial[code]
            codeMap[code].push.apply(codeMap[code], Array.isArray(vals) ? vals : [vals])
          }
        }
      } else {
        const firstItem = matchingItems[0]
        if (!firstItem) continue
        const { flatMap, arrayMap } = await exportService.buildDtoForCat(cat, firstItem.context)
        const partial = exportService.extractFromMaps(cat, flatMap, arrayMap, tableData.value)
        for (const code in partial) {
          if (!codeMap[code]) codeMap[code] = partial[code]
        }
      }
    }
    if (importType.value === 'word') {
      const rs = await (window as any).electronAPI.exportWordWithData({
        templatePath: currentFilePath.value,
        variables,
        codeMap
      })
      if (rs.canceled) return
      if (rs.success) {
        showExportDialog.value = false
        ElMessage.success('Word Exported: ' + rs.filePath)
      } else ElMessage.error(rs.message || 'Word Export failed')
    } else {
      const rs = await (window as any).electronAPI.exportTemplateWithData({
        templatePath: currentFilePath.value,
        variables,
        codeMap
      })
      if (rs.canceled) return
      if (rs.success) {
        showExportDialog.value = false
        ElMessage.success('Exported: ' + rs.filePath)
      } else ElMessage.error(rs.message || 'Export failed')
    }
  } catch (e: any) {
    ElMessage.error('Export error: ' + e.message)
  } finally {
    exportLoading.value = false
  }
}

const pickerModeLabel = (mode: string) => {
  const m: any = {
    organisation: 'Organisation',
    substation: 'Substation',
    voltageLevel: 'Voltage Level',
    bay: 'Bay',
    asset: 'Asset',
    job: 'Job'
  }
  return m[mode] || mode
}

const pickerNodeIcon = (data: any) => {
  const icons: any = {
    organisation: 'fa-solid fa-building',
    substation: 'fa-solid fa-location-dot',
    voltageLevel: 'fa-solid fa-plug',
    bay: 'fa-solid fa-cubes',
    asset: 'fa-solid fa-box',
    job: 'fa-solid fa-file'
  }
  return icons[data.mode] || 'fa-solid fa-folder'
}

const buildContextFromNode = (node: any) => {
  const ctx: any = {}
  ;(node.parentArr || []).forEach((p: any) => {
    if (p.mode)
      ctx[p.mode] = { mrid: p.mrid, name: p.name, ...(p.assetType && { assetType: p.assetType }) }
  })
  ctx[node.mode] = {
    mrid: node.mrid,
    name: node.displayName,
    ...(node.assetType && { assetType: node.assetType })
  }
  return ctx
}

const sanitizeSheetName = (name: string) =>
  (name || 'Sheet').replace(/[\[\]\*\?\:\/\\]/g, '_').substring(0, 31)

const uniqueSheetName = (base: string) => {
  const existing = selectedItems.value.map((i: any) => i.sheetName)
  let name = sanitizeSheetName(base)
  let counter = 2
  while (existing.includes(name)) {
    name = sanitizeSheetName(base + '_' + counter)
    counter++
  }
  return name
}

const itemIcon = (item: any) => {
  const ctx = item.context
  if (ctx.job) return 'fa-solid fa-file'
  if (ctx.asset) return 'fa-solid fa-box'
  if (ctx.bay) return 'fa-solid fa-cubes'
  return 'fa-solid fa-building'
}

const refreshPickerTree = () => {
  pickerTempSelected.value = null
  pickerTreeKey.value++
}

const addPickerSelectionToList = () => {
  if (!pickerTempSelected.value) return
  const node = pickerTempSelected.value
  const pathParts = [...(node.parentArr || []).map((p: any) => p.name), node.displayName]
  const label = pathParts.join(' / ')
  const ctx = buildContextFromNode(node)
  const isDup = selectedItems.value.some(
    (item: any) =>
      item.context.asset?.mrid === ctx.asset?.mrid &&
      item.context.job?.mrid === ctx.job?.mrid &&
      item.context.asset?.mrid !== undefined
  )
  if (isDup) {
    ElMessage.warning('This node is already in the list')
    return
  }
  const sheetName = uniqueSheetName(node.displayName || 'Sheet')
  selectedItems.value.push({
    id: Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    label,
    sheetName,
    context: ctx
  })
  pickerTempSelected.value = null
  ElMessage.success('Added: ' + label.split(' / ').pop())
}

const removeSelectedItem = (id: string) => {
  selectedItems.value = selectedItems.value.filter((item: any) => item.id !== id)
}

const loadPickerNode = async (node: any, resolve: any) => {
  const ROOT = '00000000-0000-0000-0000-000000000000'
  try {
    if (node.level === 0) {
      const rs = await (window as any).electronAPI.getParentOrganizationByMrid(ROOT)
      if (rs?.success && rs.data) {
        const root = rs.data
        resolve([
          {
            mrid: root.mrid,
            displayName: root.aliasName || root.name,
            mode: 'organisation',
            pickerIsLeaf: false,
            parentArr: []
          }
        ])
      } else resolve([])
      return
    }
    const data = node.data
    const nextParentArr = [
      ...(data.parentArr || []).map((p: any) => ({
        mrid: p.mrid,
        name: p.displayName || p.name,
        mode: p.mode
      })),
      { mrid: data.mrid, name: data.displayName, mode: data.mode }
    ]
    const rows: any[] = []
    if (data.mode === 'organisation') {
      const [childOrgs, subs] = await Promise.all([
        (window as any).electronAPI.getParentOrganizationByParentMrid(data.mrid),
        (window as any).electronAPI.getSubstationsInOrganisationForUser(data.mrid, null)
      ])
      ;(childOrgs?.data || []).forEach((o: any) =>
        rows.push({
          mrid: o.mrid,
          displayName: o.aliasName || o.name,
          mode: 'organisation',
          pickerIsLeaf: false,
          parentArr: nextParentArr
        })
      )
      ;(subs?.data || []).forEach((s: any) =>
        rows.push({
          mrid: s.mrid,
          displayName: s.name,
          mode: 'substation',
          pickerIsLeaf: false,
          parentArr: nextParentArr
        })
      )
    } else if (data.mode === 'substation') {
      const [vls, bays] = await Promise.all([
        (window as any).electronAPI.getVoltageLevelBySubstationId(data.mrid),
        (window as any).electronAPI.getBayByVoltageBySubstationId(null, data.mrid)
      ])
      ;(vls?.data || []).forEach((vl: any) =>
        rows.push({
          mrid: vl.mrid,
          displayName: vl.name,
          mode: 'voltageLevel',
          pickerIsLeaf: false,
          parentArr: nextParentArr
        })
      )
      ;(bays?.data || []).forEach((b: any) =>
        rows.push({
          mrid: b.mrid,
          displayName: b.name,
          mode: 'bay',
          pickerIsLeaf: false,
          parentArr: nextParentArr
        })
      )
      const assets = await pickerFetchAssets(data.mrid, nextParentArr)
      rows.push(...assets)
    } else if (data.mode === 'voltageLevel') {
      const rs = await (window as any).electronAPI.getBayByVoltageBySubstationId(data.mrid, null)
      ;(rs?.data || []).forEach((b: any) =>
        rows.push({
          mrid: b.mrid,
          displayName: b.name,
          mode: 'bay',
          pickerIsLeaf: false,
          parentArr: nextParentArr
        })
      )
    } else if (data.mode === 'bay') {
      const assets = await pickerFetchAssets(data.mrid, nextParentArr)
      rows.push(...assets)
    } else if (data.mode === 'asset') {
      const rs = await (window as any).electronAPI.getOldWorkByAssetId(data.mrid)
      ;(rs?.data || []).forEach((j: any) =>
        rows.push({
          mrid: j.mrid,
          displayName: j.name || j.job_name || j.mrid,
          mode: 'job',
          assetType: data.assetType,
          pickerIsLeaf: true,
          parentArr: nextParentArr
        })
      )
    }
    resolve(rows)
  } catch (e) {
    console.error('loadPickerNode error:', e)
    resolve([])
  }
}

const pickerFetchAssets = async (psrId: string, parentArr: any[]) => {
  const results = await Promise.all([
    (window as any).electronAPI.getAssetByPsrIdAndKind(psrId, 'Transformer'),
    (window as any).electronAPI.getAssetByPsrIdAndKind(psrId, 'Voltage transformer'),
    (window as any).electronAPI.getAssetByPsrIdAndKind(psrId, 'Current transformer'),
    (window as any).electronAPI.getAssetByPsrIdAndKind(psrId, 'Circuit breaker'),
    (window as any).electronAPI.getAssetByPsrIdAndKind(psrId, 'Power cable'),
    (window as any).electronAPI.getAssetByPsrIdAndKind(psrId, 'Disconnector'),
    (window as any).electronAPI.getAssetByPsrIdAndKind(psrId, 'Rotating machine'),
    (window as any).electronAPI.getAssetByPsrIdAndKind(psrId, 'Capacitor'),
    (window as any).electronAPI.getAssetByPsrIdAndKind(psrId, 'Reactor'),
    (window as any).electronAPI.getSurgeArresterByPsrId(psrId),
    (window as any).electronAPI.getBushingByPsrId(psrId)
  ])
  const assetTypes = [
    'Transformer',
    'Voltage transformer',
    'Current transformer',
    'Circuit breaker',
    'Power cable',
    'Disconnector',
    'Rotating machine',
    'Capacitor',
    'Reactor',
    'Surge arrester',
    'Bushing'
  ]
  const rows: any[] = []
  results.forEach((rs: any, i: number) => {
    if (!rs?.success || !rs.data) return
    const atype = assetTypes[i]
    ;(Array.isArray(rs.data) ? rs.data : [rs.data]).forEach((a: any) => {
      rows.push({
        mrid: a.mrid,
        displayName: a.apparatus_id || a.serial_number || a.name || a.mrid,
        mode: 'asset',
        assetType: atype,
        pickerIsLeaf: false,
        parentArr
      })
    })
  })
  return rows
}

const onPickerNodeClick = (data: any) => {
  pickerTempSelected.value = data
}

const getMatchingItems = (cat: any) => {
  const jobToAsset: any = {
    Job_TransformerJobDto: 'Transformer',
    Job_VoltageTransformerJobDto: 'Voltage transformer',
    Job_CurrentTransformerJobDto: 'Current transformer',
    Job_CircuitBreakerJobDto: 'Circuit breaker',
    Job_PowerCableJobDto: 'Power cable',
    Job_SurgeArresterJobDto: 'Surge arrester',
    Job_ReactorJobDto: 'Reactor',
    Job_CapacitorJobDto: 'Capacitor',
    Job_DisconnectorJobDto: 'Disconnector',
    Job_RotatingMachineJobDto: 'Rotating machine',
    Job_BushingJobDto: 'Bushing'
  }
  return selectedItems.value.filter((item: any) => {
    const ctx = item.context
    const catKey = cat.key
    if (catKey === 'OrgEntityToOrgDto') return !!ctx.organisation
    if (catKey === 'SubstationDto') return !!ctx.substation
    if (catKey === 'VoltageLevelDto') return !!ctx.voltageLevel
    if (catKey === 'Bay') return !!ctx.bay
    if (catKey.startsWith('Asset_')) {
      if (!ctx.asset) return false
      return assetTypeToKey[ctx.asset.assetType] === catKey
    }
    if (catKey.startsWith('Job_')) {
      if (!ctx.job) return false
      const normalKey = catKey.startsWith('Job_Job_') ? catKey.slice(4) : catKey
      const requiredAsset = jobToAsset[normalKey]
      if (!requiredAsset) return false
      return (
        ctx.job.assetType === requiredAsset || (ctx.asset && ctx.asset.assetType === requiredAsset)
      )
    }
    return false
  })
}

const clearAll = () => {
  tableData.value = []
}

const addRow = (index?: number) => {
  const r = { code: '', category: '', featureLevels: [], coordinates: [] }
  if (typeof index === 'number') tableData.value.splice(index + 1, 0, r)
  else tableData.value.push(r)
}

const removeRow = (index: number) => {
  tableData.value.splice(index, 1)
}

const onCategoryChange = (row: any) => {
  row.featureLevels = [{}]
}

const getNodeByLevel = (row: any, levelIndex: number) => {
  let node = FEATURE_TREE_LOCAL[row.category]
  if (!node) return null
  for (let i = 0; i < levelIndex; i++) {
    const key = row.featureLevels[i]?.key
    node = node?.children?.[key]
    if (!node) return null
  }
  return node
}

const getFeatureOptionsByLevel = (row: any, levelIndex: number) => {
  const node = getNodeByLevel(row, levelIndex)
  if (!node?.children) return []
  return Object.entries(node.children).map(([key, child]: [string, any]) => ({
    key,
    label: child.label,
    hasChildren: !!child.children,
    isLeaf: !!child.value
  }))
}

const onFeatureLevelChange = ({ row, levelIndex }: { row: any; levelIndex: number }) => {
  row.featureLevels.splice(levelIndex + 1)
  const key = row.featureLevels[levelIndex]?.key
  const parent = getNodeByLevel(row, levelIndex)
  const selected = parent?.children?.[key]
  if (selected?.children) row.featureLevels.push({ key: '' })
}

const clearAllDialog = () => {
  resetAddDialog()
  clearAll()
  selectedTemplateName.value = ''
  currentFilePath.value = ''
}
</script>
