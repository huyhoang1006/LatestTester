import IdentifiedObject from "../IdentifiedObject";

class Reconditioning extends IdentifiedObject {
    asset: any
    date_time: any
    constructor() {
        super()
        this.asset = null
        this.date_time = null
    }
}

export default Reconditioning