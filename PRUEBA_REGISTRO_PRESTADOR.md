# 🧪 Guía de Prueba - Registro de Prestador de Servicios

## 📋 Datos de Prueba Válidos

Según la base de datos del gobierno:

```
RNT: 181056
Cédula: 1081183169
Nombre del Negocio: YERSON URIAS IBARRA BONILLA
Tipo de RNT: Guía de Turismo
Departamento: HUILA
Ciudad: CAMARA DE COMERCIO DEL HUILA
Estado: ACTIVO
```

## 🔍 Casos de Prueba

### ✅ Caso 1: Registro Exitoso (TODO VÁLIDO)

**Datos a ingresar en el formulario:**

```json
{
  "username": "yerson_guia",
  "email": "yerson@example.com",
  "password": "Password123!",
  "firstName": "Yerson",
  "lastName": "Ibarra",
  "phoneNumber": "3001234567",
  "document": "1081183169",
  "businessName": "YERSON URIAS IBARRA BONILLA",
  "rnt": "181056",
  "rntType": "guia_turismo"
}
```

**Resultado esperado:**
- ✅ Validación de cédula exitosa
- ✅ Verificación con gobierno exitosa
- ✅ Usuario registrado y auto-login
- ✅ Redirección a panel de prestador

---

### ❌ Caso 2: Cédula NO Coincide

**Datos a ingresar:**

```json
{
  "document": "9999999999",  // ❌ Cédula incorrecta
  "businessName": "YERSON URIAS IBARRA BONILLA",
  "rnt": "181056"
}
```

**Resultado esperado:**
- ❌ Modal de error: "La cédula no coincide con el NIT registrado en el RNT"
- ❌ Registro bloqueado

---

### ❌ Caso 3: Nombre del Negocio NO Coincide

**Datos a ingresar:**

```json
{
  "document": "1081183169",
  "businessName": "Mi Agencia Turística",  // ❌ Nombre incorrecto
  "rnt": "181056"
}
```

**Resultado esperado:**
- ❌ Modal de error: "El nombre del negocio no coincide con el registrado"
- ❌ Registro bloqueado

---

### ❌ Caso 4: RNT NO Existe

**Datos a ingresar:**

```json
{
  "document": "1081183169",
  "businessName": "YERSON URIAS IBARRA BONILLA",
  "rnt": "999999"  // ❌ RNT que no existe
}
```

**Resultado esperado:**
- ❌ Modal de error: "El RNT no existe en la base de datos del gobierno"
- ❌ Registro bloqueado

---

### ❌ Caso 5: RNT Inactivo/Suspendido

**Datos a ingresar:**
- RNT de un prestador con estado "INACTIVO" o "SUSPENDIDO"

**Resultado esperado:**
- ❌ Modal de error: "El RNT está inactivo. Por favor renueva tu registro"
- ❌ Registro bloqueado

---

## 🚀 Pasos para Probar

### 1. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Servidor corriendo en: http://localhost:5174

### 2. Navegar al Formulario de Registro

```
http://localhost:5174/register
```

### 3. Seleccionar "Prestador de Servicio"

- Hacer clic en el botón "Prestador"
- Se mostrarán los campos adicionales

### 4. Completar el Formulario

**Campos Básicos:**
- Username: `yerson_guia`
- Email: `yerson@example.com`
- Password: `Password123!` (mín 8 caracteres, 1 mayúscula, 1 número, 1 especial)
- Confirmar Password: `Password123!`
- Nombres: `Yerson`
- Apellidos: `Ibarra`
- Teléfono: `3001234567`

**Campos de Prestador:**
- Documento (Cédula): `1081183169`
  - Se formatea automáticamente (solo números)
  - Se valida con el backend (algoritmo módulo 10)
  - Muestra ✓ verde cuando es válida

- Tipo de Prestador: Seleccionar `Guía de Turismo`

- Nombre del Negocio: `YERSON URIAS IBARRA BONILLA`
  - Debe coincidir EXACTAMENTE con el RNT
  - Sensible a mayúsculas/minúsculas

- Número RNT: `181056`
  - Se verificará automáticamente con la cédula

### 5. Aceptar Términos y Condiciones

- Marcar la casilla de aceptación

### 6. Hacer Clic en "Crear Cuenta"

**Lo que sucede:**
1. ⏳ Muestra "Validando campos..."
2. ⏳ Muestra "Verificando datos con RNT..."
3. 🔍 Llama al endpoint del gobierno
4. ✅ Si todo es válido: registra y hace login automático
5. ❌ Si algo falla: muestra modal con error específico

---

## 📊 Endpoints Utilizados

### 1. Validación de Cédula (Módulo 10)
```
POST http://localhost:5116/api/Auth/validate-document
Body: { "document": "1081183169" }
```

### 2. Verificación con Gobierno (RNT + Cédula)
```
POST http://localhost:5116/api/rnt/verify-with-document
Params: ?rntNumber=181056&document=1081183169&businessName=YERSON%20URIAS%20IBARRA%20BONILLA
```

### 3. Registro de Usuario
```
POST http://localhost:5116/api/Auth/register
Body: { ...todos los campos del formulario }
```

---

## 🐛 Solución de Problemas

### Problema: "Error al validar la cédula"
**Solución:** Asegúrate de que el backend esté corriendo en http://localhost:5116

### Problema: "Error al verificar el RNT"
**Solución:** Verifica que el endpoint `/api/rnt/verify-with-document` esté disponible

### Problema: "Datos de proveedor incompletos"
**Solución:** Asegúrate de que todos los campos estén completos:
- document ✓
- businessName ✓
- rnt ✓
- rntType ✓

---

## ✅ Checklist de Validaciones

- [x] Documento formateado (solo números)
- [x] Documento validado con algoritmo módulo 10
- [x] Documento entre 6-10 dígitos
- [x] Nombre del negocio máx 200 caracteres
- [x] RNT máx 50 caracteres
- [x] rntType máx 100 caracteres
- [x] Verificación con gobierno antes del registro
- [x] Mensajes de error específicos
- [x] Modal de resultado (éxito/error)
- [x] Auto-login después del registro exitoso
- [x] Redirección según rol (prestador → panel-proveedor)

---

## 📝 Notas Importantes

1. **Formato de Cédula:** El campo acepta cualquier formato (con puntos, comas, espacios) pero se limpia automáticamente a solo números antes de enviar.

2. **Nombre del Negocio:** Debe coincidir EXACTAMENTE con el registrado en el RNT. Es sensible a:
   - Mayúsculas/minúsculas
   - Espacios
   - Acentos

3. **Verificación Obligatoria:** No se puede registrar un prestador sin que la verificación con el gobierno sea exitosa.

4. **Tiempo de Verificación:** La consulta al gobierno puede tomar 2-5 segundos. El formulario muestra un indicador de carga durante este tiempo.

5. **Errores Comunes:**
   - Olvidar seleccionar el tipo de RNT
   - Escribir el nombre del negocio con formato diferente al oficial
   - Usar una cédula que no coincide con el NIT del RNT
