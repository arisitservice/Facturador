<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { Row } from '@tanstack/table-core';

import { getPaginationRowModel } from '@tanstack/table-core';
import { upperFirst } from 'scule';

import type { Client } from '~/types/facturador/api/client-api';

definePageMeta({
  name: 'nova-catalogs-clients',
});

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');
const UCheckbox = resolveComponent('UCheckbox');

const toast = useToast();
const table = useTemplateRef('table');
const clientsStore = useClientsStore();

const isEditSlideoverOpen = ref(false);
const clientToEdit = ref<Client | null>(null);

const columnFilters = ref([{
  id: 'name',
  value: '',
}]);
const columnVisibility = ref();
const rowSelection = ref({});

await clientsStore.fetchClients();

function openEdit(client: Client) {
  clientToEdit.value = client;
  isEditSlideoverOpen.value = true;
}

function getRowItems(row: Row<Client>) {
  return [
    {
      type: 'label',
      label: 'Acciones',
    },
    {
      label: 'Editar cliente',
      icon: 'i-lucide-pencil',
      onSelect() {
        openEdit(row.original);
      },
    },
    {
      label: 'Copiar ID',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original.id.toString());
        toast.add({
          title: 'Copiado',
          description: 'ID del cliente copiado al portapapeles',
        });
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Eliminar cliente',
      icon: 'i-lucide-trash',
      color: 'error',
      async onSelect() {
        const response = await clientsStore.deleteClient(row.original.id);
        toast.add({
          title: response.isSuccess ? 'Cliente eliminado' : 'Error',
          description: response.message ?? undefined,
          color: response.isSuccess ? 'success' : 'error',
        });
      },
    },
  ];
}

const columns: TableColumn<Client>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all',
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'ariaLabel': 'Select row',
      }),
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => h('p', { class: 'font-medium text-highlighted' }, row.original.name),
  },
  {
    accessorKey: 'businessName',
    header: 'Razón Social',
  },
  {
    accessorKey: 'taxId',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'RFC',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      });
    },
  },
  {
    accessorKey: 'postalCode',
    header: 'C.P.',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end',
            },
            items: getRowItems(row),
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
            }),
        ),
      );
    },
  },
];

const nameFilter = computed({
  get: (): string => {
    return (table.value?.tableApi?.getColumn('name')?.getFilterValue() as string) || '';
  },
  set: (value: string) => {
    table.value?.tableApi?.getColumn('name')?.setFilterValue(value || undefined);
  },
});

const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
});
</script>

<template>
  <div>
    <div
      v-if="clientsStore.isLoading"
      class="flex flex-wrap items-center justify-between gap-1.5"
    >
      <USkeleton class="h-8 max-w-sm w-full rounded-md" />
      <div class="flex items-center gap-1.5">
        <USkeleton class="h-8 w-20 rounded-md" />
        <USkeleton class="h-8 w-28 rounded-md" />
        <USkeleton class="h-8 w-24 rounded-md" />
      </div>
    </div>

    <div
      v-else
      class="flex flex-wrap items-center justify-between gap-1.5"
    >
      <UInput
        v-model="nameFilter"
        class="max-w-sm"
        icon="i-lucide-search"
        placeholder="Filter by name..."
      />

      <div class="flex items-center gap-1.5">
        <UDropdownMenu
          :items="
            table?.tableApi
              ?.getAllColumns()
              .filter((column: any) => column.getCanHide())
              .map((column: any) => ({
                label: upperFirst(column.id),
                type: 'checkbox' as const,
                checked: column.getIsVisible(),
                onUpdateChecked(checked: boolean) {
                  table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                },
                onSelect(e?: Event) {
                  e?.preventDefault()
                },
              }))
          "
          :content="{ align: 'end' }"
        >
          <UButton
            label="Columns"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-settings-2"
          />
        </UDropdownMenu>
      </div>
    </div>

    <UTable
      ref="table"
      v-model:column-filters="columnFilters"
      v-model:column-visibility="columnVisibility"
      v-model:row-selection="rowSelection"
      v-model:pagination="pagination"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel(),
      }"
      class="shrink-0"
      :data="clientsStore.clients"
      :columns="columns"
      :loading="clientsStore.isLoading"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default',
        separator: 'h-0',
      }"
    />

    <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
      <div class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
        {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
      </div>

      <div class="flex items-center gap-1.5">
        <UPagination
          :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </div>
    <USlideover
      v-model:open="isEditSlideoverOpen"
      title="Editar cliente"
      @after-leave="clientToEdit = null"
    >
      <template #body>
        <CatalogsFormsEditClient
          v-if="clientToEdit"
          :client="clientToEdit"
          @close="isEditSlideoverOpen = false"
        />
      </template>
    </USlideover>
  </div>
</template>

<style scoped>

</style>
