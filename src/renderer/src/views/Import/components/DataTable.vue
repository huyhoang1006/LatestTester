<template>
  <div style="border: 1px solid #ebeef5; border-radius: 4px; overflow: hidden; margin-top: 10px">
    <table cellpadding="8" width="100%" style="border-collapse: collapse; table-layout: fixed">
      <thead>
        <tr>
          <th style="width: 130px">Code</th>
          <th style="width: 140px">Category</th>
          <th>Feature</th>
          <th style="width: 190px">Coordinates</th>
          <th style="width: 50px">
            <el-button @click="$emit('add-row')" size="small" type="primary"
              ><i class="fa-solid fa-plus"></i
            ></el-button>
          </th>
          <th style="width: 50px">
            <el-button @click="$emit('clear-all')" size="small" type="danger"
              ><i class="fa-solid fa-trash"></i
            ></el-button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in tableData"
          :key="index"
          :style="{
            background: index % 2 === 0 ? '#fff' : '#fafafa',
            borderBottom: '1px solid #EBEEF5'
          }"
        >
          <td><el-input v-model="row.code" placeholder="e.g. A1" size="small" /></td>
          <td>
            <el-select
              v-model="row.category"
              size="small"
              style="width: 100%"
              @change="$emit('category-change', row)"
            >
              <el-option
                v-for="c in categoryOptions"
                :key="c.value"
                :label="c.label"
                :value="c.value"
              />
            </el-select>
          </td>
          <td>
            <div
              v-for="(level, li) in row.featureLevels"
              :key="index + '-' + li"
              style="margin-bottom: 4px"
            >
              <el-select
                v-model="level.key"
                size="small"
                style="width: 100%"
                placeholder="Select feature"
                @change="$emit('feature-change', { row: row, levelIndex: Number(li) })"
              >
                <el-option
                  v-for="opt in getOptions(row, Number(li))"
                  :key="String(opt.key)"
                  :label="opt.label"
                  :value="opt.key"
                />
              </el-select>
            </div>
          </td>
          <td>
            <template v-if="row.coordinates && row.coordinates.length">
              <el-tag
                v-for="coord in row.coordinates"
                :key="coord"
                size="small"
                type="info"
                style="margin: 2px; font-size: 11px"
                >{{ coord }}</el-tag
              >
            </template>
            <span v-else style="color: #c0c4cc; font-size: 11px">not found</span>
          </td>
          <td>
            <el-button
              @click="$emit('add-row', index)"
              type="primary"
              size="small"
              style="width: 100%"
              ><i class="fa-solid fa-plus"></i
            ></el-button>
          </td>
          <td>
            <el-button
              @click="$emit('remove-row', index)"
              type="danger"
              size="small"
              style="width: 100%"
              ><i class="fa-solid fa-trash"></i
            ></el-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tableData: any[]
  categoryOptions: any[]
  getOptions: (row: any, levelIndex: number) => any[]
}>()

defineEmits<{
  (e: 'add-row', index?: number): void
  (e: 'remove-row', index: number): void
  (e: 'clear-all'): void
  (e: 'category-change', row: any): void
  (e: 'feature-change', payload: { row: any; levelIndex: number }): void
}>()
</script>

<style scoped>
th {
  background: #f5f7fa;
  font-weight: 600;
  border-bottom: 2px solid #ebeef5;
  padding: 8px;
  white-space: nowrap;
}
td,
th {
  vertical-align: middle;
}
td {
  border-bottom: 1px solid #ebeef5;
}
tr:last-child td {
  border-bottom: none;
}
</style>
