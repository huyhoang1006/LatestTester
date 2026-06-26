import MeasurementValue from "../MeasurementValue";

class DiscreteValue extends MeasurementValue {
    discrete: any
    value: any
    constructor() {
        super();
        this.value = null;
        this.discrete = null;
    }
}

export default DiscreteValue;
