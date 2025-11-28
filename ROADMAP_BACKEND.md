# 🔧 ROADMAP BACKEND - WILDTOUR PLATFORM

**Última actualización:** Noviembre 2025

## 📊 Estado Actual del Backend
- **Completitud:** 40% ✅
- **Autenticación:** JWT implementado ✅
- **Base de datos:** PostgreSQL/SQL Server ✅
- **Pagos:** MercadoPago integrado ✅
- **RNT Verification:** Funcional ✅

---

# PROMPTS DETALLADOS PARA IMPLEMENTACIÓN

## 🔍 PROMPT 1: BÚSQUEDA Y FILTRADO AVANZADO

### Contexto
Necesitamos implementar un sistema de búsqueda avanzado similar a Booking.com y Airbnb que permita a los usuarios encontrar destinos y servicios con autocompletado, filtros múltiples, búsquedas guardadas e historial.

### Requerimientos Técnicos

**Base de Datos:**
```sql
-- Tabla de búsquedas guardadas
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255),
  filters JSONB, -- {destination, dates, guests, priceRange, categories, etc}
  created_at TIMESTAMP DEFAULT NOW(),
  notify_on_new BOOLEAN DEFAULT false
);

-- Tabla de historial de búsquedas
CREATE TABLE search_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  query TEXT,
  filters JSONB,
  results_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX idx_destinations_search ON destinations USING gin(to_tsvector('spanish', name || ' ' || description));
CREATE INDEX idx_services_search ON services USING gin(to_tsvector('spanish', name || ' ' || description));
```

**Endpoints Requeridos:**

1. **POST /api/search/destinations**
```json
Request:
{
  "query": "Desierto de la Tatacoa",
  "filters": {
    "dateRange": { "start": "2025-12-01", "end": "2025-12-05" },
    "guests": 2,
    "priceRange": { "min": 50000, "max": 500000 },
    "categories": ["hospedaje", "tours", "transporte"],
    "amenities": ["wifi", "piscina"],
    "rating": { "min": 4.0 },
    "verified": true
  },
  "sort": "price_asc", // price_asc, price_desc, rating, popularity
  "page": 1,
  "limit": 20
}

Response:
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "uuid",
        "name": "Hotel Bethel",
        "location": "Villavieja, Huila",
        "price": 120000,
        "rating": 4.5,
        "reviewsCount": 234,
        "images": ["url1", "url2"],
        "availability": true,
        "verified": true,
        "categories": ["hospedaje"],
        "amenities": ["wifi", "piscina", "desayuno"]
      }
    ],
    "total": 45,
    "page": 1,
    "totalPages": 3,
    "facets": {
      "priceRange": { "min": 50000, "max": 800000 },
      "categories": { "hospedaje": 12, "tours": 20, "transporte": 8 },
      "ratings": { "5": 10, "4": 20, "3": 10, "2": 3, "1": 2 }
    }
  }
}
```

2. **POST /api/search/autocomplete**
```json
Request:
{
  "query": "tata",
  "limit": 5
}

Response:
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "type": "destination",
        "id": "uuid",
        "text": "Desierto de la Tatacoa",
        "highlight": "<strong>Tata</strong>coa",
        "subtitle": "Villavieja, Huila",
        "image": "url"
      },
      {
        "type": "service",
        "text": "Tour Tatacoa nocturno",
        "serviceId": "uuid"
      }
    ]
  }
}
```

3. **POST /api/search/save** (Autenticado)
```json
Request:
{
  "name": "Escapada Tatacoa Diciembre",
  "filters": { /* filtros aplicados */ },
  "notifyOnNew": true
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Escapada Tatacoa Diciembre",
    "createdAt": "2025-11-13T10:30:00Z"
  }
}
```

**Implementación Backend (.NET):**

```csharp
// SearchController.cs
[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    private readonly ISearchService _searchService;

    [HttpPost("destinations")]
    public async Task<IActionResult> SearchDestinations([FromBody] SearchRequest request)
    {
        var results = await _searchService.SearchAsync(request);
        return Ok(ApiResponse.Success(results));
    }

    [HttpPost("autocomplete")]
    public async Task<IActionResult> Autocomplete([FromBody] AutocompleteRequest request)
    {
        var suggestions = await _searchService.AutocompleteAsync(request.Query, request.Limit);
        return Ok(ApiResponse.Success(new { suggestions }));
    }

    [Authorize]
    [HttpPost("save")]
    public async Task<IActionResult> SaveSearch([FromBody] SaveSearchRequest request)
    {
        var userId = User.GetUserId();
        var savedSearch = await _searchService.SaveSearchAsync(userId, request);
        return Ok(ApiResponse.Success(savedSearch));
    }
}

// SearchService.cs
public class SearchService : ISearchService
{
    private readonly ApplicationDbContext _context;

    public async Task<SearchResults> SearchAsync(SearchRequest request)
    {
        var query = _context.Services
            .Include(s => s.Provider)
            .Include(s => s.Reviews)
            .AsQueryable();

        // Filtro de texto con búsqueda full-text
        if (!string.IsNullOrEmpty(request.Query))
        {
            query = query.Where(s =>
                EF.Functions.ToTsVector("spanish", s.Name + " " + s.Description)
                .Matches(EF.Functions.PlainToTsQuery("spanish", request.Query))
            );
        }

        // Filtro de precio
        if (request.Filters?.PriceRange != null)
        {
            query = query.Where(s =>
                s.Price >= request.Filters.PriceRange.Min &&
                s.Price <= request.Filters.PriceRange.Max
            );
        }

        // Filtro de categorías
        if (request.Filters?.Categories?.Any() == true)
        {
            query = query.Where(s => request.Filters.Categories.Contains(s.Category));
        }

        // Filtro de rating
        if (request.Filters?.Rating?.Min > 0)
        {
            query = query.Where(s => s.AverageRating >= request.Filters.Rating.Min);
        }

        // Ordenamiento
        query = request.Sort switch
        {
            "price_asc" => query.OrderBy(s => s.Price),
            "price_desc" => query.OrderByDescending(s => s.Price),
            "rating" => query.OrderByDescending(s => s.AverageRating),
            _ => query.OrderByDescending(s => s.CreatedAt)
        };

        var total = await query.CountAsync();
        var results = await query
            .Skip((request.Page - 1) * request.Limit)
            .Take(request.Limit)
            .Select(s => new SearchResultItem
            {
                Id = s.Id,
                Name = s.Name,
                Location = s.Location,
                Price = s.Price,
                Rating = s.AverageRating,
                ReviewsCount = s.Reviews.Count,
                Images = s.Images.Select(i => i.Url).ToList(),
                Verified = s.Provider.IsVerified
            })
            .ToListAsync();

        return new SearchResults
        {
            Results = results,
            Total = total,
            Page = request.Page,
            TotalPages = (int)Math.Ceiling(total / (double)request.Limit)
        };
    }
}
```

**Optimizaciones Requeridas:**
- Implementar caché con Redis para búsquedas populares (TTL 5 minutos)
- Usar Elasticsearch para búsqueda full-text más rápida
- Implementar debouncing en autocomplete (300ms)
- Guardar historial de búsquedas solo para usuarios autenticados
- Notificaciones cuando aparecen nuevos servicios en búsquedas guardadas

---

## 📅 PROMPT 2: CALENDARIO DE DISPONIBILIDAD

### Contexto
Necesitamos un sistema de gestión de disponibilidad en tiempo real para servicios turísticos, permitiendo bloqueos, slots de tiempo, y sincronización con múltiples plataformas.

### Requerimientos Técnicos

**Base de Datos:**
```sql
-- Tabla de disponibilidad
CREATE TABLE availability (
  id UUID PRIMARY KEY,
  service_id UUID REFERENCES services(id),
  date DATE NOT NULL,
  total_capacity INTEGER NOT NULL,
  available_capacity INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'available', -- available, limited, sold_out, blocked
  blocked_reason TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de slots de tiempo
CREATE TABLE time_slots (
  id UUID PRIMARY KEY,
  service_id UUID REFERENCES services(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  capacity INTEGER NOT NULL,
  available INTEGER NOT NULL,
  price DECIMAL(10,2)
);

-- Índices
CREATE INDEX idx_availability_service_date ON availability(service_id, date);
CREATE INDEX idx_timeslots_service_date ON time_slots(service_id, date);
CREATE UNIQUE INDEX idx_availability_unique ON availability(service_id, date);
```

**Endpoints Requeridos:**

1. **GET /api/availability/check**
```json
Request Query:
?serviceId=uuid&startDate=2025-12-01&endDate=2025-12-05&guests=2

Response:
{
  "success": true,
  "data": {
    "available": true,
    "dates": [
      {
        "date": "2025-12-01",
        "available": true,
        "capacity": 10,
        "remaining": 8,
        "price": 120000,
        "status": "available"
      },
      {
        "date": "2025-12-02",
        "available": true,
        "capacity": 10,
        "remaining": 2,
        "price": 120000,
        "status": "limited"
      }
    ],
    "timeSlots": [
      {
        "date": "2025-12-01",
        "slots": [
          { "time": "09:00", "available": true, "capacity": 5, "remaining": 3 },
          { "time": "14:00", "available": false, "capacity": 5, "remaining": 0 }
        ]
      }
    ]
  }
}
```

2. **POST /api/availability/block** (Provider)
```json
Request:
{
  "serviceId": "uuid",
  "dates": ["2025-12-15", "2025-12-16"],
  "reason": "Mantenimiento del hotel"
}

Response:
{
  "success": true,
  "data": {
    "blockedDates": 2,
    "message": "Fechas bloqueadas exitosamente"
  }
}
```

**Implementación Backend (.NET):**

