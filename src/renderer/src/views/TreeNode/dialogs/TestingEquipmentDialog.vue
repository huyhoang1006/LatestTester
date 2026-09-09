<template>
  <div>
    <!-- Step 1: equipment list -->
    <el-dialog
      title="Testing Equipment"
      :model-value="visible"
      @update:model-value="$emit('update:visible', $event)"
      :modal="modal"
      :show-close="showClose"
      :transition="transition"
      :class="customClass"
    >
      <TestingEquipmentList ref="list" @open="openDetail" @create="openCreate" />
      <template #footer>
        <span class="dialog-footer custom-footer">
          <el-button class="footer-btn" size="small" @click="handleCancel">Close</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Step 2: detail of the selected equipment (stacked popup) -->
    <el-dialog
      :title="detailTitle"
      :model-value="detailVisible"
      @update:model-value="detailVisible = $event"
      append-to-body
      :class="customClass"
    >
      <TestingEquipment
        v-if="detailVisible"
        ref="testingEquipment"
        :equipment="selectedExcel"
        :equipmentMrid="detailMrid"
        @saved="handleSaved"
      />
      <template #footer>
        <span class="dialog-footer custom-footer">
          <el-button class="footer-btn" size="small" @click="detailVisible = false">Back</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import TestingEquipment from '@/views/TestingEquipment/index.vue'
import TestingEquipmentList from '@/views/TestingEquipment/components/list.vue'

export default {
  name: 'TestingEquipmentDialog',
  components: {
    TestingEquipment,
    TestingEquipmentList
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    equipmentMrid: {
      type: String,
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
      default: 'app-dialog custom-dialog'
    }
  },
  data() {
    return {
      detailVisible: false,
      selected: null
    }
  },
  computed: {
    detailTitle() {
      if (!this.selected) return 'New testing equipment'
      const s = this.selected
      return [s.name, s.model, s.serial].filter(Boolean).join(' · ') || 'Equipment details'
    },
    detailMrid() {
      return this.selected && this.selected.mrid ? this.selected.mrid : null
    },
    selectedExcel() {
      return this.selected && !this.selected.mrid ? this.selected : null
    }
  },
  methods: {
    openDetail(equipment) {
      this.selected = equipment
      this.detailVisible = true
    },
    openCreate() {
      this.selected = null
      this.detailVisible = true
    },
    handleCancel() {
      this.$emit('cancel')
    },
    handleSaved(payload) {
      if (this.$refs.list && this.$refs.list.reload) this.$refs.list.reload()
      this.$emit('saved', payload)
    }
  }
}
</script>

<style lang="scss" scoped>
:global(.app-dialog) {
  box-sizing: border-box;
}
:global(.app-dialog.el-dialog) {
  width: 80%;
  margin-top: 5vh !important;
  border-radius: 6px;
  max-height: 90vh;
  height: auto !important;
  display: flex;
  flex-direction: column;
}
:global(.app-dialog .el-dialog__body) {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px;
}
.custom-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
