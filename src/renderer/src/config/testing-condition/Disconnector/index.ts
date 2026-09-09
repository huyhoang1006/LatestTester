import controlCheck from './ControlCheck.json'
import contactResistance from './ContactResistance.json'
import dcwindingMotor from './DcWindingMotor.json'
import generalInspection from './GeneralInspection.json'
import insulationResMotor from './InsulationResMotor.json'
import insulationResistance from './InsulationResistance.json'
import operatingTest from './OperatingTest.json'

const disconnectorConditionMap = {
  ControlCheck: controlCheck,
  ContactResistance: contactResistance,
  DcWindingMotor: dcwindingMotor,
  GeneralInspection: generalInspection,
  InsulationResMotor: insulationResMotor,
  InsulationResistance: insulationResistance,
  OperatingTest: operatingTest
}

export default disconnectorConditionMap
