import db from '../../datacontext/index'

const safeGet = (sql: string, params: any[] = []): Promise<any> =>
  new Promise((resolve) => {
    try {
      db.get(sql, params, (err: Error | null, row: any) => {
        if (err) {
          resolve(null)
          return
        }
        resolve(row || null)
      })
    } catch (e) {
      resolve(null)
    }
  })

interface MRIDTableDef {
  table: string
  nameJoin?: boolean
  nameCol?: string
  parent: (row: any) => Promise<{ mrid: string; mode: string } | null>
}

const MRID_TABLES: Record<string, MRIDTableDef> = {
  organisation: {
    table: 'organisation',
    nameJoin: true,
    parent: async (row: any) =>
      row.parent_organisation ? { mrid: row.parent_organisation, mode: 'organisation' } : null
  },
  substation: {
    table: 'substation',
    nameJoin: true,
    parent: async (row: any) => {
      const link: any = await safeGet(
        `SELECT organisation_id FROM organisation_psr WHERE psr_id = ? LIMIT 1`,
        [row.mrid]
      )
      return link && link.organisation_id
        ? { mrid: link.organisation_id, mode: 'organisation' }
        : null
    }
  },
  voltageLevel: {
    table: 'voltage_level',
    nameJoin: true,
    parent: async (row: any) =>
      row.substation ? { mrid: row.substation, mode: 'substation' } : null
  },
  bay: {
    table: 'bay',
    nameJoin: true,
    parent: async (row: any) =>
      row.voltage_level
        ? { mrid: row.voltage_level, mode: 'voltageLevel' }
        : row.substation
          ? { mrid: row.substation, mode: 'substation' }
          : null
  },
  asset: {
    table: 'asset',
    nameCol: 'serial_number',
    parent: async (row: any) => {
      const link: any = await safeGet(`SELECT psr_id FROM asset_psr WHERE asset_id = ? LIMIT 1`, [
        row.mrid
      ])
      if (!link || !link.psr_id) return null
      return { mrid: link.psr_id, mode: 'psr' }
    }
  },
  job: {
    table: 'work_task',
    nameJoin: true,
    parent: async (row: any) => {
      const link: any = await safeGet(
        `SELECT asset_id FROM asset_work_task WHERE work_task_id = ? LIMIT 1`,
        [row.mrid]
      )
      return link && link.asset_id ? { mrid: link.asset_id, mode: 'asset' } : null
    }
  }
}

const PSR_LOOKUP = ['bay', 'voltageLevel', 'substation']

const getNodeName = async (def: MRIDTableDef, row: any): Promise<string> => {
  if (def.nameJoin) {
    const io: any = await safeGet(`SELECT name FROM identified_object WHERE mrid = ? LIMIT 1`, [
      row.mrid
    ])
    if (io && io.name) return io.name
  }
  if (def.nameCol && row[def.nameCol]) return row[def.nameCol]
  return row.serial_number || row.name || ''
}

const findMridInModes = async (
  mrid: string,
  modes: string[]
): Promise<{ mode: string; row: any; def: MRIDTableDef } | null> => {
  for (const mode of modes) {
    const def = MRID_TABLES[mode]
    if (!def) continue
    const row: any = await safeGet(`SELECT * FROM ${def.table} WHERE mrid = ? LIMIT 1`, [mrid])
    if (row) return { mode, row, def }
  }
  return null
}

const ASSET_TYPES = new Set([
  'transformer',
  'voltageTransformer',
  'currentTransformer',
  'breaker',
  'disconnector',
  'surgeArrester',
  'powerCable',
  'rotatingMachine',
  'capacitor',
  'reactor',
  'bushing'
])

const normalizeType = (type: string): string => (ASSET_TYPES.has(type) ? 'asset' : type)

export const mRIDCheckFunc: any = {
  checkMridsExist: async (items: any[]) => {
    const existing: any[] = []
    for (const it of items || []) {
      const mrid = it.mrid
      if (!mrid) continue
      const wantMode = normalizeType(it.type)

      let hit: { mode: string; row: any; def: MRIDTableDef } | null = null
      if (wantMode && MRID_TABLES[wantMode]) {
        hit = await findMridInModes(mrid, [wantMode])
      }
      if (!hit) {
        hit = await findMridInModes(mrid, [
          'asset',
          'job',
          'bay',
          'voltageLevel',
          'substation',
          'organisation'
        ])
      }
      if (hit) {
        const name = await getNodeName(hit.def, hit.row)
        existing.push({ mrid, mode: hit.mode, name, _table: hit.def.table })
      }
    }
    return { success: true, data: existing }
  },

  resolveMridPath: async (mrid: string, mode: string) => {
    const path: any[] = []
    let cur: { mrid: string; mode: string } = { mrid, mode: normalizeType(mode) }
    let guard = 0

    while (cur && cur.mrid && guard++ < 50) {
      let hit: { mode: string; row: any; def: MRIDTableDef } | null = null
      if (cur.mode === 'psr') {
        hit = await findMridInModes(cur.mrid, PSR_LOOKUP)
      } else {
        hit = await findMridInModes(cur.mrid, [cur.mode])
      }
      if (!hit) break

      const name = await getNodeName(hit.def, hit.row)
      path.unshift({ mode: hit.mode, mrid: cur.mrid, name })

      const parent = hit.def.parent ? await hit.def.parent(hit.row) : null
      if (!parent || !parent.mrid) break
      cur = parent
    }

    return { success: true, data: path }
  }
}
