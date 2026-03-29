# U1 — Pinia SSR: Eliminación de restoreSession()

**Skill:** `pinia` → advanced-ssr, advanced-nuxt
**Fecha:** 2026-03-28
**Archivos afectados:** `app/stores/auth.ts`, `app/middleware/auth.global.ts`
**Estado:** Resuelto como parte de U4

---

## Problema identificado

El store `useAuthStore` definía una función `restoreSession()` que se llamaba al final del cuerpo del setup del store (línea 112):

```ts
// Dentro del setup store:
restoreSession(); // ← se ejecuta al instanciar el store
```

Aunque la función tenía un guard `if (import.meta.client)` que prevenía la ejecución en el servidor, el patrón introducía varios problemas:

1. **Sincronización manual frágil**: La sesión debía sincronizarse manualmente entre `ref` reactivos y `localStorage` en tres funciones separadas (`saveSession`, `clearSession`, `restoreSession`).
2. **Redundancia con el middleware**: El middleware `auth.global.ts` también llamaba `authStore.restoreSession()` para cada navegación, duplicando la lógica.
3. **Estado desincronizado posible**: Si se modificaba `localStorage` externamente (otra pestaña), los refs no se actualizaban.

---

## Solución aplicada

Se reemplazó por `useLocalStorage` de VueUse (cubierto en U4). Al usar `useLocalStorage`, la sincronización es automática y reactiva — eliminando la necesidad de `restoreSession()` como función pública.

---

## Mejora obtenida

| Antes | Después |
|-------|---------|
| Sincronización manual en 3 funciones | `useLocalStorage` sincroniza automáticamente |
| `restoreSession()` redundante en middleware | Middleware simplificado (sin llamadas manuales) |
| Estado no reactivo ante cambios externos de localStorage | Reactivo ante cambios de otras pestañas |
| Posible desincronización SSR | SSR-safe por diseño de VueUse |