```csharp
// AvailabilityController.cs
[ApiController]
[Route("api/availability")]
public class AvailabilityController : ControllerBase
{
    private readonly IAvailabilityService _availabilityService;
    private readonly IHubContext<AvailabilityHub> _hubContext;

    [HttpGet("check")]
    public async Task<IActionResult> CheckAvailability(
        [FromQuery] Guid serviceId,
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate,
        [FromQuery] int guests = 1)
    {
        var availability = await _availabilityService.CheckAvailabilityAsync(
            serviceId, startDate, endDate, guests);
        return Ok(ApiResponse.Success(availability));
    }

    [Authorize(Roles = "Provider")]
    [HttpPost("block")]
    public async Task<IActionResult> BlockDates([FromBody] BlockDatesRequest request)
    {
        var userId = User.GetUserId();

        // Verificar que el servicio pertenece al proveedor
        var service = await _context.Services.FindAsync(request.ServiceId);
        if (service.ProviderId != userId)
            return Forbid();

        await _availabilityService.BlockDatesAsync(
            request.ServiceId, request.Dates, request.Reason);

        // Notificar cambios en tiempo real vía WebSocket
        await _hubContext.Clients.Group($"service_{request.ServiceId}")
            .SendAsync("AvailabilityUpdated", request.ServiceId);

        return Ok(ApiResponse.Success(new {
            blockedDates = request.Dates.Count,
            message = "Fechas bloqueadas exitosamente"
        }));
    }

    [HttpGet("calendar/{serviceId}")]
    public async Task<IActionResult> GetCalendar(Guid serviceId, int month, int year)
    {
        var calendar = await _availabilityService.GetMonthCalendarAsync(
            serviceId, month, year);
        return Ok(ApiResponse.Success(calendar));
    }
}

// AvailabilityService.cs
public class AvailabilityService : IAvailabilityService
{
    private readonly ApplicationDbContext _context;
    private readonly IDistributedCache _cache;

    public async Task<AvailabilityCheckResult> CheckAvailabilityAsync(
        Guid serviceId, DateTime startDate, DateTime endDate, int guests)
    {
        // Intentar obtener de caché
        var cacheKey = $"availability:{serviceId}:{startDate:yyyyMMdd}:{endDate:yyyyMMdd}";
        var cached = await _cache.GetStringAsync(cacheKey);

        if (cached != null)
            return JsonSerializer.Deserialize<AvailabilityCheckResult>(cached);

        var dates = new List<AvailabilityDate>();
        var currentDate = startDate;

        while (currentDate <= endDate)
        {
            var availability = await _context.Availability
                .FirstOrDefaultAsync(a =>
                    a.ServiceId == serviceId &&
                    a.Date == currentDate);

            if (availability == null)
            {
                // Crear disponibilidad por defecto
                var service = await _context.Services.FindAsync(serviceId);
                availability = new Availability
                {
                    ServiceId = serviceId,
                    Date = currentDate,
                    TotalCapacity = service.DefaultCapacity,
                    AvailableCapacity = service.DefaultCapacity,
                    Status = "available"
                };
                _context.Availability.Add(availability);
            }

            dates.Add(new AvailabilityDate
            {
                Date = currentDate,
                Available = availability.AvailableCapacity >= guests,
                Capacity = availability.TotalCapacity,
                Remaining = availability.AvailableCapacity,
                Status = availability.Status
            });

            currentDate = currentDate.AddDays(1);
        }

        await _context.SaveChangesAsync();

        var result = new AvailabilityCheckResult
        {
            Available = dates.All(d => d.Available),
            Dates = dates
        };

        // Guardar en caché por 5 minutos
        await _cache.SetStringAsync(cacheKey,
            JsonSerializer.Serialize(result),
            new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) });

        return result;
    }

    public async Task BlockDatesAsync(Guid serviceId, List<DateTime> dates, string reason)
    {
        foreach (var date in dates)
        {
            var availability = await _context.Availability
                .FirstOrDefaultAsync(a => a.ServiceId == serviceId && a.Date == date);

            if (availability != null)
            {
                availability.Status = "blocked";
                availability.BlockedReason = reason;
                availability.AvailableCapacity = 0;
            }
            else
            {
                _context.Availability.Add(new Availability
                {
                    ServiceId = serviceId,
                    Date = date,
                    Status = "blocked",
                    BlockedReason = reason,
                    TotalCapacity = 0,
                    AvailableCapacity = 0
                });
            }

            // Invalidar caché
            await InvalidateCacheForDateAsync(serviceId, date);
        }

        await _context.SaveChangesAsync();
    }
}

// AvailabilityHub.cs (SignalR)
public class AvailabilityHub : Hub
{
    public async Task SubscribeToService(string serviceId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"service_{serviceId}");
    }

    public async Task UnsubscribeFromService(string serviceId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"service_{serviceId}");
    }
}
```

**WebSocket Setup (Program.cs):**
```csharp
builder.Services.AddSignalR();

app.MapHub<AvailabilityHub>("/hubs/availability");
```

**Optimizaciones Requeridas:**
- Caché distribuido con Redis
- Actualización en tiempo real con SignalR
- Sincronización con channel managers (Booking.com, Airbnb)
- Prevención de overbooking con locks optimistas
- Reservas temporales (hold) durante 15 minutos en checkout

---

## 💳 PROMPT 3: CHECKOUT MEJORADO Y GUEST CHECKOUT

### Contexto
Implementar un sistema de checkout profesional que permita compras sin registro (guest checkout), aplicación de cupones, múltiples pasajeros, y cálculo preciso de impuestos y fees.

### Requerimientos Técnicos

**Base de Datos:**
```sql
-- Tabla de sesiones de checkout
CREATE TABLE checkout_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) NULL, -- NULL para guests
  guest_email VARCHAR(255),
  guest_name VARCHAR(255),
  guest_phone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, expired, abandoned
  items JSONB NOT NULL, -- Array de servicios
  subtotal DECIMAL(10,2),
  taxes DECIMAL(10,2),
  fees DECIMAL(10,2),
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2),
  coupon_id UUID REFERENCES coupons(id) NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  completed_at TIMESTAMP NULL
);

-- Tabla de cupones
CREATE TABLE coupons (
  id UUID PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20), -- percentage, fixed, free_shipping
  value DECIMAL(10,2),
  min_purchase DECIMAL(10,2),
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  provider_id UUID REFERENCES users(id) NULL, -- NULL = admin coupon
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  active BOOLEAN DEFAULT true
);

-- Tabla de pasajeros adicionales
CREATE TABLE booking_travelers (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  document_type VARCHAR(20),
  document_number VARCHAR(50),
  email VARCHAR(255),
  phone VARCHAR(50),
  birthdate DATE,
  is_primary BOOLEAN DEFAULT false
);
```

**Endpoints Requeridos:**

1. **POST /api/checkout/init**
```json
Request:
{
  "items": [
    {
      "serviceId": "uuid",
      "date": "2025-12-01",
      "guests": 2,
      "timeSlot": "09:00",
      "price": 120000
    }
  ],
  "guestInfo": {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+57300123456"
  },
  "userId": "uuid" // opcional, null para guest checkout
}

Response:
{
  "success": true,
  "data": {
    "checkoutId": "uuid",
    "expiresAt": "2025-11-13T10:45:00Z", // 15 minutos
    "summary": {
      "subtotal": 240000,
      "taxes": 45600, // 19% IVA
      "platformFee": 12000, // 5% platform fee
      "total": 297600
    }
  }
}
```

2. **POST /api/checkout/apply-coupon**
```json
Request:
{
  "checkoutId": "uuid",
  "couponCode": "VERANO2025"
}

Response:
{
  "success": true,
  "data": {
    "coupon": {
      "code": "VERANO2025",
      "type": "percentage",
      "value": 15,
      "description": "15% de descuento"
    },
    "discount": 36000,
    "newTotal": 261600
  }
}
```

**Implementación Backend (.NET):**

