# U3 — Pinia: HMR (Hot Module Replacement) en auth store

**Skill:** `pinia` → advanced-hmr
**Fecha:** 2026-03-28
**Archivos afectados:** `app/stores/auth.ts`

---

## Problema identificado

El store `useAuthStore` no tenía soporte para Hot Module Replacement (HMR). Esto significaba que durante el desarrollo, **cualquier cambio en el archivo del store provocaba una recarga completa de la página**, perdiendo el estado actual de la sesión y el contexto de desarrollo.

---

## Solución aplicada

Se agregó el bloque estándar de HMR de Pinia al final del archivo del store:

```ts
// ✅ Después — al final de app/stores/auth.ts
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
```

**Regla del skill `pinia`:**
> Add HMR support to each store for better development experience.

`acceptHMRUpdate` está auto-importado via `@pinia/nuxt`.

---

## Mejora obtenida

| Antes | Después |
|-------|---------|
| Cambios en el store → recarga completa de página | Cambios en el store → HMR sin recarga |
| Se pierde estado de sesión en dev al editar el store | Estado preservado durante desarrollo |
| DX (Developer Experience) degradada | DX óptima para iteraciones rápidas |
