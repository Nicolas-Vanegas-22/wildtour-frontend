# 🔧 PROMPT PARA BACKEND .NET - Validación RNT y Cédula

## 📋 Contexto

Necesito implementar 2 endpoints en el backend .NET para validar:
1. **Cédulas duplicadas** durante el registro
2. **Coincidencia entre cédula del prestador y NIT del RNT**

El frontend ya está listo y esperando estos endpoints.

---

## 🎯 ENDPOINT 1: Validar Documento (Cédula)

### Especificaciones:

**Ruta:** `POST /api/Auth/validate-document`

**Request Body:**
```json
{
  "document": 1234567890
}
```
- `document` es de tipo `long` (número grande sin puntos, comas ni guiones)

**Response cuando documento está DISPONIBLE:**
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

**Response cuando documento ya EXISTE:**
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

### Lógica Requerida:

1. Recibir `document` como `long`
2. Buscar en la tabla de usuarios (o personas) si existe un registro con ese documento
3. Si existe → Retornar `isValid: false` con mensaje de error
4. Si NO existe → Retornar `isValid: true` con mensaje de éxito
5. Usar el formato de respuesta estándar `ApiResponse<T>`

### Modelos C#:

```csharp
// Models/ValidateDocumentRequest.cs
public class ValidateDocumentRequest
{
    [Required(ErrorMessage = "El documento es requerido")]
    [Range(1000000, 9999999999, ErrorMessage = "El documento debe tener entre 7 y 10 dígitos")]
    public long Document { get; set; }
}

// Models/ValidateDocumentResponse.cs
public class ValidateDocumentResponse
{
    public bool IsValid { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Document { get; set; }  // Opcional - para debugging
}
```

### Controller:

```csharp
// Controllers/AuthController.cs
[HttpPost("validate-document")]
public async Task<ActionResult<ApiResponse<ValidateDocumentResponse>>> ValidateDocument(
    [FromBody] ValidateDocumentRequest request)
{
    try
    {
        // Buscar si existe un usuario con ese documento
        var existingUser = await _context.Persons
            .FirstOrDefaultAsync(p => p.Document == request.Document);

        if (existingUser != null)
        {
            // Documento ya existe
            return Ok(new ApiResponse<ValidateDocumentResponse>
            {
                Success = false,
                Message = "El documento ya está registrado",
                Data = new ValidateDocumentResponse
                {
                    IsValid = false,
                    Message = "Este documento ya está registrado en el sistema",
                    Document = request.Document.ToString()
                }
            });
        }

        // Documento disponible
        return Ok(new ApiResponse<ValidateDocumentResponse>
        {
            Success = true,
            Message = "Documento válido",
            Data = new ValidateDocumentResponse
            {
                IsValid = true,
                Message = "El documento está disponible",
                Document = request.Document.ToString()
            }
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new ApiResponse<ValidateDocumentResponse>
        {
            Success = false,
            Message = "Error al validar el documento",
            Errors = new[] { ex.Message }
        });
    }
}
```

---

## 🎯 ENDPOINT 2: Verificar RNT con Documento

### Especificaciones:

**Ruta:** `POST /api/rnt/verify-with-document`

**Request Body:**
```json
{
  "rntNumber": "12345",
  "document": 1234567890,
  "businessName": "Mi Empresa Turística"
}
```

**Response cuando TODO coincide:**
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

**Response cuando cédula NO coincide:**
```json
{
  "success": false,
  "message": "Los datos no coinciden",
  "data": {
    "isValid": false,
    "documentMatches": false,
    "businessNameMatches": false,
    "message": "La cédula 1234567890 no coincide con el NIT 9876543210 registrado en el RNT 12345"
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
    "message": "El número de RNT 12345 no existe en el sistema"
  }
}
```

### Lógica Requerida:

1. Recibir `rntNumber` (string), `document` (long - cédula), `businessName` (string)
2. Buscar el RNT en la BD o consultar API externa del Ministerio de Comercio
3. Si NO existe el RNT → Retornar error "RNT no encontrado"
4. Si existe:
   - Extraer el **NIT** del RNT (puede venir como "123456789-0", extraer parte numérica)
   - **IMPORTANTE:** En Colombia, para personas naturales, el NIT = Cédula + dígito de verificación
   - Comparar: `document` (cédula) == NIT (sin dígito de verificación)
   - Comparar: `businessName` vs nombre registrado (normalizar textos, mayúsculas, tildes)
5. Retornar:
   - `documentMatches`: true si cédula == NIT
   - `businessNameMatches`: true si nombres son similares (>80% match)
   - `isValid`: true si AMBOS coinciden
   - Incluir datos del RNT: `registeredName`, `registeredType`, `city`, `department`

### Modelos C#:

```csharp
// Models/RNTDocumentVerificationRequest.cs
public class RNTDocumentVerificationRequest
{
    [Required(ErrorMessage = "El número de RNT es requerido")]
    public string RntNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "El documento es requerido")]
    [Range(1000000, 9999999999, ErrorMessage = "El documento debe tener entre 7 y 10 dígitos")]
    public long Document { get; set; }

    [Required(ErrorMessage = "El nombre del negocio es requerido")]
    [MinLength(3, ErrorMessage = "El nombre debe tener al menos 3 caracteres")]
    public string BusinessName { get; set; } = string.Empty;
}

// Models/RNTDocumentVerificationResponse.cs
public class RNTDocumentVerificationResponse
{
    public bool IsValid { get; set; }
    public bool DocumentMatches { get; set; }
    public bool BusinessNameMatches { get; set; }
    public string? RegisteredName { get; set; }
    public string? RegisteredType { get; set; }
    public string? City { get; set; }
    public string? Department { get; set; }
    public string Message { get; set; } = string.Empty;
}
```

### Controller:

```csharp
// Controllers/RntController.cs
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class RntController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<RntController> _logger;

    public RntController(ApplicationDbContext context, ILogger<RntController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("verify-with-document")]
    public async Task<ActionResult<ApiResponse<RNTDocumentVerificationResponse>>> VerifyWithDocument(
        [FromBody] RNTDocumentVerificationRequest request)
    {
        try
        {
            // 1. Buscar RNT en la base de datos
            var rnt = await _context.RNTs
                .FirstOrDefaultAsync(r => r.Number == request.RntNumber);

            if (rnt == null)
            {
                return Ok(new ApiResponse<RNTDocumentVerificationResponse>
                {
                    Success = false,
                    Message = "RNT no encontrado",
                    Data = new RNTDocumentVerificationResponse
                    {
                        IsValid = false,
                        DocumentMatches = false,
                        BusinessNameMatches = false,
                        Message = $"El número de RNT {request.RntNumber} no existe en el sistema"
                    }
                });
            }

            // 2. Extraer NIT (parte numérica del NIT, sin dígito de verificación)
            // Ejemplo: NIT = "123456789-0" → extraer "123456789"
            var nitString = rnt.Nit?.Split('-')[0] ?? "";
            var nitNumber = long.TryParse(nitString, out var parsedNit) ? parsedNit : 0;

            // 3. Comparar documento (cédula) con NIT
            bool documentMatches = request.Document == nitNumber;

            // 4. Comparar nombres (normalizar y comparar)
            bool businessNameMatches = CompareBusinessNames(
                request.BusinessName,
                rnt.BusinessName
            );

            // 5. Validación general
            bool isValid = documentMatches && businessNameMatches;

            // 6. Construir mensaje
            string message;
            if (isValid)
            {
                message = "Los datos coinciden con el RNT registrado";
            }
            else if (!documentMatches)
            {
                message = $"La cédula {request.Document} no coincide con el NIT {nitNumber} registrado en el RNT {request.RntNumber}";
            }
            else if (!businessNameMatches)
            {
                message = $"El nombre del negocio no coincide con el registrado: '{rnt.BusinessName}'";
            }
            else
            {
                message = "Los datos no coinciden con el RNT registrado";
            }

            return Ok(new ApiResponse<RNTDocumentVerificationResponse>
            {
                Success = isValid,
                Message = isValid ? "Verificación exitosa" : "Los datos no coinciden",
                Data = new RNTDocumentVerificationResponse
                {
                    IsValid = isValid,
                    DocumentMatches = documentMatches,
                    BusinessNameMatches = businessNameMatches,
                    RegisteredName = rnt.BusinessName,
                    RegisteredType = rnt.Type,
                    City = rnt.City,
                    Department = rnt.Department,
                    Message = message
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al verificar RNT con documento");

            return StatusCode(500, new ApiResponse<RNTDocumentVerificationResponse>
            {
                Success = false,
                Message = "Error al verificar los datos",
                Errors = new[] { ex.Message }
            });
        }
    }

    // Método auxiliar para comparar nombres (normalizar, quitar tildes, etc.)
    private bool CompareBusinessNames(string input, string registered)
    {
        // Normalizar ambos nombres
        var normalizedInput = NormalizeName(input);
        var normalizedRegistered = NormalizeName(registered);

        // Calcular similitud (Levenshtein distance o simple contains)
        // Opción simple: verificar si uno contiene al otro
        if (normalizedRegistered.Contains(normalizedInput) ||
            normalizedInput.Contains(normalizedRegistered))
        {
            return true;
        }

        // Opción avanzada: calcular % de similitud (implementar Levenshtein)
        // Por ahora, retornar false si no coinciden
        return false;
    }

    private string NormalizeName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return string.Empty;

        // Convertir a mayúsculas
        var normalized = name.ToUpperInvariant();

        // Remover tildes (á → a, é → e, etc.)
        normalized = RemoveDiacritics(normalized);

        // Remover caracteres especiales (excepto letras y números)
        normalized = System.Text.RegularExpressions.Regex.Replace(
            normalized,
            @"[^A-Z0-9\s]",
            ""
        );

        // Remover espacios extras
        normalized = System.Text.RegularExpressions.Regex.Replace(
            normalized,
            @"\s+",
            " "
        ).Trim();

        return normalized;
    }

    private string RemoveDiacritics(string text)
    {
        var normalizedString = text.Normalize(NormalizationForm.FormD);
        var stringBuilder = new System.Text.StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
    }
}
```