```csharp
// CheckoutController.cs
[ApiController]
[Route("api/checkout")]
public class CheckoutController : ControllerBase
{
    private readonly ICheckoutService _checkoutService;
    private readonly ICouponService _couponService;

    [HttpPost("init")]
    public async Task<IActionResult> InitCheckout([FromBody] InitCheckoutRequest request)
    {
        var checkout = await _checkoutService.InitializeAsync(request);
        return Ok(ApiResponse.Success(checkout));
    }

    [HttpPost("apply-coupon")]
    public async Task<IActionResult> ApplyCoupon([FromBody] ApplyCouponRequest request)
    {
        var checkout = await _context.CheckoutSessions.FindAsync(request.CheckoutId);

        if (checkout == null || checkout.Status != "pending")
            return BadRequest(ApiResponse.Error("Sesión de checkout inválida"));

        if (checkout.ExpiresAt < DateTime.UtcNow)
            return BadRequest(ApiResponse.Error("Sesión de checkout expirada"));

        var coupon = await _couponService.ValidateAndApplyAsync(
            request.CouponCode, checkout.Subtotal);

        if (!coupon.IsValid)
            return BadRequest(ApiResponse.Error(coupon.ErrorMessage));

        checkout.CouponId = coupon.Id;
        checkout.Discount = coupon.DiscountAmount;
        checkout.Total = checkout.Subtotal + checkout.Taxes + checkout.Fees - checkout.Discount;

        await _context.SaveChangesAsync();

        return Ok(ApiResponse.Success(new {
            coupon = new {
                code = coupon.Code,
                type = coupon.Type,
                value = coupon.Value,
                description = coupon.Description
            },
            discount = checkout.Discount,
            newTotal = checkout.Total
        }));
    }

    [HttpPost("complete")]
    public async Task<IActionResult> CompleteCheckout([FromBody] CompleteCheckoutRequest request)
    {
        var checkout = await _context.CheckoutSessions
            .Include(c => c.Coupon)
            .FirstOrDefaultAsync(c => c.Id == request.CheckoutId);

        if (checkout == null || checkout.Status != "pending")
            return BadRequest(ApiResponse.Error("Sesión inválida"));

        if (checkout.ExpiresAt < DateTime.UtcNow)
        {
            checkout.Status = "expired";
            await _context.SaveChangesAsync();
            return BadRequest(ApiResponse.Error("Sesión expirada"));
        }

        // Procesar pago
        var payment = await _paymentService.ProcessPaymentAsync(new PaymentRequest
        {
            Amount = checkout.Total,
            Currency = "COP",
            PaymentMethod = request.PaymentMethod,
            Email = checkout.GuestEmail ?? checkout.User?.Email,
            Description = $"Reserva WildTour - Checkout {checkout.Id}"
        });

        if (!payment.Success)
            return BadRequest(ApiResponse.Error(payment.ErrorMessage));

        // Crear reservas para cada item
        var bookings = new List<Booking>();
        var items = JsonSerializer.Deserialize<List<CheckoutItem>>(checkout.Items.ToString());

        foreach (var item in items)
        {
            var booking = new Booking
            {
                UserId = checkout.UserId,
                ServiceId = item.ServiceId,
                GuestName = checkout.GuestName,
                GuestEmail = checkout.GuestEmail,
                GuestPhone = checkout.GuestPhone,
                Date = item.Date,
                Guests = item.Guests,
                TimeSlot = item.TimeSlot,
                TotalPrice = item.Price,
                Status = "confirmed",
                PaymentId = payment.Id,
                CheckoutSessionId = checkout.Id
            };

            _context.Bookings.Add(booking);
            bookings.Add(booking);

            // Reducir disponibilidad
            await _availabilityService.ReduceCapacityAsync(
                item.ServiceId, item.Date, item.Guests);
        }

        checkout.Status = "completed";
        checkout.CompletedAt = DateTime.UtcNow;

        // Incrementar uso de cupón
        if (checkout.CouponId.HasValue)
        {
            var coupon = await _context.Coupons.FindAsync(checkout.CouponId);
            coupon.UsedCount++;
        }

        await _context.SaveChangesAsync();

        // Enviar confirmación por email
        await _emailService.SendBookingConfirmationAsync(bookings, checkout.GuestEmail);

        return Ok(ApiResponse.Success(new {
            bookingIds = bookings.Select(b => b.Id).ToList(),
            paymentId = payment.Id,
            message = "Reserva completada exitosamente"
        }));
    }
}

// CheckoutService.cs
public class CheckoutService : ICheckoutService
{
    public async Task<CheckoutSession> InitializeAsync(InitCheckoutRequest request)
    {
        decimal subtotal = 0;
        var items = new List<CheckoutItem>();

        foreach (var item in request.Items)
        {
            var service = await _context.Services.FindAsync(item.ServiceId);

            // Verificar disponibilidad
            var available = await _availabilityService.CheckAvailabilityAsync(
                item.ServiceId, item.Date, item.Date, item.Guests);

            if (!available.Available)
                throw new BusinessException("Servicio no disponible para la fecha seleccionada");

            var itemPrice = item.Price ?? service.Price;
            subtotal += itemPrice * item.Guests;

            items.Add(new CheckoutItem
            {
                ServiceId = item.ServiceId,
                Date = item.Date,
                Guests = item.Guests,
                TimeSlot = item.TimeSlot,
                Price = itemPrice
            });
        }

        var taxes = subtotal * 0.19m; // 19% IVA en Colombia
        var platformFee = subtotal * 0.05m; // 5% platform fee
        var total = subtotal + taxes + platformFee;

        var checkout = new CheckoutSession
        {
            UserId = request.UserId,
            GuestEmail = request.GuestInfo?.Email,
            GuestName = request.GuestInfo?.Name,
            GuestPhone = request.GuestInfo?.Phone,
            Items = JsonSerializer.SerializeToDocument(items),
            Subtotal = subtotal,
            Taxes = taxes,
            Fees = platformFee,
            Total = total,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15) // Sesión válida por 15 minutos
        };

        _context.CheckoutSessions.Add(checkout);
        await _context.SaveChangesAsync();

        return checkout;
    }
}

// CouponService.cs
public class CouponService : ICouponService
{
    public async Task<CouponValidationResult> ValidateAndApplyAsync(string code, decimal purchaseAmount)
    {
        var coupon = await _context.Coupons
            .FirstOrDefaultAsync(c => c.Code == code && c.Active);

        if (coupon == null)
            return new CouponValidationResult { IsValid = false, ErrorMessage = "Cupón no válido" };

        if (coupon.ValidFrom > DateTime.UtcNow || coupon.ValidUntil < DateTime.UtcNow)
            return new CouponValidationResult { IsValid = false, ErrorMessage = "Cupón expirado" };

        if (coupon.MaxUses.HasValue && coupon.UsedCount >= coupon.MaxUses)
            return new CouponValidationResult { IsValid = false, ErrorMessage = "Cupón agotado" };

        if (coupon.MinPurchase.HasValue && purchaseAmount < coupon.MinPurchase)
            return new CouponValidationResult {
                IsValid = false,
                ErrorMessage = $"Compra mínima de ${coupon.MinPurchase:N0} requerida"
            };

        decimal discountAmount = coupon.Type switch
        {
            "percentage" => purchaseAmount * (coupon.Value / 100m),
            "fixed" => coupon.Value,
            _ => 0
        };

        return new CouponValidationResult
        {
            IsValid = true,
            Id = coupon.Id,
            Code = coupon.Code,
            Type = coupon.Type,
            Value = coupon.Value,
            DiscountAmount = discountAmount,
            Description = $"{(coupon.Type == "percentage" ? $"{coupon.Value}%" : $"${coupon.Value:N0}")} de descuento"
        };
    }
}
```

**Funcionalidades Adicionales:**
- Recuperación de carritos abandonados (emails automáticos)
- Checkout express para usuarios frecuentes
- Guardado de info de viajeros frecuentes
- Múltiples métodos de pago (tarjeta, PSE, efectivo)
- Split payments (dividir pago entre varias tarjetas)

---

## 💬 PROMPT 4: SISTEMA DE MENSAJERÍA EN TIEMPO REAL

### Contexto
Implementar un sistema de mensajería bidireccional entre usuarios y proveedores usando WebSocket (SignalR) para comunicación en tiempo real, con soporte para archivos adjuntos, indicadores de escritura, y notificaciones push.

### Requerimientos Técnicos

**Base de Datos:**
```sql
-- Conversaciones
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  service_id UUID REFERENCES services(id) NULL,
  booking_id UUID REFERENCES bookings(id) NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Participantes
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  user_id UUID REFERENCES users(id),
  last_read_at TIMESTAMP NULL,
  joined_at TIMESTAMP DEFAULT NOW()
);

-- Mensajes
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  edited BOOLEAN DEFAULT false,
  deleted BOOLEAN DEFAULT false
);

-- Archivos adjuntos
CREATE TABLE message_attachments (
  id UUID PRIMARY KEY,
  message_id UUID REFERENCES messages(id),
  file_name VARCHAR(255),
  file_type VARCHAR(50),
  file_size BIGINT,
  url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_participants_user ON conversation_participants(user_id);
```

**Implementación Backend (.NET con SignalR):**

