import db from '../../datacontext/index'

export const updateOnlineMonitoringData = (online_monitoring: any) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE online_monitor' +
        ' SET ageing_insulation = ?, moisture_insulation = ?, bushings_online = ?, patital_discharge = ?, dga = ?, bushing_df_worst = ?, bushing_df_average = ?, bushing_c_worst = ?, bushing_c_average = ?, condition_mois = ?, health_index = ?, weight_bushing_df = ?, weight_bushing_c = ?, weight_mois = ?' +
        ' WHERE asset_id = ?',
      [
        JSON.stringify(online_monitoring.aois || []),
        JSON.stringify(online_monitoring.moip || []),
        JSON.stringify(online_monitoring.bushings || []),
        JSON.stringify(online_monitoring.pd || []),
        JSON.stringify(online_monitoring.dga || []),
        online_monitoring.bushing_df_worst || 0,
        online_monitoring.bushing_df_average || 0,
        online_monitoring.bushing_c_worst || 0,
        online_monitoring.bushing_c_average || 0,
        online_monitoring.condition_mois || 0,
        online_monitoring.health_index || 0,
        online_monitoring.weight_bushing_df || 0,
        online_monitoring.weight_bushing_c || 0,
        online_monitoring.weight_mois || 0,
        online_monitoring.asset_id
      ],
      function (this: any, err: Error | null) {
        if (err) return reject({ success: false, err, message: err.message })
        return resolve({ success: true, message: 'Update online monitoring completed' })
      }
    )
  })
}

export const insertOnlineMonitoringData = (assetId: string, online_monitoring: any) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO online_monitor(id, asset_id, ageing_insulation, moisture_insulation, bushings_online, patital_discharge, dga, bushing_df_worst, bushing_df_average, bushing_c_worst, bushing_c_average, condition_mois, health_index, weight_bushing_df, weight_bushing_c, weight_mois, created_on, created_by, updated_on, updated_by)' +
        ' VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        online_monitoring.id,
        assetId,
        JSON.stringify(online_monitoring.aois || []),
        JSON.stringify(online_monitoring.moip || []),
        JSON.stringify(online_monitoring.bushings || []),
        JSON.stringify(online_monitoring.pd || []),
        JSON.stringify(online_monitoring.dga || []),
        online_monitoring.bushing_df_worst || 0,
        online_monitoring.bushing_df_average || 0,
        online_monitoring.bushing_c_worst || 0,
        online_monitoring.bushing_c_average || 0,
        online_monitoring.condition_mois || 0,
        online_monitoring.health_index || 0,
        online_monitoring.weight_bushing_df || 0,
        online_monitoring.weight_bushing_c || 0,
        online_monitoring.weight_mois || 0,
        online_monitoring.created_on || new Date().toISOString(),
        online_monitoring.created_by || null,
        online_monitoring.updated_on || new Date().toISOString(),
        online_monitoring.updated_by || null
      ],
      function (this: any, err: Error | null) {
        if (err) return reject({ success: false, err, message: err.message })
        return resolve({ success: true, message: 'Insert online monitoring completed' })
      }
    )
  })
}

export const deleteMonitorsByAssetId = (asset_id: string) => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM online_monitor WHERE asset_id = ?',
      [asset_id],
      function (this: any, err: Error | null) {
        if (err) return reject({ success: false, err, message: err.message })
        return resolve({ success: true, changes: this.changes })
      }
    )
  })
}

export const getOnlineMonitoringData = (asset_id: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM online_monitor WHERE asset_id = ?',
      [asset_id],
      (err: Error | null, row: any) => {
        if (err) return reject({ success: false, err, message: err.message })
        if (!row)
          return resolve({ success: false, data: null, message: 'Online monitoring not found' })
        try {
          row.aois = JSON.parse(row.ageing_insulation || '[]')
          row.moip = JSON.parse(row.moisture_insulation || '[]')
          row.bushings = JSON.parse(row.bushings_online || '[]')
          row.pd = JSON.parse(row.patital_discharge || '[]')
          row.dga = JSON.parse(row.dga || '[]')
        } catch (e: any) {
          console.warn('[onlineMonitoring] parse JSON failed:', e.message)
        }
        return resolve({ success: true, data: row, message: 'Get online monitoring completed' })
      }
    )
  })
}
