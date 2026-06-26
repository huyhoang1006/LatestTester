import OldSwitchInfo from '../OldSwitchInfo';
class BreakerInfo extends OldSwitchInfo {
    phase_trip: any
    constructor() {
        super();
        this.phase_trip = null;
    }
}

export default BreakerInfo;