```csharp
// MessagesHub.cs
[Authorize]
public class MessagesHub : Hub
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<MessagesHub> _logger;

    public MessagesHub(ApplicationDbContext context, ILogger<MessagesHub> logger)
    {
        _context = context;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User.GetUserId();

        // Agregar usuario a sus conversaciones activas
        var conversations = await _context.ConversationParticipants
            .Where(p => p.UserId == userId)
            .Select(p => p.ConversationId.ToString())
            .ToListAsync();

        foreach (var conversationId in conversations)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
        }

        _logger.LogInformation($"Usuario {userId} conectado al hub de mensajes");
        await base.OnConnectedAsync();
    }

    public async Task SendMessage(Guid conversationId, string message, List<string> attachmentUrls = null)
    {
        var userId = Context.User.GetUserId();

        // Verificar que el usuario es participante de la conversación
        var isParticipant = await _context.ConversationParticipants
            .AnyAsync(p => p.ConversationId == conversationId && p.UserId == userId);

        if (!isParticipant)
        {
            await Clients.Caller.SendAsync("Error", "No tienes acceso a esta conversación");
            return;
        }

        var newMessage = new Message
        {
            ConversationId = conversationId,
            SenderId = userId,
            MessageText = message,
            CreatedAt = DateTime.UtcNow
        };

        _context.Messages.Add(newMessage);

        // Agregar archivos adjuntos
        if (attachmentUrls != null && attachmentUrls.Any())
        {
            foreach (var url in attachmentUrls)
            {
                _context.MessageAttachments.Add(new MessageAttachment
                {
                    MessageId = newMessage.Id,
                    Url = url,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        // Actualizar timestamp de la conversación
        var conversation = await _context.Conversations.FindAsync(conversationId);
        conversation.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Obtener información del remitente
        var sender = await _context.Users.FindAsync(userId);

        // Enviar mensaje a todos los participantes
        await Clients.Group($"conversation_{conversationId}")
            .SendAsync("ReceiveMessage", new
            {
                id = newMessage.Id,
                conversationId,
                sender = new { id = sender.Id, name = $"{sender.FirstName} {sender.LastName}", avatar = sender.Avatar },
                message,
                attachments = attachmentUrls,
                createdAt = newMessage.CreatedAt,
                read = false
            });

        // Enviar notificación push a otros participantes
        var otherParticipants = await _context.ConversationParticipants
            .Where(p => p.ConversationId == conversationId && p.UserId != userId)
            .Select(p => p.UserId)
            .ToListAsync();

        foreach (var participantId in otherParticipants)
        {
            await SendPushNotification(participantId, sender.FirstName, message);
        }
    }

    public async Task StartTyping(Guid conversationId)
    {
        var userId = Context.User.GetUserId();
        var user = await _context.Users.FindAsync(userId);

        await Clients.OthersInGroup($"conversation_{conversationId}")
            .SendAsync("UserTyping", new { userId, name = user.FirstName });
    }

    public async Task StopTyping(Guid conversationId)
    {
        var userId = Context.User.GetUserId();

        await Clients.OthersInGroup($"conversation_{conversationId}")
            .SendAsync("UserStoppedTyping", userId);
    }

    public async Task MarkAsRead(Guid conversationId)
    {
        var userId = Context.User.GetUserId();

        // Marcar todos los mensajes no leídos como leídos
        var unreadMessages = await _context.Messages
            .Where(m => m.ConversationId == conversationId &&
                       m.SenderId != userId &&
                       !m.Read)
            .ToListAsync();

        foreach (var message in unreadMessages)
        {
            message.Read = true;
            message.ReadAt = DateTime.UtcNow;
        }

        // Actualizar last_read_at del participante
        var participant = await _context.ConversationParticipants
            .FirstOrDefaultAsync(p => p.ConversationId == conversationId && p.UserId == userId);

        if (participant != null)
        {
            participant.LastReadAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        // Notificar al remitente que se leyeron los mensajes
        await Clients.OthersInGroup($"conversation_{conversationId}")
            .SendAsync("MessagesRead", new { conversationId, readBy = userId });
    }

    private async Task SendPushNotification(Guid userId, string senderName, string message)
    {
        // Implementar con OneSignal, Firebase, etc.
        // Por ahora solo logging
        _logger.LogInformation($"Push notification to {userId}: {senderName} te envió un mensaje");
    }
}

// MessagesController.cs
[ApiController]
[Route("api/messages")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorageService _fileStorage;

    [HttpPost("conversation/start")]
    public async Task<IActionResult> StartConversation([FromBody] StartConversationRequest request)
    {
        var userId = User.GetUserId();

        // Verificar si ya existe una conversación
        var existing = await _context.Conversations
            .Where(c => c.ServiceId == request.ServiceId || c.BookingId == request.BookingId)
            .Where(c => c.Participants.Any(p => p.UserId == userId) &&
                       c.Participants.Any(p => p.UserId == request.ReceiverId))
            .FirstOrDefaultAsync();

        if (existing != null)
            return Ok(ApiResponse.Success(new { conversationId = existing.Id }));

        // Crear nueva conversación
        var conversation = new Conversation
        {
            ServiceId = request.ServiceId,
            BookingId = request.BookingId
        };

        _context.Conversations.Add(conversation);

        // Agregar participantes
        _context.ConversationParticipants.Add(new ConversationParticipant
        {
            ConversationId = conversation.Id,
            UserId = userId
        });

        _context.ConversationParticipants.Add(new ConversationParticipant
        {
            ConversationId = conversation.Id,
            UserId = request.ReceiverId
        });

        await _context.SaveChangesAsync();

        return Ok(ApiResponse.Success(new { conversationId = conversation.Id }));
    }

    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        [FromQuery] bool unreadOnly = false)
    {
        var userId = User.GetUserId();

        var query = _context.Conversations
            .Where(c => c.Participants.Any(p => p.UserId == userId))
            .Include(c => c.Participants).ThenInclude(p => p.User)
            .Include(c => c.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
            .AsQueryable();

        if (unreadOnly)
        {
            query = query.Where(c => c.Messages
                .Any(m => m.SenderId != userId && !m.Read));
        }

        var total = await query.CountAsync();

        var conversations = await query
            .OrderByDescending(c => c.UpdatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .Select(c => new
            {
                id = c.Id,
                serviceId = c.ServiceId,
                bookingId = c.BookingId,
                participants = c.Participants.Select(p => new
                {
                    id = p.User.Id,
                    name = $"{p.User.FirstName} {p.User.LastName}",
                    avatar = p.User.Avatar
                }),
                lastMessage = c.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault(),
                unreadCount = c.Messages.Count(m => m.SenderId != userId && !m.Read),
                updatedAt = c.UpdatedAt
            })
            .ToListAsync();

        return Ok(ApiResponse.Success(new
        {
            conversations,
            total,
            page,
            totalPages = (int)Math.Ceiling(total / (double)limit)
        }));
    }

    [HttpGet("conversation/{conversationId}")]
    public async Task<IActionResult> GetMessages(
        Guid conversationId,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 50)
    {
        var userId = User.GetUserId();

        // Verificar acceso
        var isParticipant = await _context.ConversationParticipants
            .AnyAsync(p => p.ConversationId == conversationId && p.UserId == userId);

        if (!isParticipant)
            return Forbid();

        var total = await _context.Messages
            .Where(m => m.ConversationId == conversationId && !m.Deleted)
            .CountAsync();

        var messages = await _context.Messages
            .Where(m => m.ConversationId == conversationId && !m.Deleted)
            .Include(m => m.Sender)
            .Include(m => m.Attachments)
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .Select(m => new
            {
                id = m.Id,
                sender = new
                {
                    id = m.Sender.Id,
                    name = $"{m.Sender.FirstName} {m.Sender.LastName}",
                    avatar = m.Sender.Avatar
                },
                message = m.MessageText,
                attachments = m.Attachments.Select(a => new
                {
                    id = a.Id,
                    fileName = a.FileName,
                    fileType = a.FileType,
                    url = a.Url
                }),
                read = m.Read,
                readAt = m.ReadAt,
                createdAt = m.CreatedAt,
                edited = m.Edited
            })
            .ToListAsync();

        return Ok(ApiResponse.Success(new
        {
            messages = messages.OrderBy(m => m.createdAt), // Orden ascendente para UI
            total,
            page,
            totalPages = (int)Math.Ceiling(total / (double)limit)
        }));
    }

    [HttpPost("upload-attachment")]
    public async Task<IActionResult> UploadAttachment(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(ApiResponse.Error("Archivo no válido"));

        // Validar tamaño (máx 10MB)
        if (file.Length > 10 * 1024 * 1024)
            return BadRequest(ApiResponse.Error("Archivo muy grande (máx 10MB)"));

        // Validar tipo
        var allowedTypes = new[] { "image/jpeg", "image/png", "application/pdf", "application/msword" };
        if (!allowedTypes.Contains(file.ContentType))
            return BadRequest(ApiResponse.Error("Tipo de archivo no permitido"));

        var url = await _fileStorage.UploadAsync(file, "message-attachments");

        return Ok(ApiResponse.Success(new
        {
            url,
            fileName = file.FileName,
            fileType = file.ContentType,
            fileSize = file.Length
        }));
    }

    [HttpDelete("{messageId}")]
    public async Task<IActionResult> DeleteMessage(Guid messageId)
    {
        var userId = User.GetUserId();
        var message = await _context.Messages.FindAsync(messageId);

        if (message == null)
            return NotFound();

        if (message.SenderId != userId)
            return Forbid();

        // Soft delete
        message.Deleted = true;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse.Success(new { message = "Mensaje eliminado" }));
    }
}
```

**Configuración en Program.cs:**
```csharp
builder.Services.AddSignalR();

app.MapHub<MessagesHub>("/hubs/messages");
```

**Optimizaciones:**
- Paginación infinita en frontend
- Indicadores de "escribiendo..." con debounce
- Notificaciones push con OneSignal/Firebase
- Encriptación end-to-end opcional
- Límite de caracteres por mensaje (5000)
- Rate limiting para prevenir spam

---

## 📧 PROMPT 5: CONFIRMACIONES AUTOMÁTICAS Y NOTIFICACIONES

### Contexto
Sistema completo de notificaciones multi-canal (email, SMS, WhatsApp, push) con templates personalizables, envío automático basado en eventos, y soporte para recordatorios programados.

### Requerimientos Técnicos

**Base de Datos:**
```sql
-- Templates de email
CREATE TABLE email_templates (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  subject VARCHAR(500),
  html_body TEXT,
  text_body TEXT,
  variables JSONB, -- ["{{userName}}", "{{bookingId}}", etc]
  category VARCHAR(50), -- booking_confirmation, reminder, cancellation, etc
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notificaciones enviadas
CREATE TABLE sent_notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  type VARCHAR(50), -- email, sms, whatsapp, push
  channel VARCHAR(50), -- booking_confirmation, reminder, etc
  subject VARCHAR(500),
  content TEXT,
  status VARCHAR(50), -- sent, failed, pending
  sent_at TIMESTAMP NULL,
  error_message TEXT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Configuración de notificaciones de usuario
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  whatsapp_enabled BOOLEAN DEFAULT false,
  marketing_emails BOOLEAN DEFAULT true,
  booking_reminders BOOLEAN DEFAULT true,
  price_alerts BOOLEAN DEFAULT true
);

-- Cola de notificaciones programadas
CREATE TABLE scheduled_notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  type VARCHAR(50),
  scheduled_for TIMESTAMP NOT NULL,
  sent BOOLEAN DEFAULT false,
  data JSONB
);
```

**Implementación Backend (.NET):**

