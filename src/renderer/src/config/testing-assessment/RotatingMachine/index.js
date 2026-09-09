const modules = import.meta.glob('./*.json', { eager: true })

const RotatingMachineMap = {}

for (const path in modules) {
  const name = path.replace('./', '').replace('.json', '')
  const mod = modules[path]
  RotatingMachineMap[name] = mod.default || mod
}

export default RotatingMachineMap
