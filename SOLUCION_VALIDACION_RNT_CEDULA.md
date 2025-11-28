# 🔧 Solución: Validación de Cédula con RNT

## 📊 Análisis del Problema

### Errores Detectados en Console:

```
authApi.ts:308 Validate document error:
AxiosError {message: 'Network Error', name: 'AxiosError', code: 'ERR_NETWORK'}

POST http://localhost:5116/api/Auth/validate-document net::ERR_CONNECTION_REFUSED

rntApi.ts:108 Error verifying RNT with document:
AxiosError {message: 'Network Error', name: 'AxiosError', code: 'ERR_NETWORK'}

POST http://localhost:5116/api/rnt/verify-with-document net::ERR_CONNECTION_REFUSED
```

### Causa Raíz:

**El backend .NET NO está corriendo en `http://localhost:5116`**

Esto causa que todas las peticiones del frontend fallen con `ERR_CONNECTION_REFUSED`.

---

## ✅ Estado Actual del Frontend

### El código del frontend YA está preparado correctamente:

#### 1. **authApi.ts** - Validación de Documento (Líneas 278-315)

```typescript
async validateDocument(document: string): Promise<ValidateDocumentResponse> {
  try {
    // Convertir el documento de string a number
    const documentNumber = parseInt(document.replace(/[.,\s-]/g, ''), 10);

    if (isNaN(documentNumber)) {
      return {
        isValid: false,
        message: 'El documento debe contener solo números'
      };
    }

    const response = await api.post<ApiResponse<ValidateDocumentResponse>>(
      '/Auth/validate-document',
      { document: documentNumber }
    );

    const apiResponse = response.data as any as ApiResponse<ValidateDocumentResponse>;

    if (apiResponse.success && apiResponse.data) {
      return apiResponse.data;
    } else {
      return {
        isValid: false,
        message: apiResponse.message || 'Error al validar el documento'
      };
    }
  } catch (error: any) {
    console.error('Validate document error:', error);
    return {
      isValid: false,
      message: handleApiError(error)
    };
  }
}
```

**✅ Características:**
- Limpia el documento (remueve puntos, comas, espacios, guiones)
- Convierte a número
- Valida que sea un número válido
- Llama al endpoint `/Auth/validate-document`
- Maneja errores gracefully

#### 2. **rntApi.ts** - Verificación RNT con Documento (Líneas 48-122)

```typescript
async verifyRNTWithDocument(data: RNTDocumentVerificationRequest): Promise<RNTDocumentVerificationResponse> {
  try {
    // Limpiar y convertir el documento a número
    const documentString = typeof data.document === 'number'
      ? data.document.toString()
      : data.document;
    const cleanDocumentString = documentString.replace(/[.,\s-]/g, '');
    const documentNumber = parseInt(cleanDocumentString, 10);

    if (isNaN(documentNumber)) {
      return {
        isValid: false,
        documentMatches: false,
        businessNameMatches: false,
        message: 'El documento debe contener solo números'
      };
    }

    const requestBody = {
      rntNumber: data.rntNumber.trim(),
      document: documentNumber,
      businessName: data.businessName.trim()
    };

    const response = await api.post<any>(
      '/rnt/verify-with-document',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const responseData = response.data;

    if (responseData && typeof responseData === 'object') {
      if ('isValid' in responseData) {
        return responseData;
      }
      if (responseData.success && responseData.data) {
        return responseData.data;
      }
    }

    return {
      isValid: false,
      documentMatches: false,
      businessNameMatches: false,
      message: responseData?.message || 'Error al verificar los datos'
    };
  } catch (error: any) {
    console.error('Error verifying RNT with document:', error);

    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        'Error al verificar los datos. Por favor intenta nuevamente.';

    return {
      isValid: false,
      documentMatches: false,
      businessNameMatches: false,
      message: errorMessage
    };
  }
}
```

**✅ Características:**
- Acepta document como string o number
- Limpia y valida el documento
- Llama al endpoint `/rnt/verify-with-document`
- Envía: `rntNumber`, `document` (number), `businessName`
- Maneja múltiples formatos de respuesta del backend
- Retorna: `isValid`, `documentMatches`, `businessNameMatches`, `message`

#### 3. **apiClient.ts** - Cliente HTTP Configurado

```typescript
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5116/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**✅ Características:**
- URL base: `http://localhost:5116/api`
- Interceptor de request agrega JWT token
- Interceptor de response maneja formato .NET API
- Manejo de errores 401 (logout automático)

---

