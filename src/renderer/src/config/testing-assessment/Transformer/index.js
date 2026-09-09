const modules = import.meta.glob('./*.json', { eager: true })

const TransformerMap = {}

for (const path in modules) {
  const name = path.replace('./', '').replace('.json', '')
  const mod = modules[path]
  TransformerMap[name] = mod.default || mod
}

export default TransformerMap
