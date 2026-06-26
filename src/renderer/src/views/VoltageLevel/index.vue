<template>
    <div>
        <el-row :gutter="20">
            <el-col :xs="24" :md="12">
                <div class="col-content">
                    <el-form :model="properties" :inline-message="true" :label-width="labelWidth" size="small"
                        label-position="left">
                        <span class="bolder">Properties</span>
                        <el-divider class="thick-divider"></el-divider>
                        <el-form-item label="Voltage Level">
                        </el-form-item>
                        <el-form-item label="Name" class="custom-label">
                            <el-input v-model="properties.name"></el-input>
                        </el-form-item>
                        <el-form-item label="High voltage limit" class="custom-label form-item-top">
                            <el-row :gutter="10" class="voltage-row">
                                <el-col :xs="24" :sm="24" :md="12" :lg="12" class="voltage-value-col">
                                    <el-select v-model.number="properties.high_voltage_limit_value" allow-create
                                        filterable placeholder="Value" style="width: 100%">
                                        <el-option v-for="(value, index) in voltageList" :key="index" :label="value"
                                            :value="value"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :xs="12" :sm="12" :md="6" :lg="6">
                                    <el-select v-model="properties.high_voltage_limit_multiplier" placeholder="Unit"
                                        style="width: 100%">
                                        <el-option v-for="(unit, index) in voltageMultiplierArr" :key="index"
                                            :label="unit" :value="unit"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :xs="12" :sm="12" :md="6" :lg="6">
                                    <el-select v-model="properties.high_voltage_limit_unit" placeholder="Symbol"
                                        style="width: 100%">
                                        <el-option v-for="(unit, index) in voltageUnitArr" :key="index" :label="unit"
                                            :value="unit"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="Low voltage limit" class="custom-label form-item-top">
                            <el-row :gutter="10" class="voltage-row">
                                <el-col :xs="24" :sm="24" :md="12" :lg="12" class="voltage-value-col">
                                    <el-select v-model.number="properties.low_voltage_limit_value" allow-create
                                        filterable placeholder="Value" style="width: 100%">
                                        <el-option v-for="(value, index) in voltageList" :key="index" :label="value"
                                            :value="value"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :xs="12" :sm="12" :md="6" :lg="6">
                                    <el-select v-model="properties.low_voltage_limit_multiplier" placeholder="Unit"
                                        style="width: 100%">
                                        <el-option v-for="(unit, index) in voltageMultiplierArr" :key="index"
                                            :label="unit" :value="unit"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :xs="12" :sm="12" :md="6" :lg="6">
                                    <el-select v-model="properties.low_voltage_limit_unit" placeholder="Symbol"
                                        style="width: 100%">
                                        <el-option v-for="(unit, index) in voltageUnitArr" :key="index" :label="unit"
                                            :value="unit"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="Base voltage" class="custom-label form-item-top">
                            <el-row :gutter="10" class="voltage-row">
                                <el-col :xs="24" :sm="24" :md="12" :lg="12" class="voltage-value-col">
                                    <el-select @change="handleBaseVoltageChange"
                                        v-model.number="properties.base_voltage_value" allow-create filterable
                                        placeholder="Value" style="width: 100%">
                                        <el-option v-for="(value, index) in voltageList" :key="index" :label="value"
                                            :value="value"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :xs="12" :sm="12" :md="6" :lg="6">
                                    <el-select v-model="properties.base_voltage_multiplier" placeholder="Unit"
                                        style="width: 100%">
                                        <el-option v-for="(unit, index) in voltageMultiplierArr" :key="index"
                                            :label="unit" :value="unit"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :xs="12" :sm="12" :md="6" :lg="6">
                                    <el-select v-model="properties.base_voltage_unit" placeholder="Unit"
                                        style="width: 100%">
                                        <el-option v-for="(unit, index) in voltageUnitArr" :key="index" :label="unit"
                                            :value="unit"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :xs="24" :md="12">
                <div class="col-content">
                    <el-form :label-width="labelWidth" size="small" label-position="left">
                        <span class="bolder">Comment </span>
                        <el-divider></el-divider>
                        <el-input type="textarea" :rows="5" v-model="properties.comment"></el-input>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import mixin from './mixin/index'
export default {
    name: 'VoltageLevel',
    mixins: [mixin],
    props: {
        parent: {
            type: Object,
            default: () => ({})
        },
        locationId: {
            type: String,
            default: ''
        }
    },
}
</script>

<style scoped>
:deep(.el-form-item__label) {
    font-size: 12px !important;
    line-height: 16px;
}

.bolder {
    font-weight: bold;
    font-size: 12px;
}

:deep(.form-item-top .el-form-item__label) {
    float: none;
    width: 100% !important;
    text-align: left;
}

:deep(.form-item-top .el-form-item__content) {
    margin-left: 0 !important;
}

@media (max-width: 991px) {
    .col-content {
        margin-bottom: 20px;
    }
}

@media (max-width: 767px) {
    .voltage-value-col {
        margin-bottom: 8px;
    }

    :deep(.custom-label .el-form-item__label) {
        float: none;
        width: 100% !important;
        text-align: left;
    }

    :deep(.custom-label .el-form-item__content) {
        margin-left: 0 !important;
    }
}
</style>