```csharp
// NotificationService.cs
public class NotificationService : INotificationService
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ISmsService _smsService;
    private readonly IWhatsAppService _whatsAppService;
    private readonly IPushNotificationService _pushService;
    private readonly ILogger<NotificationService> _logger;

    public async Task SendBookingConfirmationAsync(Booking booking)
    {
        var user = await _context.Users.FindAsync(booking.UserId);
        var service = await _context.Services
            .Include(s => s.Provider)
            .FirstOrDefaultAsync(s => s.Id == booking.ServiceId);

        var template = await _context.EmailTemplates
            .FirstOrDefaultAsync(t => t.Name == "booking_confirmation" && t.Active);

        if (template == null)
        {
            _logger.LogError("Template 'booking_confirmation' not found");
            return;
        }

        // Generar voucher PDF
        var voucherUrl = await _voucherService.GenerateVoucherAsync(booking.Id);

        // Reemplazar variables en el template
        var variables = new Dictionary<string, string>
        {
            { "{{userName}}", user.FirstName },
            { "{{bookingId}}", booking.Id.ToString() },
            { "{{serviceName}}", service.Name },
            { "{{providerName}}", service.Provider.BusinessName },
            { "{{date}}", booking.Date.ToString("dddd, dd MMMM yyyy", new CultureInfo("es-CO")) },
            { "{{time}}", booking.TimeSlot },
            { "{{guests}}", booking.Guests.ToString() },
            { "{{totalPrice}}", $"${booking.TotalPrice:N0} COP" },
            { "{{voucherUrl}}", voucherUrl },
            { "{{qrCode}}", await _qrService.GenerateQRCodeAsync(booking.Id) }
        };

        var subject = ReplaceVariables(template.Subject, variables);
        var htmlBody = ReplaceVariables(template.HtmlBody, variables);
        var textBody = ReplaceVariables(template.TextBody, variables);

        // Obtener preferencias del usuario
        var prefs = await GetNotificationPreferencesAsync(user.Id);

        // Enviar email
        if (prefs.EmailEnabled)
        {
            await _emailService.SendAsync(new EmailMessage
            {
                To = user.Email,
                Subject = subject,
                HtmlBody = htmlBody,
                TextBody = textBody,
                Attachments = new[] { new EmailAttachment { Url = voucherUrl, FileName = "Voucher.pdf" } }
            });

            await LogNotificationAsync(user.Id, user.Email, "email", "booking_confirmation", subject, htmlBody, "sent");
        }

        // Enviar SMS
        if (prefs.SmsEnabled && !string.IsNullOrEmpty(user.PhoneNumber))
        {
            var smsText = $"¡Reserva confirmada! {service.Name} - {booking.Date:dd/MM/yyyy} a las {booking.TimeSlot}. Tu código de reserva: {booking.Id}. Ver voucher: {voucherUrl}";

            await _smsService.SendAsync(user.PhoneNumber, smsText);
            await LogNotificationAsync(user.Id, null, "sms", "booking_confirmation", null, smsText, "sent");
        }

        // Programar recordatorios
        await ScheduleRemindersAsync(booking);
    }

    private async Task ScheduleRemindersAsync(Booking booking)
    {
        var bookingDateTime = booking.Date.Add(TimeSpan.Parse(booking.TimeSlot ?? "00:00"));

        // Recordatorio 24 horas antes
        var reminder24h = bookingDateTime.AddHours(-24);
        if (reminder24h > DateTime.UtcNow)
        {
            _context.ScheduledNotifications.Add(new ScheduledNotification
            {
                UserId = booking.UserId,
                BookingId = booking.Id,
                Type = "reminder_24h",
                ScheduledFor = reminder24h,
                Data = JsonSerializer.SerializeToDocument(new { booking.Id, booking.ServiceId })
            });
        }

        // Recordatorio 1 hora antes
        var reminder1h = bookingDateTime.AddHours(-1);
        if (reminder1h > DateTime.UtcNow)
        {
            _context.ScheduledNotifications.Add(new ScheduledNotification
            {
                UserId = booking.UserId,
                BookingId = booking.Id,
                Type = "reminder_1h",
                ScheduledFor = reminder1h,
                Data = JsonSerializer.SerializeToDocument(new { booking.Id, booking.ServiceId })
            });
        }

        await _context.SaveChangesAsync();
    }

    private string ReplaceVariables(string template, Dictionary<string, string> variables)
    {
        foreach (var variable in variables)
        {
            template = template.Replace(variable.Key, variable.Value);
        }
        return template;
    }
}

// BackgroundService para procesar notificaciones programadas
public class NotificationSchedulerService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<NotificationSchedulerService> _logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Notification Scheduler Service iniciado");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

                // Obtener notificaciones pendientes
                var pendingNotifications = await context.ScheduledNotifications
                    .Where(n => !n.Sent && n.ScheduledFor <= DateTime.UtcNow)
                    .Include(n => n.Booking).ThenInclude(b => b.Service)
                    .Include(n => n.User)
                    .ToListAsync(stoppingToken);

                foreach (var notification in pendingNotifications)
                {
                    try
                    {
                        await ProcessScheduledNotificationAsync(notification, notificationService);

                        notification.Sent = true;
                        await context.SaveChangesAsync(stoppingToken);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Error procesando notificación {notification.Id}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en Notification Scheduler Service");
            }

            // Ejecutar cada minuto
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }

    private async Task ProcessScheduledNotificationAsync(
        ScheduledNotification notification,
        INotificationService notificationService)
    {
        switch (notification.Type)
        {
            case "reminder_24h":
                await notificationService.SendBookingReminderAsync(
                    notification.Booking, "24 horas");
                break;

            case "reminder_1h":
                await notificationService.SendBookingReminderAsync(
                    notification.Booking, "1 hora");
                break;

            default:
                _logger.LogWarning($"Tipo de notificación desconocido: {notification.Type}");
                break;
        }
    }
}

// EmailService.cs (usando SendGrid/SMTP)
public class EmailService : IEmailService
{
    private readonly SendGridClient _client;
    private readonly IConfiguration _configuration;

    public async Task<bool> SendAsync(EmailMessage message)
    {
        var from = new EmailAddress(_configuration["SendGrid:FromEmail"], "WildTour");
        var to = new EmailAddress(message.To);

        var msg = MailHelper.CreateSingleEmail(
            from,
            to,
            message.Subject,
            message.TextBody,
            message.HtmlBody
        );

        // Adjuntar archivos
        if (message.Attachments != null && message.Attachments.Any())
        {
            foreach (var attachment in message.Attachments)
            {
                var fileBytes = await DownloadFileAsync(attachment.Url);
                msg.AddAttachment(attachment.FileName, Convert.ToBase64String(fileBytes));
            }
        }

        var response = await _client.SendEmailAsync(msg);
        return response.IsSuccessStatusCode;
    }
}

// SmsService.cs (usando Twilio)
public class SmsService : ISmsService
{
    private readonly TwilioRestClient _client;
    private readonly string _fromNumber;

    public async Task<bool> SendAsync(string phoneNumber, string message)
    {
        var messageResource = await MessageResource.CreateAsync(
            body: message,
            from: new PhoneNumber(_fromNumber),
            to: new PhoneNumber(phoneNumber),
            client: _client
        );

        return messageResource.Status != MessageResource.StatusEnum.Failed;
    }
}

// WhatsAppService.cs (usando Twilio WhatsApp API)
public class WhatsAppService : IWhatsAppService
{
    private readonly TwilioRestClient _client;
    private readonly string _fromNumber;

    public async Task<bool> SendAsync(string phoneNumber, string message, string mediaUrl = null)
    {
        var messageResource = await MessageResource.CreateAsync(
            body: message,
            from: new PhoneNumber($"whatsapp:{_fromNumber}"),
            to: new PhoneNumber($"whatsapp:{phoneNumber}"),
            mediaUrl: mediaUrl != null ? new[] { new Uri(mediaUrl) } : null,
            client: _client
        );

        return messageResource.Status != MessageResource.StatusEnum.Failed;
    }
}
```

**Configuración en Program.cs:**
```csharp
// Registrar servicios
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<ISmsService, SmsService>();
builder.Services.AddTransient<IWhatsAppService, WhatsAppService>();
builder.Services.AddTransient<INotificationService, NotificationService>();

// Registrar background service
builder.Services.AddHostedService<NotificationSchedulerService>();

// Configurar SendGrid
builder.Services.AddSingleton(new SendGridClient(builder.Configuration["SendGrid:ApiKey"]));

// Configurar Twilio
TwilioClient.Init(
    builder.Configuration["Twilio:AccountSid"],
    builder.Configuration["Twilio:AuthToken"]
);
```

**appsettings.json:**
```json
{
  "SendGrid": {
    "ApiKey": "SG.xxx",
    "FromEmail": "noreply@wildtour.com",
    "FromName": "WildTour"
  },
  "Twilio": {
    "AccountSid": "ACxxx",
    "AuthToken": "xxx",
    "PhoneNumber": "+1234567890",
    "WhatsAppNumber": "+1234567890"
  }
}
```

**Funcionalidades Adicionales:**
- Templates editables desde admin panel
- A/B testing de templates
- Analytics de tasas de apertura/click
- Unsubscribe links automáticos
- Retry logic para emails fallidos
- Rate limiting para prevenir spam

---

## 🎫 PROMPT 6: VOUCHER DIGITAL CON QR Y VALIDACIÓN

### Contexto
Sistema de generación de vouchers digitales en PDF con códigos QR únicos, descarga, envío automático, y validación en el punto de servicio usando escáner QR.

### Requerimientos Técnicos

**Base de Datos:**
```sql
-- QR Codes generados
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) UNIQUE,
  qr_data TEXT NOT NULL, -- Data encriptada
  qr_image_url TEXT,
  generated_at TIMESTAMP DEFAULT NOW(),
  validated BOOLEAN DEFAULT false,
  validated_at TIMESTAMP NULL,
  validated_by UUID REFERENCES users(id) NULL
);

-- Log de validaciones
CREATE TABLE qr_validations (
  id UUID PRIMARY KEY,
  qr_code_id UUID REFERENCES qr_codes(id),
  validated_by UUID REFERENCES users(id),
  location JSONB, -- {lat, lng}
  device_info TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Implementación Backend (.NET):**

```csharp
// VoucherService.cs
public class VoucherService : IVoucherService
{
    private readonly ApplicationDbContext _context;
    private readonly IQRCodeService _qrService;
    private readonly IPdfService _pdfService;
    private readonly IFileStorageService _fileStorage;

    public async Task<string> GenerateVoucherAsync(Guid bookingId)
    {
        var booking = await _context.Bookings
            .Include(b => b.Service).ThenInclude(s => s.Provider)
            .Include(b => b.User)
            .Include(b => b.Travelers)
            .FirstOrDefaultAsync(b => b.Id == bookingId);

        if (booking == null)
            throw new NotFoundException("Reserva no encontrada");

        // Generar QR code
        var qrCode = await _qrService.GenerateQRCodeAsync(booking.Id);

        // Generar PDF
        var pdfBytes = await GenerateVoucherPdfAsync(booking, qrCode.ImageUrl);

        // Subir a storage
        var fileName = $"voucher_{booking.Id}.pdf";
        var url = await _fileStorage.UploadBytesAsync(pdfBytes, "vouchers", fileName);

        // Actualizar booking
        booking.VoucherUrl = url;
        await _context.SaveChangesAsync();

        return url;
    }

    private async Task<byte[]> GenerateVoucherPdfAsync(Booking booking, string qrImageUrl)
    {
        var html = GenerateVoucherHtml(booking, qrImageUrl);
        return await _pdfService.GeneratePdfFromHtmlAsync(html);
    }

