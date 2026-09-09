<template>
  <el-dialog
    title="Add Disconnector"
    :model-value="visible"
    @close="handleClose"
    @update:model-value="$emit('update:visible', $event)"
    :modal="modal"
    :show-close="showClose"
    :transition="transition"
    :class="customClass"
  >
    <Disconnector :locationId="locationId" :parent="parentOrganization" ref="disconnector" />
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
import Disconnector from '@/views/AssetView/Disconnector/index.vue'

export default {
  name: 'DisconnectorDialog',
  components: {
    Disconnector
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
    // Expose disconnector ref to parent
    getDisconnectorRef() {
      return this.$refs.disconnector
    },
    // Alternative method name for consistency
    getComponentRef() {
      return this.$refs.disconnector
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
