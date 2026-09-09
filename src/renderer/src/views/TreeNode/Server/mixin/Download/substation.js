// File: src/services/download-services/substation.js
import * as demoAPI from '@/api/demo'
import * as SubstationServerMapper from '@/views/Mapping/ServerToDTO/Substation/index.js'
import * as SubstationMapper from '@/views/Mapping/Substation/index.js'
import { downloadOrganisationChainForParent } from './organisation'
import { useLoadingStore } from '@/store/loading'
import { useUserStore } from '@/store/user'

export async function processSubstationDownload(node, ctx) {
  if (!node.mrid && !node.id) throw new Error('Substation ID not found')
  if (!node.parentId) throw new Error('Parent organisation not found.')
  const loadingStore = useLoadingStore()
  loadingStore.text = 'Downloading substation...'
  await downloadOrganisationChainForParent(node, ctx)

  const { substation, parentOrgId } = await prepareSubstation(node)
  await saveSubstationToDb(substation, parentOrgId, ctx)
}

async function prepareSubstation(node) {
  const subId = node.mrid || node.id
  const parentOrgId = node.parentId
  let data = null

  try {
    const res = await demoAPI.getSubstationById(subId)
    if (res && res.name) {
      data = res
      if (!data.aliasName) data.aliasName = data.name
    }
  } catch (e) {
    throw new Error('Lỗi fetch API Substation')
  }

  return {
    substation: {
      id: subId,
      mrid: String(subId),
      name: data?.name || node.name || '',
      aliasName: data?.aliasName || node.name || '',
      parentId: String(parentOrgId),
      _type: 'substation',
      _serverData: data || { id: subId, name: node.name, mRID: subId, organisation_id: parentOrgId }
    },
    parentOrgId: String(parentOrgId)
  }
}

async function saveSubstationToDb(substation, parentOrgId, ctx) {
  const userStore = useUserStore()
  const serverData = { ...substation._serverData, mRID: substation.mrid }
  const dto = SubstationServerMapper.mapServerToDto(serverData)
  dto.organisationId = parentOrgId
  dto.userId = userStore.user?.user_id
  dto.userIdentifiedObjectId = ctx.generateUuid()
  dto.organisationPsrId = ctx.generateUuid()

  const entity = SubstationMapper.mapDtoToEntity(dto)
  const insertResult = await window.electronAPI.insertSubstationEntity(entity)

  if (!insertResult.success) throw new Error('Lỗi DB Insert Substation')

  const parentNode = ctx.findNodeById(parentOrgId, ctx.organisationClientList)
  if (parentNode) {
    if (!parentNode.children) parentNode.children = []
    const newNode = {
      mrid: substation.mrid,
      name: substation.name,
      aliasName: substation.aliasName,
      parentId: parentOrgId,
      mode: 'substation'
    }
    const idx = parentNode.children.findIndex((c) => c.mrid === substation.mrid)
    if (idx >= 0) parentNode.children[idx] = newNode
    else parentNode.children.push(newNode)
    ctx.$set(parentNode, 'expanded', true)
  }
}
