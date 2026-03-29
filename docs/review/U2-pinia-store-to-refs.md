# U2 — Pinia: storeToRefs para state/getters reactivos

**Skill:** `pinia` → core-stores
**Fecha:** 2026-03-28
**Archivos afectados:** `app/components/app-header.vue`, `app/pages/login.vue`

---

## Problema identificado

### app-header.vue (línea 2)

```ts
// ❌ Antes — destructuring directo pierde reactividad
const { isAuthenticated, isLoading } = useAuthStore();
```

### login.vue (líneas 12-13)

```ts
// ❌ Antes — isAuthenticated pierde reactividad
const authStore = useAuthStore();
const { signIn, isAuthenticated } = authStore;
```

Cuando se desestructura directamente del store sin `storeToRefs`, las propiedades de estado (`ref`) y getters (`computed`) pierden su enlace reactivo. El valor se "congela" al momento de la desestructuración y **no actualiza el template** cuando el store cambia.

En `app-header.vue`, tanto `isAuthenticated` (computed) como `isLoading` (ref) necesitaban reactivity para mostrar/ocultar botones dinámicamente. Sin `storeToRefs`, los cambios en el store no se reflejarían en la UI.

En `login.vue`, `isAuthenticated` se usaba en `onMounted` para redirigir si ya estaba autenticado. Sin reactivity, si el estado cambia después del mount, no se detectaría.

---

## Solución aplicada

```ts
// ✅ Después — app-header.vue
const authStore = useAuthStore();
const { isAuthenticated, isLoading } = storeToRefs(authStore);
```

```ts
// ✅ Después — login.vue
const authStore = useAuthStore();
const { signIn } = authStore;          // actions: desestructurar directo ✓
const { isAuthenticated } = storeToRefs(authStore); // state/getters: storeToRefs ✓
```

**Regla del skill `pinia`:**
> Use `storeToRefs()` when destructuring state/getters to preserve reactivity.
> Actions can be destructured directly — they're bound to the store.

---

## Mejora obtenida

| Antes | Después |
|-------|---------|
| `isAuthenticated` y `isLoading` no reactivos | Completamente reactivos con el store |
| Cambios en el store no se reflejan en UI | UI se actualiza automáticamente |
| Bug silencioso difícil de detectar | Patrón explícito y correcto |
