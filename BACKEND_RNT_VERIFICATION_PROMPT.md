# Sistema de Verificación y Validación del RNT - Backend

## 📋 Resumen Ejecutivo

Implementar un sistema completo de verificación del **Registro Nacional de Turismo (RNT)** en el backend de Wild Tour para validar que los prestadores de servicios turísticos estén debidamente registrados ante el Ministerio de Comercio, Industria y Turismo de Colombia.

---

## 🎯 Objetivos

1. **Verificar** la autenticidad de los números RNT
2. **Validar** que el RNT esté activo y vigente
3. **Comparar** la información proporcionada con la registrada oficialmente
4. **Almacenar** el estado de verificación para auditorías
5. **Prevenir** el registro de prestadores fraudulentos

---

## 📊 Esquema de Base de Datos

### Nueva Tabla: RNTVerifications

```sql
CREATE TABLE RNTVerifications (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    RNTNumber NVARCHAR(50) NOT NULL,
    RNTType NVARCHAR(100) NOT NULL,
    BusinessName NVARCHAR(200) NOT NULL,

    -- Resultado de la verificación
    IsValid BIT NOT NULL DEFAULT 0,
    Status NVARCHAR(50) NOT NULL, -- 'active', 'inactive', 'suspended', 'not_found'

    -- Información del RNT verificada
    RegisteredName NVARCHAR(200),
    RegisteredType NVARCHAR(100),
    RegistrationDate DATETIME2,
    ExpirationDate DATETIME2,

    -- Metadata
    VerificationDate DATETIME2 DEFAULT GETDATE(),
    VerificationMethod NVARCHAR(50), -- 'api', 'manual', 'scraping'
    ResponseData NVARCHAR(MAX), -- JSON con respuesta completa de la API

    -- Auditoría
    VerifiedBy NVARCHAR(100), -- Sistema o usuario que verificó
    Notes NVARCHAR(MAX),

    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE INDEX IX_RNTVerifications_RNTNumber ON RNTVerifications(RNTNumber);
CREATE INDEX IX_RNTVerifications_UserId ON RNTVerifications(UserId);
CREATE INDEX IX_RNTVerifications_Status ON RNTVerifications(Status);
```

### Actualizar Tabla Users/Providers

```sql
ALTER TABLE Users ADD RNTVerified BIT DEFAULT 0;
ALTER TABLE Users ADD RNTVerificationDate DATETIME2 NULL;
ALTER TABLE Users ADD LastRNTCheckDate DATETIME2 NULL;
```

---

## 🔌 API del Ministerio de Turismo

### Opción 1: API Oficial (Recomendada)

El Ministerio de Comercio, Industria y Turismo ofrece servicios para consultar el RNT:

**Endpoint Base:** `https://www.mincit.gov.co/MINTURISMO/servicios-rnt`

**Métodos de Consulta:**
1. **Portal Web:** https://rnt.mincit.gov.co/
2. **Servicio SOAP/REST** (requiere credenciales)
3. **Datos Abiertos:** https://www.datos.gov.co/ (datasets del RNT)

### Opción 2: Web Scraping (Alternativa)

Si no tienes acceso a la API oficial, implementar web scraping responsable:

```csharp
// Consulta al portal público del RNT
public async Task<RNTInfo> ScrapeRNTData(string rntNumber)
{
    var url = $"https://rnt.mincit.gov.co/consultas/prestador/{rntNumber}";
    // Implementar lógica de scraping
}
```

### Opción 3: Base de Datos Estática (Desarrollo)

Para desarrollo y pruebas, usar datasets descargados de datos.gov.co

---

## 📡 Endpoints REST API

### 1. Verificar RNT

```http
POST /api/rnt/verify
Content-Type: application/json
```

**Request Body:**
```json
{
  "rntNumber": "12345",
  "rntType": "alojamiento_hotel",
  "businessName": "Hotel Vista Hermosa"
}
```

**Response - Success (200 OK):**
```json
{
  "isValid": true,
  "status": "active",
  "registeredName": "Hotel Vista Hermosa S.A.S",
  "registeredType": "Establecimiento de Alojamiento - Hotel",
  "registrationDate": "2020-05-15T00:00:00Z",
  "expirationDate": "2025-05-15T00:00:00Z",
  "message": "RNT verificado correctamente"
}
```

**Response - RNT Inválido (200 OK):**
```json
{
  "isValid": false,
  "status": "not_found",
  "registeredName": null,
  "registeredType": null,
  "registrationDate": null,
  "expirationDate": null,
  "message": "No se encontró ningún registro con este número de RNT"
}
```

