# Sistema de Gestión de Servicios de Proveedores - Backend Wild Tour

## 📋 Resumen Ejecutivo

Implementar un sistema completo en el backend de Wild Tour que permita a los proveedores de servicios turísticos registrar, gestionar y publicar sus servicios, además de recibir y gestionar reseñas de los turistas.

---

## 🎯 Objetivos

1. **Permitir a proveedores** registrar y gestionar sus propios servicios turísticos
2. **Gestionar imágenes** con almacenamiento en la nube (Azure Blob Storage, AWS S3, o Cloudinary)
3. **Sistema de calificaciones** y reseñas de turistas
4. **Control de visibilidad** (activar/desactivar servicios)
5. **Validaciones de negocio** robustas
6. **API REST** completa con autenticación y autorización

---

## 📊 Esquema de Base de Datos

### 1. Tabla: ProviderServices

```sql
CREATE TABLE ProviderServices (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ProviderId UNIQUEIDENTIFIER NOT NULL,

    -- Información básica
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(500) NOT NULL,
    Category NVARCHAR(50) NOT NULL, -- 'alojamiento', 'alimentacion', 'recorrido', 'astronomicas', 'sitios_interes'
    Price DECIMAL(18, 2) NOT NULL,

    -- Estado
    IsActive BIT NOT NULL DEFAULT 1,
    IsApproved BIT NOT NULL DEFAULT 0, -- Requiere aprobación de admin

    -- Estadísticas
    AverageRating DECIMAL(3, 2) DEFAULT 0,
    ReviewCount INT DEFAULT 0,
    ViewCount INT DEFAULT 0,
    BookingCount INT DEFAULT 0,

    -- Auditoría
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    DeletedAt DATETIME2 NULL, -- Soft delete

    FOREIGN KEY (ProviderId) REFERENCES Users(Id),

    CONSTRAINT CK_ProviderServices_Category CHECK (Category IN ('alojamiento', 'alimentacion', 'recorrido', 'astronomicas', 'sitios_interes')),
    CONSTRAINT CK_ProviderServices_Price CHECK (Price >= 0),
    CONSTRAINT CK_ProviderServices_Rating CHECK (AverageRating BETWEEN 0 AND 5)
);

CREATE INDEX IX_ProviderServices_ProviderId ON ProviderServices(ProviderId);
CREATE INDEX IX_ProviderServices_Category ON ProviderServices(Category);
CREATE INDEX IX_ProviderServices_IsActive ON ProviderServices(IsActive);
CREATE INDEX IX_ProviderServices_IsApproved ON ProviderServices(IsApproved);
```

### 2. Tabla: ServiceImages

```sql
CREATE TABLE ServiceImages (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ServiceId UNIQUEIDENTIFIER NOT NULL,

    -- Imagen
    Url NVARCHAR(500) NOT NULL,
    BlobName NVARCHAR(200) NOT NULL, -- Nombre en el storage
    Alt NVARCHAR(200),
    IsPrimary BIT DEFAULT 0,
    DisplayOrder INT DEFAULT 0,

    -- Metadata
    FileSize INT, -- En bytes
    MimeType NVARCHAR(50),
    Width INT,
    Height INT,

    UploadedAt DATETIME2 DEFAULT GETDATE(),

    FOREIGN KEY (ServiceId) REFERENCES ProviderServices(Id) ON DELETE CASCADE
);

CREATE INDEX IX_ServiceImages_ServiceId ON ServiceImages(ServiceId);
CREATE INDEX IX_ServiceImages_IsPrimary ON ServiceImages(IsPrimary);
```

### 3. Tabla: ServiceReviews

```sql
CREATE TABLE ServiceReviews (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ServiceId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,

    -- Contenido
    Rating INT NOT NULL, -- 1 a 5
    Comment NVARCHAR(1000) NOT NULL,

    -- Estado
    IsApproved BIT DEFAULT 1, -- Puede requerir moderación
    IsEdited BIT DEFAULT 0,

    -- Respuesta del proveedor
    ProviderResponse NVARCHAR(1000) NULL,
    ResponseDate DATETIME2 NULL,

    -- Auditoría
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    DeletedAt DATETIME2 NULL,

    FOREIGN KEY (ServiceId) REFERENCES ProviderServices(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id),

    CONSTRAINT CK_ServiceReviews_Rating CHECK (Rating BETWEEN 1 AND 5),
    CONSTRAINT UQ_ServiceReviews_UserService UNIQUE (ServiceId, UserId) -- Un usuario solo puede reseñar una vez por servicio
);

CREATE INDEX IX_ServiceReviews_ServiceId ON ServiceReviews(ServiceId);
CREATE INDEX IX_ServiceReviews_UserId ON ServiceReviews(UserId);
CREATE INDEX IX_ServiceReviews_Rating ON ServiceReviews(Rating);
```

