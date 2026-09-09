import EquipmentContainer from '../EquipmentContainer'

class Bay extends EquipmentContainer {
  bay_energy_meas_flag: any
  bay_power_meas_flag: any
  breaker_configuration: any
  bus_bar_configuration: any
  substation: any
  voltage_level: any
  constructor() {
    super()
    this.bay_energy_meas_flag = null // e.g., "volt"
    this.bay_power_meas_flag = null // Numerical value of the voltage
    this.breaker_configuration = null // e.g., "kilo", "mega" for scaling the value
    this.bus_bar_configuration = null // e.g., "kilo", "mega" for scaling the value
    this.substation = null // e.g., "kilo", "mega" for scaling the value
    this.voltage_level = null // e.g., "kilo", "mega" for scaling the value
  }
}

export default Bay
