const modules = import.meta.glob('./*.json', { eager: true })

const SurgeArresterMap = {}

for (const path in modules) {
  const name = path.replace('./', '').replace('.json', '')
  const mod = modules[path]
  SurgeArresterMap[name] = mod.default || mod
}

export default SurgeArresterMap
