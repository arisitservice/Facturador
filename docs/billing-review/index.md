# Billing Pages — Code Review Notes

This folder documents every issue found and fix applied during the review of the three billing form pages:

- `app/pages/nova/billing/invoices/new-invoice.vue`
- `app/pages/nova/billing/credit-notes/new-credit-note.vue`
- `app/pages/nova/billing/payment-complements/new-payment-complement.vue`

Each document covers one specific topic: the problem, the fix, _why_ the fix matters, and the underlying best practice to carry forward.

---

## Documents

| # | File | Topic | Severity |
|---|------|-------|----------|
| 1 | [01-component-decomposition.md](./01-component-decomposition.md) | Splitting a monolithic page into focused components and composables | Critical |
| 2 | [02-reactive-primitives.md](./02-reactive-primitives.md) | Choosing the right reactive primitive — `shallowRef`, `ref`, `reactive` | Medium |
| 3 | [03-ssr-data-fetching.md](./03-ssr-data-fetching.md) | Using `useAsyncData` instead of a bare `await` for SSR-safe data loading | High |
| 4 | [04-template-side-effects.md](./04-template-side-effects.md) | Moving side effects and mutations out of the template into script handlers | Medium |
| 5 | [05-render-functions-in-columns.md](./05-render-functions-in-columns.md) | Replacing `resolveComponent` + `h()` in table column definitions with named slots | Medium |
| 6 | [06-data-flow-contracts.md](./06-data-flow-contracts.md) | Typing component contracts with `defineModel`, `defineProps`, `defineEmits` | Medium |

---

## Summary of what changed

### Before

All three pages were monolithic — a single `.vue` file mixing:
- API orchestration (fetching clients, populating a store)
- Full form state
- Product/service CRUD logic
- Modal visibility state
- Multiple distinct UI sections inlined directly

Each page was 300–400 lines long, with duplicated patterns across the three files.

### After

Each page became a thin ~35-line composition surface. Logic and UI were extracted into:

```
app/
  composables/
    use-new-invoice.ts           ← form state + client watcher + submit
    use-new-credit-note.ts
    use-new-payment-complement.ts

  components/billing/
    client-info-card.vue         ← shared across all three pages
    invoice/
      tax-info-card.vue
      product-services-table.vue
    credit-note/
      tax-info-card.vue
      product-services-table.vue
    payment-complement/
      payment-reception-card.vue
```