---

## 📡 API REST Endpoints

### SERVICIOS DEL PROVEEDOR

#### 1. Obtener servicios del proveedor

```http
GET /api/provider/services
Authorization: Bearer {token}
Query Parameters:
  - page: int (default: 1)
  - pageSize: int (default: 10)
  - category: string (opcional)
  - isActive: bool (opcional)
```

**Response 200 OK:**
```json
{
  "services": [
    {
      "id": "uuid",
      "providerId": "uuid",
      "name": "Hotel Vista Hermosa",
      "description": "Hotel sencillo con vista al desierto...",
      "category": "alojamiento",
      "price": 80000,
      "images": [
        {
          "id": "uuid",
          "url": "https://cdn.wildtour.com/images/...",
          "alt": "Vista frontal del hotel",
          "isPrimary": true
        }
      ],
      "isActive": true,
      "averageRating": 4.5,
      "reviewCount": 23,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-20T14:45:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "pageSize": 10
}
```

---

#### 2. Crear nuevo servicio

```http
POST /api/provider/services
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
name: "Hotel Vista Hermosa"
description: "Hotel sencillo con vista al desierto y todas las comodidades básicas..."
category: "alojamiento"
price: 80000
images: [File, File, File] (máximo 3)
```

**Response 201 Created:**
```json
{
  "id": "uuid",
  "providerId": "uuid",
  "name": "Hotel Vista Hermosa",
  "description": "Hotel sencillo con vista al desierto...",
  "category": "alojamiento",
  "price": 80000,
  "images": [
    {
      "id": "uuid",
      "url": "https://cdn.wildtour.com/images/service-123-1.jpg",
      "isPrimary": true
    }
  ],
  "isActive": true,
  "averageRating": 0,
  "reviewCount": 0,
  "createdAt": "2025-11-01T15:30:00Z",
  "updatedAt": "2025-11-01T15:30:00Z"
}
```

**Validaciones:**
- `name`: Requerido, entre 5 y 200 caracteres
- `description`: Requerido, entre 10 y 500 caracteres
- `category`: Requerido, debe ser una categoría válida
- `price`: Requerido, mayor a 0
- `images`: Mínimo 1, máximo 3 imágenes
- Formatos de imagen: JPG, PNG, WEBP
- Tamaño máximo por imagen: 5MB
- Proveedor debe tener RNT verificado

---

#### 3. Actualizar servicio

```http
PUT /api/provider/services/{id}
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
name: "Hotel Vista Hermosa Premium" (opcional)
description: "..." (opcional)
category: "alojamiento" (opcional)
price: 95000 (opcional)
images: [File] (opcional - nuevas imágenes)
existingImages: ["url1", "url2"] (opcional - URLs de imágenes existentes a mantener)
```

**Response 200 OK:**
```json
{
  "id": "uuid",
  "name": "Hotel Vista Hermosa Premium",
  "price": 95000,
  // ... resto del servicio actualizado
}
```

---

#### 4. Eliminar servicio

```http
DELETE /api/provider/services/{id}
Authorization: Bearer {token}
```

**Response 204 No Content**

**Validaciones:**
- Solo el propietario del servicio puede eliminarlo
- Si tiene reservas pendientes o confirmadas, no se puede eliminar (soft delete)

---

#### 5. Activar/Desactivar servicio

```http
PATCH /api/provider/services/{id}/status
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "isActive": true
}
```

**Response 200 OK:**
```json
{
  "id": "uuid",
  "isActive": true,
  "updatedAt": "2025-11-01T16:00:00Z"
}
```

---

### RESEÑAS

#### 6. Obtener reseñas de un servicio

```http
GET /api/services/{serviceId}/reviews
Query Parameters:
  - page: int (default: 1)
  - pageSize: int (default: 10)
```

**Response 200 OK:**
```json
{
  "reviews": [
    {
      "id": "uuid",
      "serviceId": "uuid",
      "userId": "uuid",
      "userName": "Juan Pérez",
      "userAvatar": "https://cdn.wildtour.com/avatars/...",
      "rating": 5,
      "comment": "Excelente servicio, muy recomendado. La atención fue impecable.",
      "createdAt": "2025-10-28T10:00:00Z",
      "updatedAt": "2025-10-28T10:00:00Z"
    }
  ],
  "total": 23,
  "averageRating": 4.5
}
```

