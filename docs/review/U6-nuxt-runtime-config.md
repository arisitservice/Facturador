# U6 — Nuxt: URL de API a runtimeConfig

**Skill:** `nuxt` → runtimeConfig, environment variables
**Fecha:** 2026-03-28
**Archivos afectados:** `app/composables/use-api.ts`, `nuxt.config.ts`

---

## Problema identificado

La URL base de la API estaba hardcodeada en `use-api.ts`:

```ts
// ❌ Antes — URL hardcodeada
const API_BASE_URL = 'http://erp.almacenadoravica.com/erp/public/api';

export function useApi<T>(url: string, options: UseFetchOptions<T> = {}) {
  ...
  baseURL: API_BASE_URL,
  ...
}

export function useApiFetch<T>(url: string, options?: any) {
  return $fetch<T>(`${API_BASE_URL}${url}`, ...);
}
```

**Problemas de este enfoque:**
1. **No configurable por entorno**: No hay forma de usar una URL distinta para desarrollo, staging y producción sin modificar el código fuente.
2. **Violación del principio 12-factor**: La configuración debe estar separada del código.
3. **Sin soporte para variables de entorno**: No se puede sobreescribir con `.env` files o variables de CI/CD.
4. **Práctica anti-Nuxt**: Nuxt provee `runtimeConfig` específicamente para este caso de uso.

---

## Solución aplicada

### nuxt.config.ts
```ts
runtimeConfig: {
  public: {
    apiBase: 'http://erp.almacenadoravica.com/erp/public/api',
  },
},
```

### use-api.ts
```ts
// ✅ Después — URL desde runtimeConfig
export function useApi<T>(url: string, options: UseFetchOptions<T> = {}) {
  const { public: { apiBase } } = useRuntimeConfig();
  ...
  baseURL: apiBase,
  ...
}

export function useApiFetch<T>(url: string, options?: any) {
  const { public: { apiBase } } = useRuntimeConfig();
  return $fetch<T>(`${apiBase}${url}`, ...);
}
```

**`runtimeConfig.public`** está disponible tanto en el servidor como en el cliente, es auto-importado en composables, y puede ser sobreescrito con variables de entorno usando el prefijo `NUXT_PUBLIC_`:

```env
# .env
NUXT_PUBLIC_API_BASE=https://mi-api-production.com/api
```

---

## Mejora obtenida

| Antes | Después |
|-------|---------|
| URL hardcodeada en código fuente | URL configurable por entorno |
| Requiere cambio de código para cambiar API | Sobreescribible con `NUXT_PUBLIC_API_BASE` env var |
| No compatible con diferentes entornos | dev / staging / prod con distintas URLs |
| Anti-pattern en Nuxt | Patrón estándar de Nuxt para config de runtime |
