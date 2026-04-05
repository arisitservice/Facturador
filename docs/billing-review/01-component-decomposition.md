# 01 — Component Decomposition

**Severity: Critical**

---

## The Issue

Each billing page (`new-invoice.vue`, `new-credit-note.vue`, `new-payment-complement.vue`) was implemented as a single large file that did everything at once:

- Fetched data from the store
- Held all form state in one large `ref` object
- Managed modal open/close state
- Contained CRUD logic for product/service rows
- Rendered 4–5 visually distinct UI sections all inline

A simplified picture of the original structure:

```vue
<!-- new-invoice.vue (300+ lines) -->
<script setup lang="ts">
// 1. imports
// 2. store fetch
// 3. ALL form state
// 4. client-watcher side effect
// 5. product/service CRUD (reset, open, edit, delete, save)
// 6. table column definitions with inline render functions
// 7. submitInvoice
</script>

<template>
  <!-- Client card (6 fields) -->
  <!-- Tax info card (4 fields + VAT toggles) -->
  <!-- Product modal (5 fields + action buttons) -->
  <!-- Add product button row -->
  <!-- Product table -->
  <!-- Submit button -->
</template>
```

The same pattern was copy-pasted across all three pages, so the same code existed in three places.

---

## The Fix

### 1. Extract state and logic into a composable

Each page got a dedicated composable (`use-new-invoice.ts`, `use-new-credit-note.ts`, `use-new-payment-complement.ts`):

```ts
// app/composables/use-new-invoice.ts
export function useNewInvoice() {
  const clientsStore = useClientsStore()

  const clientList = computed(() =>
    clientsStore.clients.map(client => ({
      label: `${client.name} — ${client.taxId}`,
      value: client.id,
    }))
  )

  const state = reactive<NewInvoiceData>({ /* initial values */ })

  const selectedClientId = shallowRef<number | undefined>(undefined)

  watch(selectedClientId, (id) => {
    const client = clientsStore.clients.find(c => c.id === id)
    if (!client) return
    state.client.clientId = client.id
    // ... populate other client fields
  })

  function submitInvoice() {
    // TODO: validate and call API
  }

  return { state, selectedClientId, clientList, submitInvoice }
}
```

### 2. Extract each UI section into its own component

| Component | Responsibility |
|---|---|
| `BillingClientInfoCard` | Client dropdown + derived read-only fields. Shared across all three pages. |
| `BillingInvoiceTaxInfoCard` | Tax selects + VAT toggles specific to invoices |
| `BillingInvoiceProductServicesTable` | Product/service table + add/edit/delete modal |
| `BillingCreditNoteTaxInfoCard` | Tax selects for credit notes (no VAT section) |
| `BillingCreditNoteProductServicesTable` | Product table with taxable/withholding fields |
| `BillingPaymentComplementPaymentReceptionCard` | Payment reception form + fiscal folio list |

### 3. Reduce the page to a thin composition surface

```vue
<!-- new-invoice.vue (~35 lines after refactor) -->
<script setup lang="ts">
import { newInvoiceDataSchema } from '~/lib/schemas/billing'

definePageMeta({ name: 'nova-billing-invoices-new-invoice' })

const clientsStore = useClientsStore()
await useAsyncData('invoice-clients', () => clientsStore.fetchClients(), {
  immediate: !clientsStore.clients.length,
})

const { state, selectedClientId, clientList, submitInvoice } = useNewInvoice()
</script>

<template>
  <div class="flex flex-col gap-8">
    <UForm :schema="newInvoiceDataSchema" :state="state">
      <div class="flex flex-col sm:flex-row gap-4">
        <BillingClientInfoCard
          v-model:selected-client-id="selectedClientId"
          :items="clientList"
          :is-loading="clientsStore.isLoading"
          :client-data="state.client"
        />
        <BillingInvoiceTaxInfoCard
          v-model:tax-info="state.taxInfo"
          v-model:vat-details="state.vatDetails"
        />
      </div>
    </UForm>
    <BillingInvoiceProductServicesTable v-model="state.productServices" />
    <div class="flex justify-end">
      <UButton label="Create Invoice" type="button" icon="i-lucide-file-plus" size="lg" @click="submitInvoice" />
    </div>
  </div>
</template>
```

---

## Why this matters

### Separation of concerns

A component that both fetches data **and** renders 5 UI sections **and** manages a modal is doing too much. When something breaks, you have to read 300 lines to find the relevant part. When a section needs to change, you risk accidentally breaking an unrelated section.

### Maintainability

Small, focused components are dramatically easier to read, update, and reason about. If the product modal form needs a new field, you open `product-services-table.vue` and nothing else touches.

### Reusability

`BillingClientInfoCard` is identical in all three billing forms. Before the refactor, the same 40-line block of markup existed in three files. Now it lives in one place — a bug fix or field change is a single-file edit.

### Testability

Composables and small components are far easier to test in isolation. You can unit-test `useNewInvoice` without mounting a full page. You can mount `ProductServicesTable` independently to test CRUD behavior.

---

## The Best Practice

> **Keep route-view components thin.** A page component's job is app shell layout, data wiring, and feature composition. All feature UI and feature logic belongs in child components and composables.

The rule of thumb from the Vue best practices guide:

- **Split a component when it has more than one clear responsibility.**
- A component that owns orchestration (state, fetching, side effects) **should not** also contain substantial presentational markup for multiple sections.
- For any CRUD/form feature, split at minimum into: a container, an input/form component, a list/table component.

```
Route view (thin)
  └── Feature container (composable)
  └── Section A component  ← props in, events out
  └── Section B component  ← props in, events out
  └── Section C component  ← v-model for two-way CRUD
```
