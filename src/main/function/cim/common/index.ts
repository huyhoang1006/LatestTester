export const runPromise = (db: any, sql: string, params: any[] = []) => {
  return new Promise<any>((resolve, reject) => {
    db.run(sql, params, function (this: any, err: Error | null) {
      if (err) return reject(err)
      resolve(this)
    })
  })
}
