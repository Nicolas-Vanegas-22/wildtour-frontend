# Integración Frontend-Backend .NET

## Resumen

Este documento describe la integración entre el frontend React/TypeScript y el backend .NET de WildTour.

## Configuración

### Variables de Entorno

El archivo `.env` debe contener:

```env
# Backend .NET API Configuration
VITE_API_URL=http://localhost:5000/api
```

### URL Base de la API

- **Desarrollo**: `http://localhost:5116/api`
- **Producción**: Configurar según el servidor de producción

## Autenticación

### Sistema de Autenticación

- **Tipo**: JWT (JSON Web Tokens)
- **Header**: `Authorization: Bearer {token}`
- **Expiración**: 24 horas (1440 minutos)

### Endpoints Implementados

#### Login
```typescript
POST /api/auth/login
Request: {
  email: string;
  password: string;
}
Response: {
  success: true,
  message: "Login exitoso",
  data: {
    token: string,
    expiresAt: string,
    user: {
      id: number,
      email: string,
      username: string | null,
      firstName: string | null,
      lastName: string | null,
      roles: string[],
      permissions: string[]
    }
  }
}
```

#### Register
```typescript
POST /api/auth/register
Request: {
  username: string;
  email: string;
  password: string;
  roleId: number; // 1 = Usuario, 2 = Prestador de Servicio
}
Response: {
  success: true,
  message: "Usuario registrado exitosamente",
  data: {
    id: number,
    username: string,
    email: string,
    registrationDate: string,
    isActive: boolean,
    isEmailConfirmed: boolean
  }
}
```

**Nota**: El registro devuelve la información del usuario pero no el token. El frontend automáticamente llama al endpoint de login después del registro exitoso.

#### Get Profile
```typescript
GET /api/auth/me
Headers: { Authorization: Bearer {token} }
Response: {
  success: true,
  data: {
    id: number,
    email: string,
    username: string | null,
    firstName: string | null,
    lastName: string | null,
    roles: string[],
    permissions: string[]
  }
}
```

### Mapeo de Roles

| Backend .NET | Frontend | Descripción |
|--------------|----------|-------------|
| `Usuario` | `user` | Turista/Usuario regular |
| `Prestador de Servicio` | `provider` | Prestador de servicios turísticos |
| `Admin` | `admin` | Administrador |

## Formato de Respuestas

Todas las respuestas de la API .NET siguen este formato estándar:

```typescript
interface ApiResponse<T> {
  success: boolean;      // true si éxito, false si error
  message: string;       // Mensaje descriptivo
  data?: T;             // Datos (solo en éxito)
  errors: string[];     // Lista de errores (solo en fallo)
}
```

### Códigos de Error

| Código HTTP | Error Code | Descripción |
|-------------|------------|-------------|
| 400 | VALIDATION_ERROR | Error de validación |
| 401 | INVALID_CREDENTIALS | Credenciales inválidas |
| 401 | INVALID_TOKEN | Token inválido o expirado |
| 403 | ACCOUNT_DISABLED | Cuenta deshabilitada |
| 404 | RESOURCE_NOT_FOUND | Recurso no encontrado |
| 409 | EMAIL_ALREADY_EXISTS | Email ya registrado |
| 409 | DUPLICATE_RESOURCE | Recurso duplicado |
| 500 | INTERNAL_ERROR | Error interno del servidor |

## Servicios Disponibles

### 1. Authentication API (`authApi`)

**Archivo**: `src/infrastructure/services/authApi.ts`

**Métodos implementados**:
- ✅ `login(credentials)` - Iniciar sesión
- ✅ `register(userData)` - Registrar usuario
- ✅ `getProfile(token)` - Obtener perfil
- ✅ `logout(token)` - Cerrar sesión (solo local)

**Métodos pendientes de implementar en backend**:
- ❌ `forgotPassword(email)` - Recuperar contraseña
- ❌ `resetPassword(token, password)` - Restablecer contraseña
- ❌ `refreshToken(token)` - Renovar token
- ❌ `updateProfile(token, userData)` - Actualizar perfil
- ❌ `verifyEmail(token)` - Verificar email
- ❌ `resendVerificationEmail(email)` - Reenviar email de verificación