    private string GenerateVoucherHtml(Booking booking, string qrImageUrl)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset=""UTF-8"">
  <style>
    @page {{ size: A4; margin: 0; }}
    body {{ font-family: Arial, sans-serif; margin: 0; padding: 0; }}
    .voucher {{
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      background: white;
    }}
    .header {{
      text-align: center;
      border-bottom: 3px solid #667eea;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }}
    .logo {{ font-size: 36px; font-weight: bold; color: #667eea; }}
    .booking-id {{
      background: #f0f0f0;
      padding: 10px 20px;
      border-radius: 5px;
      display: inline-block;
      margin: 10px 0;
      font-family: monospace;
      font-size: 18px;
    }}
    .section {{
      margin: 20px 0;
      padding: 15px;
      background: #f9f9f9;
      border-left: 4px solid #667eea;
    }}
    .section-title {{
      font-size: 18px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 10px;
    }}
    .detail-row {{
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px dotted #ddd;
    }}
    .qr-section {{
      text-align: center;
      margin: 30px 0;
      padding: 20px;
      background: #f0f0f0;
      border-radius: 10px;
    }}
    .qr-code {{ width: 200px; height: 200px; }}
    .important {{
      background: #fff3cd;
      border: 2px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }}
    .footer {{
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 12px;
      color: #666;
    }}
  </style>
</head>
<body>
  <div class=""voucher"">
    <div class=""header"">
      <div class=""logo"">WILDTOUR</div>
      <h2>Voucher de Reserva</h2>
      <div class=""booking-id"">#{booking.Id}</div>
    </div>

    <div class=""section"">
      <div class=""section-title"">👤 Información del Cliente</div>
      <div class=""detail-row"">
        <span><strong>Nombre:</strong></span>
        <span>{booking.User.FirstName} {booking.User.LastName}</span>
      </div>
      <div class=""detail-row"">
        <span><strong>Email:</strong></span>
        <span>{booking.User.Email}</span>
      </div>
      <div class=""detail-row"">
        <span><strong>Teléfono:</strong></span>
        <span>{booking.User.PhoneNumber}</span>
      </div>
    </div>

    <div class=""section"">
      <div class=""section-title"">🎯 Detalles del Servicio</div>
      <div class=""detail-row"">
        <span><strong>Servicio:</strong></span>
        <span>{booking.Service.Name}</span>
      </div>
      <div class=""detail-row"">
        <span><strong>Proveedor:</strong></span>
        <span>{booking.Service.Provider.BusinessName}</span>
      </div>
      <div class=""detail-row"">
        <span><strong>RNT:</strong></span>
        <span>{booking.Service.Provider.Rnt}</span>
      </div>
      <div class=""detail-row"">
        <span><strong>Fecha:</strong></span>
        <span>{booking.Date:dddd, dd MMMM yyyy}</span>
      </div>
      <div class=""detail-row"">
        <span><strong>Hora:</strong></span>
        <span>{booking.TimeSlot}</span>
      </div>
      <div class=""detail-row"">
        <span><strong>Número de personas:</strong></span>
        <span>{booking.Guests}</span>
      </div>
    </div>

    <div class=""section"">
      <div class=""section-title"">💳 Información de Pago</div>
      <div class=""detail-row"">
        <span><strong>Precio del servicio:</strong></span>
        <span>${booking.TotalPrice:N0} COP</span>
      </div>
      <div class=""detail-row"">
        <span><strong>Estado del pago:</strong></span>
        <span style=""color: green; font-weight: bold;"">✓ PAGADO</span>
      </div>
      <div class=""detail-row"">
        <span><strong>Fecha de pago:</strong></span>
        <span>{booking.CreatedAt:dd/MM/yyyy HH:mm}</span>
      </div>
    </div>

    <div class=""qr-section"">
      <div class=""section-title"">📱 Código QR de Validación</div>
      <p>Presenta este código QR al proveedor para validar tu reserva</p>
      <img src=""{qrImageUrl}"" alt=""QR Code"" class=""qr-code"" />
      <p style=""font-size: 12px; color: #666; margin-top: 10px;"">
        Código: {booking.Id}
      </p>
    </div>

    <div class=""important"">
      <strong>⚠️ Instrucciones Importantes:</strong>
      <ul style=""margin: 10px 0;"">
        <li>Llega 15 minutos antes de la hora programada</li>
        <li>Presenta este voucher (impreso o digital) al proveedor</li>
        <li>Trae un documento de identidad válido</li>
        <li>Para cancelaciones, comunícate con al menos 48 horas de anticipación</li>
      </ul>
    </div>

    <div class=""footer"">
      <p>
        Este voucher fue generado electrónicamente y es válido sin firma.<br>
        Para consultas: soporte@wildtour.com | +57 (300) 123-4567<br>
        © 2025 WildTour - Todos los derechos reservados
      </p>
    </div>
  </div>
</body>
</html>";
    }
}

// QRCodeService.cs
public class QRCodeService : IQRCodeService
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorageService _fileStorage;
    private readonly IDataProtectionProvider _dataProtection;

    public async Task<QRCodeResult> GenerateQRCodeAsync(Guid bookingId)
    {
        // Verificar si ya existe
        var existing = await _context.QRCodes.FirstOrDefaultAsync(q => q.BookingId == bookingId);
        if (existing != null && !string.IsNullOrEmpty(existing.QrImageUrl))
            return new QRCodeResult { Id = existing.Id, ImageUrl = existing.QrImageUrl };

        // Crear data encriptada
        var dataProtector = _dataProtection.CreateProtector("QRCodeProtection");
        var qrData = JsonSerializer.Serialize(new
        {
            bookingId,
            timestamp = DateTime.UtcNow,
            random = Guid.NewGuid().ToString()
        });
        var encryptedData = dataProtector.Protect(qrData);

        // Generar imagen QR
        using var qrGenerator = new QRCodeGenerator();
        var qrCodeData = qrGenerator.CreateQrCode(encryptedData, QRCodeGenerator.ECCLevel.Q);
        using var qrCode = new PngByteQRCode(qrCodeData);
        var qrImageBytes = qrCode.GetGraphic(20);

        // Subir a storage
        var fileName = $"qr_{bookingId}.png";
        var url = await _fileStorage.UploadBytesAsync(qrImageBytes, "qr-codes", fileName);

        // Guardar en BD
        var qrCodeEntity = new QRCode
        {
            BookingId = bookingId,
            QrData = encryptedData,
            QrImageUrl = url
        };

        if (existing != null)
        {
            existing.QrData = encryptedData;
            existing.QrImageUrl = url;
            existing.GeneratedAt = DateTime.UtcNow;
        }
        else
        {
            _context.QRCodes.Add(qrCodeEntity);
        }

        await _context.SaveChangesAsync();

        return new QRCodeResult { Id = qrCodeEntity.Id, ImageUrl = url };
    }

    public async Task<QRValidationResult> ValidateQRCodeAsync(string qrData, Guid validatedBy, string ipAddress, string deviceInfo)
    {
        try
        {
            // Desencriptar data
            var dataProtector = _dataProtection.CreateProtector("QRCodeProtection");
            var decryptedData = dataProtector.Unprotect(qrData);
            var data = JsonSerializer.Deserialize<QRDataModel>(decryptedData);

            // Buscar QR code
            var qrCode = await _context.QRCodes
                .Include(q => q.Booking).ThenInclude(b => b.Service)
                .Include(q => q.Booking).ThenInclude(b => b.User)
                .FirstOrDefaultAsync(q => q.BookingId == data.BookingId);

            if (qrCode == null)
                return new QRValidationResult { IsValid = false, Message = "Código QR no válido" };

            // Verificar que el proveedor sea el correcto
            var validator = await _context.Users.FindAsync(validatedBy);
            if (validator.Role != "provider" || qrCode.Booking.Service.ProviderId != validatedBy)
                return new QRValidationResult { IsValid = false, Message = "No tienes permisos para validar esta reserva" };

            // Verificar si ya fue validado
            if (qrCode.Validated)
            {
                return new QRValidationResult
                {
                    IsValid = false,
                    Message = $"Este código QR ya fue validado el {qrCode.ValidatedAt:dd/MM/yyyy HH:mm}",
                    AlreadyUsed = true
                };
            }

            // Verificar fecha de la reserva
            var bookingDateTime = qrCode.Booking.Date.Add(TimeSpan.Parse(qrCode.Booking.TimeSlot ?? "00:00"));
            if (DateTime.Now < bookingDateTime.AddHours(-2) || DateTime.Now > bookingDateTime.AddHours(24))
            {
                return new QRValidationResult
                {
                    IsValid = false,
                    Message = "Fuera del rango de tiempo permitido para validación"
                };
            }

            // Marcar como validado
            qrCode.Validated = true;
            qrCode.ValidatedAt = DateTime.UtcNow;
            qrCode.ValidatedBy = validatedBy;

            // Actualizar estado de reserva
            qrCode.Booking.Status = "completed";

            // Registrar validación
            _context.QRValidations.Add(new QRValidation
            {
                QrCodeId = qrCode.Id,
                ValidatedBy = validatedBy,
                IpAddress = ipAddress,
                DeviceInfo = deviceInfo
            });

            await _context.SaveChangesAsync();

            return new QRValidationResult
            {
                IsValid = true,
                Message = "Código QR validado exitosamente",
                Booking = new BookingInfo
                {
                    Id = qrCode.Booking.Id,
                    ServiceName = qrCode.Booking.Service.Name,
                    GuestName = qrCode.Booking.GuestName ?? $"{qrCode.Booking.User.FirstName} {qrCode.Booking.User.LastName}",
                    GuestEmail = qrCode.Booking.GuestEmail ?? qrCode.Booking.User.Email,
                    Date = qrCode.Booking.Date,
                    TimeSlot = qrCode.Booking.TimeSlot,
                    Guests = qrCode.Booking.Guests,
                    TotalPrice = qrCode.Booking.TotalPrice
                }
            };
        }
        catch (Exception ex)
        {
            return new QRValidationResult { IsValid = false, Message = "Error al validar código QR" };
        }
    }
}

// PdfService.cs (usando IronPDF o similar)
public class PdfService : IPdfService
{
    public async Task<byte[]> GeneratePdfFromHtmlAsync(string html)
    {
        var renderer = new ChromePdfRenderer();

        // Configuración
        renderer.RenderingOptions.PaperSize = PdfPaperSize.A4;
        renderer.RenderingOptions.MarginTop = 0;
        renderer.RenderingOptions.MarginBottom = 0;
        renderer.RenderingOptions.MarginLeft = 0;
        renderer.RenderingOptions.MarginRight = 0;
        renderer.RenderingOptions.CssMediaType = PdfCssMediaType.Print;

        var pdf = await renderer.RenderHtmlAsPdfAsync(html);
        return pdf.BinaryData;
    }
}

// BookingsController.cs
[ApiController]
[Route("api/bookings")]
[Authorize]
public class BookingsController : ControllerBase
{
    [HttpGet("{bookingId}/voucher")]
    public async Task<IActionResult> GetVoucher(Guid bookingId)
    {
        var userId = User.GetUserId();
        var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);

        if (booking == null)
            return NotFound();

        // Verificar acceso
        if (booking.UserId != userId && !User.IsInRole("admin"))
            return Forbid();

        // Si ya tiene voucher, devolverlo
        if (!string.IsNullOrEmpty(booking.VoucherUrl))
            return Ok(ApiResponse.Success(new { voucherUrl = booking.VoucherUrl }));

        // Generar nuevo voucher
        var voucherUrl = await _voucherService.GenerateVoucherAsync(bookingId);
        return Ok(ApiResponse.Success(new { voucherUrl }));
    }

    [HttpGet("{bookingId}/qr")]
    public async Task<IActionResult> GetQRCode(Guid bookingId)
    {
        var userId = User.GetUserId();
        var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);

        if (booking == null)
            return NotFound();

        if (booking.UserId != userId && !User.IsInRole("admin"))
            return Forbid();

        var qrCode = await _qrService.GenerateQRCodeAsync(bookingId);
        return Ok(ApiResponse.Success(new { qrImageUrl = qrCode.ImageUrl }));
    }

