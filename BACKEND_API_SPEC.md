# Wild Tour Colombia - Especificación API Backend

## 📋 Resumen

Este documento especifica las APIs necesarias para el sistema de publicaciones tipo Facebook de Wild Tour Colombia, donde los prestadores de servicios pueden publicar y gestionar sus ofertas turísticas.

## 🚀 Endpoints Principales

### Base URL
```
http://localhost:3001/api
```

## 🔐 Autenticación

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <jwt_token>
```

---

## 📝 Service Posts (Publicaciones de Servicios)

### GET `/service-posts`
Obtener feed de publicaciones con filtros

**Query Parameters:**
- `page` (number, opcional): Número de página (default: 1)
- `limit` (number, opcional): Elementos por página (default: 10)
- `serviceType` (string, opcional): Tipo de servicio
- `location` (string, opcional): Ubicación
- `priceMin` (number, opcional): Precio mínimo
- `priceMax` (number, opcional): Precio máximo

**Response:**
```json
{
  "posts": [
    {
      "id": "string",
      "provider": {
        "id": "string",
        "name": "string",
        "avatar": "string",
        "businessName": "string",
        "rating": "number",
        "totalReviews": "number",
        "location": {
          "city": "string",
          "department": "string"
        },
        "verified": "boolean",
        "joinedDate": "string"
      },
      "title": "string",
      "description": "string",
      "images": ["string"],
      "serviceType": "guia|transporte|alojamiento|comida|actividad|experiencia",
      "price": {
        "amount": "number",
        "currency": "string",
        "unit": "string"
      },
      "location": {
        "name": "string",
        "coordinates": {
          "lat": "number",
          "lng": "number"
        }
      },
      "availability": {
        "dates": ["string"],
        "maxCapacity": "number",
        "currentBookings": "number"
      },
      "features": ["string"],
      "tags": ["string"],
      "createdAt": "string",
      "updatedAt": "string",
      "likes": "number",
      "shares": "number",
      "isLiked": "boolean",
      "isBookmarked": "boolean"
    }
  ],
  "total": "number",
  "hasMore": "boolean"
}
```

### GET `/service-posts/:id`
Obtener una publicación específica

**Response:**
```json
{
  // Mismo formato que el objeto post de arriba
}
```

### POST `/service-posts`
Crear nueva publicación (solo prestadores)

**Content-Type:** `multipart/form-data`

**Fields:**
- `title` (string): Título del servicio
- `description` (string): Descripción detallada
- `serviceType` (string): Tipo de servicio
- `price` (JSON string): Objeto precio
- `location` (JSON string): Objeto ubicación
- `availability` (JSON string): Objeto disponibilidad
- `features` (JSON string): Array de características
- `tags` (JSON string): Array de tags
- `images` (File[]): Archivos de imagen

**Response:**
```json
{
  // Objeto post creado
}
```

### PUT `/service-posts/:id`
Actualizar publicación (solo dueño)

**Content-Type:** `multipart/form-data`

**Fields:** Mismos que POST (todos opcionales)

### DELETE `/service-posts/:id`
Eliminar publicación (solo dueño)

**Response:** `204 No Content`

### POST `/service-posts/:id/like`
Dar like a una publicación

**Response:**
```json
{
  // Objeto post actualizado con nuevo conteo de likes
}
```

### POST `/service-posts/:id/unlike`
Quitar like de una publicación

### POST `/service-posts/:id/bookmark`
Guardar/quitar de favoritos

---

## 💬 Comments (Comentarios)

### GET `/service-posts/:postId/comments`
Obtener comentarios de una publicación

**Query Parameters:**
- `page` (number, opcional)
- `limit` (number, opcional)

**Response:**
```json
{
  "comments": [
    {
      "id": "string",
      "user": {
        "id": "string",
        "name": "string",
        "avatar": "string"
      },
      "servicePostId": "string",
      "content": "string",
      "createdAt": "string",
      "likes": "number",
      "isLiked": "boolean",
      "replies": [
        // Array de comentarios anidados (mismo formato)
      ]
    }
  ],
  "total": "number"
}
```

### POST `/service-posts/:postId/comments`
Crear comentario

**Body:**
```json
{
  "content": "string"
}
```

### POST `/comments/:commentId/like`
Dar like a un comentario

---

## ⭐ Reviews (Reseñas)

### GET `/service-posts/:postId/reviews`
Obtener reseñas de una publicación

**Response:**
```json
{
  "reviews": [
    {
      "id": "string",
      "user": {
        "id": "string",
        "name": "string",
        "avatar": "string"
      },
      "servicePostId": "string",
      "rating": "number",
      "comment": "string",
      "images": ["string"],
      "createdAt": "string",
      "helpful": "number",
      "isHelpful": "boolean"
    }
  ],
  "total": "number"
}
```

### POST `/service-posts/:postId/reviews`
Crear reseña

**Content-Type:** `multipart/form-data`

**Fields:**
- `rating` (number): Calificación 1-5
- `comment` (string): Comentario de la reseña
- `images` (File[], opcional): Imágenes de la reseña

### POST `/reviews/:reviewId/helpful`
Marcar reseña como útil

---

## 👤 Authentication & Users

### POST `/auth/login`
Iniciar sesión

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "avatar": "string",
    "role": "user|provider|admin",
    "verified": "boolean"
  }
}
```

