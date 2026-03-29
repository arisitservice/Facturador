# U16 — Nuxt Middleware: Eliminar restore session redundante

**Skill:** `nuxt` → middleware, `pinia` → best-practices-outside-component
**Fecha:** 2026-03-28
**Archivos afectados:** `app/middleware/auth.global.ts`

---

## Problema identificado

```ts
// ❌ Antes
export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const authStore = useAuthStore();

  if (!authStore.user) {
    authStore.restoreSession();
  }
});
```

**Problemas:**
1. **Redundancia tras U4**: Con `useLocalStorage` en el store, la sesión se restaura automáticamente al instanciar el store por primera vez. La llamada a `restoreSession()` en el middleware era completamente redundante.
2. **`async` innecesario**: La función era declarada `async` pero no contenía ningún `await`. En Nuxt, los middlewares async que no esperan nada pueden causar timing issues en la carga de la página.
3. **`restoreSession()` ya no existe**: Como parte de U4, la función fue eliminada del store API, lo que haría crashear el middleware.

---

## Solución aplicada

```ts
// ✅ Después — middleware simplificado
export default defineNuxtRouteMiddleware((_to, _from) => {
  // Session is automatically restored from localStorage via useLocalStorage in useAuthStore.
  // No manual restoration needed here.
});
```

El middleware se simplifica a un no-op documentado. En el futuro, este middleware es el lugar correcto para agregar **guards de autenticación** (ej. redirigir a `/login` si la ruta requiere autenticación y el usuario no está autenticado).

---

## Mejora obtenida

| Antes | Después |
|-------|---------|
| Llamada redundante a `restoreSession()` | Middleware sin efectos secundarios no intencionales |
| `async` sin `await` (timing issue) | Función síncrona correcta |
| Acoplado a función que ya no existe (U4) | Consistente con el nuevo modelo del store |
| Lógica duplicada entre store y middleware | Single source of truth en el store |
