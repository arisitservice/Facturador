import type { TableColumn } from '@nuxt/ui';
import type { Row } from '@tanstack/table-core';

import type { User } from '~/types/facturador';

// TODO - Check why is not rendering components when using the useComponents composable

export function useClientsTable() {
  const UAvatar = resolveComponent('UAvatar');
  const UBadge = resolveComponent('UBadge');
  const UButton = resolveComponent('UButton');
  const UCheckbox = resolveComponent('UCheckbox');
  const UDropdownMenu = resolveComponent('UDropdownMenu');
  const toast = useToast();

  function getRowItems(row: Row<User>) {
    return [
      {
        type: 'label',
        label: 'Actions',
      },
      {
        label: 'Copy customer ID',
        icon: 'i-lucide-copy',
        onSelect() {
          navigator.clipboard.writeText(row.original.id.toString());
          toast.add({
            title: 'Copied to clipboard',
            description: 'Customer ID copied to clipboard',
          });
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'View customer details',
        icon: 'i-lucide-list',
      },
      {
        label: 'View customer payments',
        icon: 'i-lucide-wallet',
      },
      {
        type: 'separator',
      },
      {
        label: 'Delete customer',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect() {
          toast.add({
            title: 'Customer deleted',
            description: 'The customer has been deleted.',
          });
        },
      },
    ];
  }

  const columns: TableColumn<User>[] = [
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
      header: 'Name',
      cell: ({ row }) => {
        return h('div', { class: 'flex items-center gap-3' }, [
          h(UAvatar, {
            ...row.original.avatar,
            size: 'lg',
          }),
          h('div', undefined, [
            h('p', { class: 'font-medium text-highlighted' }, row.original.name),
            h('p', { class: '' }, `@${row.original.name}`),
          ]),
        ]);
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          label: 'Email',
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
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => row.original.location,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      filterFn: 'equals',
      cell: ({ row }) => {
        const color = {
          subscribed: 'success' as const,
          unsubscribed: 'error' as const,
          bounced: 'warning' as const,
        }[row.original.status];

        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
          row.original.status);
      },
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

  return {
    columns,
    getRowItems,
  };
}