### POST `/auth/register`
Registrar usuario

**Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "user|provider"
}
```

### GET `/auth/me`
Obtener perfil del usuario autenticado

---

## 📁 File Upload

### POST `/upload/images`
Subir imágenes

**Content-Type:** `multipart/form-data`

**Response:**
```json
{
  "urls": ["string"]
}
```

---

## 🗃️ Modelos de Base de Datos

### User
```javascript
{
  id: String (Primary Key),
  name: String,
  email: String (Unique),
  password: String (Hash),
  avatar: String (URL),
  role: Enum('user', 'provider', 'admin'),
  verified: Boolean,
  businessName: String (solo providers),
  location: {
    city: String,
    department: String
  },
  rating: Number,
  totalReviews: Number,
  joinedDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### ServicePost
```javascript
{
  id: String (Primary Key),
  providerId: String (Foreign Key -> User),
  title: String,
  description: Text,
  images: [String], // URLs
  serviceType: Enum('guia', 'transporte', 'alojamiento', 'comida', 'actividad', 'experiencia'),
  price: {
    amount: Number,
    currency: String,
    unit: String
  },
  location: {
    name: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  availability: {
    dates: [Date],
    maxCapacity: Number,
    currentBookings: Number
  },
  features: [String],
  tags: [String],
  likes: Number,
  shares: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Review
```javascript
{
  id: String (Primary Key),
  userId: String (Foreign Key -> User),
  servicePostId: String (Foreign Key -> ServicePost),
  rating: Number (1-5),
  comment: Text,
  images: [String], // URLs
  helpful: Number,
  createdAt: Date
}
```

### Comment
```javascript
{
  id: String (Primary Key),
  userId: String (Foreign Key -> User),
  servicePostId: String (Foreign Key -> ServicePost),
  parentId: String (Foreign Key -> Comment, for replies),
  content: Text,
  likes: Number,
  createdAt: Date
}
```

### PostLike
```javascript
{
  id: String (Primary Key),
  userId: String (Foreign Key -> User),
  servicePostId: String (Foreign Key -> ServicePost),
  createdAt: Date
}
```

### CommentLike
```javascript
{
  id: String (Primary Key),
  userId: String (Foreign Key -> User),
  commentId: String (Foreign Key -> Comment),
  createdAt: Date
}
```

### ReviewHelpful
```javascript
{
  id: String (Primary Key),
  userId: String (Foreign Key -> User),
  reviewId: String (Foreign Key -> Review),
  createdAt: Date
}
```

### Bookmark
```javascript
{
  id: String (Primary Key),
  userId: String (Foreign Key -> User),
  servicePostId: String (Foreign Key -> ServicePost),
  createdAt: Date
}
```

---

## 🛠️ Tecnologías Recomendadas

### Backend
- **Framework:** Node.js con Express.js o NestJS
- **Base de Datos:** MongoDB con Mongoose o PostgreSQL con Prisma
- **Autenticación:** JWT
- **Upload de Archivos:** Multer + Cloudinary/AWS S3
- **Validación:** Joi o Yup
- **Rate Limiting:** express-rate-limit

### Consideraciones Adicionales

1. **Paginación:** Implementar paginación cursor-based para mejor performance
2. **Cache:** Redis para cache de publicaciones populares
3. **Search:** Elasticsearch para búsqueda avanzada de servicios
4. **Notificaciones:** WebSockets para notificaciones en tiempo real
5. **Analytics:** Tracking de interacciones (views, clicks, etc.)
6. **Moderación:** Sistema para reportar contenido inapropiado

---

## 🔄 Estados del Frontend

El frontend ya está configurado para trabajar con esta API. Actualmente usa datos mock que puedes encontrar en:

- `src/data/mockServicePosts.ts`
- `src/infrastructure/services/servicePostApi.ts`

Para activar la integración real, cambia `USE_MOCK_DATA = false` en `servicePostApi.ts`.

---

## 🚀 Próximos Pasos

1. Implementar endpoints básicos de autenticación
2. Crear endpoints de service posts con CRUD completo
3. Implementar sistema de comentarios y reseñas
4. Agregar upload de imágenes
5. Implementar sistema de likes y bookmarks
6. Agregar filtros y búsqueda avanzada

¡El frontend está listo y esperando tu backend! 🎉