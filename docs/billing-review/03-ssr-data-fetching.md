# 03 — SSR-Safe Data Fetching

**Severity: High**

---

## The Issue

All three pages loaded their client list using a bare `await` directly in `<script setup>`:

```ts
// ❌ Before — in every billing page
if (!clientsStore.clients.length) {
  await clientsStore.fetchClients()
}
```

`fetchClients()` internally calls `$fetch` (a plain HTTP request). While `await` in `<script setup>` works with Vue Suspense, Nuxt has no visibility into what is being fetched, so it **cannot include the result in the SSR payload**. This creates a silent problem.

---

## What actually happens

### With bare `await $fetch` / `await store.fetchClients()`

1. **Server renders the page.** The fetch runs on the server, data populates the store, HTML is produced.
2. **Client receives the HTML** — it looks correct.
3. **Client hydrates.** Vue re-runs `<script setup>`. The bare `await` fires again, making a second HTTP request from the browser.
4. Result: **two network requests** for the same data on every page load.

```
Server:  fetch clients → render HTML ✓
Client:  fetch clients again → re-render → flicker / wasted request ✗
```

### With `useAsyncData`

```ts
await useAsyncData('invoice-clients', () => clientsStore.fetchClients(), {
  immediate: !clientsStore.clients.length,
})
```

1. **Server renders the page.** `useAsyncData` runs the fetcher and serialises the result into `__NUXT_DATA__` in the HTML payload.
2. **Client hydrates.** `useAsyncData` reads the payload from `__NUXT_DATA__` — **no second request**.
3. The key `'invoice-clients'` identifies the cache entry. If the key is already in the payload, the fetch is skipped.

---

## The Fix

### Before

```ts
if (!clientsStore.clients.length) {
  await clientsStore.fetchClients()
}
```

### After

```ts
await useAsyncData('invoice-clients', () => clientsStore.fetchClients(), {
  immediate: !clientsStore.clients.length,
})
```

The `immediate` option replicates the original guard: if the store already has data (e.g. the user navigated from another page where clients were already loaded), skip the fetch entirely.

Each page uses a distinct key:
- `'invoice-clients'`
- `'credit-note-clients'`
- `'payment-complement-clients'`

This is intentional — it allows Nuxt to cache each independently and avoids conflicts.

---

## Why `useAsyncData` and not `useFetch`?

`useFetch('/api/clients')` is a shorthand for `useAsyncData(key, () => $fetch('/api/clients'))`. It is the right choice when you are calling a URL directly.

Here we are calling a Pinia store action (`clientsStore.fetchClients()`), which already encapsulates the URL and response handling. Wrapping that store action in `useAsyncData` is the correct pattern.

---

## The Best Practice

> **Never use a bare `await someFunction()` in `<script setup>` for data loading in a Nuxt app.** Always use `useAsyncData` or `useFetch` so Nuxt can serialise the result into the SSR payload and prevent double-fetching on the client.

| Scenario | Use |
|---|---|
| Fetching a URL directly | `useFetch('/api/endpoint')` |
| Calling a store action or custom async function | `useAsyncData('key', () => myAsyncFn())` |
| User interaction (button click, form submit) | plain `await myAsyncFn()` — SSR payload not relevant |

Always provide an **explicit, stable key** string. Auto-generated keys (based on file path + line number) can cause cache collisions when components move or the file is refactored.