**Response - RNT Inactivo (200 OK):**
```json
{
  "isValid": false,
  "status": "inactive",
  "registeredName": "Hotel Vista Hermosa S.A.S",
  "registeredType": "Establecimiento de Alojamiento - Hotel",
  "registrationDate": "2020-05-15T00:00:00Z",
  "expirationDate": "2023-05-15T00:00:00Z",
  "message": "El RNT ha expirado. Por favor renueva tu registro"
}
```

**Response - RNT Suspendido (200 OK):**
```json
{
  "isValid": false,
  "status": "suspended",
  "registeredName": "Hotel Vista Hermosa S.A.S",
  "registeredType": "Establecimiento de Alojamiento - Hotel",
  "registrationDate": "2020-05-15T00:00:00Z",
  "expirationDate": "2025-05-15T00:00:00Z",
  "message": "El RNT se encuentra suspendido por el Ministerio de Turismo"
}
```

**Response - Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "El número de RNT es requerido",
  "errors": ["rntNumber: El campo es obligatorio"]
}
```

---

### 2. Obtener Detalles de RNT

```http
GET /api/rnt/{rntNumber}
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "rntNumber": "12345",
  "businessName": "Hotel Vista Hermosa S.A.S",
  "legalRepresentative": "Juan Pérez",
  "nit": "900123456-1",
  "type": "Establecimiento de Alojamiento - Hotel",
  "category": "4 Estrellas",
  "address": "Calle 123 #45-67",
  "city": "Villavieja",
  "department": "Huila",
  "phone": "+57 312 345 6789",
  "email": "info@hotelvistahermosa.com",
  "website": "https://hotelvistahermosa.com",
  "registrationDate": "2020-05-15T00:00:00Z",
  "expirationDate": "2025-05-15T00:00:00Z",
  "status": "active",
  "lastVerification": "2025-10-30T14:30:00Z"
}
```

---

### 3. Revalidar RNT (Periódico)

```http
POST /api/rnt/revalidate/{userId}
Authorization: Bearer {admin-token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "RNT revalidado correctamente",
  "previousStatus": "active",
  "currentStatus": "active",
  "lastCheck": "2025-10-30T14:30:00Z"
}
```

---

### 4. Búsqueda de Prestadores por RNT

```http
GET /api/rnt/search?name={name}&type={type}&city={city}
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "results": [
    {
      "rntNumber": "12345",
      "businessName": "Hotel Vista Hermosa",
      "type": "Hotel",
      "city": "Villavieja",
      "status": "active"
    }
  ],
  "total": 1
}
```

---

## 💼 Modelos C#

### DTOs

```csharp
// Request
public class VerifyRNTRequest
{
    [Required(ErrorMessage = "El número de RNT es obligatorio")]
    public string RNTNumber { get; set; }

    [Required(ErrorMessage = "El tipo de prestador es obligatorio")]
    public string RNTType { get; set; }

    [Required(ErrorMessage = "El nombre del negocio es obligatorio")]
    [MaxLength(200)]
    public string BusinessName { get; set; }
}

// Response
public class RNTVerificationResponse
{
    public bool IsValid { get; set; }
    public string Status { get; set; } // active, inactive, suspended, not_found
    public string RegisteredName { get; set; }
    public string RegisteredType { get; set; }
    public DateTime? RegistrationDate { get; set; }
    public DateTime? ExpirationDate { get; set; }
    public string Message { get; set; }
}

// Entity
public class RNTVerification
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string RNTNumber { get; set; }
    public string RNTType { get; set; }
    public string BusinessName { get; set; }

    // Resultado
    public bool IsValid { get; set; }
    public string Status { get; set; }
    public string RegisteredName { get; set; }
    public string RegisteredType { get; set; }
    public DateTime? RegistrationDate { get; set; }
    public DateTime? ExpirationDate { get; set; }

    // Metadata
    public DateTime VerificationDate { get; set; } = DateTime.UtcNow;
    public string VerificationMethod { get; set; }
    public string ResponseData { get; set; }
    public string VerifiedBy { get; set; }
    public string Notes { get; set; }

    // Navigation
    public User User { get; set; }
}
```

---

## 🔧 Servicios e Implementación

### Interface

```csharp
public interface IRNTService
{
    Task<RNTVerificationResponse> VerifyRNTAsync(VerifyRNTRequest request);
    Task<RNTDetails> GetRNTDetailsAsync(string rntNumber);
    Task<bool> RevalidateUserRNTAsync(Guid userId);
    Task<List<RNTVerification>> GetVerificationHistoryAsync(Guid userId);
}
```

### Implementación Básica

```csharp
public class RNTService : IRNTService
{
    private readonly HttpClient _httpClient;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<RNTService> _logger;

