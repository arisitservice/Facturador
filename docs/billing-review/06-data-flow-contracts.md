# 06 — Component Data Flow Contracts

**Severity: Medium**

---

## Overview

This document covers three related data-flow improvements made during the refactor:

1. Using `defineModel` for two-way bindings
2. Keeping read-only props truly read-only (disabled fields)
3. Extracting repeated inline expressions into `computed`

---

## Issue A — `defineModel` for two-way component contracts

### Before

Before the split, state was mutated directly inside the parent page because everything lived in the same component. After splitting into child components, the data-flow contract needed to be made explicit.

The approach chosen for every child component that needs to both read **and** mutate its data is `defineModel`:

```ts
// ✅ product-services-table.vue
const productServices = defineModel<ProductService[]>({ required: true })
// Nuxt auto-generates the v-model binding in the parent
```

```ts
// ✅ tax-info-card.vue
const taxInfo = defineModel<InvoiceTaxInfo>('taxInfo', { required: true })
const vatDetails = defineModel<VatDetails>('vatDetails', { required: true })
// Named models allow multiple v-model bindings on one component
```

In the parent page:

```vue
<BillingInvoiceProductServicesTable v-model="state.productServices" />

<BillingInvoiceTaxInfoCard
  v-model:tax-info="state.taxInfo"
  v-model:vat-details="state.vatDetails"
/>
```

### Why `defineModel`

`defineModel` (available since Vue 3.4) is the modern, idiomatic way to declare two-way binding in a child component. It is equivalent to declaring an `update:modelValue` emit + a `modelValue` prop, but in a single line with full TypeScript type inference.

Before 3.4 you would write:

```ts
const props = defineProps<{ modelValue: ProductService[] }>()
const emit = defineEmits<{ 'update:modelValue': [v: ProductService[]] }>()
// and manually call emit('update:modelValue', newValue) everywhere
```

`defineModel` handles all of that automatically. The value it returns is a writable `ref` — reading it returns the current value, writing to it emits the update.

---

## Issue B — Read-only props should not use `v-model`

The client info card shows fields that are auto-filled from the selected client and are never editable by the user (Tax ID, Business Name, etc.). Before the split these used `v-model` on `state.client.*`, which technically worked but implied two-way binding where there was none.

### Before (in the page, before extracting the component)

```vue
<UInput v-model="state.client.taxId" disabled />
<UInput v-model="state.client.businessName" disabled />
```

### After (in `client-info-card.vue`)

```ts
const props = defineProps<{
  clientData: ClientData
  // ...
}>()
```

```vue
<UInput :model-value="props.clientData.taxId" disabled class="w-full" />
<UInput :model-value="props.clientData.businessName" disabled class="w-full" />
```

### Why

When a field is disabled and purely display-only, using `v-model` suggests the child can mutate the value. `:model-value` (one-way binding) is the honest declaration: the component receives the value as input and does not emit updates. This makes intent clear and prevents accidental two-way wiring if `disabled` is ever removed.

> **Rule:** Use `:model-value` (one-way) for display-only fields. Use `v-model` or `defineModel` only when the component genuinely needs to emit changes up.

---

## Issue C — Repeated inline expression → `computed`

### Before

The expression `editingIndex !== null` (or `editingIndex.value !== null`) appeared in multiple places inside the template:

```vue
<!-- ❌ Repeated expression, easy to get out of sync -->
:title="editingIndex !== null ? 'Edit Product / Service' : 'Add Product / Service'"
:label="editingIndex !== null ? 'Save' : 'Add'"
```

### After

```ts
// ✅ Single source of truth
const isEditing = computed(() => editingIndex.value !== null)
```

```vue
:title="isEditing ? 'Edit Product / Service' : 'Add Product / Service'"
:label="isEditing ? 'Save' : 'Add'"
```

### Why

A `computed` property is a single declaration that Vue caches. If the expression needs to change (e.g. you add a second condition to determine "editing mode"), you update one place. With the inline expression repeated, you must find and update all occurrences — and it is easy to miss one.

This also improves readability: `isEditing` communicates semantic intent, while `editingIndex !== null` forces the reader to interpret it.

> **Rule:** Extract any template expression that is used in more than one place, or that requires interpretation to understand, into a named `computed` property.

---

## Summary of Data Flow Principles

| Situation | Pattern |
|---|---|
| Child needs to read **and** update a value | `defineModel` → `v-model` in parent |
| Multiple two-way bindings on one component | Named `defineModel('name')` → `v-model:name` |
| Child only reads a value (display/disabled) | `defineProps` → `:model-value` in parent |
| Child needs to notify parent of an event | `defineEmits` → `@event-name` in parent |
| Derived boolean used in multiple template places | `computed` |