### 2. Destinations API (`destinationsApi`)

**Archivo**: `src/infrastructure/services/destinationsApi.ts`

**Estado**: ⚠️ Preparado pero requiere implementación en backend

**Métodos**:
- `getDestinations(filters?, pagination?)` - Listar destinos
- `getDestination(id)` - Obtener destino por ID
- `createDestination(data)` - Crear destino (Provider/Admin)
- `updateDestination(id, data)` - Actualizar destino (Provider/Admin)
- `deleteDestination(id)` - Eliminar destino (Admin)

**Endpoints requeridos en backend**:
```
GET    /api/destinations
GET    /api/destinations/:id
POST   /api/destinations
PUT    /api/destinations/:id
DELETE /api/destinations/:id
```

### 3. Activities API (`activitiesApi`)

**Archivo**: `src/infrastructure/services/activitiesApi.ts`

**Estado**: ⚠️ Preparado pero requiere implementación en backend

**Métodos**:
- `getActivities(filters?, pagination?)` - Listar actividades
- `getActivity(id)` - Obtener actividad por ID
- `createActivity(data)` - Crear actividad (Provider/Admin)
- `updateActivity(id, data)` - Actualizar actividad (Provider/Admin)
- `deleteActivity(id)` - Eliminar actividad (Admin)

**Endpoints requeridos en backend**:
```
GET    /api/activities
GET    /api/activities/:id
POST   /api/activities
PUT    /api/activities/:id
DELETE /api/activities/:id
```

## Cliente HTTP

### Configuración de Axios

**Archivo**: `src/infrastructure/http/apiClient.ts`

El cliente HTTP está configurado con:
- **Base URL**: `http://localhost:5000/api`
- **Interceptor de Request**: Agrega automáticamente el token JWT
- **Interceptor de Response**:
  - Extrae el campo `data` de las respuestas
  - Maneja errores automáticamente
  - Logout automático en errores 401

### Uso del Cliente

```typescript
import { api } from '../http/apiClient';

// GET request
const response = await api.get('/destinations');

// POST request
const response = await api.post('/auth/login', { email, password });

// PUT request
const response = await api.put(`/destinations/${id}`, data);

// DELETE request
await api.delete(`/destinations/${id}`);
```

## Tipos TypeScript

### Archivo de Tipos

**Archivo**: `src/infrastructure/http/apiTypes.ts`

Contiene:
- `ApiResponse<T>` - Formato de respuesta estándar
- `ErrorCode` - Códigos de error
- `BackendUser` - Usuario del backend
- `BackendAuthResponse` - Respuesta de autenticación
- `BackendDestination` - Destino del backend
- `BackendActivity` - Actividad del backend
- `PaginatedResponse<T>` - Respuesta paginada
- Helpers: `extractData()`, `handleApiError()`

## Estado de la Integración

### ✅ Completado

1. **Configuración de variables de entorno**
2. **Cliente HTTP con interceptors**
   - Interceptor de request para agregar token JWT automáticamente
   - Interceptor de response para manejar errores y formato de respuesta
3. **Tipos TypeScript para respuestas de la API**
   - ApiResponse, ErrorCode, PaginatedResponse
   - BackendUser, BackendAuthResponse, BackendRegisterResponse
   - BackendDestination, BackendActivity
4. **Servicio de autenticación (authApi)**
   - ✅ login(credentials) - Implementado y probado
   - ✅ register(userData) - Implementado con soporte para Person data
   - ✅ getProfile(token) - Implementado
   - ✅ logout(token) - Implementado (solo local)
5. **Servicio de usuarios (userApi)** - NUEVO
   - ✅ getProfile() - Obtener perfil del usuario
   - ✅ updateProfile(data) - Actualizar perfil
   - ✅ updatePerson(data) - Actualizar datos personales (Person entity)
   - ✅ uploadAvatar(file) - Subir foto de perfil
   - ✅ deleteAccount() - Eliminar cuenta
