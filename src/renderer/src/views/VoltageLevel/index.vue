<template>
  <div class="vl-view">
    <div class="vl-row">
      <div class="col-content">
        <section class="vl-card">
          <div class="vl-header">
            <i class="fa-solid fa-bolt"></i>
            <span>Properties</span>
          </div>
          <div class="vl-body">
            <el-form
              :model="properties"
              :inline-message="true"
              :label-width="labelWidth"
              size="small"
              label-position="left"
            >
              <el-form-item label="Name">
                <el-input v-model="properties.name"></el-input>
              </el-form-item>
              <el-form-item label="High voltage limit" class="form-item-inline">
                <el-row :gutter="8" class="voltage-row">
                  <el-col :xs="24" :sm="8" :md="8" class="voltage-value-col">
                    <el-select
                      v-model.number="properties.high_voltage_limit_value"
                      allow-create
                      filterable
                      placeholder="Value"
                    >
                      <el-option
                        v-for="(value, index) in voltageList"
                        :key="index"
                        :label="value"
                        :value="value"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :xs="12" :sm="8" :md="8">
                    <el-select
                      v-model="properties.high_voltage_limit_multiplier"
                      placeholder="Unit"
                    >
                      <el-option
                        v-for="(unit, index) in voltageMultiplierArr"
                        :key="index"
                        :label="unit"
                        :value="unit"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :xs="12" :sm="8" :md="8">
                    <el-select v-model="properties.high_voltage_limit_unit" placeholder="Symbol">
                      <el-option
                        v-for="(unit, index) in voltageUnitArr"
                        :key="index"
                        :label="unit"
                        :value="unit"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="Low voltage limit" class="form-item-inline">
                <el-row :gutter="8" class="voltage-row">
                  <el-col :xs="24" :sm="8" :md="8" class="voltage-value-col">
                    <el-select
                      v-model.number="properties.low_voltage_limit_value"
                      allow-create
                      filterable
                      placeholder="Value"
                    >
                      <el-option
                        v-for="(value, index) in voltageList"
                        :key="index"
                        :label="value"
                        :value="value"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :xs="12" :sm="8" :md="8">
                    <el-select v-model="properties.low_voltage_limit_multiplier" placeholder="Unit">
                      <el-option
                        v-for="(unit, index) in voltageMultiplierArr"
                        :key="index"
                        :label="unit"
                        :value="unit"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :xs="12" :sm="8" :md="8">
                    <el-select v-model="properties.low_voltage_limit_unit" placeholder="Symbol">
                      <el-option
                        v-for="(unit, index) in voltageUnitArr"
                        :key="index"
                        :label="unit"
                        :value="unit"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="Base voltage" class="form-item-inline">
                <el-row :gutter="8" class="voltage-row">
                  <el-col :xs="24" :sm="8" :md="8" class="voltage-value-col">
                    <el-select
                      @change="handleBaseVoltageChange"
                      v-model.number="properties.base_voltage_value"
                      allow-create
                      filterable
                      placeholder="Value"
                    >
                      <el-option
                        v-for="(value, index) in voltageList"
                        :key="index"
                        :label="value"
                        :value="value"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :xs="12" :sm="8" :md="8">
                    <el-select v-model="properties.base_voltage_multiplier" placeholder="Unit">
                      <el-option
                        v-for="(unit, index) in voltageMultiplierArr"
                        :key="index"
                        :label="unit"
                        :value="unit"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :xs="12" :sm="8" :md="8">
                    <el-select v-model="properties.base_voltage_unit" placeholder="Unit">
                      <el-option
                        v-for="(unit, index) in voltageUnitArr"
                        :key="index"
                        :label="unit"
                        :value="unit"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </div>
        </section>
      </div>
      <div class="col-content">
        <section class="vl-card vl-comment-card">
          <div class="vl-header">
            <i class="fa-solid fa-align-left"></i>
            <span>Comment</span>
          </div>
          <div class="vl-body">
            <el-form size="small" class="vl-comment-form">
              <el-input
                class="vl-comment-input"
                type="textarea"
                v-model="properties.comment"
              ></el-input>
            </el-form>
          </div>
        </section>
      </div>
    </div>
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
  methods: {
    handleBaseVoltageChange() {
      this.$emit && this.$emit && this.$emit('base-voltage-changed')
    }
  }
}
</script>

<style scoped>
.vl-view {
  display: flex;
  flex-direction: column;
  padding: 0 4px 16px;
}

.vl-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 20px;
  margin-top: 14px;
}

.col-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.vl-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
}

.vl-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  border-radius: 6px 6px 0 0;
  color: #606266;
  font-size: 12px;
  font-weight: 600;
}

.vl-header i {
  color: #909399;
}

.vl-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px;
}

.vl-body :deep(.el-form) {
  width: 100%;
}

.vl-comment-form,
.vl-comment-input,
.vl-comment-input :deep(.el-textarea__inner) {
  height: 100%;
}

.vl-comment-form {
  display: flex;
  flex: 1;
}

.vl-comment-input :deep(.el-textarea__inner) {
  min-height: 150px !important;
  resize: vertical;
}

:deep(.el-select),
:deep(.el-input),
:deep(.el-textarea) {
  width: 100%;
}

.voltage-value-col {
  min-width: 0;
}

:deep(.el-form-item) {
  margin-bottom: 10px;
}

:deep(.el-form-item__label) {
  font-size: 12px !important;
  color: #303133;
  line-height: 16px;
  width: 150px !important;
  text-align: left;
}

:deep(.el-input__inner),
:deep(.el-select .el-input__inner) {
  width: 100%;
  font-size: 12px !important;
  height: 32px;
  line-height: 32px;
}

/* Label inline cùng dòng với selects */
:deep(.form-item-inline .el-form-item__label) {
  float: none;
  display: inline-block;
  width: 150px !important;
  padding-right: 12px;
  white-space: nowrap;
  vertical-align: middle;
  text-align: left;
}

:deep(.form-item-inline .el-form-item__content) {
  display: inline-block;
  margin-left: 0 !important;
  flex: 1;
  min-width: 0;
}

:deep(.form-item-inline) {
  display: flex;
  align-items: center;
}

@media (max-width: 767px) {
  .vl-view {
    padding: 0 0 12px;
  }

  .vl-row {
    gap: 10px;
    margin-top: 10px;
  }

  .vl-header {
    padding: 8px 10px;
  }

  .vl-body {
    padding: 10px;
  }

  .voltage-value-col {
    margin-bottom: 8px;
  }

  :deep(.form-item-inline .el-form-item__label) {
    display: block;
    width: 100% !important;
    padding: 0 0 4px;
    text-align: left;
  }

  :deep(.form-item-inline .el-form-item__content) {
    display: block;
    width: 100%;
  }

  :deep(.el-form-item) {
    display: block;
  }

  :deep(.el-form-item__label) {
    float: none;
    display: block;
    width: 100% !important;
    margin-left: 0 !important;
    padding: 0 0 4px;
    text-align: left;
  }

  :deep(.el-form-item__content) {
    width: 100%;
    margin-left: 0 !important;
  }
}
</style>
