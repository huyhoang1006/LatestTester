// Schema file is plain SQL, no TS types needed
// Re-export from .js shim
const { INIT_SCHEMA } = require('./schema.js') as { INIT_SCHEMA: string }
export { INIT_SCHEMA }
