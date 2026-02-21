<script setup lang="ts">
const { isAddNewRecordSlideoverOpen } = useDashboard();
const route = useRoute();

type FormType = 'clients' | 'suppliers' | 'users' | 'folders' | null;

const showForm = computed<FormType>(() => {
  const path = route.path;
  if (path === '/nova/catalogs/clients')
    return 'clients';
  if (path === '/nova/catalogs/suppliers')
    return 'suppliers';
  if (path === '/nova/catalogs/users')
    return 'users';
  if (path === '/nova/catalogs/folders')
    return 'folders';
  return null;
});
</script>

<template>
  <USlideover
    v-model:open="isAddNewRecordSlideoverOpen"
    title="Add New Record"
  >
    <template #body>
      <div>
        <CatalogsFormsClients v-if="showForm === 'clients'" />
        <CatalogsFormsSuppliers v-else-if="showForm === 'suppliers'" />
        <CatalogsFormsUsers v-else-if="showForm === 'users'" />
        <CatalogsFormsFolders v-else-if="showForm === 'folders'" />
      </div>
    </template>
  </USlideover>
</template>