---

## 📊 Estructura de BD Necesaria

### Tabla `Persons` o `Users`:

```sql
CREATE TABLE Persons (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Document BIGINT NOT NULL UNIQUE,  -- Cédula
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    PhoneNumber NVARCHAR(20),
    -- Otros campos...
);
```

### Tabla `RNTs` (si no existe):

```sql
CREATE TABLE RNTs (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Number NVARCHAR(50) NOT NULL UNIQUE,  -- Número del RNT
    Nit NVARCHAR(50) NOT NULL,            -- NIT con dígito (ej: "123456789-0")
    BusinessName NVARCHAR(200) NOT NULL,  -- Nombre del negocio
    Type NVARCHAR(100),                   -- Tipo de RNT
    City NVARCHAR(100),
    Department NVARCHAR(100),
    Status NVARCHAR(50),                  -- active, inactive, suspended
    RegistrationDate DATETIME,
    ExpirationDate DATETIME,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME
);
```

---

## ✅ Checklist de Implementación

### Endpoint 1: `/api/Auth/validate-document`
- [ ] Crear `ValidateDocumentRequest.cs` en carpeta Models
- [ ] Crear `ValidateDocumentResponse.cs` en carpeta Models
- [ ] Agregar método `ValidateDocument` en `AuthController.cs`
- [ ] Buscar en BD: `_context.Persons.FirstOrDefaultAsync(p => p.Document == request.Document)`
- [ ] Retornar `ApiResponse<ValidateDocumentResponse>` estándar
- [ ] Probar con Postman/Swagger

