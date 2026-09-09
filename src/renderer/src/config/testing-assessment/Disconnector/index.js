const modules = import.meta.glob('./*.json', { eager: true })

const DisconnectorMap = {}

for (const path in modules) {
  const name = path.replace('./', '').replace('.json', '')
  const mod = modules[path]
  DisconnectorMap[name] = mod.default || mod
}

export default DisconnectorMap
