import generalInspection from './GeneralInspection.json'
import insulationResistance from './InsulationResistance.json'
import leakageCurrent from './LeakageCurrent.json'
import powerFrequency from './PowerFrequency.json'

const surgeArresterConditionMap = {
  GeneralInspection: generalInspection,
  InsulationResistance: insulationResistance,
  LeakageCurrent: leakageCurrent,
  PowerFrequency: powerFrequency
}

export default surgeArresterConditionMap