    [Authorize(Roles = "Provider")]
    [HttpPost("validate-qr")]
    public async Task<IActionResult> ValidateQR([FromBody] ValidateQRRequest request)
    {
        var userId = User.GetUserId();
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var deviceInfo = Request.Headers["User-Agent"].ToString();

        var result = await _qrService.ValidateQRCodeAsync(
            request.QrCode, userId, ipAddress, deviceInfo);

        if (!result.IsValid)
            return BadRequest(ApiResponse.Error(result.Message));

        return Ok(ApiResponse.Success(result));
    }

    [HttpGet("download-voucher/{bookingId}")]
    public async Task<IActionResult> DownloadVoucher(Guid bookingId)
    {
        var userId = User.GetUserId();
        var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);

        if (booking == null)
            return NotFound();

        if (booking.UserId != userId && !User.IsInRole("admin"))
            return Forbid();

        if (string.IsNullOrEmpty(booking.VoucherUrl))
        {
            // Generar voucher si no existe
            booking.VoucherUrl = await _voucherService.GenerateVoucherAsync(bookingId);
        }

        // Descargar archivo del storage
        var fileBytes = await _fileStorage.DownloadAsync(booking.VoucherUrl);

        return File(fileBytes, "application/pdf", $"Voucher_{bookingId}.pdf");
    }
}
```

**Configuración en Program.cs:**
```csharp
builder.Services.AddTransient<IVoucherService, VoucherService>();
builder.Services.AddTransient<IQRCodeService, QRCodeService>();
builder.Services.AddTransient<IPdfService, PdfService>();

// Data Protection para encriptación de QR
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(@"./keys"))
    .SetApplicationName("WildTour");

// IronPDF License (si se usa)
IronPdf.License.LicenseKey = builder.Configuration["IronPdf:LicenseKey"];
```

**Funcionalidades Adicionales:**
- Vouchers multilenguaje
- Walletpass para Apple Wallet / Google Pay
- Notificación cuando voucher es validado
- Historial de validaciones por proveedor
- Exportación de reportes de validaciones
- Anti-fraud: límite de validaciones por dispositivo

---

## ⭐ PROMPT 7: RESEÑAS VERIFICADAS

### Contexto
Sistema completo de reseñas que garantiza autenticidad mediante verificación de reserva completada, permite respuestas del proveedor, marcación de utilidad, reportes, y moderación.

### Requerimientos Técnicos

**Base de Datos:**
```sql
-- Reseñas
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  service_id UUID REFERENCES services(id),
  booking_id UUID REFERENCES bookings(id) UNIQUE, -- Una reseña por reserva
  rating DECIMAL(2,1) CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT,
  verified_purchase BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, flagged
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categorías de rating
CREATE TABLE review_ratings (
  id UUID PRIMARY KEY,
  review_id UUID REFERENCES reviews(id),
  category VARCHAR(100), -- cleanliness, location, service, value, etc
  rating DECIMAL(2,1) CHECK (rating >= 1 AND rating <= 5)
);

