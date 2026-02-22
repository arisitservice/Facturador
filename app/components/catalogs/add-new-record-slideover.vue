<script setup lang="ts">
const { isAddNewRecordSlideoverOpen } = useDashboard();
const route = useRoute();

type FormType = 'client' | 'supplier' | 'user' | 'folder' | null;

const showForm = computed<FormType>(() => {
  const path = route.path;
  if (path === '/nova/catalogs/clients')
    return 'client';
  if (path === '/nova/catalogs/suppliers')
    return 'supplier';
  if (path === '/nova/catalogs/users')
    return 'user';
  if (path === '/nova/catalogs/folders')
    return 'folder';
  return null;
});
</script>

<template>
  <USlideover
    v-model:open="isAddNewRecordSlideoverOpen"
    :title="`Add new ${showForm}`"
  >
    <template #body>
      <div>
        <CatalogsFormsClients v-if="showForm === 'client'" />
        <CatalogsFormsSuppliers v-else-if="showForm === 'supplier'" />
        <CatalogsFormsUsers v-else-if="showForm === 'user'" />
        <CatalogsFormsFolders v-else-if="showForm === 'folder'" />
      </div>
    </template>
  </USlideover>
</template>
