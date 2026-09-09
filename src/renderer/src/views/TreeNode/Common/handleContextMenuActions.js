export default {
  methods: {
    // Đặt node từ context menu vào selectedNodes rồi gọi handler chung (giống handleDeleteFromContextMenu)
    async handleDownloadFromContext(node) {
      if (node) this.selectedNodes = [node]
      await this.handleDownloadNode()
    },
    async handleUploadFromContext(node) {
      if (node) this.selectedNodes = [node]
      await this.handleUploadNode()
    },
    handleFmecaFromContext() {
      this.handleClickFmeca()
    },
    handleShowEquipmentFromContext() {
      this.handleShowEquipment()
    }
  }
}
