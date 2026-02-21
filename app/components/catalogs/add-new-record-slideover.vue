<script setup lang="ts">
const { isAddNewRecordSlideoverOpen } = useDashboard();
</script>

<template>
  <USlideover
    v-model:open="isAddNewRecordSlideoverOpen"
    title="Agregar nuevo registro"
  >
    <template #body>
      <div>
        <CatalogsFormsClients />
      </div>
    </template>
  </USlideover>
</template>