-- Fotos de reseñas
CREATE TABLE review_photos (
  id UUID PRIMARY KEY,
  review_id UUID REFERENCES reviews(id),
  url TEXT NOT NULL,
  caption VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Marcas de "útil"
CREATE TABLE review_helpful (
  id UUID PRIMARY KEY,
  review_id UUID REFERENCES reviews(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Respuestas del proveedor
CREATE TABLE review_replies (
  id UUID PRIMARY KEY,
  review_id UUID REFERENCES reviews(id),
  provider_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reportes
CREATE TABLE review_reports (
  id UUID PRIMARY KEY,
  review_id UUID REFERENCES reviews(id),
  user_id UUID REFERENCES users(id),
  reason VARCHAR(100), -- spam, inappropriate, fake, offensive
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_reviews_service ON reviews(service_id, status);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_booking ON reviews(booking_id);
```

**Endpoints Requeridos:**

1. **POST /api/reviews/create**
```json
Request:
{
  "bookingId": "uuid",
  "rating": 4.5,
  "title": "Excelente experiencia en el desierto",
  "content": "El tour fue increíble, guías muy profesionales...",
  "categoryRatings": {
    "service": 5.0,
    "value": 4.5,
    "guide": 5.0,
    "location": 4.0
  },
  "photos": ["url1", "url2"]
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Reseña publicada exitosamente"
  }
}
```

2. **GET /api/reviews/can-review/{bookingId}**
```json
Response:
{
  "success": true,
  "data": {
    "canReview": true,
    "reason": null
  }
}

// O si no puede:
{
  "success": true,
  "data": {
    "canReview": false,
    "reason": "La reserva debe estar completada para dejar una reseña"
  }
}
```

**Implementación Backend (.NET):**

```csharp
// ReviewsController.cs
[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IReviewService _reviewService;

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreateReview([FromBody] CreateReviewRequest request)
    {
        var userId = User.GetUserId();

        // Verificar que el booking existe y pertenece al usuario
        var booking = await _context.Bookings
            .Include(b => b.Service)
            .FirstOrDefaultAsync(b => b.Id == request.BookingId);

        if (booking == null)
            return NotFound(ApiResponse.Error("Reserva no encontrada"));

        if (booking.UserId != userId)
            return Forbid();

        // Verificar que el booking está completado
        if (booking.Status != "completed")
            return BadRequest(ApiResponse.Error("La reserva debe estar completada para dejar una reseña"));

        // Verificar que no existe una reseña previa para este booking
        var existingReview = await _context.Reviews
            .FirstOrDefaultAsync(r => r.BookingId == request.BookingId);

        if (existingReview != null)
            return BadRequest(ApiResponse.Error("Ya existe una reseña para esta reserva"));

        // Crear reseña
        var review = new Review
        {
            UserId = userId,
            ServiceId = booking.ServiceId,
            BookingId = request.BookingId,
            Rating = request.Rating,
            Title = request.Title,
            Content = request.Content,
            VerifiedPurchase = true,
            Status = "approved" // Auto-aprobar reseñas verificadas
        };

        _context.Reviews.Add(review);

        // Agregar ratings por categoría
        if (request.CategoryRatings != null)
        {
            foreach (var category in request.CategoryRatings)
            {
                _context.ReviewRatings.Add(new ReviewRating
                {
                    ReviewId = review.Id,
                    Category = category.Key,
                    Rating = category.Value
                });
            }
        }

        // Agregar fotos
        if (request.Photos != null && request.Photos.Any())
        {
            foreach (var photoUrl in request.Photos)
            {
                _context.ReviewPhotos.Add(new ReviewPhoto
                {
                    ReviewId = review.Id,
                    Url = photoUrl
                });
            }
        }

        await _context.SaveChangesAsync();

        // Actualizar rating promedio del servicio
        await _reviewService.UpdateServiceAverageRatingAsync(booking.ServiceId);

        // Notificar al proveedor
        await _notificationService.NotifyProviderNewReviewAsync(booking.Service.ProviderId, review.Id);

        return Ok(ApiResponse.Success(new
        {
            id = review.Id,
            message = "Reseña publicada exitosamente"
        }));
    }

    [HttpGet("can-review/{bookingId}")]
    [Authorize]
    public async Task<IActionResult> CanReview(Guid bookingId)
    {
        var userId = User.GetUserId();
        var booking = await _context.Bookings.FindAsync(bookingId);

        if (booking == null)
            return NotFound(ApiResponse.Error("Reserva no encontrada"));

        if (booking.UserId != userId)
            return Forbid();

        // Verificar si ya existe una reseña
        var existingReview = await _context.Reviews
            .FirstOrDefaultAsync(r => r.BookingId == bookingId);

        if (existingReview != null)
        {
            return Ok(ApiResponse.Success(new
            {
                canReview = false,
                reason = "Ya has dejado una reseña para esta reserva"
            }));
        }

        // Verificar que la reserva está completada
        if (booking.Status != "completed")
        {
            return Ok(ApiResponse.Success(new
            {
                canReview = false,
                reason = "La reserva debe estar completada para dejar una reseña"
            }));
        }

        // Verificar que no han pasado más de 90 días
        if (booking.Date.AddDays(90) < DateTime.UtcNow)
        {
            return Ok(ApiResponse.Success(new
            {
                canReview = false,
                reason = "El plazo para dejar una reseña ha expirado (90 días)"
            }));
        }

        return Ok(ApiResponse.Success(new
        {
            canReview = true,
            reason = (string)null
        }));
    }

    [HttpGet("service/{serviceId}")]
    public async Task<IActionResult> GetServiceReviews(
        Guid serviceId,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string sort = "recent") // recent, helpful, rating_high, rating_low
    {
        var query = _context.Reviews
            .Where(r => r.ServiceId == serviceId && r.Status == "approved")
            .Include(r => r.User)
            .Include(r => r.Photos)
            .Include(r => r.CategoryRatings)
            .Include(r => r.Reply)
            .AsQueryable();

        // Ordenamiento
        query = sort switch
        {
            "helpful" => query.OrderByDescending(r => r.HelpfulCount),
            "rating_high" => query.OrderByDescending(r => r.Rating),
            "rating_low" => query.OrderBy(r => r.Rating),
            _ => query.OrderByDescending(r => r.CreatedAt)
        };

        var total = await query.CountAsync();
        var reviews = await query
            .Skip((page - 1) * limit)
            .Take(limit)
            .Select(r => new
            {
                id = r.Id,
                user = new
                {
                    name = $"{r.User.FirstName} {r.User.LastName.Substring(0, 1)}.",
                    avatar = r.User.Avatar,
                    reviewsCount = r.User.Reviews.Count
                },
                rating = r.Rating,
                title = r.Title,
                content = r.Content,
                verifiedPurchase = r.VerifiedPurchase,
                categoryRatings = r.CategoryRatings.ToDictionary(cr => cr.Category, cr => cr.Rating),
                photos = r.Photos.Select(p => p.Url).ToList(),
                helpfulCount = r.HelpfulCount,
                reply = r.Reply != null ? new
                {
                    content = r.Reply.Content,
                    createdAt = r.Reply.CreatedAt
                } : null,
                createdAt = r.CreatedAt
            })
            .ToListAsync();

        // Calcular estadísticas
        var stats = await _context.Reviews
            .Where(r => r.ServiceId == serviceId && r.Status == "approved")
            .GroupBy(r => 1)
            .Select(g => new
            {
                averageRating = g.Average(r => r.Rating),
                totalReviews = g.Count(),
                distribution = new
                {
                    five = g.Count(r => r.Rating >= 4.5),
                    four = g.Count(r => r.Rating >= 3.5 && r.Rating < 4.5),
                    three = g.Count(r => r.Rating >= 2.5 && r.Rating < 3.5),
                    two = g.Count(r => r.Rating >= 1.5 && r.Rating < 2.5),
                    one = g.Count(r => r.Rating < 1.5)
                }
            })
            .FirstOrDefaultAsync();

        return Ok(ApiResponse.Success(new
        {
            reviews,
            total,
            page,
            totalPages = (int)Math.Ceiling(total / (double)limit),
            stats
        }));
    }

    [Authorize]
    [HttpPost("{id}/helpful")]
    public async Task<IActionResult> MarkAsHelpful(Guid id)
    {
        var userId = User.GetUserId();

        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
            return NotFound();

        // Verificar si ya marcó como útil
        var existing = await _context.ReviewHelpful
            .FirstOrDefaultAsync(rh => rh.ReviewId == id && rh.UserId == userId);

        bool userMarked;
        if (existing != null)
        {
            // Remover marca
            _context.ReviewHelpful.Remove(existing);
            review.HelpfulCount = Math.Max(0, review.HelpfulCount - 1);
            userMarked = false;
        }
        else
        {
            // Agregar marca
            _context.ReviewHelpful.Add(new ReviewHelpful
            {
                ReviewId = id,
                UserId = userId
            });
            review.HelpfulCount++;
            userMarked = true;
        }

        await _context.SaveChangesAsync();

        return Ok(ApiResponse.Success(new
        {
            helpfulCount = review.HelpfulCount,
            userMarked
        }));
    }

    [Authorize(Roles = "Provider")]
    [HttpPost("{id}/reply")]
    public async Task<IActionResult> ReplyToReview(Guid id, [FromBody] ReplyToReviewRequest request)
    {
        var userId = User.GetUserId();

        var review = await _context.Reviews
            .Include(r => r.Service)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (review == null)
            return NotFound();

        // Verificar que el proveedor es dueño del servicio
        if (review.Service.ProviderId != userId)
            return Forbid();

        // Verificar si ya existe una respuesta
        var existingReply = await _context.ReviewReplies
            .FirstOrDefaultAsync(rr => rr.ReviewId == id);

        if (existingReply != null)
        {
            // Actualizar respuesta existente
            existingReply.Content = request.Content;
            existingReply.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            // Crear nueva respuesta
            var reply = new ReviewReply
            {
                ReviewId = id,
                ProviderId = userId,
                Content = request.Content
            };
            _context.ReviewReplies.Add(reply);
        }

        await _context.SaveChangesAsync();

        // Notificar al usuario que dejó la reseña
        await _notificationService.NotifyUserReviewReplyAsync(review.UserId, id);

        return Ok(ApiResponse.Success(new
        {
            replyId = existingReply?.Id ?? Guid.NewGuid(),
            createdAt = DateTime.UtcNow
        }));
    }

    [Authorize]
    [HttpPost("{id}/report")]
    public async Task<IActionResult> ReportReview(Guid id, [FromBody] ReportReviewRequest request)
    {
        var userId = User.GetUserId();

        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
            return NotFound();

        // Verificar si ya reportó esta reseña
        var existing = await _context.ReviewReports
            .FirstOrDefaultAsync(rr => rr.ReviewId == id && rr.UserId == userId);

        if (existing != null)
            return BadRequest(ApiResponse.Error("Ya has reportado esta reseña"));

        var report = new ReviewReport
        {
            ReviewId = id,
            UserId = userId,
            Reason = request.Reason,
            Description = request.Description,
            Status = "pending"
        };

        _context.ReviewReports.Add(report);
        await _context.SaveChangesAsync();

        // Notificar a moderadores
        await _notificationService.NotifyModeratorsReviewReportAsync(id, report.Id);

        return Ok(ApiResponse.Success(new
        {
            message = "Reporte enviado. Nuestro equipo lo revisará pronto."
        }));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/verify")]
    public async Task<IActionResult> VerifyReview(Guid id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
            return NotFound();

        review.VerifiedPurchase = true;
        review.Status = "approved";
        await _context.SaveChangesAsync();

        return Ok(ApiResponse.Success(new { message = "Reseña verificada" }));
    }
}

// ReviewService.cs
public class ReviewService : IReviewService
{
    private readonly ApplicationDbContext _context;

    public async Task UpdateServiceAverageRatingAsync(Guid serviceId)
    {
        var service = await _context.Services.FindAsync(serviceId);
        if (service == null) return;

        var reviews = await _context.Reviews
            .Where(r => r.ServiceId == serviceId && r.Status == "approved")
            .ToListAsync();

        if (reviews.Any())
        {
            service.AverageRating = reviews.Average(r => r.Rating);
            service.ReviewsCount = reviews.Count;

            // Calcular ratings por categoría
            var categoryRatings = await _context.ReviewRatings
                .Where(rr => reviews.Select(r => r.Id).Contains(rr.ReviewId))
                .GroupBy(rr => rr.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Average = g.Average(rr => rr.Rating)
                })
                .ToDictionaryAsync(x => x.Category, x => x.Average);

            service.CategoryRatings = JsonSerializer.SerializeToDocument(categoryRatings);
        }
        else
        {
            service.AverageRating = 0;
            service.ReviewsCount = 0;
        }

        await _context.SaveChangesAsync();
    }
}
```

**Funcionalidades Adicionales:**
- Detección automática de reseñas falsas con ML
- Verificación de fotos con IA (detección de stock photos)
- Traducción automática de reseñas
- Resumen de reseñas con IA
- Incentivos para dejar reseñas (puntos de lealtad)
- Destacar "Reseñas más útiles"
- Filtros avanzados (con fotos, verificadas, por rating, por fecha)

---

# 🛠️ STACK TECNOLÓGICO BACKEND

## Tecnologías Principales
```
- Framework: ASP.NET Core 8.0
- Lenguaje: C# 12
- ORM: Entity Framework Core
- Base de Datos: PostgreSQL 15+ / SQL Server
- Caché: Redis
- WebSocket: SignalR
- Auth: JWT + ASP.NET Identity
- Validación: FluentValidation
- Testing: xUnit + Moq
- API Docs: Swagger/OpenAPI
```

## Servicios de Terceros
```
- Emails: SendGrid
- SMS: Twilio
- WhatsApp: Twilio Business API
- Pagos: MercadoPago
- Storage: AWS S3 / Azure Blob Storage
- PDF: IronPDF / QuestPDF
- QR Codes: QRCoder
- Push Notifications: OneSignal / Firebase
```

## Configuración Recomendada (Program.cs)
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Redis Cache
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});

// Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// SignalR
builder.Services.AddSignalR();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173", "https://wildtour.com")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Services
builder.Services.AddTransient<ISearchService, SearchService>();
builder.Services.AddTransient<IAvailabilityService, AvailabilityService>();
builder.Services.AddTransient<ICheckoutService, CheckoutService>();
builder.Services.AddTransient<INotificationService, NotificationService>();
builder.Services.AddTransient<IVoucherService, VoucherService>();
builder.Services.AddTransient<IReviewService, ReviewService>();

// Background Services
builder.Services.AddHostedService<NotificationSchedulerService>();

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// SignalR Hubs
app.MapHub<MessagesHub>("/hubs/messages");
app.MapHub<AvailabilityHub>("/hubs/availability");

app.Run();
```

---

# 📝 PRÓXIMOS PASOS

## Semana 1-2: Búsqueda y Disponibilidad
1. Implementar endpoints de búsqueda avanzada
2. Configurar Elasticsearch (opcional) o PostgreSQL full-text search
3. Crear servicio de calendario de disponibilidad
4. Configurar SignalR para actualizaciones en tiempo real

## Semana 3-4: Checkout y Pagos
1. Implementar sistema de sesiones de checkout
2. Sistema de cupones y descuentos
3. Integración con múltiples métodos de pago
4. Validación de disponibilidad antes de pago

## Semana 5-6: Comunicaciones
1. Configurar SendGrid para emails
2. Integrar Twilio para SMS y WhatsApp
3. Sistema de templates personalizables
4. Background service para notificaciones programadas

## Semana 7-8: Vouchers y Reseñas
1. Generación de PDF con IronPDF
2. Sistema de QR codes con encriptación
3. Endpoints de reseñas verificadas
4. Sistema de moderación y reportes

---

# 📊 MÉTRICAS Y MONITOREO

## KPIs Técnicos
- Tiempo de respuesta API: < 200ms (p95)
- Uptime: > 99.5%
- Tasa de errores: < 0.1%
- Cobertura de tests: > 80%

## Logging y Monitoreo
```csharp
// Usar Serilog para logging estructurado
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// Application Insights para monitoreo
builder.Services.AddApplicationInsightsTelemetry();
```

---

**¡Éxito con la implementación del backend de WildTour! 🚀**
