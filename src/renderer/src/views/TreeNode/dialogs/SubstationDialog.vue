<template>
  <el-dialog
    title="Add Substation"
    :model-value="visible"
    @close="handleClose"
    @update:model-value="$emit('update:visible', $event)"
    :modal="modal"
    :show-close="showClose"
    :transition="transition"
    :class="customClass"
  >
    <Substation
      :parentOrganization="parentOrganization"
      :personList="personList"
      :locationList="locationList"
      :organisationId="organisationId"
      ref="substation"
    />
    <template #footer>
      <span class="dialog-footer custom-footer">
        <el-button class="footer-btn" size="small" type="danger" @click="handleCancel"
          >Cancel</el-button
        >
        <el-button
          class="footer-btn"
          size="small"
          type="primary"
          @click="handleConfirm"
          :disabled="isSaving"
          >Save</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import Substation from '../../LocationInsert/locationLevelView.vue'

export default {
  name: 'SubstationDialog',
  components: {
    Substation
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
    parentOrganization: {
      type: Object,
      default: null
    },
    personList: {
      type: Array,
      default: () => []
    },
    locationList: {
      type: Array,
      default: () => []
    },
    organisationId: {
      type: String,
      default: '0000000-0000-0000-0000-000000000000'
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
      // Emit confirm event và để parent component xử lý
      this.$emit('confirm')
    },
    // Expose substation ref to parent
    getSubstationRef() {
      return this.$refs.substation
    },
    // Alternative method name for consistency
    getComponentRef() {
      return this.$refs.substation
    }
  }
}
</script>
<style lang="scss" scoped>
:global(.app-dialog) {
  box-sizing: border-box;
}

:global(.app-dialog.el-dialog) {
  width: 92%;
  width: clamp(960px, 37.5vw + 240px, 1200px);
  max-width: 92vw;
  margin-top: 5vh !important;
  border-radius: 6px;
  max-height: 90vh;
  height: auto !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:global(.app-dialog .el-dialog__body) {
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex: 1;
}

:global(.app-dialog .el-dialog__body::-webkit-scrollbar) {
  width: 0px;
  height: 0px;
}

:global(.app-dialog .el-dialog__footer) {
  padding: 10px 20px;
  border-top: 1px solid #ebeef5;
}

:global(.custom-footer) {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:global(.custom-footer .footer-btn) {
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
  :global(.custom-footer) {
    justify-content: center;
  }
}
</style>
