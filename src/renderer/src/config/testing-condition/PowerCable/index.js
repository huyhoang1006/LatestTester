import acVoltageInsulation from './AcVoltageInsulation.json'
import dcVoltageInsulation from './DcVoltageInsulation.json'
import dcVoltageOverSheath from './DcVoltageOverSheath.json'
import generalInspection from './GeneralInspection.json'
import insulationResistance from './InsulationResistance.json'
import particalDischarge from './ParticalDischarge.json'
import tandeltaPowerAcSource from './TandeltaPowerAcSource.json'
import tandeltaVlfSource from './TandeltaVlfSource.json'
import vlfTest from './VlfTest.json'

const powerCableConditionMap = {
    AcVoltageInsulation: acVoltageInsulation,
    DcVoltageInsulation: dcVoltageInsulation,
    DcVoltageOverSheath: dcVoltageOverSheath,
    GeneralInspection: generalInspection,
    InsulationResistance: insulationResistance,
    ParticalDischarge: particalDischarge,
    TandeltaPowerAcSource: tandeltaPowerAcSource,
    TandeltaVlfSource: tandeltaVlfSource,
    VlfTest: vlfTest
}

export default powerCableConditionMap