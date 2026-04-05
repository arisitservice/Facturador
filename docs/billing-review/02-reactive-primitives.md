# 02 — Reactive Primitives

**Severity: Medium**

---

## The Issues

Two separate reactive primitive mistakes existed across every page:

1. **`ref()` was used for primitive values** (`boolean`, `number | undefined`, `null`) where `shallowRef()` is the correct choice.
2. **`ref()` was used for the form state object** that is always mutated in-place, where `reactive()` is the correct choice.

---

## Issue A — `ref` for primitives

### Before

```ts
const isProductModalOpen = ref(false)          // boolean
const editingIndex = ref<number | null>(null)  // number | null
const selectedClientId = ref<number | undefined>(undefined)  // number | undefined
const folioInput = ref('')                     // string
```

### After

```ts
const isProductModalOpen = shallowRef(false)
const editingIndex = shallowRef<number | null>(null)
const selectedClientId = shallowRef<number | undefined>(undefined)
const folioInput = shallowRef('')
```

### Why

`ref()` wraps its value in a deep reactive proxy. For a primitive (`false`, `null`, `0`, `''`) there is **no nested structure to track**, so the deep proxy is pure overhead — Vue still creates it but it contributes nothing.

`shallowRef()` creates a ref that only tracks replacement of the `.value` itself (`shallowRef.value = newValue`). For primitives this is always sufficient: assigning `isProductModalOpen.value = true` replaces the entire value, which `shallowRef` handles exactly as well as `ref`.

> **Rule of thumb:** If the value is a primitive (string, number, boolean, null, undefined), always use `shallowRef`.

---

## Issue B — `ref` for a form state object that is always mutated in-place

### Before

```ts
const state = ref<NewInvoiceData>({
  client: { clientId: 0, businessName: '', ... },
  taxInfo: { ... },
  productServices: [],
  vatDetails: { ... },
})

// Usage — all mutations go through .value:
state.value.client.clientId = client.id
state.value.productServices.push(...)
state.value.productServices.splice(index, 1)
```

### After

```ts
const state = reactive<NewInvoiceData>({
  client: { clientId: 0, businessName: '', ... },
  taxInfo: { ... },
  productServices: [],
  vatDetails: { ... },
})

// Usage — mutations directly on the object:
state.client.clientId = client.id
state.productServices.push(...)
state.productServices.splice(index, 1)
```

### Why

Vue offers two ways to hold object state:

| Primitive | Use when |
|---|---|
| `ref(obj)` | You intend to **replace the entire object** (`state.value = newObject`), e.g. resetting from an API response |
| `reactive(obj)` | You primarily **mutate properties in-place** (`state.client.id = x`, `state.items.push(...)`) |

Form state is the canonical `reactive()` use case. A form accumulates changes field-by-field — you never replace the root object wholesale. Using `ref()` here forces you to write `.value.` everywhere and provides no benefit over `reactive()`.

Additionally, `reactive()` removes one level of indirection in the template: `state.client.taxId` instead of `state.value.client.taxId`.

### Important caveat with `reactive()`

Never destructure a `reactive()` object directly — the result loses reactivity:

```ts
// ❌ BAD — count is now a plain number, not reactive
const { count } = reactive({ count: 0 })

// ✅ GOOD — use toRefs() if you need to destructure
const { count } = toRefs(reactive({ count: 0 }))
```

Our composables only return the whole `state` object (not destructured fields), so this is not a concern here.

---

## Decision Tree

```
Is this value a primitive (string, number, boolean, null, undefined)?
  YES → shallowRef()

Is this an object/array that you will mostly mutate in-place?
  YES → reactive()

Is this an object/array that you will frequently replace wholesale
(e.g. .value = fetchedData)?
  YES → ref()

Is this an external instance (SDK client, class, large data blob)
where you want to update by replacing the reference, not by proxying internals?
  YES → shallowRef()
```
