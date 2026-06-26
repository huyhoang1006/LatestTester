import IdentifiedObject from "../IdentifiedObject";

class ValueToAlias extends IdentifiedObject {
    value: any
    value_alias_set: any
    constructor() {
        super();
        this.value = null;
        this.value_alias_set = null; // Alias for the value
    }
}

export default ValueToAlias;