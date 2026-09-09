import { startLoading } from '@/utils/loading'
import * as BreakerMapping from '@/views/Mapping/Breaker/index'
import * as TransformerMapping from '@/views/Mapping/Transformer/index'
import * as SubstationMapping from '@/views/Mapping/Substation/index'
import * as OrganisationMapping from '@/views/Mapping/Organisation/index'
import * as SurgeArresterMapping from '@/views/Mapping/SurgeArrester/index'
import * as PowerCableMapping from '@/views/Mapping/PowerCable/index'
import * as DisconnectorMapping from '@/views/Mapping/Disconnector/index'
import * as CapacitorMapping from '@/views/Mapping/Capacitor/index'
import * as VoltageTransformerMapping from '@/views/Mapping/VoltageTransformer/index'
import * as CurrentTransformerMapping from '@/views/Mapping/CurrentTransformer/index'
import * as ReactorMapping from '@/views/Mapping/Reactor/index'
import * as BushingMapping from '@/views/Mapping/Bushing/index'
import * as rotatingMachineMapping from '@/views/Mapping/RotatingMachine/index'
import * as VoltageLevelMapping from '@/views/Mapping/VoltageLevel/index'
import { importNodeFromJSON as importNodeFromJSONUtil } from '@/function/entity/import/index'
export default {
  methods: {
    handleImportConfirm() {
      this.openImportDialog = false
      this.$message.success('Import successfully')
    },
    async handleImportCommand(cmd) {
      if (cmd === 'importETAP') {
        await this.importETAPTransformers()
      } else if (cmd === 'importExcel') {
        this.openImportDialog = true
      } else if (cmd === 'importJSON') {
        await this.importTreeFromJSON('dto')
      } else if (cmd === 'importJSONCIM') {
        // TODO: Implement import JSON by CIM (sau khi có import JSON thường)
        this.$message.info('Import JSON by CIM feature is coming soon')
      } else if (cmd === 'importXML') {
        this.openImportDialog = true
      } else if (cmd === 'importWord') {
        this.openImportDialog = true
      } else if (cmd === 'importPDF') {
        this.openImportDialog = true
      }
    },
    async importTreeFromJSON() {
      // Validate: Phải có selectedNode (giống export)
      if (!this.selectedNodes || this.selectedNodes.length === 0) {
        this.$message.warning('Please select at least one node to import into')
        return
      }

      // Lấy parent node (node được chọn đầu tiên)
      const parentNode = this.selectedNodes[0]

      try {
        // Mở file picker để chọn JSON file (KHÔNG có loading ở đây)
        const fileResult = await window.electronAPI.importJSON()

        if (!fileResult.success || !fileResult.data) {
          if (fileResult.message !== 'Import cancelled') {
            this.$message.error(fileResult.message || 'Failed to load JSON file')
          }
          return
        }

        const dtos = fileResult.data

        // Bắt đầu loading SAU KHI user đã chọn file
        const { close } = startLoading(this, {
          action: 'import',
          customText: 'Importing JSON...',
          type: 'heavy'
        })

        let importSuccess = false

        try {
          // Prepare dependencies
          const dependencies = {
            electronAPI: window.electronAPI,
            mappings: {
              SubstationMapping,
              OrganisationMapping,
              SurgeArresterMapping,
              PowerCableMapping,
              DisconnectorMapping,
              rotatingMachineMapping,
              CapacitorMapping,
              VoltageTransformerMapping,
              CurrentTransformerMapping,
              TransformerMapping,
              BreakerMapping,
              ReactorMapping,
              BushingMapping,
              VoltageLevelMapping
            },
            userId: this.$userId(),
            messageHandler: this.$message
          }

          // Import với parent node
          const result = await importNodeFromJSONUtil(dtos, parentNode, dependencies)

          // Tạo node trong tree UI sau khi import thành công
          if (result.success && result.successCount > 0) {
            importSuccess = true

            // Tạo các node đã import vào tree UI
            if (result.importedNodes && result.importedNodes.length > 0) {
              for (const newNodeData of result.importedNodes) {
                const node = this.findNodeById(newNodeData.parentId, this.organisationClientList)
                if (node) {
                  const children = Array.isArray(node.children) ? node.children : []
                  node.children = [...children, newNodeData]
                } else {
                  console.warn(
                    `Parent node not found for ${newNodeData.mrid}, parentId: ${newNodeData.parentId}`
                  )
                }
              }
            } else {
              console.warn('No importedNodes in result:', result)
            }

            // Refresh tree để đồng bộ với database
            // Reset flag để force fetch lại từ server
            parentNode._childrenFetched = false
            await this.fetchChildren(parentNode)
          }
        } catch (error) {
          console.error('Error importing JSON:', error)
          // Đóng loading và đợi modal biến mất
          await close()
          // Hiển thị error sau khi modal đã ẩn
          this.$message.error('An error occurred while importing JSON')
          return
        }

        // Đóng loading và đợi modal biến mất hoàn toàn
        await close()

        // Hiển thị message SAU KHI modal đã biến mất
        if (importSuccess) {
          this.$message.success('Import successfully')
        }
      } catch (error) {
        console.error('Error importing JSON:', error)
        this.$message.error('An error occurred while importing JSON')
      }
    },

    handleCancelImport() {
      this.openImportDialog = false
    },

    /**
     * Import ETAP Transformers from Excel file
     * Opens file dialog, parses Excel, and imports transformers
     */
    async importETAPTransformers() {}
  }
}
