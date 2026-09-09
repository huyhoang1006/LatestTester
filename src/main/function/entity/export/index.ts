const sanitizeFileName = (name: string): string => {
  if (!name) return 'export-data'
  return name.replace(/[<>:"/\\|?*]/g, '').trim() || 'export-data'
}

export const fetchNodeDataToDto = async (nodes: any, dependencies: any) => {
  const nodesArray = Array.isArray(nodes) ? nodes : [nodes]
  const { electronAPI, mappings, userId } = dependencies
  const dtos: any[] = []

  for (const node of nodesArray) {
    try {
      if (node.mode === 'substation') {
        const entity: any = await electronAPI.getSubstationEntityByMrid(
          node.mrid,
          userId,
          node.parentId
        )
        if (entity.success && entity.data) {
          const dto = mappings.SubstationMapping.mapEntityToDto(entity.data)
          dtos.push({ type: 'substation', data: dto })
        }
      } else if (node.mode === 'organisation') {
        const entity: any = await electronAPI.getOrganisationEntityByMrid(node.mrid)
        if (entity.success && entity.data) {
          const dto = mappings.OrganisationMapping.OrgEntityToOrgDto(entity.data)
          dtos.push({ type: 'organisation', data: dto })
        }
      } else if (node.mode === 'voltageLevel') {
        const entity: any = await electronAPI.getVoltageLevelEntityByMrid(node.mrid)
        if (entity.success && entity.data) {
          dtos.push({ type: 'voltageLevel', data: entity.data })
        }
      } else if (node.mode === 'bay') {
        const entity: any = await electronAPI.getBayEntityByMrid(node.mrid)
        if (entity.success && entity.data) {
          dtos.push({ type: 'bay', data: entity.data })
        }
      } else if (node.mode === 'asset') {
        if (node.asset === 'Surge arrester') {
          const entity: any = await electronAPI.getSurgeArresterEntityByMrid(node.mrid)
          if (entity.success && entity.data) {
            const dto = mappings.SurgeArresterMapping.mapEntityToDto(entity.data)
            dtos.push({ type: 'surgeArrester', data: dto })
          }
        } else if (node.asset === 'Power cable') {
          const entity: any = await electronAPI.getPowerCableEntityByMrid(node.mrid, node.parentId)
          if (entity.success && entity.data) {
            const dto = mappings.PowerCableMapping.mapEntityToDto(entity.data)
            dtos.push({ type: 'powerCable', data: dto })
          }
        } else if (node.asset === 'Disconnector') {
          const entity: any = await electronAPI.getDisconnectorEntityByMrid(
            node.mrid,
            node.parentId
          )
          if (entity.success && entity.data) {
            const dto = mappings.DisconnectorMapping.disconnectorEntityToDto(entity.data)
            dtos.push({ type: 'disconnector', data: dto })
          }
        } else if (node.asset === 'Rotating machine') {
          const entity: any = await electronAPI.getRotatingMachineEntityByMrid(
            node.mrid,
            node.parentId
          )
          if (entity.success && entity.data) {
            const dto = mappings.rotatingMachineMapping.mapEntityToDto(entity.data)
            dtos.push({ type: 'rotatingMachine', data: dto })
          }
        } else if (node.asset === 'Capacitor') {
          const entity: any = await electronAPI.getCapacitorEntityByMrid(node.mrid, node.parentId)
          if (entity.success && entity.data) {
            const dto = mappings.CapacitorMapping.mapEntityToDto(entity.data)
            dtos.push({ type: 'capacitor', data: dto })
          }
        } else if (node.asset === 'Voltage transformer') {
          const entity: any = await electronAPI.getVoltageTransformerEntityByMrid(
            node.mrid,
            node.parentId
          )
          if (entity.success && entity.data) {
            const dto = mappings.VoltageTransformerMapping.mapEntityToDto(entity.data)
            dtos.push({ type: 'voltageTransformer', data: dto })
          }
        } else if (node.asset === 'Current transformer') {
          const entity: any = await electronAPI.getCurrentTransformerEntityByMrid(
            node.mrid,
            node.parentId
          )
          if (entity.success && entity.data) {
            const dto = mappings.CurrentTransformerMapping.mapEntityToDto(entity.data)
            dtos.push({ type: 'currentTransformer', data: dto })
          }
        } else if (node.asset === 'Transformer') {
          const entity: any = await electronAPI.getTransformerEntityByMrid(node.mrid, node.parentId)
          if (entity.success && entity.data) {
            const dto = mappings.TransformerMapping.transformerEntityToDto(entity.data)
            dtos.push({ type: 'transformer', data: dto })
          }
        } else if (node.asset === 'Circuit breaker') {
          const entity: any = await electronAPI.getBreakerEntityByMrid(node.mrid, node.parentId)
          if (entity.success && entity.data) {
            const dto = mappings.BreakerMapping.mapEntityToDto(entity.data)
            dtos.push({ type: 'breaker', data: dto })
          }
        } else if (node.asset === 'Reactor') {
          const entity: any = await electronAPI.getReactorEntityByMrid(node.mrid, node.parentId)
          if (entity.success && entity.data) {
            const dto = mappings.ReactorMapping.mapEntityToDto(entity.data)
            dtos.push({ type: 'reactor', data: dto })
          }
        } else if (node.asset === 'Bushing') {
          const entity: any = await electronAPI.getBushingEntityByMrid(node.mrid, node.parentId)
          if (entity.success && entity.data) {
            const dto = mappings.BushingMapping.mapEntityToDto(entity.data)
            dtos.push({ type: 'bushing', data: dto })
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching and converting entity for node ${node.mrid}:`, error)
    }
  }

  return dtos
}

export const exportNodeToJSON = async (nodes: any, type: string, dependencies: any) => {
  const { electronAPI, mappings, userId, messageHandler, loadingHandler } = dependencies

  try {
    const nodesArray = Array.isArray(nodes) ? nodes : nodes ? [nodes] : []

    if (nodesArray.length === 0) {
      if (messageHandler) {
        messageHandler.warning('No node selected to export')
      }
      return
    }

    let closeLoading: any = null
    if (loadingHandler && loadingHandler.start) {
      closeLoading = loadingHandler.start()
    }

    try {
      const fetchDependencies = {
        electronAPI,
        mappings,
        userId
      }

      const dtos = await fetchNodeDataToDto(nodesArray, fetchDependencies)

      if (dtos.length === 0) {
        if (messageHandler) {
          messageHandler.warning('No data found to export')
        }
        return
      }

      const firstNode = nodesArray[0]
      let fileName: string

      if (firstNode?.name) {
        fileName = `${sanitizeFileName(firstNode.name)}.json`
      } else if (firstNode?.serial_number) {
        fileName = `${sanitizeFileName(firstNode.serial_number)}.json`
      } else if (firstNode?.asset) {
        fileName = `${sanitizeFileName(firstNode.asset)}.json`
      } else {
        fileName = type === 'cim' ? 'tree-export-cim.json' : 'tree-export-dto.json'
      }

      if (closeLoading) {
        closeLoading()
        closeLoading = null
      }

      const result: any = await electronAPI.exportJSON(dtos, {
        defaultFileName: fileName,
        title: 'Save JSON file',
        buttonLabel: 'Save'
      })

      if (result && result.success) {
        if (messageHandler) {
          messageHandler.success(result.message || `Exported ${dtos.length} items successfully`)
        }
      } else {
        if (result && result.message !== 'Export cancelled') {
          if (messageHandler) {
            messageHandler.error(result.message || 'Failed to export node to JSON')
          }
        }
      }
    } finally {
      if (closeLoading) {
        closeLoading()
      }
    }
  } catch (error) {
    console.error('Error exporting node to JSON:', error)
    if (messageHandler) {
      messageHandler.error('An error occurred while exporting node to JSON')
    }
    throw error
  }
}
