# U10 — Nuxt: key explícita en useFetch

**Skill:** `nuxt` → data fetching, caching
**Fecha:** 2026-03-28
**Archivos afectados:** `app/pages/nova/catalogs/clients.vue`

---

## Problema identificado

```ts
// ❌ Antes — sin key explícita
const { data, status } = await useFetch<User[]>('/api/clients', {
  lazy: true,
});
```

Cuando `useFetch` no tiene `key` explícita, Nuxt genera una clave automáticamente basada en la URL y las opciones. Sin embargo, esto tiene varios problemas:

1. **Caching impredecible**: Si la URL o las opciones cambian entre renders (SSR vs client), el hash puede diferir, causando doble-fetch.
2. **Deduplicación fallida**: Nuxt usa el `key` para deduplicar requests idénticos. Sin una clave explícita, dos componentes que fetcheen la misma URL con opciones distintas no deduplicarán correctamente.
3. **Invalidación manual imposible**: Para invalidar el cache de un fetch específico con `clearNuxtData(key)` o `refreshNuxtData(key)`, se necesita la clave exacta.
4. **Hydration mismatch riesgo**: En SSR, la clave generada automáticamente debe coincidir exactamente entre servidor y cliente.

---

## Solución aplicada

```ts
// ✅ Después — key explícita y descriptiva
const { data, status } = await useFetch<User[]>('/api/clients', {
  key: 'clients-list',
  lazy: true,
});
```

Con `key: 'clients-list'`:
- El cache puede invalidarse explícitamente con `clearNuxtData('clients-list')`.
- La deduplicación funciona de forma predecible.
- Es posible refrescar solo este fetch con `refreshNuxtData('clients-list')`.

---

## Mejora obtenida

| Antes | Después |
|-------|---------|
| Key generada automáticamente (hash) | Key explícita y legible |
| Invalidación de cache imposible | `clearNuxtData('clients-list')` disponible |
| Deduplicación impredecible | Deduplicación garantizada |
| Riesgo de hydration mismatch | Clave estable entre SSR y cliente |