---

#### 7. Crear reseña (Solo turistas)

```http
POST /api/reviews
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "serviceId": "uuid",
  "rating": 5,
  "comment": "Excelente servicio, muy recomendado..."
}
```

**Response 201 Created:**
```json
{
  "id": "uuid",
  "serviceId": "uuid",
  "userId": "uuid",
  "userName": "Juan Pérez",
  "rating": 5,
  "comment": "Excelente servicio...",
  "createdAt": "2025-11-01T16:30:00Z"
}
```

**Validaciones:**
- Usuario debe tener rol de "user" (turista)
- `rating`: Entre 1 y 5
- `comment`: Entre 10 y 1000 caracteres
- Usuario solo puede dejar una reseña por servicio
- Idealmente, usuario debería tener una reserva completada del servicio

---

#### 8. Actualizar reseña

```http
PUT /api/reviews/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Actualizo mi reseña..."
}
```

---

#### 9. Eliminar reseña

```http
DELETE /api/reviews/{id}
Authorization: Bearer {token}
```

**Response 204 No Content**

---

## 💾 Almacenamiento de Imágenes

### Opción 1: Azure Blob Storage (Recomendado)

```csharp
public interface IImageStorageService
{
    Task<string> UploadImageAsync(IFormFile file, string containerName);
    Task<bool> DeleteImageAsync(string blobName, string containerName);
    Task<List<string>> UploadMultipleImagesAsync(List<IFormFile> files, string containerName);
}

public class AzureBlobStorageService : IImageStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _containerName = "provider-services";

    public async Task<string> UploadImageAsync(IFormFile file, string containerName)
    {
        // Generar nombre único
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

        // Obtener container
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

        // Subir archivo
        var blobClient = containerClient.GetBlobClient(fileName);
        await blobClient.UploadAsync(file.OpenReadStream(), new BlobHttpHeaders
        {
            ContentType = file.ContentType
        });

        return blobClient.Uri.ToString();
    }

    public async Task<bool> DeleteImageAsync(string blobName, string containerName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        var blobClient = containerClient.GetBlobClient(blobName);
        return await blobClient.DeleteIfExistsAsync();
    }
}
```

### Configuración en appsettings.json

```json
{
  "AzureBlobStorage": {
    "ConnectionString": "DefaultEndpointsProtocol=https;AccountName=...",
    "ContainerName": "provider-services"
  },
  "ImageUpload": {
    "MaxFileSize": 5242880,
    "AllowedExtensions": [".jpg", ".jpeg", ".png", ".webp"],
    "MaxImagesPerService": 3
  }
}
```

---

## 🔧 Modelos C#

### DTOs

```csharp
// Request para crear servicio
public class CreateServiceRequest
{
    [Required(ErrorMessage = "El nombre es requerido")]
    [StringLength(200, MinimumLength = 5)]
    public string Name { get; set; }

    [Required(ErrorMessage = "La descripción es requerida")]
    [StringLength(500, MinimumLength = 10)]
    public string Description { get; set; }

    [Required(ErrorMessage = "La categoría es requerida")]
    [RegularExpression("^(alojamiento|alimentacion|recorrido|astronomicas|sitios_interes)$")]
    public string Category { get; set; }

    [Required(ErrorMessage = "El precio es requerido")]
    [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Debe subir al menos una imagen")]
    [MaxLength(3, ErrorMessage = "Máximo 3 imágenes")]
    public List<IFormFile> Images { get; set; }
}

// Response de servicio
public class ServiceResponse
{
    public Guid Id { get; set; }
    public Guid ProviderId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public decimal Price { get; set; }
    public List<ServiceImageDto> Images { get; set; }
    public bool IsActive { get; set; }
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ServiceImageDto
{
    public Guid Id { get; set; }
    public string Url { get; set; }
    public string Alt { get; set; }
    public bool IsPrimary { get; set; }
}

// Request para crear reseña
public class CreateReviewRequest
{
    [Required]
    public Guid ServiceId { get; set; }

    [Required]
    [Range(1, 5, ErrorMessage = "La calificación debe estar entre 1 y 5")]
    public int Rating { get; set; }

    [Required(ErrorMessage = "El comentario es requerido")]
    [StringLength(1000, MinimumLength = 10)]
    public string Comment { get; set; }
}

// Response de reseña
public class ReviewResponse
{
    public Guid Id { get; set; }
    public Guid ServiceId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; }
    public string UserAvatar { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### Entities

```csharp
public class ProviderService
{
    public Guid Id { get; set; }
    public Guid ProviderId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; }
    public bool IsApproved { get; set; }
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public int ViewCount { get; set; }
    public int BookingCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Navigation properties
    public User Provider { get; set; }
    public ICollection<ServiceImage> Images { get; set; }
    public ICollection<ServiceReview> Reviews { get; set; }
}

