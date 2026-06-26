import OperatingMechanism from '../OperatingMechanism';
class OldOperatingMechanism extends OperatingMechanism {
    number_of_close_coil: any
    number_of_trip_coil: any
    constructor() {
        super();
        this.number_of_trip_coil = null
        this.number_of_close_coil = null
    }
}

export default OldOperatingMechanism;