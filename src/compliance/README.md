# Sistema de Compliance - Wild Tour

Este directorio contiene la implementación completa del sistema de compliance para Wild Tour, diseñado para cumplir con la Ley 1581 de 2012 de Colombia (Protección de Datos Personales) y mejores prácticas internacionales de privacidad y seguridad.

## 📋 Estructura del Sistema

### 🏗️ Arquitectura

```
src/compliance/
├── components/          # Componentes React de UI
├── hooks/              # Hooks personalizados para compliance
├── services/           # APIs y servicios
├── stores/             # Estado global (Zustand)
├── utils/              # Utilidades y helpers
├── config/             # Configuración del sistema
└── README.md           # Este archivo
```

### 🔧 Componentes Principales

#### 1. **Sistema de Consentimientos**
- `ConsentBanner`: Banner de consentimientos inicial
- `ConsentModal`: Modal detallado para gestión de consentimientos
- `useConsentStore`: Estado global de consentimientos

#### 2. **Gestión de Cookies**
- `CookieManager`: Interfaz granular para gestión de cookies
- Categorización automática de cookies
- Control individual por cookie

#### 3. **Derechos del Titular (ARCO)**
- `DataRightsForm`: Formulario para ejercer derechos
- `DataRights`: Página principal de derechos
- Soporte para 7 tipos de derechos según la ley

#### 4. **Centro de Privacidad**
- `PrivacyCenter`: Dashboard unificado de privacidad
- `PrivacyDashboard`: Panel de control del usuario
- Visualización de datos y controles

#### 5. **Sistema de Auditoría**
- `AuditProvider`: Proveedor de contexto para logging
- `useAuditLogger`: Hook para logging de eventos
- `SecurityMonitor`: Monitor en tiempo real de seguridad

### 🛡️ Características de Seguridad

#### Monitoreo Automático
- **Detección de clics rápidos**: Posibles bots o automatización
- **Patrones de tecleo**: Detección de entrada automatizada
- **Movimientos de mouse**: Análisis de patrones no naturales
- **Manipulación DOM**: Detección de inyección de scripts/formularios
- **Acceso a DevTools**: Monitoreo de intentos de acceso

#### Logging Comprehensivo
- **17 tipos de eventos** de auditoría diferentes
- **5 categorías** de eventos (seguridad, privacidad, compliance, operacional, legal)
- **4 niveles de severidad** (low, medium, high, critical)
- **Retención automática** según normativas legales

#### Protección de Datos
- **Encriptación en tránsito** para todas las comunicaciones
- **Logs inmutables** con verificación de integridad
- **Limpieza automática** según períodos de retención
- **Anonimización** de datos sensibles en logs

### 📊 APIs de Compliance

#### 1. **Consent API** (`consentApi.ts`)
```typescript
// Enviar consentimiento
await consentApi.submitConsent({
  consentType: 'marketing',
  granted: true,
  purpose: 'Comunicaciones promocionales'
});

// Exportar historial
const history = await consentApi.exportConsentHistory('json');
```

#### 2. **Data Rights API** (`dataRightsApi.ts`)
```typescript
// Ejercer derecho de acceso
await dataRightsApi.submitRequest({
  requestType: 'access',
  reason: 'Quiero conocer qué datos tienen de mí'
});

// Verificar elegibilidad
const eligible = await dataRightsApi.checkEligibility('cancellation');
```

#### 3. **Audit API** (`auditApi.ts`)
```typescript
// Log manual de evento
await auditApi.logEvent({
  eventType: 'data_access',
  category: 'privacy',
  severity: 'medium',
  description: 'Usuario accedió a su perfil'
});

// Generar reporte
const report = await auditApi.generateReport(query);
```

### 🎯 Hooks Especializados

#### `useAuditLogger`
Hook principal para logging de eventos de auditoría:

```typescript
const { logDataAccess, logConsentAction, logSecurityEvent } = useAuditLogger();

// Log de acceso a datos
await logDataAccess({
  description: 'Acceso a datos de perfil',
  dataCategories: ['personal_data'],
  legalBasis: 'Consent'
});
```

#### `useFormAudit`
Hook específico para formularios:

```typescript
const { logFormStart, logFormSubmit, logFieldAccess } = useFormAudit({
  formName: 'registro',
  dataCategories: ['personal_data', 'contact_data'],
  legalBasis: 'Article 6 Law 1581/2012'
});
```

### 🔒 Configuración de Seguridad

El archivo `securityConfig.ts` contiene toda la configuración del sistema:

```typescript
import { securityConfig } from './config/securityConfig';

// Verificar si un evento es crítico
const isCritical = isCriticalEvent('data_breach'); // true

// Obtener severidad automática
const severity = getAutoSeverity('login_attempt_failed'); // 'medium'
```

### 📋 Categorías de Datos

Según la Ley 1581/2012, se manejan 5 categorías principales:

1. **Datos Personales**: Información identificatoria
2. **Datos de Contacto**: Email, teléfono, dirección
3. **Datos Financieros**: Información de pagos
4. **Datos de Comportamiento**: Uso de la plataforma
5. **Datos Técnicos**: IP, user agent, dispositivo

### 🕐 Períodos de Retención

- **Seguridad**: 7 años
- **Legal**: 10 años
- **Privacidad**: 5 años
- **Compliance**: 5 años
- **Operacional**: 2 años

### 🚨 Sistema de Alertas

#### Alertas Inmediatas
- Inyección de scripts
- Violación de datos
- Acceso no autorizado

#### Alertas en Lote
- Clics rápidos sospechosos
- Intentos de acceso a DevTools
- Cambios excesivos de foco

### 📖 Uso en Componentes

#### Integración Básica
```typescript
import { useAudit } from '../compliance/components/AuditProvider';

function MyComponent() {
  const audit = useAudit();

  const handleSensitiveAction = async () => {
    await audit.logDataAccess({
      description: 'Acción sensible realizada',
      dataCategories: ['personal_data'],
      legalBasis: 'Consent'
    });
  };
}
```

#### Con Error Boundary
```typescript
import { AuditErrorBoundary } from '../compliance/components/AuditErrorBoundary';

function App() {
  return (
    <AuditErrorBoundary>
      <MyApplication />
    </AuditErrorBoundary>
  );
}
```

### 🔄 Flujo de Consentimientos

1. **Banner inicial**: Información básica y opciones rápidas
2. **Modal detallado**: Consentimientos granulares por categoría
3. **Persistencia**: Almacenamiento seguro con timestamp
4. **Auditoría**: Log automático de cambios
5. **Expiración**: Renovación automática según configuración

### 📊 Métricas y Reportes

El sistema genera automáticamente:

- **Métricas de consentimiento**: Tasas de aceptación/rechazo
- **Métricas de derechos**: Tiempo de respuesta, cumplimiento
- **Métricas de seguridad**: Incidentes, patrones sospechosos
- **Reportes de compliance**: Cumplimiento legal y recomendaciones

### 🔧 Configuración del Entorno

```typescript
// Desarrollo
{
  logLevel: 'debug',
  debugMode: true,
  strictMode: false
}

// Producción
{
  logLevel: 'error',
  debugMode: false,
  strictMode: true
}
```

### 🚀 Inicialización

El sistema se inicializa automáticamente con:

1. **AuditProvider**: Envuelve toda la aplicación
2. **SecurityMonitor**: Monitoreo en tiempo real
3. **ConsentBanner/Modal**: Gestión de consentimientos
4. **SessionManager**: Tracking de sesiones

### 📝 Cumplimiento Legal

Este sistema garantiza el cumplimiento de:

✅ **Ley 1581 de 2012** - Protección de Datos Personales Colombia
✅ **Decreto 1377 de 2013** - Reglamentación Ley 1581
✅ **Mejores prácticas GDPR** - Estándares internacionales
✅ **ISO 27001** - Gestión de seguridad de la información
✅ **Principios de Privacy by Design**

### 🎯 Próximos Pasos

- [ ] Integración con backend de auditoría
- [ ] Dashboard de administración
- [ ] Reportes automáticos programados
- [ ] Integración con sistemas de alertas externos
- [ ] Certificación ISO 27001

---

**Nota**: Este sistema ha sido diseñado siguiendo las mejores prácticas de seguridad y privacidad. Para cualquier duda o modificación, consulte con el equipo de seguridad y legal.