# 05 — Render Functions in Table Column Definitions

**Severity: Medium**

---

## The Issue

The product/service table's "actions" column was defined using `resolveComponent()` and `h()` (Vue's render function API) directly inside the column definition array:

```ts
// ❌ Before
const UButton = resolveComponent('UButton')

const productServiceColumns: TableColumn<ProductService>[] = [
  { accessorKey: 'detailedDescription', header: 'Description' },
  // ... other columns
  {
    id: 'actions',
    header: '',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-1 justify-end' }, [
        h(UButton, {
          icon: 'i-lucide-pencil',
          variant: 'ghost',
          size: 'xs',
          onClick: () => openEditModal(row.index),
        }),
        h(UButton, {
          icon: 'i-lucide-trash',
          variant: 'ghost',
          color: 'error',
          size: 'xs',
          onClick: () => deleteProductService(row.index),
        }),
      ]),
  },
]
```

---

## The Fix

### Remove the render function column

The `cell` function was removed. The column definition simply declares the column id and header:

```ts
// ✅ After — in the column definition
const columns: TableColumn<ProductService>[] = [
  { accessorKey: 'detailedDescription', header: 'Description' },
  // ... other columns
  { id: 'actions', header: '' },  // no cell function
]
```

### Use the `#actions-cell` named slot instead

Nuxt UI's `UTable` automatically provides a named slot for each column with the pattern `#<columnId>-cell`. The slot receives the same row context:

```vue
<!-- ✅ After — declarative template slot -->
<UTable :data="productServices" :columns="columns" class="flex-1">
  <template #actions-cell="{ row }">
    <div class="flex gap-1 justify-end">
      <UButton
        icon="i-lucide-pencil"
        variant="ghost"
        size="xs"
        @click="openEditModal(row.index)"
      />
      <UButton
        icon="i-lucide-trash"
        variant="ghost"
        color="error"
        size="xs"
        @click="deleteProductService(row.index)"
      />
    </div>
  </template>
</UTable>
```

The `resolveComponent('UButton')` call was also removed.

---

## Why this matters

### `resolveComponent` is a workaround, not a pattern

`resolveComponent()` is needed when you want to reference a component **by string name** outside of a template. It exists to bridge the gap between the template compiler (which resolves component names automatically) and render functions (which work with raw JavaScript). Writing `resolveComponent('UButton')` to then pass it to `h()` is an awkward workaround — the template compiler already handles this for free.

### Render functions in column definitions are hard to work with

Column definitions are plain JavaScript arrays. When you put `h()` calls inside them:

- **No template features** — you cannot use Vue directives (`v-if`, `v-for`), slots, or shorthand event syntax
- **No IDE help** — no autocomplete for props, no component prop type-checking
- **Opaque to tooling** — Vue devtools cannot inspect components rendered through bare `h()` in the same way
- **Hard to read** — the structure is verbose and non-obvious compared to template syntax

### Nuxt UI's named cell slot is the designed API

`UTable` was built expecting this usage pattern. The slot name follows a predictable convention (`<columnId>-cell`) and receives the full TanStack Table row context. Using the designed API means the code works with the component's update contract rather than against it.

---

## The Best Practice

> **Prefer template slots over render functions for cell content in `UTable`.** Reserve `h()` and render functions for cases where template syntax genuinely cannot express the requirement (dynamic component generation, programmatic rendering).

```
Column needs custom cell content?
  → Does UTable provide a named slot for it?   YES → use #<id>-cell slot
  → Does the content involve Vue directives?   YES → use slot
  → Is the structure entirely data-driven
    (no event handlers, no v-if)?             MAYBE → h() is acceptable
```

For `UTable` specifically: use `cell: fn` only for purely data-driven transformations (formatting a number, rendering a status badge from a value). Use the `#<id>-cell` slot for anything interactive.