## 🎯 Lo que Necesita el Backend

### Endpoints Requeridos:

### 1. **POST /api/Auth/validate-document**

**Purpose:** Validar que un documento (cédula) no esté duplicado en el sistema.

**Request Body:**
```json
{
  "document": 1234567890  // number (sin puntos, comas, ni guiones)
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Documento válido",
  "data": {
    "isValid": true,
    "message": "El documento está disponible"
  }
}
```

**Response cuando documento ya existe:**
```json
{
  "success": false,
  "message": "El documento ya está registrado",
  "data": {
    "isValid": false,
    "message": "Este documento ya está registrado en el sistema"
  }
}
```

**Lógica del Endpoint:**
1. Recibir `document` como número
2. Buscar en la BD si existe un usuario con ese documento
3. Si existe → `isValid: false`, mensaje de error
4. Si NO existe → `isValid: true`, documento disponible

---

### 2. **POST /api/rnt/verify-with-document**

**Purpose:** Verificar que la cédula del prestador coincida con el NIT registrado en el RNT.

**Request Body:**
```json
{
  "rntNumber": "12345",
  "document": 1234567890,  // number - Cédula del prestador
  "businessName": "Mi Empresa Turística"
}
```

**Response Success (Coincide):**
```json
{
  "success": true,
  "message": "Verificación exitosa",
  "data": {
    "isValid": true,
    "documentMatches": true,
    "businessNameMatches": true,
    "registeredName": "MI EMPRESA TURÍSTICA S.A.S",
    "registeredType": "Establecimiento de Alojamiento",
    "city": "Bogotá",
    "department": "Cundinamarca",
    "message": "Los datos coinciden con el RNT registrado"
  }
}
```

**Response cuando NO coincide:**
```json
{
  "success": false,
  "message": "Los datos no coinciden",
  "data": {
    "isValid": false,
    "documentMatches": false,
    "businessNameMatches": false,
    "message": "La cédula no coincide con el NIT del RNT registrado"
  }
}
```

**Response cuando RNT no existe:**
```json
{
  "success": false,
  "message": "RNT no encontrado",
  "data": {
    "isValid": false,
    "documentMatches": false,
    "businessNameMatches": false,
    "message": "El número de RNT no existe en el sistema"
  }
}
```

**Lógica del Endpoint:**
1. Recibir `rntNumber`, `document` (cédula como número), `businessName`
2. Consultar la BD o API del RNT para obtener datos del RNT
3. Comparar:
   - **NIT del RNT** vs **Cédula del prestador**
   - **Nombre registrado** vs **Business Name** (opcional)
4. Retornar:
   - `documentMatches`: true si la cédula coincide con el NIT
   - `businessNameMatches`: true si el nombre coincide
   - `isValid`: true si AMBOS coinciden
   - `message`: Mensaje descriptivo del resultado

**Nota Importante:**
En Colombia, para RNTs de personas naturales, el **NIT es la cédula + dígito de verificación**.
Por ejemplo:
- Cédula: `1234567890`
- NIT: `1234567890-1` (cédula + guión + dígito de verificación)

La validación debe:
1. Extraer la parte numérica del NIT (antes del guión)
2. Comparar con la cédula del prestador

---

## 📋 TypeScript Interfaces (Para el Backend .NET)

### Models para C#:

```csharp
// ValidateDocumentRequest.cs
public class ValidateDocumentRequest
{
    [Required]
    public long Document { get; set; }  // long para números grandes
}

// ValidateDocumentResponse.cs
public class ValidateDocumentResponse
{
    public bool IsValid { get; set; }
    public string Message { get; set; }
    public string? Document { get; set; }  // Opcional
}

// RNTDocumentVerificationRequest.cs
public class RNTDocumentVerificationRequest
{
    [Required]
    public string RntNumber { get; set; }

    [Required]
    public long Document { get; set; }  // Cédula como número

    [Required]
    public string BusinessName { get; set; }
}

// RNTDocumentVerificationResponse.cs
public class RNTDocumentVerificationResponse
{
    public bool IsValid { get; set; }
    public bool DocumentMatches { get; set; }
    public bool BusinessNameMatches { get; set; }
    public string? RegisteredName { get; set; }
    public string? RegisteredType { get; set; }
    public string? City { get; set; }
    public string? Department { get; set; }
    public string Message { get; set; }
}
```

---

## 🚀 Cómo Probar

### 1. **Iniciar el Backend:**

```bash
cd path/to/backend
dotnet run
```

Verificar que corra en `http://localhost:5116`

