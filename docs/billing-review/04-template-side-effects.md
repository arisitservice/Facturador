# 04 — Template Side Effects

**Severity: Medium**

---

## The Issue

The VAT switch fields in the invoice tax card used `@change` handlers to mutate reactive state **directly inside the template**:

```vue
<!-- ❌ Before -->
<USwitch
  v-model="state.vatDetails.vatChargedAtRate"
  @change="state.vatDetails.vatExempt = false"
/>
<USwitch
  v-model="state.vatDetails.vatExempt"
  @change="state.vatDetails.vatChargedAtRate = false"
/>
```

Similarly, the credit note product form had a `handleTaxableChange` function called via `@change` — though the function itself was in the script, the trigger carried implicit state mutation logic tied to template event wiring:

```vue
<!-- ❌ Before — credit note -->
<USwitch v-model="productServiceData.isTaxable" @change="handleTaxableChange" />
```

```ts
function handleTaxableChange() {
  if (!productServiceData.value.isTaxable) {
    productServiceData.value.withholdingType = undefined
  }
}
```

---

## The Fix

### Invoice VAT switches

The mutual exclusion logic was moved entirely into the script as named handler functions:

```ts
// ✅ After — in tax-info-card.vue <script setup>
function setVatRate(v: boolean) {
  vatDetails.value = {
    ...vatDetails.value,
    vatChargedAtRate: v,
    vatExempt: v ? false : vatDetails.value.vatExempt,
  }
}

function setVatExempt(v: boolean) {
  vatDetails.value = {
    ...vatDetails.value,
    vatExempt: v,
    vatChargedAtRate: v ? false : vatDetails.value.vatChargedAtRate,
  }
}
```

```vue
<!-- ✅ After — template is declarative -->
<USwitch
  :model-value="vatDetails.vatChargedAtRate"
  @update:model-value="setVatRate($event as boolean)"
/>
<USwitch
  :model-value="vatDetails.vatExempt"
  @update:model-value="setVatExempt($event as boolean)"
/>
```

### Credit note taxable switch

```ts
// ✅ After — named handler makes the intent explicit
function onTaxableChange(v: boolean) {
  if (!v) {
    newProductService.value.withholdingType = undefined
  }
}
```

```vue
<USwitch
  v-model="newProductService.isTaxable"
  @update:model-value="onTaxableChange($event as boolean)"
/>
```

---

## Why this matters

### Templates should be declarative

A Vue template's job is to describe **what the UI looks like** given the current state. It should not describe **how the state changes** — that is the script's job.

When you write `@change="state.vatDetails.vatExempt = false"` in the template, you have hidden a business rule (VAT Rate and VAT Exempt are mutually exclusive) inside markup. Someone reading the template to understand the UI layout now has to parse business logic mixed in.

### Side effects belong in the script

The three-way separation of concerns in a Vue SFC is:
- `<script>` — state, logic, side effects
- `<template>` — declarative description of UI based on state
- `<style>` — visual presentation

Mutations, conditionals, and derivations belong in `<script>`. The template should only call named, descriptive functions.

### Also: `@change` vs `@update:modelValue`

The original code used `@change` (a native DOM event) on a Vue component. Nuxt UI's `USwitch` emits `update:modelValue` when toggled — not a native `change` event. Using `@change` on a component works by accident (the event bubbles from the internal `<input>`), but it is fragile and inconsistent. The correct event to listen to is `@update:model-value`.

---

## The Best Practice

> **Keep templates declarative.** Move any conditional logic, state mutations, and side effects into named functions in `<script setup>`. Use descriptive function names (`setVatRate`, `onTaxableChange`) that communicate intent.

```vue
<!-- ❌ Logic in template -->
<USwitch v-model="a" @change="b = false" />

<!-- ✅ Logic in script, template stays clean -->
<USwitch :model-value="a" @update:model-value="onAChange($event)" />
```

```ts
function onAChange(v: boolean) {
  a.value = v
  if (v) b.value = false
}
```
