# U4 — VueUse: useLocalStorage en lugar de localStorage manual

**Skill:** `vueuse-functions` → useLocalStorage, `pinia` → features-composables, `nuxt` → SSR
**Fecha:** 2026-03-28
**Archivos afectados:** `app/stores/auth.ts`

---

## Problema identificado

El store de autenticación manejaba la persistencia de sesión con llamadas directas a `localStorage`:

```ts
// ❌ Antes — manipulación manual de localStorage
function restoreSession() {
  if (import.meta.client) {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    try {
      token.value = storedToken;
      session.value = JSON.parse(storedUser);
    } catch (error) {
      console.error('Failed to restore session:', error);
      clearSession();
    }
  }
}

function saveSession(authToken: string, authTokenType: string, authUser: User) {
  if (import.meta.client) {
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
  }
  token.value = authToken;
  session.value = authUser;
}

function clearSession() {
  if (import.meta.client) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
  token.value = null;
  session.value = null;
}
```

**Problemas de este enfoque:**
1. **Duplicación de estado**: El valor existe en un `ref` Y en `localStorage` por separado, requiriendo sincronización manual.
2. **No reactivo a cambios externos**: Si otra pestaña modifica el `localStorage`, los refs no se actualizan.
3. **Boilerplate innecesario**: 3 funciones para manejar lo que VueUse hace en 1 línea.
4. **Guards manuales de SSR**: Cada acceso a `localStorage` requiere `if (import.meta.client)`.
5. **Error handling manual**: El `try/catch` en `restoreSession` para el `JSON.parse`.

---

## Solución aplicada

```ts
// ✅ Después — useLocalStorage de VueUse
const session = useLocalStorage<User | null>(USER_KEY, null);
const token = useLocalStorage<string | null>(TOKEN_KEY, null);
const tokenType = useLocalStorage<string | null>(TOKEN_TYPE_KEY, null);
```

`useLocalStorage` de VueUse:
- **Reactivo bidireccional**: El ref ES el localStorage. Cambiar `token.value` actualiza localStorage automáticamente.
- **SSR-safe**: En el servidor, actúa como `ref` normal sin acceder a `localStorage`.
- **Serialización automática**: JSON.stringify/parse para objetos complejos como `User`.
- **Reactivo a cambios externos**: Si otra pestaña modifica el storage, el ref se actualiza (event `storage`).

`saveSession` y `clearSession` se simplifican a asignaciones directas sin guards de SSR.

---

## Mejora obtenida

| Antes | Después |
|-------|---------|
| 3 funciones de sincronización manual (~30 líneas) | Solo asignación directa a refs |
| Guards `if (import.meta.client)` en cada acceso | SSR-safe automáticamente |
| `restoreSession()` necesaria al iniciar | Restauración automática al crear el store |
| No reactivo entre pestañas | Reactivo a cambios de `storage` event |
| `try/catch` manual para JSON.parse | VueUse maneja errores de deserialización |
