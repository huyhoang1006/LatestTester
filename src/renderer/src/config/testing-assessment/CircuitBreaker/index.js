const modules = import.meta.glob('./*.json', { eager: true })

const CircuitBreakerMap = {}

for (const path in modules) {
  const name = path.replace('./', '').replace('.json', '')
  const mod = modules[path]
  CircuitBreakerMap[name] = mod.default || mod
}

export default CircuitBreakerMap
