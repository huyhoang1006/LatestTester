const modules = import.meta.glob('./*.json', { eager: true })

const ReactorMap = {}

for (const path in modules) {
  const name = path.replace('./', '').replace('.json', '')
  const mod = modules[path]
  ReactorMap[name] = mod.default || mod
}

export default ReactorMap