    public async Task<RNTVerificationResponse> VerifyRNTAsync(VerifyRNTRequest request)
    {
        try
        {
            // Opción 1: Llamar a la API oficial del Ministerio
            var result = await CallMinciAPIAsync(request.RNTNumber);

            // Opción 2: Consultar base de datos local (datos.gov.co)
            // var result = await QueryLocalRNTDatabase(request.RNTNumber);

            // Opción 3: Web Scraping (último recurso)
            // var result = await ScrapeRNTPortal(request.RNTNumber);

            // Validar que los datos coincidan
            var isValid = ValidateRNTData(request, result);

            // Guardar registro de verificación
            await SaveVerificationRecordAsync(request, result, isValid);

            return new RNTVerificationResponse
            {
                IsValid = isValid && result.Status == "active",
                Status = result.Status,
                RegisteredName = result.BusinessName,
                RegisteredType = result.Type,
                RegistrationDate = result.RegistrationDate,
                ExpirationDate = result.ExpirationDate,
                Message = GetVerificationMessage(result.Status, isValid)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al verificar RNT {RNTNumber}", request.RNTNumber);
            throw;
        }
    }

    private async Task<RNTData> CallMinciAPIAsync(string rntNumber)
    {
        // Implementar llamada a la API del Ministerio
        var url = $"https://api.mincit.gov.co/rnt/consulta/{rntNumber}";
        var response = await _httpClient.GetAsync(url);

        if (response.IsSuccessStatusCode)
        {
            var data = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<RNTData>(data);
        }

        return new RNTData { Status = "not_found" };
    }

    private bool ValidateRNTData(VerifyRNTRequest request, RNTData result)
    {
        // Validar que el nombre del negocio coincida (tolerancia a variaciones)
        var similarity = CalculateStringSimilarity(
            request.BusinessName.ToLower().Trim(),
            result.BusinessName.ToLower().Trim()
        );

        // Validar que el tipo de prestador coincida
        var typeMatches = MapRNTType(request.RNTType) == result.Type;

        return similarity > 0.8 && typeMatches;
    }

    private string GetVerificationMessage(string status, bool isValid)
    {
        return status switch
        {
            "active" when isValid => "RNT verificado correctamente",
            "active" when !isValid => "El RNT existe pero la información no coincide",
            "inactive" => "El RNT ha expirado. Por favor renueva tu registro",
            "suspended" => "El RNT se encuentra suspendido por el Ministerio de Turismo",
            "not_found" => "No se encontró ningún registro con este número de RNT",
            _ => "No se pudo verificar el RNT"
        };
    }

    private async Task SaveVerificationRecordAsync(
        VerifyRNTRequest request,
        RNTData result,
        bool isValid)
    {
        var verification = new RNTVerification
        {
            RNTNumber = request.RNTNumber,
            RNTType = request.RNTType,
            BusinessName = request.BusinessName,
            IsValid = isValid,
            Status = result.Status,
            RegisteredName = result.BusinessName,
            RegisteredType = result.Type,
            RegistrationDate = result.RegistrationDate,
            ExpirationDate = result.ExpirationDate,
            VerificationMethod = "api",
            ResponseData = JsonSerializer.Serialize(result),
            VerifiedBy = "System"
        };

        _context.RNTVerifications.Add(verification);
        await _context.SaveChangesAsync();
    }
}
```

---

## 🔐 Controlador

```csharp
[ApiController]
[Route("api/[controller]")]
public class RNTController : ControllerBase
{
    private readonly IRNTService _rntService;

    [HttpPost("verify")]
    [AllowAnonymous] // Permitir verificación antes del registro
    public async Task<ActionResult<RNTVerificationResponse>> VerifyRNT(
        [FromBody] VerifyRNTRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _rntService.VerifyRNTAsync(request);
        return Ok(result);
    }

    [HttpGet("{rntNumber}")]
    [Authorize]
    public async Task<ActionResult<RNTDetails>> GetRNTDetails(string rntNumber)
    {
        var details = await _rntService.GetRNTDetailsAsync(rntNumber);

        if (details == null)
            return NotFound(new { message = "RNT no encontrado" });

        return Ok(details);
    }

