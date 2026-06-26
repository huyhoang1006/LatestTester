import VoltageLevel from '@/views/Cim/VoltageLevel/index.js';
import BaseVoltage from '@/views/Cim/BaseVoltage';
class VoltageLevelEntity {
    baseVoltage: any
    voltage: any
    voltageLevel: any
    constructor() {
        this.voltageLevel = new VoltageLevel();
        this.baseVoltage = new BaseVoltage();
        this.voltage = [];
    }
}

export default VoltageLevelEntity;
