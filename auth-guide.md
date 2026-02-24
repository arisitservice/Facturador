# Guía de Autenticación

Este proyecto utiliza un sistema de autenticación basado en tokens con un backend de Laravel.

## Configuración Completa

### 1. Auth Store (app/stores/auth.ts)

El store maneja:

- ✅ Login con email y password
- ✅ Persistencia de sesión en localStorage (token, token_type, user)
- ✅ Restauración automática de sesión al recargar
- ✅ Logout con limpieza de datos
- ✅ Estado de autenticación reactivo

### 2. Composable de API (app/composables/useApi.ts)

Dos funciones disponibles:

#### `useApi` (para peticiones reactivas)

```typescript
const { data, pending, error } = useApi('/users');
```

#### `useApiFetch` (para peticiones directas)

```typescript
const users = await useApiFetch('/users');
```

Ambas funciones:

- Añaden automáticamente el header `Authorization` con el token
- Manejan errores 401 (redirigen a login si el token expiró)
- Usan la URL base del API de Laravel

### 3. Middleware de Autenticación (app/middleware/auth.ts)

Protege rutas que requieren autenticación:

```vue
<script setup>
definePageMeta({
  middleware: 'auth', // Requiere autenticación
});
</script>
```

Si el usuario no está autenticado, lo redirige a `/login`.

## Uso en Componentes

### Login

Ya está implementado en `app/pages/login.vue`:

- Valida email y password
- Llama a `authStore.signIn()`
- Guarda token y usuario
- Redirige a dashboard

### Logout

Implementado en `app/components/user-menu.vue`:

- Llama a `authStore.signOut()`
- Limpia localStorage
- Redirige a login

### Proteger Rutas

```vue
<script setup>
definePageMeta({
  middleware: 'auth',
});
</script>
```

### Acceder a Usuario Actual

```vue
<script setup>
const authStore = useAuthStore();
const user = authStore.user; // Usuario autenticado
const isAuth = authStore.isAuthenticated; // Boolean
</script>
```

### Hacer Peticiones Autenticadas

#### Opción 1: useApi (reactivo)

```vue
<script setup>
const { data: users, pending } = useApi('/users');
</script>

<template>
  <div v-if="pending">
    Cargando...
  </div>
  <div v-else>
    {{ users }}
  </div>
</template>
```

#### Opción 2: useApiFetch (directo)

```vue
<script setup>
async function loadUsers() {
  try {
    const users = await useApiFetch('/users');
    console.log(users);
  }
  catch (error) {
    console.error(error);
  }
}
</script>
```

## Flujo de Autenticación

1. **Login**:
   - Usuario ingresa email/password
   - Se envía POST a `http://erp.almacenadoravica.com/erp/public/api/login`
   - Laravel devuelve `{ success, token, token_type, user }`
   - Se guarda en localStorage y en el store
   - Redirección a dashboard

2. **Persistencia**:
   - Al cargar la app, el store lee localStorage
   - Si hay token válido, restaura la sesión automáticamente

3. **Peticiones API**:
   - Todas las peticiones con `useApi` o `useApiFetch` incluyen header:
     ```
     Authorization: Bearer <token>
     ```

4. **Expiración de Token**:
   - Si Laravel responde 401, el interceptor:
     - Limpia la sesión
     - Redirige a `/login`

5. **Logout**:
   - Usuario hace clic en "Log out"
   - Se limpia localStorage y store
   - Redirección a `/login`

## Configuración del Backend (Laravel)

Tu API debe devolver este formato en el login:

```json
{
  "success": true,
  "token": "1|abc123...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
    // ... otros campos
  }
}
```

## Notas de Seguridad

- ✅ El token se guarda en localStorage (persiste entre sesiones)
- ✅ Se valida automáticamente en cada petición
- ✅ Se limpia completamente al hacer logout
- ✅ Las rutas protegidas verifican autenticación antes de cargar
- ⚠️ El token es visible en DevTools (considera HTTPOnly cookies para mayor seguridad)

## Ejemplo de Uso Completo

```vue
<!-- app/pages/nova/users/index.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: 'auth', // Proteger ruta
});

const authStore = useAuthStore();

// Obtener usuarios del API
const { data: users, pending, error, refresh } = useApi('/users');

async function deleteUser(id: number) {
  try {
    await useApiFetch(`/users/${id}`, {
      method: 'DELETE',
    });
    refresh(); // Recargar lista
  }
  catch (err) {
    console.error('Error al eliminar:', err);
  }
}
</script>

<template>
  <div>
    <h1>Usuarios</h1>
    <p>Bienvenido, {{ authStore.user?.name }}</p>

    <div v-if="pending">
      Cargando...
    </div>
    <div v-else-if="error">
      Error: {{ error.message }}
    </div>
    <div v-else>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.name }}
          <button @click="deleteUser(user.id)">
            Eliminar
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
```

## Eliminar Better Auth (No Necesario)

Puedes eliminar Better Auth del proyecto ya que no lo estás usando:

```bash
npm uninstall better-auth
# o
bun remove better-auth
```

Y eliminar estos archivos:

- `app/lib/auth.ts`
- `server/api/auth/[...all].ts`
