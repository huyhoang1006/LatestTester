import cocotiming from './COCOTiming.json'
import cotiming from './COTiming.json'
import contactResistance from './ContactResistance.json'
import ctiming from './CTiming.json'
import dcwindingCloseCoil from './DCWindingCloseCoil.json'
import dcwindingMotor from './DCWindingMotor.json'
import dcwindingTripCoil from './DCWindingTripCoil.json'
import generalInspection from './GeneralInspection.json'
import insulationResistanceCircuit from './InsulationResistanceCircuit.json'
import insulationResistanceCloseCoil from './InsulationResistanceCloseCoil.json'
import insulationResistanceMotor from './InsulationResistanceMotor.json'
import insulationResistanceTripCoil from './InsulationResistanceTripCoil.json'
import minimumPickup from './MinimumPickup.json'
import motorCurrent from './MotorCurrent.json'
import ococotiming from './OCOCOTiming.json'
import ocotiming from './OCTiming.json'
import ocotoTiming from './OCOTiming.json'
import otiming from './OTiming.json'
import overCurrentRelease from './OverCurrentRelease.json'
import pressureGauge from './PressureGauge.json'
import sf6GasAnalysis from './SF6GasAnalysis.json'
import sf6MoiturePurity from './SF6MoiturePurity.json'
import underVoltageRelease from './UnderVoltageRelease.json'

const circuitBreakerConditionMap = {
  COCOTiming: cocotiming,
  COTiming: cotiming,
  ContactResistance: contactResistance,
  CTiming: ctiming,
  DCWindingCloseCoil: dcwindingCloseCoil,
  DCWindingMotor: dcwindingMotor,
  DCWindingTripCoil: dcwindingTripCoil,
  GeneralInspection: generalInspection,
  InsulationResistanceCircuit: insulationResistanceCircuit,
  InsulationResistanceCloseCoil: insulationResistanceCloseCoil,
  InsulationResistanceMotor: insulationResistanceMotor,
  InsulationResistanceTripCoil: insulationResistanceTripCoil,
  MinimumPickup: minimumPickup,
  MotorCurrent: motorCurrent,
  OCOCOTiming: ococotiming,
  OCTiming: ocotiming,
  OCOTiming: ocotoTiming,
  OTiming: otiming,
  OverCurrentRelease: overCurrentRelease,
  PressureGauge: pressureGauge,
  SF6GasAnalysis: sf6GasAnalysis,
  SF6MoiturePurity: sf6MoiturePurity,
  UnderVoltageRelease: underVoltageRelease
}

export default circuitBreakerConditionMap