    [HttpPost("revalidate/{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> RevalidateRNT(Guid userId)
    {
        var success = await _rntService.RevalidateUserRNTAsync(userId);

        if (!success)
            return BadRequest(new { message = "No se pudo revalidar el RNT" });

        return Ok(new { message = "RNT revalidado correctamente" });
    }
}
```

---

## ⚙️ Configuración

### appsettings.json

```json
{
  "RNTSettings": {
    "ApiUrl": "https://api.mincit.gov.co/rnt",
    "ApiKey": "your-api-key-here",
    "VerificationEnabled": true,
    "RevalidationIntervalDays": 30,
    "CacheExpirationMinutes": 60,
    "MaxRetries": 3,
    "TimeoutSeconds": 30
  }
}
```

---

## 🔄 Trabajo en Segundo Plano

### Job de Revalidación Periódica

```csharp
public class RNTRevalidationJob : IHostedService
{
    private Timer _timer;

    public Task StartAsync(CancellationToken cancellationToken)
    {
        // Ejecutar cada 24 horas
        _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromHours(24));
        return Task.CompletedTask;
    }

    private async void DoWork(object state)
    {
        // Obtener todos los prestadores con RNT a punto de expirar (30 días)
        var providersToRevalidate = await _context.Users
            .Where(u => u.RoleId == 2 &&
                   u.RNTVerified &&
                   u.LastRNTCheckDate < DateTime.UtcNow.AddDays(-30))
            .ToListAsync();

        foreach (var provider in providersToRevalidate)
        {
            await _rntService.RevalidateUserRNTAsync(provider.Id);
        }
    }
}
```

---

## ✅ Validaciones y Reglas de Negocio

### 1. Durante el Registro

- ✅ El RNT debe ser verificado antes de completar el registro
- ✅ El nombre del negocio debe coincidir (tolerancia del 80%)
- ✅ El tipo de prestador debe coincidir
- ✅ El RNT debe estar activo

### 2. Durante el Uso

- ✅ Revalidar RNT cada 30 días automáticamente
- ✅ Notificar al prestador si su RNT está por expirar (60 días antes)
- ✅ Suspender cuenta si el RNT expira o es suspendido
- ✅ Permitir actualizar RNT si hay cambios

### 3. Auditoría

- ✅ Registrar todas las verificaciones (exitosas y fallidas)
- ✅ Mantener histórico de cambios de estado
- ✅ Alertar a administradores de intentos fraudulentos

---

## 🧪 Casos de Prueba

### 1. RNT Válido y Activo
```json
Input: { "rntNumber": "12345", "rntType": "alojamiento_hotel", "businessName": "Hotel Vista Hermosa" }
Expected: { "isValid": true, "status": "active" }
```

### 2. RNT Válido pero Inactivo
```json
Input: { "rntNumber": "99999", "rntType": "agencia_viajes", "businessName": "Tours Colombia" }
Expected: { "isValid": false, "status": "inactive" }
```

### 3. RNT No Encontrado
```json
Input: { "rntNumber": "00000", "rntType": "hotel", "businessName": "Hotel Falso" }
Expected: { "isValid": false, "status": "not_found" }
```

### 4. Datos No Coinciden
```json
Input: { "rntNumber": "12345", "rntType": "restaurante", "businessName": "Nombre Diferente" }
Expected: { "isValid": false, "status": "active", "message": "Los datos no coinciden" }
```

---

## 📚 Recursos y Referencias

### APIs y Datos Oficiales

1. **Portal RNT:** https://rnt.mincit.gov.co/
2. **Datos Abiertos Colombia:** https://www.datos.gov.co/
3. **MinCIT:** https://www.mincit.gov.co/minturismo

### Datasets Disponibles

- **Prestadores RNT:** https://www.datos.gov.co/Comercio-Industria-y-Turismo/Registro-Nacional-de-Turismo/
- Actualizado mensualmente por el Ministerio

---

## 🚀 Fases de Implementación

### Fase 1: Básico (Semana 1)
- [ ] Crear tabla RNTVerifications
- [ ] Implementar endpoint POST /api/rnt/verify
- [ ] Integrar con formulario de registro
- [ ] Validación básica (formato, requeridos)

### Fase 2: Verificación Real (Semana 2)
- [ ] Integrar con API oficial del Ministerio (si disponible)
- [ ] Implementar fallback con datos estáticos
- [ ] Agregar lógica de coincidencia de nombres
- [ ] Guardar histórico de verificaciones

### Fase 3: Mantenimiento (Semana 3)
- [ ] Job de revalidación periódica
- [ ] Notificaciones de expiración
- [ ] Panel de administración de RNTs
- [ ] Reportes y auditorías

---

## ⚠️ Consideraciones Importantes

1. **Privacidad**: No exponer información sensible de terceros
2. **Rate Limiting**: Limitar verificaciones (máx 10 por hora por IP)
3. **Caché**: Cachear resultados de verificación (1 hora)
4. **Fallback**: Si la API falla, permitir verificación manual por admin
5. **Legal**: Cumplir con términos de uso de la API del Ministerio

---

## 📞 Soporte

Para dudas sobre la implementación:
- **Frontend**: Ver `src/infrastructure/services/rntApi.ts`
- **Validación**: Ver `src/presentation/pages/Register.tsx` líneas 105-143

---

**Versión:** 1.0
**Fecha:** 30 de Octubre, 2025
**Autor:** Wild Tour Development Team
