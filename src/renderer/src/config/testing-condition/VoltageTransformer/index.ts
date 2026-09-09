import dcWindingResistance from './DcWindingResistance.json'
import generalInspection from './GeneralInspection.json'
import insulationResistance from './InsulationResistance.json'
import vtDfcap from './VTDfcap.json'
import vtRatio from './VTRatio.json'

const voltageTransformerConditionMap = {
  DcWindingResistance: dcWindingResistance,
  GeneralInspection: generalInspection,
  InsulationResistance: insulationResistance,
  VTDfcap: vtDfcap,
  VTRatio: vtRatio
}

export default voltageTransformerConditionMap