6. **Servicios de Destinations y Activities**
   - ✅ destinationsApi preparado con fallback a datos mock
   - ✅ activitiesApi preparado
7. **Componentes actualizados**
   - ✅ Register.tsx - Envía firstName, lastName, document, phoneNumber al backend
   - ✅ Destinations.tsx - Integrado con destinationsApi (con fallback)
   - ✅ CompleteProfile.tsx - Integrado con userApi

### ⚠️ Pendiente en Backend .NET

#### Endpoints de Autenticación
- [ ] POST `/api/auth/forgot-password` - Recuperar contraseña
- [ ] POST `/api/auth/reset-password` - Restablecer contraseña
- [ ] POST `/api/auth/refresh` - Renovar token JWT
- [ ] POST `/api/auth/logout` - Cerrar sesión (invalidar token)
- [ ] POST `/api/auth/verify-email` - Verificar email
- [ ] POST `/api/auth/resend-verification` - Reenviar email de verificación

**Nota importante sobre el registro:**
El endpoint `/api/auth/register` debe ser actualizado para aceptar los siguientes campos adicionales:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "roleId": 1, // 1 = Usuario, 2 = Prestador
  "firstName": "string",  // NUEVO
  "lastName": "string",   // NUEVO
  "document": "string",   // NUEVO
  "phoneNumber": "string", // NUEVO
  "businessName": "string", // OPCIONAL - solo para providers
  "rnt": "string"          // OPCIONAL - solo para providers
}
```

#### Endpoints de Usuarios (NUEVOS)
- [ ] GET `/api/users/me` - Obtener perfil del usuario autenticado
- [ ] PUT `/api/users/me` - Actualizar perfil (username, email)
- [ ] PUT `/api/users/me/person` - Actualizar datos personales (Person entity)
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "document": number,
    "phoneNumber": number
  }
  ```
- [ ] POST `/api/users/me/avatar` - Subir foto de perfil (multipart/form-data)
- [ ] DELETE `/api/users/me` - Eliminar cuenta del usuario

#### Endpoints de Destinos
- [ ] GET `/api/destinations` (con paginación y filtros)
- [ ] GET `/api/destinations/:id`
- [ ] POST `/api/destinations`
- [ ] PUT `/api/destinations/:id`
- [ ] DELETE `/api/destinations/:id`

#### Endpoints de Actividades
- [ ] GET `/api/activities` (con paginación y filtros)
- [ ] GET `/api/activities/:id`
- [ ] POST `/api/activities`
- [ ] PUT `/api/activities/:id`
- [ ] DELETE `/api/activities/:id`

#### Otros Endpoints Necesarios
- [ ] Accommodations (Alojamientos)
- [ ] Bookings (Reservas)
- [ ] Reviews (Reseñas)
- [ ] Favorites (Favoritos)
- [ ] Packages (Paquetes turísticos)
- [ ] Service Posts (Publicaciones de servicios)

## Pruebas

### Cómo Probar la Integración

1. **Iniciar el backend .NET**:
   ```bash
   cd ModelSecurityWildTour
   dotnet run
   ```
   El backend debería estar disponible en `http://localhost:5000`

2. **Verificar Swagger**:
   Abrir `http://localhost:5000` en el navegador para ver la documentación de la API

3. **Iniciar el frontend**:
   ```bash
   npm run dev
   ```

4. **Probar el registro**:
   - Ir a `/register`
   - Crear una cuenta de usuario o prestador
   - Verificar que funcione el auto-login

5. **Probar el login**:
   - Ir a `/login`
   - Iniciar sesión con las credenciales creadas
   - Verificar que se guarde el token y se redirija correctamente

### Logs y Debugging

- **Frontend**: Abrir DevTools > Console para ver logs de errores
- **Backend**: Revisar la consola del servidor .NET
- **Network**: DevTools > Network para ver las peticiones HTTP

## Resumen de Cambios Realizados

### Frontend (React/TypeScript)

