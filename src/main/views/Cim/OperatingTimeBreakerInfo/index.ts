class OperatingTimeBreakerInfo {
    assessment_limit_breaker_info_id: any
    mrid: any
    parameter_name: any
    t_dev_negative: any
    t_dev_position: any
    t_max: any
    t_min: any
    t_ref: any
    constructor() {
        this.mrid = null
        this.assessment_limit_breaker_info_id = null
        this.parameter_name = null
        this.t_min = null
        this.t_max = null
        this.t_ref = null
        this.t_dev_position = null
        this.t_dev_negative = null
    }
}

export default OperatingTimeBreakerInfo;