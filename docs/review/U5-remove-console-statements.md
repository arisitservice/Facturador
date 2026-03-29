# U5 — Eliminar console.log/error en código de producción

**Skill:** `vue-best-practices`
**Fecha:** 2026-03-28
**Archivos afectados:** `app/stores/auth.ts`, `app/pages/login.vue`, `app/composables/clients/use-client.ts`

---

## Problema identificado

Se encontraron 4 instancias de `console.log`/`console.error` en código de producción:

### app/stores/auth.ts
```ts
// Línea 30
console.error('Failed to restore session:', error);

// Línea 84
console.error('Login error:', process.env.NODE_ENV === 'development' ? error : '...');
```

### app/pages/login.vue
```ts
// Línea 64
console.error('Login error:', process.env.NODE_ENV === 'development' ? err : '...');
```

### app/composables/clients/use-client.ts
```ts
// Línea 15
console.log('from useClient', response);

// Línea 19
console.log(error);
```

**Por qué esto es un problema:**
1. **Información sensible en consola**: Los errores de login pueden exponer datos del request o stack traces en producción.
2. **Ruido en consola**: `console.log('from useClient', response)` es un log de debug que no debería estar en producción.
3. **Inconsistencia**: El guard `process.env.NODE_ENV === 'development'` es frágil — en Nuxt/Vite la variable no siempre está disponible como se espera.
4. **Estándares de calidad**: El skill `vue-best-practices` prohíbe `console.log` statements en código de producción.

---

## Solución aplicada

- En `auth.ts` (U4): Al eliminar `restoreSession()` y simplificar `signIn()`, los console.error desaparecen naturalmente. El error de login ahora retorna silenciosamente un objeto `{ success: false, message: '...' }`.
- En `login.vue`: El bloque `catch` se simplifica — el error ya fue manejado por el store.
- En `use-client.ts`: Se eliminaron ambos `console.log`. Los errores del fetch ya están manejados por el catch que retorna un objeto de error estructurado.

---

## Mejora obtenida

| Antes | Después |
|-------|---------|
| Logs de debug visibles en consola de producción | Consola limpia |
| Posible exposición de datos sensibles en errores | Sin leakage de información |
| 4 instancias de console statements | 0 instancias |
| Manejo de errores con `process.env.NODE_ENV` frágil | Error handling limpio via objetos de respuesta |
