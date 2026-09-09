const modules = import.meta.glob('./*.json', { eager: true })

const CapacitorMap = {}

for (const path in modules) {
  const name = path.replace('./', '').replace('.json', '')
  const mod = modules[path]
  CapacitorMap[name] = mod.default || mod
}

export default CapacitorMap