### 2. **Iniciar el Frontend:**

```bash
cd wildtour-frontend
npm run dev
```

### 3. **Probar Registro de Prestador:**

1. Ir a `/register`
2. Seleccionar rol "Prestador de Servicio"
3. Llenar el formulario:
   - **Cédula**: `1234567890`
   - **RNT**: `12345`
   - **Nombre del Negocio**: `Mi Empresa Turística`
   - **Tipo RNT**: `Establecimiento de Alojamiento`
4. Al llenar la cédula → Debe llamar a `/Auth/validate-document`
5. Al continuar → Debe llamar a `/rnt/verify-with-document`

### 4. **Verificar en Console:**

Deberías ver:
```
POST http://localhost:5116/api/Auth/validate-document  → 200 OK
POST http://localhost:5116/api/rnt/verify-with-document → 200 OK
```

En lugar de:
```
net::ERR_CONNECTION_REFUSED ❌
```

---

## 📝 Notas Adicionales

### Flujo Completo de Validación:

1. **Usuario llena cédula** → Frontend valida formato (solo números)
2. **onBlur de cédula** → Llama `authApi.validateDocument()`
   - Backend verifica si está duplicada
   - Muestra error si ya existe
3. **Usuario llena RNT y nombre del negocio** → No hace nada aún
4. **Usuario hace submit del formulario** → Llama `rntApi.verifyRNTWithDocument()`
   - Backend verifica que cédula coincida con NIT del RNT
   - Backend verifica que nombre del negocio sea similar
   - Muestra error si NO coinciden
5. **Si todo es válido** → Llama `authApi.register()`
   - Crea el usuario en la BD
   - Auto-login
   - Redirige a dashboard

### Mensaje de Error Actual (Frontend):

El error mostrado en la imagen dice:
> "La cédula no coincide con el NIT registrado en el RNT. El nombre del negocio no coincide con el registrado"

Este mensaje viene del **MOCK** del frontend cuando el backend no está disponible.
Una vez implementes los endpoints del backend, este mensaje será reemplazado por la respuesta real.

---

## ✅ Checklist de Implementación Backend

### Endpoint 1: `/api/Auth/validate-document`
- [ ] Crear modelo `ValidateDocumentRequest`
- [ ] Crear modelo `ValidateDocumentResponse`
- [ ] Crear endpoint POST en `AuthController`
- [ ] Buscar en BD si existe usuario con ese document
- [ ] Retornar `isValid: true` si NO existe
- [ ] Retornar `isValid: false` si ya existe
- [ ] Manejar errores y retornar ApiResponse estándar

### Endpoint 2: `/api/rnt/verify-with-document`
- [ ] Crear modelo `RNTDocumentVerificationRequest`
- [ ] Crear modelo `RNTDocumentVerificationResponse`
- [ ] Crear `RntController` (si no existe)
- [ ] Crear endpoint POST
- [ ] Consultar datos del RNT (BD o API externa)
- [ ] Extraer NIT del RNT (parte numérica)
- [ ] Comparar NIT con document (cédula)
- [ ] Comparar businessName con nombre registrado (opcional)
- [ ] Retornar `documentMatches`, `businessNameMatches`, `isValid`
- [ ] Manejar casos: RNT no existe, datos no coinciden
- [ ] Retornar ApiResponse estándar

### Testing:
- [ ] Probar endpoint con Postman/Swagger
- [ ] Probar caso: documento disponible
- [ ] Probar caso: documento duplicado
- [ ] Probar caso: RNT válido, cédula coincide
- [ ] Probar caso: RNT válido, cédula NO coincide
- [ ] Probar caso: RNT no existe
- [ ] Integrar con frontend y probar flujo completo

---

## 🎯 Resultado Esperado

Después de implementar los endpoints del backend:

1. ✅ Usuario llena cédula → Validación en tiempo real
2. ✅ Si cédula ya existe → Muestra error inmediatamente
3. ✅ Si cédula disponible → Continúa
4. ✅ Usuario llena RNT → Validación al submit
5. ✅ Si RNT no coincide con cédula → Muestra error claro
6. ✅ Si todo coincide → Registro exitoso

**Mensaje de Error Real:**
> "La cédula **1234567890** no coincide con el NIT **9876543210** registrado en el RNT **12345**"

En lugar del mensaje genérico actual.

---

**Fecha:** 27 de noviembre de 2025
**Versión Frontend:** Listo y funcionando ✅
**Pendiente:** Implementar endpoints en backend .NET