### Endpoint 2: `/api/rnt/verify-with-document`
- [ ] Crear `RNTDocumentVerificationRequest.cs` en carpeta Models
- [ ] Crear `RNTDocumentVerificationResponse.cs` en carpeta Models
- [ ] Crear `RntController.cs` (si no existe)
- [ ] Agregar método `VerifyWithDocument`
- [ ] Buscar RNT en BD: `_context.RNTs.FirstOrDefaultAsync(r => r.Number == request.RntNumber)`
- [ ] Extraer NIT y comparar con documento
- [ ] Implementar comparación de nombres (método `CompareBusinessNames`)
- [ ] Retornar `ApiResponse<RNTDocumentVerificationResponse>` estándar
- [ ] Probar con Postman/Swagger

### Testing Integrado:
- [ ] Probar desde frontend: llenar formulario de registro de prestador
- [ ] Verificar que llamadas HTTP respondan 200 OK
- [ ] Verificar que validaciones funcionen correctamente
- [ ] Probar casos de error (documento duplicado, RNT no existe, datos no coinciden)

---

## 🧪 Casos de Prueba

### Test 1: Validar Documento Disponible
```bash
POST http://localhost:5116/api/Auth/validate-document
Content-Type: application/json

{
  "document": 1234567890
}

# Esperado: isValid: true (si no existe)
```

### Test 2: Validar Documento Duplicado
```bash
POST http://localhost:5116/api/Auth/validate-document
Content-Type: application/json

{
  "document": 1234567890
}

# Esperado: isValid: false (si ya existe)
```

### Test 3: Verificar RNT con Cédula (Match)
```bash
POST http://localhost:5116/api/rnt/verify-with-document
Content-Type: application/json

{
  "rntNumber": "12345",
  "document": 1234567890,
  "businessName": "Mi Empresa"
}

# Esperado: isValid: true, documentMatches: true (si NIT del RNT es 1234567890)
```

### Test 4: Verificar RNT con Cédula (No Match)
```bash
POST http://localhost:5116/api/rnt/verify-with-document
Content-Type: application/json

{
  "rntNumber": "12345",
  "document": 9999999999,
  "businessName": "Mi Empresa"
}

# Esperado: isValid: false, documentMatches: false (si NIT del RNT NO es 9999999999)
```

### Test 5: RNT No Existe
```bash
POST http://localhost:5116/api/rnt/verify-with-document
Content-Type: application/json

{
  "rntNumber": "99999",
  "document": 1234567890,
  "businessName": "Mi Empresa"
}

# Esperado: isValid: false, message: "El número de RNT 99999 no existe en el sistema"
```

---

## 📚 Notas Adicionales

### Sobre el NIT en Colombia:

En Colombia:
- **Personas Naturales**: NIT = Cédula + Dígito de Verificación
  - Ejemplo: Cédula `12345678` → NIT `12345678-9`
- **Personas Jurídicas**: NIT es diferente a la cédula del representante legal

Para validación:
1. Extraer parte numérica del NIT: `"12345678-9"` → `12345678`
2. Comparar con la cédula: `12345678 == 12345678` ✅

### Comparación de Nombres:

La comparación de nombres puede ser:
- **Estricta**: Nombres deben coincidir exactamente (normalizado)
- **Flexible**: Permitir variaciones (>80% similitud)

Recomendación: Usar comparación **flexible** para mejor UX.

Ejemplo:
- Registrado: `"MI EMPRESA TURÍSTICA S.A.S."`
- Usuario escribe: `"Mi Empresa Turistica"`
- Normalizado 1: `"MIEMPRESATURISTICASAS"`
- Normalizado 2: `"MIEMPRESATURISTICA"`
- Similitud: 85% → **Coincide** ✅

---

## 🎯 Resultado Final

Con estos endpoints implementados, el flujo completo será:

1. ✅ Usuario registra prestador de servicio
2. ✅ Frontend valida cédula en tiempo real (no duplicada)
3. ✅ Frontend valida que cédula coincida con NIT del RNT
4. ✅ Si todo es válido → Registro exitoso
5. ✅ Si algo falla → Mensajes de error claros y específicos

---

**Este prompt está listo para copiar y pegar al equipo de backend. Contiene todo lo necesario para implementar la funcionalidad completa.**