public class ServiceImage
{
    public Guid Id { get; set; }
    public Guid ServiceId { get; set; }
    public string Url { get; set; }
    public string BlobName { get; set; }
    public string Alt { get; set; }
    public bool IsPrimary { get; set; }
    public int DisplayOrder { get; set; }
    public int? FileSize { get; set; }
    public string MimeType { get; set; }
    public int? Width { get; set; }
    public int? Height { get; set; }
    public DateTime UploadedAt { get; set; }

    // Navigation
    public ProviderService Service { get; set; }
}

public class ServiceReview
{
    public Guid Id { get; set; }
    public Guid ServiceId { get; set; }
    public Guid UserId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
    public bool IsApproved { get; set; }
    public bool IsEdited { get; set; }
    public string ProviderResponse { get; set; }
    public DateTime? ResponseDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Navigation
    public ProviderService Service { get; set; }
    public User User { get; set; }
}
```

---

## 🔐 Controladores

```csharp
[ApiController]
[Route("api/provider/services")]
[Authorize(Roles = "provider,admin")]
public class ProviderServicesController : ControllerBase
{
    private readonly IProviderServiceService _serviceService;
    private readonly IImageStorageService _imageStorage;

    [HttpGet]
    public async Task<ActionResult<ServiceListResponse>> GetMyServices(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var result = await _serviceService.GetProviderServicesAsync(Guid.Parse(userId), page, pageSize);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceResponse>> GetService(Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var service = await _serviceService.GetByIdAsync(id);

        if (service == null)
            return NotFound(new { message = "Servicio no encontrado" });

        if (service.ProviderId.ToString() != userId)
            return Forbid();

        return Ok(service);
    }

    [HttpPost]
    public async Task<ActionResult<ServiceResponse>> CreateService(
        [FromForm] CreateServiceRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Validar imágenes
        if (request.Images.Count > 3)
            return BadRequest(new { message = "Máximo 3 imágenes permitidas" });

        foreach (var image in request.Images)
        {
            if (image.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = $"La imagen {image.FileName} supera los 5MB" });

            var extension = Path.GetExtension(image.FileName).ToLower();
            if (!new[] { ".jpg", ".jpeg", ".png", ".webp" }.Contains(extension))
                return BadRequest(new { message = $"Formato de imagen no permitido: {extension}" });
        }

        var result = await _serviceService.CreateServiceAsync(Guid.Parse(userId), request);
        return CreatedAtAction(nameof(GetService), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ServiceResponse>> UpdateService(
        Guid id,
        [FromForm] UpdateServiceRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var service = await _serviceService.GetByIdAsync(id);

        if (service == null)
            return NotFound();

        if (service.ProviderId.ToString() != userId)
            return Forbid();

        var result = await _serviceService.UpdateServiceAsync(id, request);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteService(Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var service = await _serviceService.GetByIdAsync(id);

        if (service == null)
            return NotFound();

        if (service.ProviderId.ToString() != userId)
            return Forbid();

        await _serviceService.DeleteServiceAsync(id);
        return NoContent();
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<ServiceResponse>> ToggleStatus(
        Guid id,
        [FromBody] ToggleStatusRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var result = await _serviceService.ToggleStatusAsync(id, Guid.Parse(userId), request.IsActive);

        if (result == null)
            return NotFound();

        return Ok(result);
    }
}

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    [HttpGet]
    [Route("/api/services/{serviceId}/reviews")]
    public async Task<ActionResult<ReviewListResponse>> GetServiceReviews(
        Guid serviceId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _reviewService.GetServiceReviewsAsync(serviceId, page, pageSize);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "user")]
    public async Task<ActionResult<ReviewResponse>> CreateReview(
        [FromBody] CreateReviewRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Validar que el usuario no haya reseñado ya este servicio
        var existingReview = await _reviewService.GetUserReviewForServiceAsync(
            Guid.Parse(userId),
            request.ServiceId
        );

        if (existingReview != null)
            return BadRequest(new { message = "Ya has reseñado este servicio" });

        var result = await _reviewService.CreateReviewAsync(Guid.Parse(userId), request);
        return CreatedAtAction(nameof(GetServiceReviews), new { serviceId = request.ServiceId }, result);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<ReviewResponse>> UpdateReview(
        Guid id,
        [FromBody] UpdateReviewRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var result = await _reviewService.UpdateReviewAsync(id, Guid.Parse(userId), request);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> DeleteReview(Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var success = await _reviewService.DeleteReviewAsync(id, Guid.Parse(userId));

        if (!success)
            return NotFound();

        return NoContent();
    }
}
```

---

## ✅ Reglas de Negocio y Validaciones

### Servicios

1. **Creación:**
   - Usuario debe tener rol "provider"
   - Proveedor debe tener RNT verificado
   - Nombre: 5-200 caracteres
   - Descripción: 10-500 caracteres
   - Precio: Mayor a 0
   - Imágenes: Mínimo 1, máximo 3
   - Formatos: JPG, PNG, WEBP
   - Tamaño máximo: 5MB por imagen

2. **Edición:**
   - Solo el propietario puede editar
   - Si hay reservas confirmadas, no se puede cambiar el precio

3. **Eliminación:**
   - Solo el propietario puede eliminar
   - Soft delete si tiene reservas
   - Hard delete si no tiene reservas ni reseñas

4. **Activación/Desactivación:**
   - Solo el propietario puede cambiar el estado
   - Servicios inactivos no aparecen en búsquedas públicas

### Reseñas

1. **Creación:**
   - Solo usuarios con rol "user" (turistas)
   - Un usuario solo puede reseñar una vez por servicio
   - Rating: 1-5 estrellas
   - Comentario: 10-1000 caracteres
   - Idealmente, haber completado una reserva del servicio

2. **Edición:**
   - Solo el autor puede editar su reseña
   - Marcar como editada

3. **Eliminación:**
   - El autor o un admin pueden eliminar
   - Recalcular rating promedio del servicio

4. **Actualización de Rating:**
   - Al crear/actualizar/eliminar reseña, recalcular AverageRating y ReviewCount del servicio

---

## 🧪 Casos de Prueba

### 1. Crear Servicio - Success
```json
POST /api/provider/services
{
  "name": "Hotel Vista Hermosa",
  "description": "Hotel sencillo con vista al desierto y todas las comodidades básicas",
  "category": "alojamiento",
  "price": 80000,
  "images": [File1, File2, File3]
}
Expected: 201 Created
```

### 2. Crear Servicio - Validation Error
```json
POST /api/provider/services
{
  "name": "H",
  "description": "Corto",
  "category": "invalido",
  "price": -1000
}
Expected: 400 Bad Request
```

### 3. Crear Reseña - Success
```json
POST /api/reviews
{
  "serviceId": "uuid",
  "rating": 5,
  "comment": "Excelente servicio, muy recomendado para familias."
}
Expected: 201 Created
```

### 4. Crear Reseña - Duplicate
```json
POST /api/reviews (segunda vez para el mismo servicio)
Expected: 400 Bad Request - "Ya has reseñado este servicio"
```

---

## 📚 Documentación Adicional

### Flujo de Trabajo

1. **Proveedor se registra** con RNT
2. **RNT es verificado** por el sistema
3. **Proveedor crea servicios** con imágenes
4. **Admin revisa y aprueba** servicios (opcional)
5. **Servicios aparecen** en búsquedas públicas
6. **Turistas reservan** y completan servicios
7. **Turistas dejan reseñas** con calificación
8. **Rating se actualiza** automáticamente

### Integraciones Futuras

- [ ] Notificaciones push cuando reciben reseña
- [ ] Sistema de respuesta del proveedor a reseñas
- [ ] Analytics de vistas y conversiones
- [ ] Recomendaciones basadas en IA
- [ ] Integración con sistemas de reservas
- [ ] Exportar estadísticas a Excel/PDF

---

## ⚠️ Consideraciones Importantes

1. **Seguridad:**
   - Validar siempre el ownership de los recursos
   - Sanitizar inputs para prevenir XSS
   - Rate limiting en endpoints públicos

2. **Performance:**
   - Índices en tablas para búsquedas rápidas
   - Caché de servicios populares
   - CDN para imágenes

3. **Escalabilidad:**
   - Usar colas para procesamiento de imágenes
   - Considerar microservicios para alta carga

4. **Monitoreo:**
   - Logs de todas las operaciones
   - Métricas de uso y errores
   - Alertas para operaciones sospechosas

---

**Versión:** 1.0
**Fecha:** 01 de Noviembre, 2025
**Autor:** Wild Tour Development Team
