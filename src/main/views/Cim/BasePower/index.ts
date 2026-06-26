import IdentifiedObject from "../IdentifiedObject";

class BasePower extends IdentifiedObject {
    base_power: any
    constructor() {
        super();
        this.base_power = null; // Base power value
    }
}

export default BasePower;
