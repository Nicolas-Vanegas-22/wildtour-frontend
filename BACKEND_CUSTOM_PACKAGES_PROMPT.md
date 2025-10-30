# Guía de Implementación Backend: Sistema de Paquetes Personalizados

## Resumen General

Este documento proporciona una especificación completa para implementar el sistema de creación de paquetes personalizados en el backend de Wild Tour (API .NET). El sistema permite a los usuarios crear paquetes turísticos personalizados seleccionando servicios de múltiples categorías.

---

## Tabla de Contenidos

1. [Esquema de Base de Datos](#esquema-de-base-de-datos)
2. [Modelos C#](#modelos-c)
3. [Endpoints REST API](#endpoints-rest-api)
4. [Lógica de Negocio](#lógica-de-negocio)
5. [Reglas de Validación](#reglas-de-validación)
6. [Fases de Implementación](#fases-de-implementación)

---

## Esquema de Base de Datos

### Tabla: Services

Almacena todos los servicios disponibles en todas las categorías.

```sql
CREATE TABLE Services (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Category NVARCHAR(50) NOT NULL, -- 'alojamiento', 'alimentacion', 'recorrido', 'astronomicas', 'sitios_interes'
    Subcategory NVARCHAR(50) NOT NULL, -- 'hotel', 'hostel', 'camping', 'glamping', 'restaurante', etc.

    -- Precios
    BasePrice DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(10) DEFAULT 'COP',
    MinPersons INT NOT NULL DEFAULT 1,
    MaxPersons INT NOT NULL DEFAULT 10,

    -- Precios estacionales (multiplicadores)
    HighSeasonMultiplier DECIMAL(5,2) DEFAULT 1.3, -- 30% de incremento
    LowSeasonMultiplier DECIMAL(5,2) DEFAULT 0.9,  -- 10% de descuento

    -- Información adicional
    Images NVARCHAR(MAX), -- Array JSON de URLs de imágenes
    Location NVARCHAR(200),
    Rating DECIMAL(3,2) DEFAULT 0.0,
    TotalReviews INT DEFAULT 0,
    Features NVARCHAR(MAX), -- Array JSON de características

    -- Estado
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX IX_Services_Category ON Services(Category);
CREATE INDEX IX_Services_Subcategory ON Services(Subcategory);
CREATE INDEX IX_Services_IsActive ON Services(IsActive);
```

### Tabla: CustomPackages

Almacena los paquetes personalizados creados por los usuarios.

```sql
CREATE TABLE CustomPackages (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL, -- FK a tabla Users

    -- Detalles del paquete
    TotalPersons INT NOT NULL DEFAULT 1,
    Subtotal DECIMAL(18,2) NOT NULL DEFAULT 0,
    Taxes DECIMAL(18,2) NOT NULL DEFAULT 0, -- 19% IVA
    Total DECIMAL(18,2) NOT NULL DEFAULT 0,

    -- Estado
    Status NVARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft', 'saved', 'pending_payment', 'confirmed', 'cancelled'

    -- Metadata
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    ExpiresAt DATETIME2, -- Los borradores expiran después de 7 días

    -- Reserva vinculada (si se convirtió)
    BookingId UNIQUEIDENTIFIER NULL, -- FK a tabla Bookings

    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (BookingId) REFERENCES Bookings(Id)
);

CREATE INDEX IX_CustomPackages_UserId ON CustomPackages(UserId);
CREATE INDEX IX_CustomPackages_Status ON CustomPackages(Status);
CREATE INDEX IX_CustomPackages_ExpiresAt ON CustomPackages(ExpiresAt);
```

### Tabla: PackageServices

Tabla de unión que enlaza paquetes con servicios y detalles de cantidad.

```sql
CREATE TABLE PackageServices (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PackageId UNIQUEIDENTIFIER NOT NULL,
    ServiceId UNIQUEIDENTIFIER NOT NULL,

    -- Cantidad y snapshot de precios
    Persons INT NOT NULL,
    PricePerPerson DECIMAL(18,2) NOT NULL, -- Snapshot del precio al momento de la selección
    Subtotal DECIMAL(18,2) NOT NULL, -- Persons × PricePerPerson

    AddedAt DATETIME2 DEFAULT GETDATE(),

    FOREIGN KEY (PackageId) REFERENCES CustomPackages(Id) ON DELETE CASCADE,
    FOREIGN KEY (ServiceId) REFERENCES Services(Id)
);

CREATE INDEX IX_PackageServices_PackageId ON PackageServices(PackageId);
CREATE INDEX IX_PackageServices_ServiceId ON PackageServices(ServiceId);
```

---

## Modelos C#

### Enums

```csharp
public enum ServiceCategory
{
    Alojamiento,
    Alimentacion,
    Recorrido,
    Astronomicas,
    SitiosInteres
}

public enum ServiceSubcategory
{
    // Alojamiento
    Hotel,
    Hostel,
    Camping,
    Glamping,

    // Alimentación
    Restaurante,
    Estadero,

    // Recorrido
    GuiaTuristico,
    Cabalgata,
    Bicicleta,
    Cuatrimoto,

    // Astronómicas
    Observatorio,

    // Sitios de interés
    BalnearioNatural,
    Museo
}

public enum PackageStatus
{
    Draft,
    Saved,
    PendingPayment,
    Confirmed,
    Cancelled
}
```

### Modelos de Entidad

```csharp
public class Service
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public ServiceCategory Category { get; set; }
    public ServiceSubcategory Subcategory { get; set; }

    // Precios
    public decimal BasePrice { get; set; }
    public string Currency { get; set; } = "COP";
    public int MinPersons { get; set; } = 1;
    public int MaxPersons { get; set; } = 10;

    // Precios estacionales
    public decimal HighSeasonMultiplier { get; set; } = 1.3m;
    public decimal LowSeasonMultiplier { get; set; } = 0.9m;

    // Información adicional
    public List<string> Images { get; set; } = new();
    public string Location { get; set; }
    public decimal Rating { get; set; }
    public int TotalReviews { get; set; }
    public List<string> Features { get; set; } = new();

    // Estado
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navegación
    public ICollection<PackageService> PackageServices { get; set; }
}

public class CustomPackage
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    // Detalles del paquete
    public int TotalPersons { get; set; } = 1;
    public decimal Subtotal { get; set; }
    public decimal Taxes { get; set; } // 19% IVA
    public decimal Total { get; set; }

    // Estado
    public PackageStatus Status { get; set; } = PackageStatus.Draft;

    // Metadata
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }

    // Reserva vinculada
    public Guid? BookingId { get; set; }

    // Navegación
    public User User { get; set; }
    public Booking Booking { get; set; }
    public ICollection<PackageService> PackageServices { get; set; } = new List<PackageService>();
}

public class PackageService
{
    public Guid Id { get; set; }
    public Guid PackageId { get; set; }
    public Guid ServiceId { get; set; }

    // Cantidad y snapshot de precios
    public int Persons { get; set; }
    public decimal PricePerPerson { get; set; }
    public decimal Subtotal { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    // Navegación
    public CustomPackage Package { get; set; }
    public Service Service { get; set; }
}
```

### DTOs (Objetos de Transferencia de Datos)

```csharp
// DTOs de Request
public class CreateServiceDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public ServiceCategory Category { get; set; }
    public ServiceSubcategory Subcategory { get; set; }
    public decimal BasePrice { get; set; }
    public int MinPersons { get; set; } = 1;
    public int MaxPersons { get; set; } = 10;
    public decimal HighSeasonMultiplier { get; set; } = 1.3m;
    public decimal LowSeasonMultiplier { get; set; } = 0.9m;
    public List<string> Images { get; set; }
    public string Location { get; set; }
    public List<string> Features { get; set; }
}

public class AddServiceToPackageDto
{
    public Guid ServiceId { get; set; }
    public int Persons { get; set; }
}

public class CreatePackageDto
{
    public int TotalPersons { get; set; } = 1;
    public List<AddServiceToPackageDto> Services { get; set; } = new();
}

public class UpdatePackageDto
{
    public int? TotalPersons { get; set; }
    public List<AddServiceToPackageDto> ServicesToAdd { get; set; }
    public List<Guid> ServicesToRemove { get; set; }
}

// DTOs de Response
public class ServiceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public string Subcategory { get; set; }
    public ServicePricingDto Pricing { get; set; }
    public List<string> Images { get; set; }
    public string Location { get; set; }
    public decimal Rating { get; set; }
    public int TotalReviews { get; set; }
    public List<string> Features { get; set; }
}

public class ServicePricingDto
{
    public decimal BasePrice { get; set; }
    public string Currency { get; set; }
    public int MinPersons { get; set; }
    public int MaxPersons { get; set; }
    public SeasonalPricingDto SeasonalPricing { get; set; }
}

public class SeasonalPricingDto
{
    public decimal HighSeason { get; set; }
    public decimal LowSeason { get; set; }
}

public class PackageDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int TotalPersons { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Taxes { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public List<PackageServiceDto> Services { get; set; }
}

public class PackageServiceDto
{
    public Guid ServiceId { get; set; }
    public string ServiceName { get; set; }
    public string Category { get; set; }
    public int Persons { get; set; }
    public decimal PricePerPerson { get; set; }
    public decimal Subtotal { get; set; }
}

public class PackageSummaryDto
{
    public Guid Id { get; set; }
    public int TotalServices { get; set; }
    public int TotalPersons { get; set; }
    public Dictionary<string, ModuleSummaryDto> Modules { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Taxes { get; set; }
    public decimal Total { get; set; }
}

public class ModuleSummaryDto
{
    public int ServiceCount { get; set; }
    public decimal Subtotal { get; set; }
}
```

---

## Endpoints REST API

### Endpoints de Servicios

#### 1. Obtener Todos los Servicios (con filtros)

```
GET /api/Services?category={category}&subcategory={subcategory}&minPrice={minPrice}&maxPrice={maxPrice}
```

**Parámetros de Query:**
- `category` (opcional): Filtrar por categoría
- `subcategory` (opcional): Filtrar por subcategoría
- `minPrice` (opcional): Precio base mínimo
- `maxPrice` (opcional): Precio base máximo
- `isActive` (opcional): Filtrar servicios activos (por defecto: true)

**Respuesta:** `200 OK`
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Hotel Boutique Centro Histórico",
    "description": "Hotel de lujo en el corazón del centro histórico...",
    "category": "alojamiento",
    "subcategory": "hotel",
    "pricing": {
      "basePrice": 250000,
      "currency": "COP",
      "minPersons": 1,
      "maxPersons": 4,
      "seasonalPricing": {
        "highSeason": 1.3,
        "lowSeason": 0.9
      }
    },
    "images": [
      "https://example.com/hotel1.jpg"
    ],
    "location": "Centro Histórico, Villavieja",
    "rating": 4.5,
    "totalReviews": 128,
    "features": [
      "WiFi gratis",
      "Desayuno incluido",
      "Piscina"
    ]
  }
]
```

#### 2. Obtener Servicio por ID

```
GET /api/Services/{id}
```

**Respuesta:** `200 OK` (misma estructura que un servicio individual)

#### 3. Crear Servicio (Solo administradores)

```
POST /api/Services
Authorization: Bearer {token}
```

**Cuerpo de Request:**
```json
{
  "name": "Nuevo Servicio",
  "description": "Descripción detallada...",
  "category": "alojamiento",
  "subcategory": "hotel",
  "basePrice": 150000,
  "minPersons": 1,
  "maxPersons": 6,
  "highSeasonMultiplier": 1.3,
  "lowSeasonMultiplier": 0.9,
  "images": ["url1.jpg", "url2.jpg"],
  "location": "Villavieja",
  "features": ["WiFi", "Parqueadero"]
}
```

**Respuesta:** `201 Created`

#### 4. Actualizar Servicio (Solo administradores)

```
PUT /api/Services/{id}
Authorization: Bearer {token}
```

**Cuerpo de Request:** Igual que Crear

**Respuesta:** `200 OK`

#### 5. Eliminar Servicio (Solo administradores)

```
DELETE /api/Services/{id}
Authorization: Bearer {token}
```

**Respuesta:** `204 No Content`

---

### Endpoints de Paquetes Personalizados

#### 6. Crear o Actualizar Paquete

```
POST /api/Packages
Authorization: Bearer {token}
```

**Cuerpo de Request:**
```json
{
  "totalPersons": 2,
  "services": [
    {
      "serviceId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "persons": 2
    },
    {
      "serviceId": "7b234dc3-8a91-4d2f-9e5c-1a3b5c7d9e0f",
      "persons": 2
    }
  ]
}
```

**Respuesta:** `201 Created`
```json
{
  "id": "9c8e7a6b-5d4c-3f2e-1a0b-9c8d7e6f5a4b",
  "userId": "user-id-here",
  "totalPersons": 2,
  "subtotal": 500000,
  "taxes": 95000,
  "total": 595000,
  "status": "draft",
  "createdAt": "2025-10-27T10:30:00Z",
  "expiresAt": "2025-11-03T10:30:00Z",
  "services": [
    {
      "serviceId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "serviceName": "Hotel Boutique Centro Histórico",
      "category": "alojamiento",
      "persons": 2,
      "pricePerPerson": 250000,
      "subtotal": 500000
    }
  ]
}
```

#### 7. Obtener Mis Paquetes

```
GET /api/Packages/my?status={status}
Authorization: Bearer {token}
```

**Parámetros de Query:**
- `status` (opcional): Filtrar por estado (draft, saved, confirmed, etc.)

**Respuesta:** `200 OK` (array de paquetes)

#### 8. Obtener Paquete por ID

```
GET /api/Packages/{id}
Authorization: Bearer {token}
```

**Respuesta:** `200 OK` (detalles del paquete)

#### 9. Actualizar Paquete

```
PUT /api/Packages/{id}
Authorization: Bearer {token}
```

**Cuerpo de Request:**
```json
{
  "totalPersons": 3,
  "servicesToAdd": [
    {
      "serviceId": "new-service-id",
      "persons": 3
    }
  ],
  "servicesToRemove": [
    "service-id-to-remove"
  ]
}
```

**Respuesta:** `200 OK` (paquete actualizado)

#### 10. Eliminar Paquete

```
DELETE /api/Packages/{id}
Authorization: Bearer {token}
```

**Respuesta:** `204 No Content`

#### 11. Obtener Resumen del Paquete

```
GET /api/Packages/{id}/summary
Authorization: Bearer {token}
```

**Respuesta:** `200 OK`
```json
{
  "id": "package-id",
  "totalServices": 5,
  "totalPersons": 2,
  "modules": {
    "alojamiento": {
      "serviceCount": 1,
      "subtotal": 500000
    },
    "alimentacion": {
      "serviceCount": 2,
      "subtotal": 180000
    },
    "recorrido": {
      "serviceCount": 2,
      "subtotal": 320000
    }
  },
  "subtotal": 1000000,
  "taxes": 190000,
  "total": 1190000
}
```

#### 12. Checkout del Paquete (Convertir a Reserva)

```
POST /api/Packages/{id}/checkout
Authorization: Bearer {token}
```

**Descripción:** Convierte un paquete guardado en una reserva real en el sistema existente.

**Cuerpo de Request:**
```json
{
  "startDate": "2025-12-01",
  "endDate": "2025-12-05",
  "paymentMethod": "credit_card",
  "specialRequests": "Habitación con vista al desierto"
}
```

**Respuesta:** `200 OK`
```json
{
  "packageId": "package-id",
  "bookingId": "new-booking-id",
  "status": "pending_payment",
  "total": 1190000,
  "paymentUrl": "https://payment-gateway.com/checkout/xyz"
}
```

#### 13. Limpiar Paquetes Expirados (Trabajo en segundo plano)

```
POST /api/Packages/cleanup
Authorization: Bearer {admin-token}
```

**Descripción:** Elimina todos los paquetes borrador que han expirado (más de 7 días). Debe ejecutarse como un trabajo programado en segundo plano.

**Respuesta:** `200 OK`
```json
{
  "deletedCount": 42,
  "message": "Se limpiaron exitosamente 42 paquetes expirados"
}
```

---

### Endpoints Auxiliares Adicionales

#### 14. Obtener Categorías

```
GET /api/Services/categories
```

**Respuesta:** `200 OK`
```json
[
  {
    "key": "alojamiento",
    "name": "Alojamiento",
    "subcategories": ["hotel", "hostel", "camping", "glamping"]
  },
  {
    "key": "alimentacion",
    "name": "Alimentación",
    "subcategories": ["restaurante", "estadero"]
  },
  {
    "key": "recorrido",
    "name": "Recorrido",
    "subcategories": ["guia_turistico", "cabalgata", "bicicleta", "cuatrimoto"]
  },
  {
    "key": "astronomicas",
    "name": "Actividades Astronómicas",
    "subcategories": ["observatorio"]
  },
  {
    "key": "sitios_interes",
    "name": "Sitios de Interés",
    "subcategories": ["balneario_natural", "museo"]
  }
]
```

---

## Lógica de Negocio

### Cálculo de Precios

El cálculo de precios debe coincidir exactamente con la lógica del frontend:

```csharp
public class PackagePricingService
{
    private const decimal IVA_RATE = 0.19m; // 19% Impuesto Colombia

    public decimal CalculateServicePrice(Service service, int persons, bool isHighSeason = false)
    {
        // Validar cantidad de personas
        if (persons < service.MinPersons || persons > service.MaxPersons)
        {
            throw new ValidationException($"La cantidad de personas debe estar entre {service.MinPersons} y {service.MaxPersons}");
        }

        // Aplicar multiplicador estacional
        decimal multiplier = isHighSeason ? service.HighSeasonMultiplier : service.LowSeasonMultiplier;
        decimal pricePerPerson = service.BasePrice * multiplier;

        return pricePerPerson * persons;
    }

    public (decimal subtotal, decimal taxes, decimal total) CalculatePackageTotal(CustomPackage package)
    {
        decimal subtotal = 0;

        foreach (var ps in package.PackageServices)
        {
            subtotal += ps.Subtotal;
        }

        decimal taxes = Math.Round(subtotal * IVA_RATE, 0); // Redondear al peso más cercano
        decimal total = subtotal + taxes;

        return (subtotal, taxes, total);
    }

    public void RecalculatePackage(CustomPackage package, bool isHighSeason = false)
    {
        // Recalcular todos los subtotales de servicios
        foreach (var ps in package.PackageServices)
        {
            ps.Subtotal = ps.Persons * ps.PricePerPerson;
        }

        // Calcular totales
        var (subtotal, taxes, total) = CalculatePackageTotal(package);

        package.Subtotal = subtotal;
        package.Taxes = taxes;
        package.Total = total;
        package.UpdatedAt = DateTime.UtcNow;
    }
}
```

### Lógica de Expiración de Paquetes

```csharp
public class PackageExpirationService
{
    private const int DRAFT_EXPIRATION_DAYS = 7;

    public DateTime CalculateExpirationDate(PackageStatus status)
    {
        if (status == PackageStatus.Draft)
        {
            return DateTime.UtcNow.AddDays(DRAFT_EXPIRATION_DAYS);
        }

        return DateTime.MaxValue; // Los paquetes guardados no expiran
    }

    public async Task<int> CleanupExpiredPackages(DbContext context)
    {
        var expiredPackages = await context.CustomPackages
            .Where(p => p.Status == PackageStatus.Draft && p.ExpiresAt < DateTime.UtcNow)
            .ToListAsync();

        context.CustomPackages.RemoveRange(expiredPackages);
        await context.SaveChangesAsync();

        return expiredPackages.Count;
    }
}
```

### Lógica de Checkout

```csharp
public class PackageCheckoutService
{
    public async Task<Booking> CheckoutPackage(
        Guid packageId,
        Guid userId,
        DateTime startDate,
        DateTime endDate,
        string paymentMethod,
        string specialRequests)
    {
        var package = await _context.CustomPackages
            .Include(p => p.PackageServices)
            .ThenInclude(ps => ps.Service)
            .FirstOrDefaultAsync(p => p.Id == packageId && p.UserId == userId);

        if (package == null)
            throw new NotFoundException("Paquete no encontrado");

        if (package.Status == PackageStatus.Confirmed)
            throw new ValidationException("El paquete ya está confirmado");

        // Validar que todos los servicios sigan disponibles
        foreach (var ps in package.PackageServices)
        {
            if (!ps.Service.IsActive)
                throw new ValidationException($"El servicio {ps.Service.Name} ya no está disponible");
        }

        // Crear reserva desde el paquete
        var booking = new Booking
        {
            UserId = userId,
            StartDate = startDate,
            EndDate = endDate,
            TotalAmount = package.Total,
            Status = BookingStatus.PendingPayment,
            PaymentMethod = paymentMethod,
            SpecialRequests = specialRequests,
            CreatedAt = DateTime.UtcNow
        };

        _context.Bookings.Add(booking);

        // Vincular paquete a la reserva
        package.BookingId = booking.Id;
        package.Status = PackageStatus.PendingPayment;
        package.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return booking;
    }
}
```

---

## Reglas de Validación

### Validación de Servicios

- `Name`: Requerido, máximo 200 caracteres
- `Description`: Requerido, máximo 2000 caracteres
- `Category`: Debe ser un valor enum válido
- `Subcategory`: Debe ser un valor enum válido que coincida con la categoría
- `BasePrice`: Debe ser > 0
- `MinPersons`: Debe ser >= 1
- `MaxPersons`: Debe ser > MinPersons
- `HighSeasonMultiplier`: Debe ser >= 1.0
- `LowSeasonMultiplier`: Debe estar entre 0.5 y 1.0

### Validación de Paquetes

- `UserId`: Debe ser un usuario autenticado
- `TotalPersons`: Debe ser >= 1
- `Services`: Debe tener al menos 1 servicio
- `Service.Persons`: Debe estar entre MinPersons y MaxPersons del servicio
- Modificación de paquete: Solo el propietario puede modificar
- Checkout de paquete: Debe estar en estado 'draft' o 'saved'

### Ejemplo de Atributo de Validación

```csharp
public class ValidatePackageAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        var dto = value as CreatePackageDto;

        if (dto == null)
            return new ValidationResult("Datos de paquete inválidos");

        if (dto.TotalPersons < 1)
            return new ValidationResult("El total de personas debe ser al menos 1");

        if (dto.Services == null || !dto.Services.Any())
            return new ValidationResult("El paquete debe contener al menos un servicio");

        foreach (var service in dto.Services)
        {
            if (service.Persons < 1)
                return new ValidationResult($"Las personas del servicio deben ser al menos 1");
        }

        return ValidationResult.Success;
    }
}
```

---

## Consideraciones de Seguridad

1. **Autenticación**: Todos los endpoints de paquetes requieren autenticación JWT
2. **Autorización**: Los usuarios solo pueden ver/modificar sus propios paquetes
3. **Solo administradores**: Las operaciones CRUD de servicios están restringidas a usuarios administradores
4. **Validación de entrada**: Sanitizar todas las entradas de usuario para prevenir inyección SQL
5. **Limitación de tasa**: Implementar limitación de tasa en la creación de paquetes (máximo 10 por hora por usuario)
6. **Integridad de precios**: Siempre recalcular precios del lado del servidor, nunca confiar en precios del cliente

---

## Fases de Implementación

### Fase 1: Esencial (Semana 1)

**Prioridad: CRÍTICA**

- [ ] Crear tablas de base de datos (Services, CustomPackages, PackageServices)
- [ ] Implementar entidad Service y CRUD básico
- [ ] Implementar GET /api/Services con filtros
- [ ] Implementar entidad CustomPackage
- [ ] Implementar POST /api/Packages (crear paquete)
- [ ] Implementar GET /api/Packages/my (listar paquetes del usuario)
- [ ] Implementar GET /api/Packages/{id} (detalles del paquete)
- [ ] Servicio de cálculo de precios con IVA del 19%
- [ ] Poblar base de datos con servicios iniciales (30+ servicios de prueba)

**Entregable**: El frontend puede obtener servicios y crear paquetes

### Fase 2: CRUD Completo (Semana 2)

**Prioridad: ALTA**

- [ ] Implementar PUT /api/Packages/{id} (actualizar paquete)
- [ ] Implementar DELETE /api/Packages/{id}
- [ ] Implementar GET /api/Packages/{id}/summary
- [ ] Implementar POST /api/Packages/{id}/checkout (versión básica)
- [ ] Lógica de expiración de paquetes (7 días para borradores)
- [ ] Trabajo en segundo plano para limpieza de paquetes expirados
- [ ] Endpoints de administrador para gestión de servicios

**Entregable**: Gestión completa del ciclo de vida del paquete

### Fase 3: Características Avanzadas (Semana 3+)

**Prioridad: MEDIA**

- [ ] Estadísticas y análisis de paquetes
- [ ] Recomendaciones de paquetes populares
- [ ] Calendario de disponibilidad de servicios
- [ ] Integración con pasarela de pago
- [ ] Notificaciones por correo (paquete guardado, próximo a expirar, confirmado)
- [ ] Compartir paquete (compartir paquete con amigos)
- [ ] Funcionalidad de duplicar paquete

**Entregable**: Experiencia de usuario mejorada

---

## Lista de Verificación de Pruebas

### Pruebas Unitarias

- [ ] Cálculo de precios con diferentes cantidades de personas
- [ ] Multiplicadores de precios estacionales
- [ ] Cálculo de IVA (19%)
- [ ] Fechas de expiración de paquetes
- [ ] Reglas de validación

### Pruebas de Integración

- [ ] Crear paquete con múltiples servicios
- [ ] Actualizar paquete (agregar/eliminar servicios)
- [ ] Flujo de checkout (paquete → reserva)
- [ ] Limpieza de paquetes expirados
- [ ] Autorización de usuario (no puede modificar paquetes de otros)

### Pruebas de Rendimiento

- [ ] Cargar 1000+ servicios con filtros
- [ ] Crear paquete con 10+ servicios
- [ ] Modificaciones concurrentes de paquetes
- [ ] Optimización de consultas de base de datos (consultas N+1)

---

## Ejemplo de Datos de Semilla de Base de Datos

```csharp
public class ServiceSeeder
{
    public static List<Service> GetSeedServices()
    {
        return new List<Service>
        {
            // Alojamiento - Hoteles
            new Service
            {
                Name = "Hotel Boutique Centro Histórico",
                Description = "Hotel de lujo en el corazón del centro histórico de Villavieja",
                Category = ServiceCategory.Alojamiento,
                Subcategory = ServiceSubcategory.Hotel,
                BasePrice = 250000,
                MinPersons = 1,
                MaxPersons = 4,
                Images = new List<string> { "/images/hotels/boutique-1.jpg" },
                Location = "Centro Histórico, Villavieja",
                Features = new List<string>
                {
                    "WiFi gratis",
                    "Desayuno incluido",
                    "Piscina",
                    "Aire acondicionado",
                    "Estacionamiento"
                },
                IsActive = true
            },

            // Alojamiento - Hostales
            new Service
            {
                Name = "Hostal Estrella del Desierto",
                Description = "Hostal económico con ambiente familiar y acceso rápido al desierto",
                Category = ServiceCategory.Alojamiento,
                Subcategory = ServiceSubcategory.Hostel,
                BasePrice = 80000,
                MinPersons = 1,
                MaxPersons = 2,
                Images = new List<string> { "/images/hostels/estrella-1.jpg" },
                Location = "Entrada al desierto",
                Features = new List<string>
                {
                    "WiFi gratis",
                    "Cocina compartida",
                    "Terraza con hamacas",
                    "Tours incluidos"
                },
                IsActive = true
            },

            // Alojamiento - Camping
            new Service
            {
                Name = "Camping Bajo las Estrellas",
                Description = "Experiencia de camping con todas las comodidades en pleno desierto",
                Category = ServiceCategory.Alojamiento,
                Subcategory = ServiceSubcategory.Camping,
                BasePrice = 50000,
                MinPersons = 1,
                MaxPersons = 6,
                Images = new List<string> { "/images/camping/estrellas-1.jpg" },
                Location = "Desierto de la Tatacoa - Sector Rojo",
                Features = new List<string>
                {
                    "Carpas incluidas",
                    "Baños compartidos",
                    "Fogata nocturna",
                    "Vista a las estrellas"
                },
                IsActive = true
            },

            // Alojamiento - Glamping
            new Service
            {
                Name = "Glamping Tatacoa Luxury",
                Description = "Experiencia premium de glamping con todas las comodidades",
                Category = ServiceCategory.Alojamiento,
                Subcategory = ServiceSubcategory.Glamping,
                BasePrice = 350000,
                MinPersons = 2,
                MaxPersons = 4,
                Images = new List<string> { "/images/glamping/luxury-1.jpg" },
                Location = "Mirador Los Hoyos",
                Features = new List<string>
                {
                    "Tienda de lujo",
                    "Baño privado",
                    "Cama king size",
                    "Desayuno gourmet",
                    "Observación astronómica"
                },
                IsActive = true
            },

            // Alimentación - Restaurantes
            new Service
            {
                Name = "Restaurante El Desierto",
                Description = "Gastronomía típica de la región con vista al desierto de la Tatacoa",
                Category = ServiceCategory.Alimentacion,
                Subcategory = ServiceSubcategory.Restaurante,
                BasePrice = 45000,
                MinPersons = 1,
                MaxPersons = 10,
                Images = new List<string> { "/images/restaurants/desierto-1.jpg" },
                Location = "Sector Los Hoyos",
                Features = new List<string>
                {
                    "Comida típica huilense",
                    "Vista panorámica",
                    "Zona infantil",
                    "Terraza al aire libre"
                },
                IsActive = true
            },

            new Service
            {
                Name = "Restaurante La Tatacoa",
                Description = "Cocina regional con ingredientes locales y recetas tradicionales",
                Category = ServiceCategory.Alimentacion,
                Subcategory = ServiceSubcategory.Restaurante,
                BasePrice = 38000,
                MinPersons = 1,
                MaxPersons = 8,
                Images = new List<string> { "/images/restaurants/tatacoa-1.jpg" },
                Location = "Centro de Villavieja",
                Features = new List<string>
                {
                    "Menú del día",
                    "Platos a la carta",
                    "Jugos naturales",
                    "Postres caseros"
                },
                IsActive = true
            },

            // Alimentación - Estaderos
            new Service
            {
                Name = "Estadero El Mirador",
                Description = "Estadero familiar con piscina y comida típica",
                Category = ServiceCategory.Alimentacion,
                Subcategory = ServiceSubcategory.Estadero,
                BasePrice = 55000,
                MinPersons = 2,
                MaxPersons = 12,
                Images = new List<string> { "/images/estaderos/mirador-1.jpg" },
                Location = "Vía a Villavieja",
                Features = new List<string>
                {
                    "Piscina",
                    "Zona de juegos",
                    "Parqueadero",
                    "Almuerzos típicos"
                },
                IsActive = true
            },

            new Service
            {
                Name = "Estadero Las Palmeras",
                Description = "Espacio natural con zona verde y gastronomía regional",
                Category = ServiceCategory.Alimentacion,
                Subcategory = ServiceSubcategory.Estadero,
                BasePrice = 48000,
                MinPersons = 2,
                MaxPersons = 10,
                Images = new List<string> { "/images/estaderos/palmeras-1.jpg" },
                Location = "Entrada norte Villavieja",
                Features = new List<string>
                {
                    "Zona verde amplia",
                    "Kioscos cubiertos",
                    "Comida a la parrilla",
                    "Bebidas refrescantes"
                },
                IsActive = true
            },

            // Recorrido - Guías Turísticos
            new Service
            {
                Name = "Tour Guiado Desierto Completo",
                Description = "Recorrido completo por el desierto con guía experto",
                Category = ServiceCategory.Recorrido,
                Subcategory = ServiceSubcategory.GuiaTuristico,
                BasePrice = 120000,
                MinPersons = 1,
                MaxPersons = 10,
                Images = new List<string> { "/images/tours/completo-1.jpg" },
                Location = "Punto de encuentro: Centro Villavieja",
                Features = new List<string>
                {
                    "Guía certificado",
                    "Recorrido 4 horas",
                    "Visita sector rojo y gris",
                    "Hidratación incluida",
                    "Fotografías"
                },
                IsActive = true
            },

            new Service
            {
                Name = "Tour Nocturno Astronómico",
                Description = "Experiencia nocturna de observación de estrellas con guía especializado",
                Category = ServiceCategory.Recorrido,
                Subcategory = ServiceSubcategory.GuiaTuristico,
                BasePrice = 95000,
                MinPersons = 2,
                MaxPersons = 15,
                Images = new List<string> { "/images/tours/nocturno-1.jpg" },
                Location = "Observatorio Tatacoa",
                Features = new List<string>
                {
                    "Guía astronómico",
                    "Telescopios profesionales",
                    "Charla educativa",
                    "Duración 2 horas"
                },
                IsActive = true
            },

            // Recorrido - Cabalgatas
            new Service
            {
                Name = "Cabalgata al Atardecer",
                Description = "Paseo a caballo al atardecer por el desierto de la Tatacoa",
                Category = ServiceCategory.Recorrido,
                Subcategory = ServiceSubcategory.Cabalgata,
                BasePrice = 80000,
                MinPersons = 1,
                MaxPersons = 6,
                Images = new List<string> { "/images/horseback/atardecer-1.jpg" },
                Location = "Rancho Las Colinas",
                Features = new List<string>
                {
                    "Caballos mansos",
                    "Guía experto",
                    "Equipo de seguridad",
                    "Duración 2 horas",
                    "Fotografías"
                },
                IsActive = true
            },

            // Recorrido - Bicicletas
            new Service
            {
                Name = "Tour en Bicicleta Todo Terreno",
                Description = "Aventura en bicicleta por los senderos del desierto",
                Category = ServiceCategory.Recorrido,
                Subcategory = ServiceSubcategory.Bicicleta,
                BasePrice = 65000,
                MinPersons = 1,
                MaxPersons = 8,
                Images = new List<string> { "/images/bikes/tour-1.jpg" },
                Location = "Centro de Villavieja",
                Features = new List<string>
                {
                    "Bicicleta todo terreno",
                    "Casco y protecciones",
                    "Guía acompañante",
                    "Agua incluida",
                    "3 horas de recorrido"
                },
                IsActive = true
            },

            // Recorrido - Cuatrimotos
            new Service
            {
                Name = "Safari en Cuatrimoto",
                Description = "Aventura extrema en cuatrimoto por el desierto",
                Category = ServiceCategory.Recorrido,
                Subcategory = ServiceSubcategory.Cuatrimoto,
                BasePrice = 150000,
                MinPersons = 1,
                MaxPersons = 4,
                Images = new List<string> { "/images/atv/safari-1.jpg" },
                Location = "Base ATV Tatacoa",
                Features = new List<string>
                {
                    "Cuatrimoto 250cc",
                    "Equipo de seguridad completo",
                    "Instructor certificado",
                    "Recorrido 2 horas",
                    "Gasolina incluida"
                },
                IsActive = true
            },

            // Actividades Astronómicas
            new Service
            {
                Name = "Observatorio Astronómico Tatacoa",
                Description = "Sesión de observación astronómica en el observatorio principal",
                Category = ServiceCategory.Astronomicas,
                Subcategory = ServiceSubcategory.Observatorio,
                BasePrice = 75000,
                MinPersons = 1,
                MaxPersons = 20,
                Images = new List<string> { "/images/observatory/main-1.jpg" },
                Location = "Observatorio Tatacoa",
                Features = new List<string>
                {
                    "Telescopios profesionales",
                    "Charla educativa",
                    "Astrónomos expertos",
                    "Observación planetaria",
                    "Duración 1.5 horas"
                },
                IsActive = true
            },

            new Service
            {
                Name = "Experiencia Premium de Astroturismo",
                Description = "Experiencia VIP de observación astronómica con cena incluida",
                Category = ServiceCategory.Astronomicas,
                Subcategory = ServiceSubcategory.Observatorio,
                BasePrice = 180000,
                MinPersons = 2,
                MaxPersons = 10,
                Images = new List<string> { "/images/observatory/premium-1.jpg" },
                Location = "Observatorio VIP",
                Features = new List<string>
                {
                    "Telescopios de alta gama",
                    "Cena gourmet",
                    "Sesión privada",
                    "Fotografía astronómica",
                    "Certificado de participación",
                    "Duración 3 horas"
                },
                IsActive = true
            },

            // Sitios de Interés - Balnearios
            new Service
            {
                Name = "Balneario Natural Los Hoyos",
                Description = "Piscina natural con aguas cristalinas en medio del desierto",
                Category = ServiceCategory.SitiosInteres,
                Subcategory = ServiceSubcategory.BalnearioNatural,
                BasePrice = 15000,
                MinPersons = 1,
                MaxPersons = 50,
                Images = new List<string> { "/images/pools/hoyos-1.jpg" },
                Location = "Sector Los Hoyos",
                Features = new List<string>
                {
                    "Piscina natural",
                    "Zona de descanso",
                    "Vestieros",
                    "Kioscos cubiertos",
                    "Venta de alimentos"
                },
                IsActive = true
            },

            // Sitios de Interés - Museos
            new Service
            {
                Name = "Museo Paleontológico de Villavieja",
                Description = "Descubre la historia prehistórica de la región",
                Category = ServiceCategory.SitiosInteres,
                Subcategory = ServiceSubcategory.Museo,
                BasePrice = 12000,
                MinPersons = 1,
                MaxPersons = 30,
                Images = new List<string> { "/images/museums/paleo-1.jpg" },
                Location = "Centro de Villavieja",
                Features = new List<string>
                {
                    "Fósiles originales",
                    "Guía incluida",
                    "Recorrido educativo",
                    "Exposiciones permanentes",
                    "Tienda de souvenirs"
                },
                IsActive = true
            },

            new Service
            {
                Name = "Centro de Interpretación del Desierto",
                Description = "Aprende sobre la formación geológica y ecosistema del desierto",
                Category = ServiceCategory.SitiosInteres,
                Subcategory = ServiceSubcategory.Museo,
                BasePrice = 18000,
                MinPersons = 1,
                MaxPersons = 25,
                Images = new List<string> { "/images/museums/desert-1.jpg" },
                Location = "Entrada al desierto",
                Features = new List<string>
                {
                    "Exhibiciones interactivas",
                    "Videos educativos",
                    "Maquetas del desierto",
                    "Información geológica",
                    "Zona de lectura"
                },
                IsActive = true
            }
        };
    }
}
```

---

## Ejemplo de Implementación de Controlador

```csharp
[ApiController]
[Route("api/[controller]")]
public class PackagesController : ControllerBase
{
    private readonly IPackageService _packageService;
    private readonly ICurrentUserService _currentUser;

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<PackageDto>> CreatePackage([FromBody] CreatePackageDto dto)
    {
        var userId = _currentUser.GetUserId();
        var package = await _packageService.CreatePackageAsync(userId, dto);
        return CreatedAtAction(nameof(GetPackage), new { id = package.Id }, package);
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<ActionResult<List<PackageDto>>> GetMyPackages([FromQuery] string? status = null)
    {
        var userId = _currentUser.GetUserId();
        var packages = await _packageService.GetUserPackagesAsync(userId, status);
        return Ok(packages);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<PackageDto>> GetPackage(Guid id)
    {
        var userId = _currentUser.GetUserId();
        var package = await _packageService.GetPackageAsync(id, userId);

        if (package == null)
            return NotFound();

        return Ok(package);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<PackageDto>> UpdatePackage(Guid id, [FromBody] UpdatePackageDto dto)
    {
        var userId = _currentUser.GetUserId();
        var package = await _packageService.UpdatePackageAsync(id, userId, dto);
        return Ok(package);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> DeletePackage(Guid id)
    {
        var userId = _currentUser.GetUserId();
        await _packageService.DeletePackageAsync(id, userId);
        return NoContent();
    }

    [HttpGet("{id}/summary")]
    [Authorize]
    public async Task<ActionResult<PackageSummaryDto>> GetPackageSummary(Guid id)
    {
        var userId = _currentUser.GetUserId();
        var summary = await _packageService.GetPackageSummaryAsync(id, userId);
        return Ok(summary);
    }

    [HttpPost("{id}/checkout")]
    [Authorize]
    public async Task<ActionResult<CheckoutResponseDto>> Checkout(
        Guid id,
        [FromBody] CheckoutRequestDto dto)
    {
        var userId = _currentUser.GetUserId();
        var result = await _packageService.CheckoutAsync(id, userId, dto);
        return Ok(result);
    }

    [HttpPost("cleanup")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CleanupResultDto>> CleanupExpiredPackages()
    {
        var result = await _packageService.CleanupExpiredPackagesAsync();
        return Ok(result);
    }
}
```

---

## Próximos Pasos

1. Revisar esta especificación con tu equipo de backend
2. Confirmar que el esquema de base de datos coincide con tu arquitectura existente
3. Priorizar la implementación de la Fase 1
4. Configurar el entorno de desarrollo con datos de semilla
5. Crear documentación de API usando Swagger/OpenAPI
6. Coordinar con el frontend para pruebas de integración

---

## ¿Preguntas o Aclaraciones?

Si necesitas aclaraciones sobre algún endpoint, estructura de datos o lógica de negocio, consulta este documento y la implementación del frontend en:

- Tipos del frontend: `src/domain/models/CustomPackage.ts`
- Store del frontend: `src/application/state/usePackageStore.ts`
- Componentes del frontend: `src/presentation/components/package/*`
- Datos de prueba: `src/data/customPackageServices.ts`

---

**Versión del Documento**: 1.0
**Última Actualización**: 27 de Octubre, 2025
**Autor**: Equipo de Desarrollo Wild Tour
