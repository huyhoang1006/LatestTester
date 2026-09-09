<template>
  <div class="export-view">
    <el-select
      :model-value="modelValue"
      placeholder="Select template"
      size="small"
      style="min-width: 200px"
      clearable
      @update:model-value="(v: any) => $emit('update:modelValue', v)"
    >
      <el-option v-for="t in templateList" :key="t.name" :label="t.name" :value="t.name" />
    </el-select>
    <el-button type="primary" size="small" @click="$emit('add-template')"
      ><i class="fa-solid fa-plus"></i> Add Template</el-button
    >
    <slot name="actions"></slot>
    <el-button size="small" @click="$emit('refresh')"><i class="fa-solid fa-rotate"></i></el-button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  templateList: any[]
  modelValue?: string
}>()

defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'add-template'): void
  (e: 'refresh'): void
}>()
</script>

<style scoped>
.export-view {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
