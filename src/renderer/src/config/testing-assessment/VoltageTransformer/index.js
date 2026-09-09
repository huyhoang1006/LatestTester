const modules = import.meta.glob('./*.json', { eager: true })

const VoltageTransformerMap = {}

for (const path in modules) {
  const name = path.replace('./', '').replace('.json', '')
  const mod = modules[path]
  VoltageTransformerMap[name] = mod.default || mod
}

export default VoltageTransformerMap