1. **authApi.ts** - Actualizado
   - `RegisterRequest` ahora incluye: firstName, lastName, document, phoneNumber, businessName, rnt
   - Funciones `login()` y `getProfile()` ahora mapean correctamente al modelo User del frontend
   - Todos los parámetros no utilizados marcados con `_` para evitar warnings

2. **userApi.ts** - NUEVO archivo creado
   - Servicio completo para gestión de perfil de usuario
   - Métodos: getProfile, updateProfile, updatePerson, uploadAvatar, deleteAccount
   - Integrado con el interceptor de apiClient para auth automática

3. **Register.tsx** - Actualizado
   - Formulario ahora envía firstName, lastName, document, phoneNumber al backend
   - Soporte para campos adicionales de providers (businessName, rnt)
   - Manejo de errores mejorado

4. **Destinations.tsx** - Actualizado
   - Integrado con destinationsApi
   - Sistema de fallback automático a datos mock si el backend no está disponible
   - Manejo de estados de carga y errores

5. **CompleteProfile.tsx** - Actualizado
   - Integrado con userApi para actualizar datos personales
   - Soporte para actualizar Person entity (firstName, lastName, document, phoneNumber)
   - Feedback visual con toasts de éxito/error

### Arquitectura de la Integración

```
Frontend (React)
├── Presentation Layer
│   ├── pages/
│   │   ├── Register.tsx (envía datos completos)
│   │   ├── Destinations.tsx (consume destinationsApi)
│   │   └── CompleteProfile.tsx (consume userApi)
│   └── components/
│
├── Infrastructure Layer
│   ├── http/
│   │   ├── apiClient.ts (axios con interceptors)
│   │   └── apiTypes.ts (tipos compartidos)
│   └── services/
│       ├── authApi.ts ✅ (login, register, getProfile)
│       ├── userApi.ts ✅ (NUEVO - updateProfile, updatePerson)
│       ├── destinationsApi.ts ✅ (con fallback a mock)
│       └── activitiesApi.ts ✅ (preparado)
│
└── Application Layer
    └── state/
        └── useAuthStore.ts (Zustand store)

Backend (.NET)
└── API Endpoints
    ├── /api/auth/* ✅ (login, register, me)
    ├── /api/users/* ⚠️  (pendiente implementar)
    ├── /api/destinations/* ⚠️  (pendiente implementar)
    └── /api/activities/* ⚠️  (pendiente implementar)
```

## Próximos Pasos

### Backend .NET - Prioridad Alta

1. **Actualizar endpoint de registro** (`/api/auth/register`)
   - Aceptar firstName, lastName, document, phoneNumber
   - Crear registro en la tabla Person automáticamente
   - Para providers: aceptar businessName y rnt

2. **Implementar endpoints de Usuario** (`/api/users/*`)
   - GET `/api/users/me` - Retornar usuario con datos de Person
   - PUT `/api/users/me/person` - Actualizar Person entity
   - POST `/api/users/me/avatar` - Upload de imagen (usar Cloudinary o S3)
   - DELETE `/api/users/me` - Soft delete del usuario

3. **Implementar endpoints de Destinations** (`/api/destinations/*`)
   - GET `/api/destinations` con filtros y paginación
   - GET `/api/destinations/:id`
   - POST `/api/destinations` (Provider/Admin only)
   - PUT `/api/destinations/:id` (Provider/Admin only)
   - DELETE `/api/destinations/:id` (Admin only)

4. **Implementar endpoints de Activities** (`/api/activities/*`)
   - Similar a Destinations

### Backend .NET - Prioridad Media

5. Implementar upload de imágenes (Cloudinary/S3)
6. Implementar endpoints de Bookings
7. Implementar endpoints de Reviews
8. Agregar refresh tokens
9. Implementar rate limiting
10. Email verification

## Soporte

Para preguntas o problemas con la integración, revisar:
1. Este documento
2. Código de ejemplo en `src/infrastructure/services/`
3. Tipos en `src/infrastructure/http/apiTypes.ts`
4. Documentación Swagger del backend en `http://localhost:5000`
