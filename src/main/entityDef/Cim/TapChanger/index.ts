import PowerSystemResource from '../PowerSystemResource'
class TapChanger extends PowerSystemResource {
    control_enabled: any
    high_step: any
    initial_delay: any
    low_step: any
    ltc_flag: any
    neutral_step: any
    neutral_u: any
    normal_step: any
    step: any
    subsequent_delay: any
    sv_tap_step: any
    tap_changer_control: any
    constructor() {
        super();
        this.control_enabled = null
        this.high_step = null
        this.initial_delay = null
        this.low_step = null
        this.ltc_flag = null
        this.neutral_step = null
        this.neutral_u = null
        this.normal_step = null
        this.step = null
        this.subsequent_delay = null
        this.tap_changer_control = null
        this.sv_tap_step = null
    }
}

export default TapChanger;