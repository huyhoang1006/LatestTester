const modules = import.meta.glob('./*.json', { eager: true })

const BushingMap = {}

for (const path in modules) {
  const name = path.replace('./', '').replace('.json', '')
  const mod = modules[path]
  BushingMap[name] = mod.default || mod
}

export default BushingMap
