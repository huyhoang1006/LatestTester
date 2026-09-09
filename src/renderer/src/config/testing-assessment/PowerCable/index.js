const modules = import.meta.glob('./*.json', { eager: true })

const PowerCableMap = {}

for (const path in modules) {
  const name = path.replace('./', '').replace('.json', '')
  const mod = modules[path]
  PowerCableMap[name] = mod.default || mod
}

export default PowerCableMap
