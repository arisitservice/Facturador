# U15 — Eliminar código comentado (dead code)

**Skill:** `vue-best-practices`
**Fecha:** 2026-03-28
**Archivos afectados:** `app/stores/auth.ts`, `app/composables/clients/use-client.ts`

---

## Problema identificado

### app/stores/auth.ts (líneas 96-106)

```ts
// ❌ Antes — bloque de logout comentado
async function signOut() {
  // Optional: Call logout endpoint on your Laravel API
  // try {
  //   await $fetch('http://erp.almacenadoravica.com/erp/public/api/logout', {
  //     method: 'POST',
  //     headers: {
  //       Authorization: getAuthHeader() || '',
  //     },
  //   });
  // } catch (error) {
  //   console.error('Logout error:', error);
  // }
  clearSession();
}
```

### app/composables/clients/use-client.ts (líneas 8-10)

```ts
// ❌ Antes — endpoints comentados
const END_POINT_CLIENTES_ALL = '/catalogos/clientes/all';
// const END_POINT_CLIENTES_CREATE = '/catalogos/clientes/create';
// const END_POINT_CLIENTES_UPDATE = '/catalogos/clientes/update';
// const END_POINT_CLIENTES_DELETE = '/catalogos/clientes/delete';
```

**Por qué es un problema:**
1. **Ruido visual**: El código comentado dificulta la lectura del código real.
2. **Falsa documentación**: Los endpoints comentados sugieren funcionalidad que no existe, confundiendo a nuevos desarrolladores.
3. **Git history como fuente de verdad**: El código eliminado debe vivir en el historial de git, no en comentarios inline.
4. **URL hardcodeada en comentario**: El bloque de logout tenía la URL hardcodeada, lo cual se contradice con el fix de U6.

---

## Solución aplicada

- Se eliminó el bloque comentado del endpoint de logout en `signOut()`.
- Se eliminaron los endpoints comentados en `use-client.ts` (los activos se mantienen cuando se implementen).
- El historial de git preserva el código eliminado si se necesita recuperar.

---

## Mejora obtenida

| Antes | Después |
|-------|---------|
| Código muerto que agrega ruido | Código limpio y enfocado |
| Falsa sugerencia de funcionalidad | API surface clara |
| URL hardcodeada en comentario | Sin inconsistencias con runtimeConfig |
| ~15 líneas de código comentado | Eliminadas |
