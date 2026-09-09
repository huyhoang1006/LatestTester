import * as demoAPI from '@/api/demo'
import { useLoadingStore } from '@/store/loading'

export async function processAssetDownload(node, ctx) {
  const assetType = node.mode

  if (!node.mrid && !node.id) throw new Error('Asset ID not found')
  if (!node.parentId) throw new Error('Parent Bay not found')

  const loadingStore = useLoadingStore()
  loadingStore.text = `Downloading ${assetType}...`

  try {
    await ctx.$confirm(`Download ${node.aliasName || assetType}?`, 'Xác nhận', { type: 'info' })
  } catch (e) {
    throw new Error('CANCELED')
  }

  loadingStore.text = `Đang tải dữ liệu ${assetType}...`

  const apiMap = {
    transformer: demoAPI.getTransformerById,
    bushing: demoAPI.getBushingById,
    surgeArrester: demoAPI.getSurgeArresterById,
    circuitBreaker: demoAPI.getCircuitBreakerById,
    currentTransformer: demoAPI.getCurrentTransformerById,
    voltageTransformer: demoAPI.getVoltageTransformerById,
    disconnector: demoAPI.getDisconnectorById,
    powerCable: demoAPI.getPowerCableById,
    capacitor: demoAPI.getCapacitorById,
    reactor: demoAPI.getReactorById,
    rotatingMachine: demoAPI.getRotatingMachineById
  }

  const api = apiMap[assetType]
  if (!api) {
    throw new Error(`Unknown asset type: ${assetType}`)
  }

  let assetData = null
  for (let i = 0; i < 3; i++) {
    try {
      const res = await api(node.mrid || node.id)
      if (res && (res.mRID || res.mrid)) {
        assetData = res
        break
      }
    } catch (e) {
      if (i === 2) throw new Error(`Lỗi gọi API ${assetType}`)
    }
  }

  const entityData = {
    mrid: assetData?.mRID || assetData?.mrid || node.mrid || node.id,
    name: assetData?.name || node.name || node.aliasName,
    bay: node.parentId,
    substation: null,
    assetType: assetType,
    data: JSON.stringify(assetData)
  }

  const insertResult = await window.electronAPI.insertAssetEntity(assetType, entityData)
  if (!insertResult.success) throw new Error(insertResult.message)

  const parentNode = ctx.findNodeById(node.parentId, ctx.organisationClientList)
  if (parentNode) {
    if (!parentNode.children) parentNode.children = []
    const newNode = {
      id: entityData.mrid,
      mrid: entityData.mrid,
      name: entityData.name,
      aliasName: entityData.name,
      parentId: node.parentId,
      mode: assetType
    }
    const idx = parentNode.children.findIndex((c) => c.mrid === entityData.mrid)
    if (idx >= 0) parentNode.children[idx] = newNode
    else parentNode.children.push(newNode)
    parentNode.expanded = true
  }
}
