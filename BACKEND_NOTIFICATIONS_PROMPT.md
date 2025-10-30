# Prompt para Implementar Sistema de Notificaciones en Backend .NET

## Contexto
Necesito implementar un sistema completo de notificaciones para mi aplicación de turismo WildTour. El frontend ya está listo y espera los siguientes endpoints.

## Modelo de Datos

```csharp
public class Notification
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Type { get; set; } // "booking", "favorite", "review", "system", "promotion"
    public string Title { get; set; }
    public string Message { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Link { get; set; }

    // Relación
    public User User { get; set; }
}

public class NotificationPreferences
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public bool EmailNotifications { get; set; }
    public bool PushNotifications { get; set; }
    public bool BookingNotifications { get; set; }
    public bool PromotionNotifications { get; set; }
    public bool ReviewNotifications { get; set; }

    // Relación
    public User User { get; set; }
}
```

## Endpoints Requeridos

### 1. GET /api/Notifications
**Descripción**: Obtener todas las notificaciones del usuario autenticado
**Autorización**: Sí (Bearer Token)
**Respuesta**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 4,
      "type": "booking",
      "title": "Reserva confirmada",
      "message": "Tu reserva para el tour en Villavieja ha sido confirmada",
      "isRead": false,
      "createdAt": "2025-01-23T10:30:00Z",
      "link": "/mis-reservas"
    }
  ],
  "message": "Notificaciones obtenidas exitosamente",
  "errors": []
}
```

### 2. GET /api/Notifications/unread/count
**Descripción**: Obtener el conteo de notificaciones no leídas
**Autorización**: Sí
**Respuesta**:
```json
{
  "success": true,
  "data": {
    "count": 5
  },
  "message": "Conteo obtenido exitosamente",
  "errors": []
}
```

### 3. PUT /api/Notifications/{id}/read
**Descripción**: Marcar una notificación como leída
**Autorización**: Sí
**Parámetros**: id (int) - ID de la notificación
**Respuesta**:
```json
{
  "success": true,
  "data": null,
  "message": "Notificación marcada como leída",
  "errors": []
}
```

### 4. PUT /api/Notifications/read-all
**Descripción**: Marcar todas las notificaciones como leídas
**Autorización**: Sí
**Respuesta**:
```json
{
  "success": true,
  "data": null,
  "message": "Todas las notificaciones marcadas como leídas",
  "errors": []
}
```

### 5. DELETE /api/Notifications/{id}
**Descripción**: Eliminar una notificación específica
**Autorización**: Sí
**Parámetros**: id (int) - ID de la notificación
**Respuesta**:
```json
{
  "success": true,
  "data": null,
  "message": "Notificación eliminada exitosamente",
  "errors": []
}
```

### 6. DELETE /api/Notifications
**Descripción**: Eliminar todas las notificaciones del usuario
**Autorización**: Sí
**Respuesta**:
```json
{
  "success": true,
  "data": null,
  "message": "Todas las notificaciones eliminadas",
  "errors": []
}
```

### 7. GET /api/Notifications/preferences
**Descripción**: Obtener preferencias de notificaciones del usuario
**Autorización**: Sí
**Respuesta**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 4,
    "emailNotifications": true,
    "pushNotifications": true,
    "bookingNotifications": true,
    "promotionNotifications": false,
    "reviewNotifications": true
  },
  "message": "Preferencias obtenidas exitosamente",
  "errors": []
}
```

### 8. PUT /api/Notifications/preferences
**Descripción**: Actualizar preferencias de notificaciones
**Autorización**: Sí
**Body**:
```json
{
  "emailNotifications": true,
  "pushNotifications": false,
  "bookingNotifications": true,
  "promotionNotifications": false,
  "reviewNotifications": true
}
```
**Respuesta**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 4,
    "emailNotifications": true,
    "pushNotifications": false,
    "bookingNotifications": true,
    "promotionNotifications": false,
    "reviewNotifications": true
  },
  "message": "Preferencias actualizadas exitosamente",
  "errors": []
}
```

## Requerimientos Técnicos

1. **Autenticación**: Todos los endpoints requieren JWT Bearer Token
2. **Validación**: El usuario solo puede acceder a sus propias notificaciones
3. **Ordenamiento**: Las notificaciones deben venir ordenadas por `CreatedAt` DESC (más recientes primero)
4. **Soft Delete**: Opcional - podrías implementar eliminación suave
5. **Base de datos**: Agregar las tablas `Notifications` y `NotificationPreferences`
6. **Migraciones**: Crear las migraciones necesarias
7. **Repositorio**: Seguir el patrón Repository si lo estás usando
8. **DTOs**: Crear DTOs para request/response si es necesario

## Funcionalidades Adicionales (Bonus)

1. **Servicio de notificaciones**: Crear un `NotificationService` que pueda ser inyectado en otros controladores para crear notificaciones automáticamente
2. **Eventos**: Crear notificaciones automáticas cuando:
   - Se confirma una reserva
   - Se recibe una nueva reseña
   - Hay una promoción disponible
   - El sistema tiene actualizaciones importantes
3. **Paginación**: Agregar paginación opcional al endpoint GET /api/Notifications
4. **Filtros**: Agregar query params opcionales para filtrar por tipo o fecha

## Ejemplo de Uso del Servicio

```csharp
public class NotificationService
{
    private readonly ApplicationDbContext _context;

    public async Task CreateNotification(int userId, string type, string title, string message, string? link = null)
    {
        var notification = new Notification
        {
            UserId = userId,
            Type = type,
            Title = title,
            Message = message,
            Link = link,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
    }
}
```

## Testing

Por favor, proporciona ejemplos de cómo probar los endpoints con:
- Swagger
- cURL
- Postman (opcional)

## Notas Importantes

- Mi frontend ya está listo y espera exactamente esta estructura de respuesta
- La URL base es: `http://localhost:5116/api`
- Estoy usando .NET 8 (ajusta si usas otra versión)
- El formato de respuesta debe ser consistente con el resto de la API:
```json
{
  "success": bool,
  "data": object,
  "message": string,
  "errors": string[]
}
```

Por favor, implementa todos los endpoints con sus controladores, servicios, repositorios, modelos y migraciones necesarias. Incluye manejo de errores y validaciones apropiadas.
