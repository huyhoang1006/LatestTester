export default {
  methods: {
    hideLogBar() {
      this.logSign = false
      const element = this.$refs.contentData
      if (element) element.classList.remove('has-log')
    },
    async reloadLogServer(doneCallback) {
      try {
        const data = await window.electronAPI.getAllConfigurationEvents()
        if (data && data.success) {
          this.logDataServer = data.data
        }
      } catch (error) {
        console.error('Error fetching server log data:', error)
        if (this.$message) this.$message.error('Failed to fetch log data.')
      } finally {
        if (typeof doneCallback === 'function') doneCallback()
      }
    },
    showLogBar() {
      this.logSign = true
      const element = this.$refs.contentData
      if (element) element.classList.add('has-log')
      this.$nextTick(() => {
        const elementLog = this.$refs.logBar
        if (elementLog) elementLog.style.height = '20%'
      })
    }
  }
}
