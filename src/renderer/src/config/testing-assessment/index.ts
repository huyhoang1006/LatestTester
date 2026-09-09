const modules = import.meta.glob('./*/*.json', { eager: true })

const testAssessmentMap: Record<string, Record<string, any>> = {}

for (const path in modules) {
  const clean = path.replace('./', '')
  const [assetType, file] = clean.split('/')
  const name = file.replace('.json', '')

  if (!testAssessmentMap[assetType]) {
    testAssessmentMap[assetType] = {}
  }

  const mod = (modules as any)[path]
  testAssessmentMap[assetType][name] = mod.default || mod
}

export default testAssessmentMap
