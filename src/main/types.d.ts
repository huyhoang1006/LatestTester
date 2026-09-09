declare module '@journeyapps/sqlcipher' {
  interface Database {
    run(
      sql: string,
      params?: unknown[],
      callback?: (this: { lastID: number; changes: number }, err: Error | null) => void
    ): this
    all(
      sql: string,
      params?: unknown[],
      callback?: (err: Error | null, rows: unknown[]) => void
    ): this
    get(sql: string, params?: unknown[], callback?: (err: Error | null, row: unknown) => void): this
    close(callback?: (err: Error | null) => void): void
    serialize(callback?: () => void): void
  }

  interface DatabaseConstructor {
    new (filename: string, callback?: (err: Error | null) => void): Database
  }

  const Database: DatabaseConstructor
  export = Database
}

declare module 'electron-devtools-installer' {
  const VUEJS_DEVTOOLS: symbol
  function install(extension: symbol, force?: boolean): Promise<void>
  export { VUEJS_DEVTOOLS, install }
  export default install
}
