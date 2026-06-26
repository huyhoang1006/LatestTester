import IdentifiedObject from "../IdentifiedObject"

class PersonRole extends IdentifiedObject {
    department: any
    person: any
    position: any
    constructor() {
        super()
        this.person = null
        this.department = null
        this.position = null
    }
}
export default PersonRole