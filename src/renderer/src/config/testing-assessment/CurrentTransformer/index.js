const modules = import.meta.glob('./*.json', { eager: true })

const CurrentTransformerMap = {}

for (const path in modules) {
  const name = path.replace('./', '').replace('.json', '')
  const mod = modules[path]
  CurrentTransformerMap[name] = mod.default || mod
}

export default CurrentTransformerMap
