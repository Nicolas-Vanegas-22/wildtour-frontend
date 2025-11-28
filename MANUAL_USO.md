# 🛠️ MANUAL DE USO - WILDTOUR PLATFORM

**Versión:** 1.0
**Fecha:** Noviembre 2025
**Dirigido a:** Desarrolladores, Administradores y Equipo Técnico

---

## 📋 TABLA DE CONTENIDOS

1. [Introducción Técnica](#introducción-técnica)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Componentes Principales](#componentes-principales)
6. [Servicios API](#servicios-api)
7. [Estado y Store](#estado-y-store)
8. [Routing y Navegación](#routing-y-navegación)
9. [Autenticación y Seguridad](#autenticación-y-seguridad)
10. [Integración con Backend](#integración-con-backend)
11. [WebSockets y SignalR](#websockets-y-signalr)
12. [Gestión de Formularios](#gestión-de-formularios)
13. [Estilos y Theming](#estilos-y-theming)
14. [Optimización y Performance](#optimización-y-performance)
15. [Testing](#testing)
16. [Despliegue](#despliegue)
17. [Mantenimiento](#mantenimiento)
18. [Troubleshooting](#troubleshooting)

---

## 🎯 INTRODUCCIÓN TÉCNICA

### Propósito del Manual

Este manual proporciona información técnica detallada para desarrolladores que trabajarán con la plataforma WildTour, incluyendo:

- Configuración del entorno de desarrollo
- Estructura y arquitectura del código
- Guías de implementación de funcionalidades
- Mejores prácticas y patrones de diseño
- Resolución de problemas comunes

### Stack Tecnológico

#### Frontend

```json
{
  "runtime": "Node.js 18+",
  "framework": "React 18.2.0",
  "language": "TypeScript 5.0+",
  "buildTool": "Vite 4.3.0",
  "styling": "TailwindCSS 3.3.0",
  "stateManagement": "Zustand 4.3.0",
  "routing": "React Router 6.11.0",
  "forms": "React Hook Form 7.43.0 + Zod 3.21.0",
  "httpClient": "Axios 1.4.0",
  "realtime": "@microsoft/signalr 7.0.0",
  "animations": "Framer Motion 10.12.0",
  "icons": "Lucide React 0.263.0",
  "dateHandling": "date-fns 2.30.0"
}
```

#### Backend Integration

```json
{
  "api": ".NET 7.0 Web API",
  "database": "PostgreSQL 15",
  "realtime": "SignalR",
  "authentication": "JWT",
  "payments": "MercadoPago SDK",
  "email": "SendGrid",
  "storage": "Azure Blob Storage / AWS S3"
}
```

### Requisitos del Sistema

#### Para Desarrollo

- **Node.js:** v18.0.0 o superior
- **npm:** v9.0.0 o superior (o yarn 1.22+)
- **Git:** v2.30.0 o superior
- **Editor:** VS Code (recomendado) con extensiones:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript
  - GitLens

#### Hardware Recomendado

- **CPU:** 4 núcleos o más
- **RAM:** 8GB mínimo, 16GB recomendado
- **Disco:** 10GB de espacio libre
- **Conexión:** 5 Mbps o superior

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────┐
│              FRONTEND (React + TS)              │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │Presentation│ │Infrastructure│ │  Domain │     │
│  │  Layer   │ │   Layer    │ │  Layer  │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│       │              │              │          │
│       ▼              ▼              ▼          │
│  Components    API Services     Models         │
│  Pages/Hooks   HTTP/SignalR    Entities        │
│                                                 │
└─────────────────────┬───────────────────────────┘
                      │
                      │ HTTPS/WSS
                      ▼
┌─────────────────────────────────────────────────┐
│           BACKEND (.NET Web API)                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Controllers → Services → Repositories          │
│       │            │            │               │
│       ▼            ▼            ▼               │
│   SignalR      Business     Database            │
│   Hubs         Logic        (PostgreSQL)        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Patrón de Arquitectura: Clean Architecture

El proyecto sigue los principios de Clean Architecture:

```
src/
├── app/                    # Application layer
│   └── router.tsx          # Routing configuration
├── domain/                 # Domain layer (entities, interfaces)
│   ├── models/             # Domain models
│   └── interfaces/         # Contracts
├── infrastructure/         # Infrastructure layer
│   └── services/           # External services (API, storage)
├── presentation/           # Presentation layer
│   ├── components/         # React components
│   ├── pages/              # Page components
│   └── hooks/              # Custom React hooks
└── shared/                 # Shared utilities
    ├── utils/              # Helper functions
    └── constants/          # Constants
```

### Flujo de Datos

```
User Action → Component → Hook → Service → API
     ↓                                      │
  UI Update ← Store Update ← Response ←────┘
```

---

## ⚙️ INSTALACIÓN Y CONFIGURACIÓN

### Instalación Inicial

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/wildtour/wildtour-frontend.git
cd wildtour-frontend
```

#### 2. Instalar Dependencias

```bash
# Con npm
npm install

# O con yarn
yarn install
```

#### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SIGNALR_HUB_URL=http://localhost:5000

# External Services
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxxxx
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXX

# Environment
VITE_ENV=development

# Optional
VITE_ENABLE_ANALYTICS=false
VITE_SENTRY_DSN=
```

**Nota:** Nunca subas el archivo `.env` al repositorio. Usa `.env.example` como plantilla.

#### 4. Iniciar el Servidor de Desarrollo

```bash
npm run dev
# O
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`

### Scripts Disponibles

```json
{
  "scripts": {
    "dev": "vite",                          // Servidor de desarrollo
    "build": "tsc && vite build",           // Build de producción
    "preview": "vite preview",              // Preview del build
    "lint": "eslint . --ext ts,tsx",        // Linter
    "lint:fix": "eslint . --ext ts,tsx --fix", // Fix linter
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"", // Format code
    "type-check": "tsc --noEmit",           // Type checking
    "test": "vitest",                       // Run tests
    "test:ui": "vitest --ui",               // Tests con UI
    "test:coverage": "vitest --coverage"    // Coverage report
  }
}
```

### Configuración de VS Code

Crea `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

Extensiones recomendadas (`.vscode/extensions.json`):

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "usernamehw.errorlens",
    "eamodio.gitlens",
    "formulahendry.auto-rename-tag",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

---

## 📁 ESTRUCTURA DEL PROYECTO

### Árbol de Directorios Completo

```
wildtour-frontend/
├── public/                          # Static assets
│   ├── favicon.ico
│   ├── logo.svg
│   └── manifest.json
├── src/
│   ├── app/                         # Application setup
│   │   └── router.tsx               # React Router configuration
│   ├── domain/                      # Domain layer
│   │   ├── models/
│   │   │   ├── Service.ts
│   │   │   ├── User.ts
│   │   │   ├── Booking.ts
│   │   │   └── Review.ts
│   │   └── interfaces/
│   │       └── IAuthService.ts
│   ├── infrastructure/              # Infrastructure layer
│   │   ├── services/
│   │   │   ├── apiClient.ts         # Base API client
│   │   │   ├── authApi.ts
│   │   │   ├── searchApi.ts
│   │   │   ├── availabilityApi.ts
│   │   │   ├── checkoutApi.ts
│   │   │   ├── messagesApi.ts
│   │   │   └── reviewsApi.ts
│   │   └── config/
│   │       └── axios.config.ts
│   ├── presentation/                # Presentation layer
│   │   ├── components/
│   │   │   ├── search/
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── SearchResults.tsx
│   │   │   │   └── SearchFilters.tsx
│   │   │   ├── availability/
│   │   │   │   ├── AvailabilityCalendar.tsx
│   │   │   │   └── TimeSlotSelector.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── MultiStepCheckout.tsx
│   │   │   │   ├── steps/
│   │   │   │   │   ├── GuestInfoStep.tsx
│   │   │   │   │   ├── TravelersStep.tsx
│   │   │   │   │   ├── PaymentStep.tsx
│   │   │   │   │   └── ConfirmationStep.tsx
│   │   │   │   ├── CouponInput.tsx
│   │   │   │   └── OrderSummary.tsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   └── TypingIndicator.tsx
│   │   │   ├── reviews/
│   │   │   │   ├── ReviewForm.tsx
│   │   │   │   ├── ReviewCard.tsx
│   │   │   │   └── ReviewStats.tsx
│   │   │   ├── shared/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Spinner.tsx
│   │   │   └── layout/
│   │   │       ├── Header.tsx
│   │   │       ├── Footer.tsx
│   │   │       └── MobileNavigation.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Search.tsx
│   │   │   ├── ServiceDetail.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── MyBookings.tsx
│   │   │   ├── Messages.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   └── hooks/
│   │       ├── useSignalR.ts
│   │       ├── useDebounce.ts
│   │       ├── useAvailability.ts
│   │       └── useAuth.ts
│   ├── shared/                      # Shared resources
│   │   ├── utils/
│   │   │   ├── format.ts            # Formatting utilities
│   │   │   ├── validation.ts        # Validation functions
│   │   │   └── toast.ts             # Toast notifications
│   │   ├── constants/
│   │   │   ├── routes.ts
│   │   │   └── config.ts
│   │   └── types/
│   │       └── index.ts
│   ├── stores/                      # Zustand stores
│   │   ├── authStore.ts
│   │   ├── searchStore.ts
│   │   └── bookingStore.ts
│   ├── styles/                      # Global styles
│   │   ├── globals.css
│   │   └── tailwind.css
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Entry point
│   └── vite-env.d.ts                # Vite types
├── .env.example                     # Environment template
├── .eslintrc.json                   # ESLint config
├── .prettierrc                      # Prettier config
├── tsconfig.json                    # TypeScript config
├── tailwind.config.js               # Tailwind config
├── vite.config.ts                   # Vite config
├── package.json
└── README.md
```

### Convenciones de Nomenclatura

#### Archivos

- **Componentes:** PascalCase - `SearchBar.tsx`
- **Hooks:** camelCase con 'use' - `useDebounce.ts`
- **Utilities:** camelCase - `format.ts`
- **Constants:** camelCase - `routes.ts`
- **Types:** PascalCase - `Service.ts`

#### Código

```typescript
// Interfaces: PascalCase con prefijo 'I'
interface IUserService { }

// Types: PascalCase
type UserRole = 'tourist' | 'provider';

// Components: PascalCase
const SearchBar: React.FC<Props> = () => { }

// Functions: camelCase
function formatDate(date: Date): string { }

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:5000';

// Enums: PascalCase
enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed'
}
```

---

## 🧩 COMPONENTES PRINCIPALES

### Anatomía de un Componente

```typescript
// src/presentation/components/example/ExampleComponent.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'lucide-react';
import { exampleApi } from '@/infrastructure/services/exampleApi';
import { useExampleStore } from '@/stores/exampleStore';

// 1. Props interface
interface ExampleComponentProps {
  id: string;
  title: string;
  onAction?: (data: any) => void;
  className?: string;
}

// 2. Component definition
export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  id,
  title,
  onAction,
  className = ''
}) => {
  // 3. Hooks
  const navigate = useNavigate();
  const { data, loading } = useExampleStore();

  // 4. Local state
  const [localState, setLocalState] = useState<string>('');

  // 5. Effects
  useEffect(() => {
    fetchData();
  }, [id]);

  // 6. Handlers
  const fetchData = async () => {
    try {
      const result = await exampleApi.getData(id);
      setLocalState(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClick = () => {
    onAction?.(localState);
  };

  // 7. Early returns (loading, error states)
  if (loading) {
    return <Spinner />;
  }

  // 8. Render
  return (
    <div className={`component-container ${className}`}>
      <h2>{title}</h2>
      <button onClick={handleClick}>
        <Icon className="w-5 h-5" />
        Click me
      </button>
    </div>
  );
};
```

### SearchBar Component

**Ubicación:** `src/presentation/components/search/SearchBar.tsx`

**Propósito:** Barra de búsqueda con autocompletado inteligente

**Props:**
```typescript
interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  initialQuery?: string;
  placeholder?: string;
}
```

**Uso:**
```tsx
import { SearchBar } from '@/components/search/SearchBar';

function SearchPage() {
  const handleSearch = (query: string, filters: any) => {
    // Handle search logic
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      placeholder="¿A dónde quieres ir?"
    />
  );
}
```

**Características:**
- Debounce de 300ms en el input
- Autocompletado con API
- Highlighting de resultados
- Teclado navigation (↑↓ Enter)

### AvailabilityCalendar Component

**Ubicación:** `src/presentation/components/availability/AvailabilityCalendar.tsx`

**Propósito:** Calendario interactivo con disponibilidad en tiempo real

**Props:**
```typescript
interface AvailabilityCalendarProps {
  serviceId: string;
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
  minDate?: Date;
  maxDate?: Date;
}
```

**Uso:**
```tsx
import { AvailabilityCalendar } from '@/components/availability/AvailabilityCalendar';

function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <AvailabilityCalendar
      serviceId="service-123"
      onDateSelect={setSelectedDate}
      selectedDate={selectedDate || undefined}
    />
  );
}
```

**Estados de Disponibilidad:**
```typescript
type AvailabilityStatus =
  | 'available'    // Verde - Plazas disponibles
  | 'limited'      // Amarillo - Pocas plazas
  | 'sold_out'     // Rojo - Agotado
  | 'blocked';     // Gris - Bloqueado por prestador
```

### MultiStepCheckout Component

**Ubicación:** `src/presentation/components/checkout/MultiStepCheckout.tsx`

**Propósito:** Proceso de checkout en 4 pasos

**Estructura:**
```typescript
const steps = [
  { id: 1, name: 'Información', component: GuestInfoStep },
  { id: 2, name: 'Viajeros', component: TravelersStep },
  { id: 3, name: 'Pago', component: PaymentStep },
  { id: 4, name: 'Confirmación', component: ConfirmationStep }
];
```

**Estado Global:**
```typescript
interface CheckoutState {
  currentStep: number;
  formData: {
    guestInfo: GuestInfo;
    travelers: Traveler[];
    payment: PaymentInfo;
  };
}
```

**Uso:**
```tsx
import { MultiStepCheckout } from '@/components/checkout/MultiStepCheckout';

function CheckoutPage() {
  return <MultiStepCheckout />;
}
```

### ChatWindow Component

**Ubicación:** `src/presentation/components/chat/ChatWindow.tsx`

**Propósito:** Ventana de chat en tiempo real con SignalR

**Props:**
```typescript
interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
}
```

**SignalR Events:**
```typescript
// Listening
connection.on('ReceiveMessage', (message) => { });
connection.on('UserTyping', (data) => { });
connection.on('UserStoppedTyping', () => { });
connection.on('MessagesRead', (data) => { });

// Emitting
connection.invoke('SendMessage', conversationId, content);
connection.invoke('StartTyping', conversationId);
connection.invoke('StopTyping', conversationId);
```

---

## 🔌 SERVICIOS API

### Estructura de un Servicio API

```typescript
// src/infrastructure/services/exampleApi.ts

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const exampleApi = {
  // GET request
  getItem: async (id: string) => {
    const response = await axios.get(`${API_URL}/items/${id}`);
    return response.data;
  },

  // POST request
  createItem: async (data: CreateItemDto) => {
    const response = await axios.post(`${API_URL}/items`, data);
    return response.data;
  },

  // PUT request
  updateItem: async (id: string, data: UpdateItemDto) => {
    const response = await axios.put(`${API_URL}/items/${id}`, data);
    return response.data;
  },

  // DELETE request
  deleteItem: async (id: string) => {
    const response = await axios.delete(`${API_URL}/items/${id}`);
    return response.data;
  }
};
```

### Cliente API Base (apiClient.ts)

**Ubicación:** `src/infrastructure/services/apiClient.ts`

**Características:**
- Singleton instance
- Request/Response interceptors
- Automatic token injection
- Error handling
- Retry logic

**Implementación:**
```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token expiration
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient(
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
);
```

### Manejo de Errores

```typescript
// src/shared/utils/errorHandler.ts

import { AxiosError } from 'axios';
import { showToast } from './toast';

interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    // Network error
    if (!axiosError.response) {
      return {
        message: 'Error de conexión. Verifica tu internet.',
        statusCode: 0
      };
    }

    // API error
    const statusCode = axiosError.response.status;
    const errorData = axiosError.response.data;

    switch (statusCode) {
      case 400:
        return {
          message: errorData.message || 'Solicitud inválida',
          code: errorData.code,
          statusCode
        };
      case 401:
        return {
          message: 'No autorizado. Por favor inicia sesión.',
          statusCode
        };
      case 403:
        return {
          message: 'No tienes permisos para realizar esta acción.',
          statusCode
        };
      case 404:
        return {
          message: 'Recurso no encontrado.',
          statusCode
        };
      case 500:
        return {
          message: 'Error del servidor. Intenta más tarde.',
          statusCode
        };
      default:
        return {
          message: errorData.message || 'Ha ocurrido un error.',
          statusCode
        };
    }
  }

  return {
    message: 'Error desconocido',
    statusCode: 0
  };
};

// Uso en componentes
try {
  await searchApi.search(params);
} catch (error) {
  const apiError = handleApiError(error);
  showToast.error(apiError.message);
}
```

### Paginación

```typescript
// src/shared/types/pagination.ts

export interface PaginatedRequest {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Uso
export const reviewsApi = {
  getReviews: async (
    serviceId: string,
    params: PaginatedRequest
  ): Promise<PaginatedResponse<Review>> => {
    const response = await axios.get(
      `${API_URL}/reviews/service/${serviceId}`,
      { params }
    );
    return response.data;
  }
};
```

---

## 🗄️ ESTADO Y STORE

### Zustand Store Pattern

```typescript
// src/stores/authStore.ts

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'tourist' | 'provider' | 'admin';
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,

        // Actions
        login: async (email: string, password: string) => {
          set({ isLoading: true });

          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
              localStorage.setItem('token', data.data.token);
              set({
                user: data.data.user,
                token: data.data.token,
                isAuthenticated: true,
                isLoading: false
              });
            } else {
              throw new Error(data.message);
            }
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        logout: () => {
          localStorage.removeItem('token');
          set({
            user: null,
            token: null,
            isAuthenticated: false
          });
        },

        updateUser: (user: User) => {
          set({ user });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated
        })
      }
    ),
    { name: 'AuthStore' }
  )
);
```

### Uso del Store en Componentes

```typescript
import { useAuthStore } from '@/stores/authStore';

function ProfilePage() {
  // Seleccionar estado específico
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  // O seleccionar múltiples valores
  const { user, isAuthenticated, logout } = useAuthStore();

  // Evitar re-renders innecesarios con selector
  const userName = useAuthStore((state) => state.user?.name);

  return (
    <div>
      <h1>Hola, {userName}</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

### Store para Búsqueda

```typescript
// src/stores/searchStore.ts

import { create } from 'zustand';

interface SearchFilters {
  priceRange?: { min: number; max: number };
  categories?: string[];
  rating?: { min: number };
  services?: string[];
}

interface SearchState {
  query: string;
  filters: SearchFilters;
  results: Service[];
  facets: any;
  loading: boolean;
  error: string | null;

  setQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  setResults: (results: Service[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  filters: {},
  results: [],
  facets: null,
  loading: false,
  error: null,

  setQuery: (query) => set({ query }),

  setFilters: (filters) => set({ filters }),

  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value }
    })),

  clearFilters: () => set({ filters: {} }),

  setResults: (results) => set({ results, loading: false }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error, loading: false })
}));
```

---

## 🧭 ROUTING Y NAVEGACIÓN

### Configuración de React Router

```typescript
// src/app/router.tsx

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/presentation/components/layout/Layout';
import { ProtectedRoute } from '@/presentation/components/auth/ProtectedRoute';

// Lazy loading pages
const Home = lazy(() => import('@/presentation/pages/Home'));
const Search = lazy(() => import('@/presentation/pages/Search'));
const ServiceDetail = lazy(() => import('@/presentation/pages/ServiceDetail'));
const Checkout = lazy(() => import('@/presentation/pages/Checkout'));
const MyBookings = lazy(() => import('@/presentation/pages/MyBookings'));
const Messages = lazy(() => import('@/presentation/pages/Messages'));
const Profile = lazy(() => import('@/presentation/pages/Profile'));
const Login = lazy(() => import('@/presentation/pages/Login'));
const Register = lazy(() => import('@/presentation/pages/Register'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'search',
        element: <Search />
      },
      {
        path: 'service/:serviceId',
        element: <ServiceDetail />
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        )
      },
      {
        path: 'my-bookings',
        element: (
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        )
      },
      {
        path: 'messages',
        element: (
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
```

### ProtectedRoute Component

```typescript
// src/presentation/components/auth/ProtectedRoute.tsx

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'tourist' | 'provider' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // User doesn't have required role
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

### Navegación Programática

```typescript
import { useNavigate, useLocation } from 'react-router-dom';

function SomeComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = () => {
    // Navigate to a path
    navigate('/search');

    // Navigate with state
    navigate('/checkout', {
      state: { serviceId: '123', date: new Date() }
    });

    // Navigate back
    navigate(-1);

    // Replace current entry
    navigate('/login', { replace: true });
  };

  // Access passed state
  const { serviceId } = location.state || {};

  return <button onClick={handleNavigation}>Go</button>;
}
```

### Route Constants

```typescript
// src/shared/constants/routes.ts

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  SERVICE_DETAIL: (id: string) => `/service/${id}`,
  CHECKOUT: '/checkout',
  MY_BOOKINGS: '/my-bookings',
  MESSAGES: '/messages',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register'
} as const;

// Uso
navigate(ROUTES.SERVICE_DETAIL('service-123'));
```

---

## 🔐 AUTENTICACIÓN Y SEGURIDAD

### Flujo de Autenticación JWT

```
┌──────┐                 ┌──────┐                 ┌──────┐
│Client│                 │ API  │                 │  DB  │
└───┬──┘                 └───┬──┘                 └───┬──┘
    │                        │                        │
    │ POST /auth/login       │                        │
    │ {email, password}      │                        │
    ├───────────────────────>│                        │
    │                        │  Verify credentials    │
    │                        ├───────────────────────>│
    │                        │                        │
    │                        │<───────────────────────┤
    │                        │                        │
    │   200 OK               │                        │
    │   {token, user}        │                        │
    │<───────────────────────┤                        │
    │                        │                        │
    │ Store token in         │                        │
    │ localStorage           │                        │
    │                        │                        │
    │ GET /api/protected     │                        │
    │ Authorization: Bearer  │                        │
    │ {token}                │                        │
    ├───────────────────────>│                        │
    │                        │  Verify JWT            │
    │                        │                        │
    │   200 OK               │                        │
    │   {data}               │                        │
    │<───────────────────────┤                        │
```

### Login Implementation

```typescript
// src/presentation/pages/Login.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { showToast } from '@/shared/utils/toast';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres')
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      showToast.success('¡Bienvenido de vuelta!');

      // Redirect to where they came from or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      showToast.error(error.message || 'Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email')}
        type="email"
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        {...register('password')}
        type="password"
        placeholder="Contraseña"
      />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Iniciando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
```

### Token Management

```typescript
// src/shared/utils/tokenManager.ts

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }
};
```

### Refresh Token Logic

```typescript
// src/infrastructure/services/authApi.ts

import axios from 'axios';
import { tokenManager } from '@/shared/utils/tokenManager';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post('/api/auth/refresh', {
          refreshToken
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data.data;

        tokenManager.setToken(newToken);
        tokenManager.setRefreshToken(newRefreshToken);

        axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

### XSS Protection

```typescript
// src/shared/utils/sanitize.ts

import DOMPurify from 'dompurify';

export const sanitize = {
  html: (dirty: string): string => {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target']
    });
  },

  text: (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }
};

// Uso en componente
function ReviewContent({ content }: { content: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitize.html(content) }}
    />
  );
}
```

---

## 🔄 WEBSOCKETS Y SIGNALR

### useSignalR Hook

```typescript
// src/presentation/hooks/useSignalR.ts

import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

interface UseSignalROptions {
  autoReconnect?: boolean;
  accessTokenFactory?: () => string;
}

export const useSignalR = (
  hubUrl: string,
  options: UseSignalROptions = {}
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: options.accessTokenFactory || (() =>
          localStorage.getItem('token') || ''
        )
      })
      .withAutomaticReconnect(options.autoReconnect !== false ? {
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff
          return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
        }
      } : undefined)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        setIsConnected(true);
        setConnectionError(null);
      })
      .catch((err) => {
        console.error('SignalR Connection Error:', err);
        setConnectionError(err.toString());
      });

    connection.onreconnecting((error) => {
      console.log('SignalR Reconnecting...', error);
      setIsConnected(false);
    });

    connection.onreconnected((connectionId) => {
      console.log('SignalR Reconnected:', connectionId);
      setIsConnected(true);
    });

    connection.onclose((error) => {
      console.log('SignalR Connection Closed', error);
      setIsConnected(false);
    });

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [hubUrl, options.accessTokenFactory, options.autoReconnect]);

  const invoke = async (methodName: string, ...args: any[]) => {
    if (!connectionRef.current) {
      throw new Error('Connection not initialized');
    }

    try {
      return await connectionRef.current.invoke(methodName, ...args);
    } catch (error) {
      console.error(`Error invoking ${methodName}:`, error);
      throw error;
    }
  };

  const on = (eventName: string, callback: (...args: any[]) => void) => {
    connectionRef.current?.on(eventName, callback);
  };

  const off = (eventName: string, callback: (...args: any[]) => void) => {
    connectionRef.current?.off(eventName, callback);
  };

  return {
    connection: connectionRef.current,
    isConnected,
    connectionError,
    invoke,
    on,
    off
  };
};
```

### Uso en Componente de Chat

```typescript
import { useSignalR } from '@/hooks/useSignalR';
import { useEffect, useState } from 'react';

function ChatWindow({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { isConnected, invoke, on, off } = useSignalR('/hubs/messages');

  useEffect(() => {
    if (!isConnected) return;

    // Setup event listeners
    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleTyping = (data: { userId: string; name: string }) => {
      console.log(`${data.name} is typing...`);
    };

    on('ReceiveMessage', handleNewMessage);
    on('UserTyping', handleTyping);

    // Cleanup
    return () => {
      off('ReceiveMessage', handleNewMessage);
      off('UserTyping', handleTyping);
    };
  }, [isConnected, on, off]);

  const sendMessage = async (content: string) => {
    try {
      await invoke('SendMessage', conversationId, content);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      {!isConnected && <div>Connecting...</div>}
      {/* Chat UI */}
    </div>
  );
}
```

---

## 📝 GESTIÓN DE FORMULARIOS

### React Hook Form + Zod

```typescript
// src/presentation/components/checkout/steps/GuestInfoStep.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema
const guestInfoSchema = z.object({
  firstName: z.string().min(2, 'Mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Teléfono inválido'),
  documentType: z.enum(['CC', 'CE', 'PASSPORT']),
  documentNumber: z.string().min(5, 'Documento inválido')
});

type GuestInfoData = z.infer<typeof guestInfoSchema>;

export function GuestInfoStep({ onNext }: { onNext: (data: any) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<GuestInfoData>({
    resolver: zodResolver(guestInfoSchema),
    mode: 'onBlur' // Validate on blur
  });

  const onSubmit = async (data: GuestInfoData) => {
    console.log('Form data:', data);
    onNext({ guestInfo: data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Nombre</label>
        <input {...register('firstName')} />
        {errors.firstName && <span>{errors.firstName.message}</span>}
      </div>

      <div>
        <label>Apellido</label>
        <input {...register('lastName')} />
        {errors.lastName && <span>{errors.lastName.message}</span>}
      </div>

      <div>
        <label>Email</label>
        <input {...register('email')} type="email" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label>Teléfono</label>
        <input {...register('phone')} />
        {errors.phone && <span>{errors.phone.message}</span>}
      </div>

      <div>
        <label>Tipo de documento</label>
        <select {...register('documentType')}>
          <option value="CC">Cédula de ciudadanía</option>
          <option value="CE">Cédula de extranjería</option>
          <option value="PASSPORT">Pasaporte</option>
        </select>
      </div>

      <div>
        <label>Número de documento</label>
        <input {...register('documentNumber')} />
        {errors.documentNumber && <span>{errors.documentNumber.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Procesando...' : 'Continuar'}
      </button>
    </form>
  );
}
```

### Field Array (Viajeros Dinámicos)

```typescript
import { useForm, useFieldArray } from 'react-hook-form';

interface Traveler {
  fullName: string;
  document: string;
  birthDate: string;
  nationality: string;
}

export function TravelersStep() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      travelers: [{}] as Traveler[]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'travelers'
  });

  const onSubmit = (data: any) => {
    console.log('Travelers:', data.travelers);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <h3>Viajero {index + 1}</h3>

          <input
            {...register(`travelers.${index}.fullName`)}
            placeholder="Nombre completo"
          />

          <input
            {...register(`travelers.${index}.document`)}
            placeholder="Documento"
          />

          <input
            {...register(`travelers.${index}.birthDate`)}
            type="date"
          />

          <input
            {...register(`travelers.${index}.nationality`)}
            placeholder="Nacionalidad"
          />

          {fields.length > 1 && (
            <button type="button" onClick={() => remove(index)}>
              Eliminar
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={() => append({})}>
        Agregar viajero
      </button>

      <button type="submit">Continuar</button>
    </form>
  );
}
```

### Validaciones Personalizadas

```typescript
// src/shared/utils/validation.ts

import { z } from 'zod';

export const customValidations = {
  // Colombian phone number
  colombianPhone: z.string().regex(
    /^(\+57)?[1-9]\d{9}$/,
    'Número de teléfono colombiano inválido'
  ),

  // Colombian ID (Cédula)
  colombianId: z.string().regex(
    /^\d{6,10}$/,
    'Cédula de ciudadanía inválida'
  ),

  // Strong password
  strongPassword: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),

  // Future date
  futureDate: z.string().refine(
    (date) => new Date(date) > new Date(),
    'La fecha debe ser futura'
  ),

  // Age validation (18+)
  adultBirthDate: z.string().refine(
    (date) => {
      const age = new Date().getFullYear() - new Date(date).getFullYear();
      return age >= 18;
    },
    'Debes ser mayor de 18 años'
  )
};

// Uso
const schema = z.object({
  phone: customValidations.colombianPhone,
  password: customValidations.strongPassword,
  birthDate: customValidations.adultBirthDate
});
```

---

## 🎨 ESTILOS Y THEMING

### Configuración de TailwindCSS

```javascript
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#667eea',
          700: '#764ba2',
          800: '#075985',
          900: '#0c4a6e',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### CSS Global

```css
/* src/styles/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-neutral-50 text-neutral-900 antialiased;
  }

  h1 {
    @apply text-4xl font-bold;
  }

  h2 {
    @apply text-3xl font-bold;
  }

  h3 {
    @apply text-2xl font-semibold;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors;
  }

  .btn-secondary {
    @apply bg-neutral-200 hover:bg-neutral-300 text-neutral-900 px-6 py-3 rounded-xl font-semibold transition-colors;
  }

  .card {
    @apply bg-white rounded-2xl shadow-lg border border-neutral-200 p-6;
  }

  .input {
    @apply w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### Componentes Reutilizables con CVA

```typescript
// src/presentation/components/shared/Button.tsx

import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
        secondary: 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900 focus:ring-neutral-500',
        outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
        ghost: 'hover:bg-neutral-100 text-neutral-900',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

// Uso
<Button variant="primary" size="lg">Click me</Button>
<Button variant="outline" size="sm" isLoading>Guardando...</Button>
<Button variant="danger" fullWidth>Eliminar</Button>
```

### Dark Mode (Opcional)

```typescript
// src/shared/utils/theme.ts

export type Theme = 'light' | 'dark' | 'system';

export const themeManager = {
  get: (): Theme => {
    return (localStorage.getItem('theme') as Theme) || 'system';
  },

  set: (theme: Theme): void => {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  },

  toggle: (): void => {
    const current = themeManager.get();
    const next = current === 'light' ? 'dark' : 'light';
    themeManager.set(next);
  }
};

function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'dark' : 'light';
  }

  root.classList.remove('light', 'dark');
  root.classList.add(theme);
}

// Initialize on load
applyTheme(themeManager.get());
```

---

## ⚡ OPTIMIZACIÓN Y PERFORMANCE

### Code Splitting y Lazy Loading

```typescript
// src/app/router.tsx

import { lazy, Suspense } from 'react';
import { PageLoader } from '@/components/shared/PageLoader';

// Lazy load pages
const Home = lazy(() => import('@/pages/Home'));
const Search = lazy(() => import('@/pages/Search'));
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'));

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
      </Routes>
    </Suspense>
  );
}
```

### useMemo y useCallback

```typescript
import { useMemo, useCallback } from 'react';

function ExpensiveComponent({ data, onItemClick }: Props) {
  // Memoize expensive calculations
  const sortedData = useMemo(() => {
    return data.sort((a, b) => a.price - b.price);
  }, [data]);

  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.price, 0);
  }, [data]);

  // Memoize callbacks to prevent re-renders of children
  const handleClick = useCallback((id: string) => {
    onItemClick(id);
  }, [onItemClick]);

  return (
    <div>
      <p>Total: ${total}</p>
      {sortedData.map((item) => (
        <Item key={item.id} item={item} onClick={handleClick} />
      ))}
    </div>
  );
}
```

### React.memo para Componentes

```typescript
import { memo } from 'react';

interface ItemProps {
  id: string;
  title: string;
  price: number;
  onClick: (id: string) => void;
}

// Este componente solo se re-renderiza si sus props cambian
export const Item = memo<ItemProps>(({ id, title, price, onClick }) => {
  console.log('Rendering item:', id);

  return (
    <div onClick={() => onClick(id)}>
      <h3>{title}</h3>
      <p>${price}</p>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function (optional)
  // Return true if props are equal (don't re-render)
  return prevProps.id === nextProps.id &&
         prevProps.price === nextProps.price;
});
```

### Image Optimization

```typescript
// src/presentation/components/shared/OptimizedImage.tsx

import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
    </div>
  );
}
```

### Virtualization (Para Listas Largas)

```typescript
// npm install react-window

import { FixedSizeList as List } from 'react-window';

interface VirtualizedListProps {
  items: any[];
  itemHeight: number;
}

export function VirtualizedList({ items, itemHeight }: VirtualizedListProps) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ItemComponent item={items[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

### Bundle Analysis

```json
// package.json

{
  "scripts": {
    "build:analyze": "vite build --mode analyze"
  }
}
```

```typescript
// vite.config.ts

import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'form-vendor': ['react-hook-form', 'zod']
        }
      }
    }
  }
});
```

---

## 🧪 TESTING

### Configuración de Vitest

```typescript
// vitest.config.ts

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

```typescript
// src/tests/setup.ts

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

### Unit Tests

```typescript
// src/shared/utils/format.test.ts

import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from './format';

describe('formatCurrency', () => {
  it('should format Colombian pesos correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
    expect(formatCurrency(1000000)).toBe('$1,000,000');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-500)).toBe('-$500');
  });
});

describe('formatDate', () => {
  it('should format date in Spanish', () => {
    const date = new Date('2025-12-15');
    expect(formatDate(date)).toBe('15 de diciembre de 2025');
  });
});
```

### Component Tests

```typescript
// src/presentation/components/search/SearchBar.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar onSearch={() => {}} />);
    const input = screen.getByPlaceholderText(/a dónde quieres ir/i);
    expect(input).toBeInTheDocument();
  });

  it('calls onSearch when search button is clicked', async () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/a dónde quieres ir/i);
    const button = screen.getByRole('button', { name: /buscar/i });

    fireEvent.change(input, { target: { value: 'Cartagena' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('Cartagena', {});
    });
  });

  it('shows suggestions after typing', async () => {
    render(<SearchBar onSearch={() => {}} />);

    const input = screen.getByPlaceholderText(/a dónde quieres ir/i);
    fireEvent.change(input, { target: { value: 'Cart' } });

    await waitFor(() => {
      expect(screen.getByText(/cartagena/i)).toBeInTheDocument();
    });
  });
});
```

### Integration Tests

```typescript
// src/presentation/pages/Login.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from './Login';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Login Page', () => {
  it('should display validation errors for invalid inputs', async () => {
    renderWithRouter(<Login />);

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      expect(screen.getByText(/mínimo 8 caracteres/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid credentials', async () => {
    const mockLogin = vi.fn();
    vi.mock('@/stores/authStore', () => ({
      useAuthStore: () => ({ login: mockLogin })
    }));

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'user@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'Password123!' }
    });

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'Password123!');
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/search.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Search Flow', () => {
  test('should search for services and show results', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Enter search query
    await page.fill('[placeholder="¿A dónde quieres ir?"]', 'Cartagena');
    await page.click('button:has-text("Buscar")');

    // Wait for results
    await expect(page.locator('.service-card')).toHaveCount(10, { timeout: 5000 });

    // Click on first result
    await page.locator('.service-card').first().click();

    // Should navigate to service detail
    await expect(page).toHaveURL(/\/service\/.+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should apply filters', async ({ page }) => {
    await page.goto('http://localhost:5173/search?q=Cartagena');

    // Apply price filter
    await page.fill('input[placeholder="Mín"]', '100000');
    await page.fill('input[placeholder="Máx"]', '500000');

    // Apply category filter
    await page.check('label:has-text("Aventura")');

    // Wait for filtered results
    await expect(page.locator('.service-card')).toHaveCount.lessThan(10);
  });
});
```

---

## 🚀 DESPLIEGUE

### Build de Producción

```bash
# Build
npm run build

# Preview locally
npm run preview
```

El build generará archivos optimizados en la carpeta `dist/`.

### Variables de Entorno para Producción

```bash
# .env.production

VITE_API_URL=https://api.wildtour.com/api
VITE_SIGNALR_HUB_URL=https://api.wildtour.com
VITE_MERCADOPAGO_PUBLIC_KEY=PROD-xxxxxxxxxx
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXX
VITE_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Netlify Deployment

```toml
# netlify.toml

[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Vercel Deployment

```json
// vercel.json

{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Docker

```dockerfile
# Dockerfile

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf

server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

```bash
# Build and run
docker build -t wildtour-frontend .
docker run -p 80:80 wildtour-frontend
```

### CI/CD con GitHub Actions

```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_MERCADOPAGO_PUBLIC_KEY: ${{ secrets.VITE_MERCADOPAGO_PUBLIC_KEY }}

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './dist'
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 🔧 MANTENIMIENTO

### Actualización de Dependencias

```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar todas las dependencias menores
npm update

# Actualizar una dependencia específica
npm install react@latest

# Usar npm-check-updates para actualizaciones mayores
npx npm-check-updates -u
npm install
```

### Logs y Monitoreo

#### Sentry Integration

```typescript
// src/main.tsx

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: import.meta.env.VITE_ENV
  });
}
```

#### Google Analytics

```typescript
// src/shared/utils/analytics.ts

export const analytics = {
  pageview: (url: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: url
      });
    }
  },

  event: (action: string, params: any) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', action, params);
    }
  }
};

// Uso en componentes
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { analytics } from '@/shared/utils/analytics';

function App() {
  const location = useLocation();

  useEffect(() => {
    analytics.pageview(location.pathname);
  }, [location]);

  return <RouterProvider router={router} />;
}
```

### Performance Monitoring

```typescript
// src/shared/utils/performance.ts

export const performance = {
  mark: (name: string) => {
    window.performance.mark(name);
  },

  measure: (name: string, startMark: string, endMark: string) => {
    window.performance.measure(name, startMark, endMark);
    const measure = window.performance.getEntriesByName(name)[0];
    console.log(`${name}: ${measure.duration}ms`);
  },

  // Web Vitals
  reportWebVitals: () => {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
};

// Uso
performance.mark('search-start');
// ... código de búsqueda
performance.mark('search-end');
performance.measure('search', 'search-start', 'search-end');
```

---

## 🐛 TROUBLESHOOTING

### Problemas Comunes

#### 1. Error: "Module not found"

**Síntoma:** Error al importar módulos
```
Error: Cannot find module '@/components/SearchBar'
```

**Solución:**
```json
// Verificar tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// Verificar vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

#### 2. SignalR no conecta

**Síntoma:** SignalR connection failed

**Solución:**
```typescript
// Verificar CORS en backend
// Verificar URL del hub
// Verificar que el token sea válido

// Debug
const connection = new signalR.HubConnectionBuilder()
  .withUrl(hubUrl, {
    accessTokenFactory: () => localStorage.getItem('token') || '',
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets
  })
  .configureLogging(signalR.LogLevel.Debug) // Activar logs
  .build();
```

#### 3. Build falla

**Síntoma:** Build process fails

**Solución:**
```bash
# Limpiar cache
rm -rf node_modules dist .vite
npm install
npm run build

# Verificar errores de TypeScript
npm run type-check

# Verificar errores de ESLint
npm run lint
```

#### 4. Estilos no se aplican

**Síntoma:** TailwindCSS classes not working

**Solución:**
```javascript
// Verificar tailwind.config.js content
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Incluir todos los archivos
  ],
  // ...
}

// Importar en main.tsx
import './styles/globals.css';
```

#### 5. Variables de entorno no funcionan

**Síntoma:** import.meta.env.VITE_* is undefined

**Solución:**
```bash
# Las variables deben empezar con VITE_
VITE_API_URL=http://localhost:5000  ✅
API_URL=http://localhost:5000        ❌

# Reiniciar servidor después de cambiar .env
```

### Debug Tools

```typescript
// React DevTools: detectar re-renders innecesarios
// Redux DevTools: para Zustand
// Chrome DevTools: Performance tab

// Profiler para medir performance
import { Profiler } from 'react';

function onRender(id, phase, actualDuration) {
  console.log({ id, phase, actualDuration });
}

<Profiler id="SearchBar" onRender={onRender}>
  <SearchBar />
</Profiler>
```

---

## 📚 RECURSOS ADICIONALES

### Documentación Oficial

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [SignalR JavaScript Client](https://docs.microsoft.com/en-us/aspnet/core/signalr/javascript-client)

### Herramientas de Desarrollo

- [VS Code](https://code.visualstudio.com/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Postman](https://www.postman.com/) - API testing
- [Figma](https://www.figma.com/) - Diseños UI/UX

### Comunidad

- [Stack Overflow](https://stackoverflow.com/questions/tagged/reactjs)
- [Reddit r/reactjs](https://www.reddit.com/r/reactjs/)
- [Discord - Reactiflux](https://www.reactiflux.com/)

---

## 📝 CHANGELOG

### Version 1.0.0 (Noviembre 2025)

**Inicial Release**
- Implementación completa del frontend
- Integración con backend .NET
- Sistema de búsqueda y filtrado
- Calendario de disponibilidad en tiempo real
- Proceso de checkout multi-paso
- Sistema de mensajería con SignalR
- Sistema de reseñas y calificaciones
- Responsive design mobile-first

---

## 🤝 CONTRIBUCIÓN

### Git Workflow

```bash
# Crear rama para nueva feature
git checkout -b feature/nombre-feature

# Hacer cambios y commit
git add .
git commit -m "feat: descripción del cambio"

# Push y crear PR
git push origin feature/nombre-feature
```

### Commit Messages Convention

```
feat: nueva característica
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato
refactor: refactorización de código
test: agregar o modificar tests
chore: cambios en build, configuración, etc.
```

---

## 📄 LICENCIA

Este proyecto es propiedad de WildTour SAS.

---

*Última actualización: Noviembre 2025*
*© 2025 WildTour. Todos los derechos reservados.*
