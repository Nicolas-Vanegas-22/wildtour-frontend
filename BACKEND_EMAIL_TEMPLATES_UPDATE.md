# Actualización de Plantillas de Correo - Wild Tour Backend

## 📋 Objetivo

Actualizar las plantillas de correo de **bienvenida** y **inicio de sesión exitoso** para que muestren:
- ✅ **Fecha y hora reales** del evento
- ❌ **Eliminar dirección IP** (por privacidad y seguridad)

---

## 📧 Plantillas a Actualizar

### 1. Correo de Bienvenida (Registro Exitoso)

**Ubicación:** `Templates/Emails/WelcomeEmail.html` o similar

**Cambios Requeridos:**

```html
<!-- ❌ ELIMINAR este bloque -->
<tr>
  <td style="padding: 8px; border-bottom: 1px solid #eee;">
    <strong>Dirección IP:</strong>
  </td>
  <td style="padding: 8px; border-bottom: 1px solid #eee;">
    {{IpAddress}} <!-- ELIMINAR -->
  </td>
</tr>

<!-- ✅ ACTUALIZAR este bloque -->
<tr>
  <td style="padding: 8px; border-bottom: 1px solid #eee;">
    <strong>Fecha de registro:</strong>
  </td>
  <td style="padding: 8px; border-bottom: 1px solid #eee;">
    {{RegistrationDate}} <!-- DEBE SER REAL -->
  </td>
</tr>
<tr>
  <td style="padding: 8px; border-bottom: 1px solid #eee;">
    <strong>Hora:</strong>
  </td>
  <td style="padding: 8px; border-bottom: 1px solid #eee;">
    {{RegistrationTime}} <!-- DEBE SER REAL -->
  </td>
</tr>
```

**Formato Esperado:**
- **Fecha:** `01 de Noviembre, 2025` o `01/11/2025`
- **Hora:** `15:30 COT` o `3:30 PM COT`

---

### 2. Correo de Inicio de Sesión Exitoso

**Ubicación:** `Templates/Emails/LoginNotification.html` o similar

**Cambios Requeridos:**

```html
<!-- ❌ ELIMINAR este bloque -->
<tr>
  <td style="padding: 8px; border-bottom: 1px solid #eee;">
    <strong>Dirección IP:</strong>
  </td>
  <td style="padding: 8px; border-bottom: 1px solid #eee;">
    {{IpAddress}} <!-- ELIMINAR -->
  </td>
</tr>

<!-- ✅ ACTUALIZAR este bloque -->
<tr>
  <td style="padding: 8px; border-bottom: 1px solid #eee;">
    <strong>Fecha de acceso:</strong>
  </td>
  <td style="padding: 8px; border-bottom: 1px solid #eee;">
    {{LoginDate}} <!-- DEBE SER REAL -->
  </td>
</tr>
<tr>
  <td style="padding: 8px; border-bottom: 1px solid #eee;">
    <strong>Hora:</strong>
  </td>
  <td style="padding: 8px; border-bottom: 1px solid #eee;">
    {{LoginTime}} <!-- DEBE SER REAL -->
  </td>
</tr>
```

**Formato Esperado:**
- **Fecha:** `01 de Noviembre, 2025` o `01/11/2025`
- **Hora:** `15:30 COT` o `3:30 PM COT`

---

## 💻 Cambios en el Código C# (Backend)

### 1. Servicio de Email - Método de Bienvenida

```csharp
public async Task SendWelcomeEmailAsync(User user)
{
    var templatePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Templates", "Emails", "WelcomeEmail.html");
    var template = await File.ReadAllTextAsync(templatePath);

    // Obtener fecha y hora actual en zona horaria de Colombia
    var colombiaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
    var colombiaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, colombiaTimeZone);

    var emailBody = template
        .Replace("{{UserName}}", user.FirstName)
        .Replace("{{Email}}", user.Email)
        .Replace("{{RegistrationDate}}", colombiaTime.ToString("dd 'de' MMMM, yyyy", new CultureInfo("es-CO")))
        .Replace("{{RegistrationTime}}", colombiaTime.ToString("HH:mm") + " COT")
        .Replace("{{Role}}", user.Role == "provider" ? "Prestador de Servicio" : "Turista");
        // ❌ ELIMINAR: .Replace("{{IpAddress}}", ipAddress)

    await _emailService.SendEmailAsync(user.Email, "¡Bienvenido a Wild Tour!", emailBody);
}
```

### 2. Servicio de Email - Método de Login

```csharp
public async Task SendLoginNotificationAsync(User user)
{
    var templatePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Templates", "Emails", "LoginNotification.html");
    var template = await File.ReadAllTextAsync(templatePath);

    // Obtener fecha y hora actual en zona horaria de Colombia
    var colombiaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
    var colombiaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, colombiaTimeZone);

    var emailBody = template
        .Replace("{{UserName}}", user.FirstName)
        .Replace("{{LoginDate}}", colombiaTime.ToString("dd 'de' MMMM, yyyy", new CultureInfo("es-CO")))
        .Replace("{{LoginTime}}", colombiaTime.ToString("HH:mm") + " COT")
        .Replace("{{Browser}}", "Navegador detectado") // Opcional
        .Replace("{{Device}}", "Dispositivo detectado"); // Opcional
        // ❌ ELIMINAR: .Replace("{{IpAddress}}", ipAddress)

    await _emailService.SendEmailAsync(user.Email, "Inicio de sesión exitoso - Wild Tour", emailBody);
}
```

---

## 🌍 Zona Horaria de Colombia

**Importante:** Usar la zona horaria correcta para Colombia:

```csharp
// Zona horaria de Colombia (COT - Colombia Time, UTC-5)
var colombiaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
var colombiaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, colombiaTimeZone);
```

**Formatos de fecha recomendados:**

| Formato | Ejemplo | Código C# |
|---------|---------|-----------|
| Largo | `01 de Noviembre, 2025` | `colombiaTime.ToString("dd 'de' MMMM, yyyy", new CultureInfo("es-CO"))` |
| Corto | `01/11/2025` | `colombiaTime.ToString("dd/MM/yyyy")` |
| Hora 24h | `15:30 COT` | `colombiaTime.ToString("HH:mm") + " COT"` |
| Hora 12h | `3:30 PM COT` | `colombiaTime.ToString("hh:mm tt") + " COT"` |

---

## 📝 Ejemplo de Plantilla Completa (HTML)

### WelcomeEmail.html (Actualizada)

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a Wild Tour</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Contenedor principal -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                                ¡Bienvenido a Wild Tour! 🌄
                            </h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">
                                Hola {{UserName}},
                            </h2>

                            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                                ¡Estamos emocionados de tenerte con nosotros! Tu cuenta ha sido creada exitosamente y ya puedes comenzar a explorar los mejores destinos turísticos de Colombia.
                            </p>

                            <!-- Información de la cuenta -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                                <tr style="background-color: #f9fafb;">
                                    <td colspan="2" style="padding: 15px 20px; border-bottom: 2px solid #e5e7eb;">
                                        <strong style="color: #1f2937; font-size: 16px;">Detalles de tu cuenta</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 20px; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 40%;">
                                        <strong>Correo electrónico:</strong>
                                    </td>
                                    <td style="padding: 12px 20px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
                                        {{Email}}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 20px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">
                                        <strong>Rol:</strong>
                                    </td>
                                    <td style="padding: 12px 20px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
                                        {{Role}}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 20px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">
                                        <strong>Fecha de registro:</strong>
                                    </td>
                                    <td style="padding: 12px 20px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
                                        {{RegistrationDate}}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 20px; color: #6b7280;">
                                        <strong>Hora:</strong>
                                    </td>
                                    <td style="padding: 12px 20px; color: #1f2937;">
                                        {{RegistrationTime}}
                                    </td>
                                </tr>
                            </table>

                            <!-- Call to action -->
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="https://wildtour.com/login"
                                   style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                    Iniciar Sesión Ahora
                                </a>
                            </div>

                            <p style="color: #6b7280; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;">
                                Si tienes alguna pregunta, no dudes en contactarnos. ¡Estamos aquí para ayudarte!
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                                © 2025 Wild Tour. Todos los derechos reservados.
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                Este correo fue enviado a {{Email}}
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## ✅ Checklist de Implementación

- [ ] Actualizar plantilla `WelcomeEmail.html`
- [ ] Actualizar plantilla `LoginNotification.html`
- [ ] Eliminar todas las referencias a `{{IpAddress}}`
- [ ] Actualizar método `SendWelcomeEmailAsync()` en EmailService
- [ ] Actualizar método `SendLoginNotificationAsync()` en EmailService
- [ ] Implementar zona horaria de Colombia (`SA Pacific Standard Time`)
- [ ] Usar formato de fecha en español: `dd 'de' MMMM, yyyy`
- [ ] Usar formato de hora: `HH:mm COT`
- [ ] Probar envío de correo de bienvenida
- [ ] Probar envío de correo de inicio de sesión

---

## 🔒 Razones para Eliminar la IP

1. **Privacidad:** Las direcciones IP son datos personales según GDPR y normativas de privacidad
2. **Seguridad:** Exponer IPs en correos puede ser un riesgo de seguridad
3. **Utilidad:** Para el usuario final, la IP no es información útil
4. **Geolocalización imprecisa:** Las IPs pueden ser de VPNs o proxies

**Alternativa (Opcional):** Si se desea mantener información de ubicación, usar solo:
- **Ciudad/País** (ej: "Bogotá, Colombia")
- **Dispositivo** (ej: "Navegador Chrome en Windows")

---

## 📞 Notas Adicionales

- Las fechas y horas **deben ser dinámicas**, obtenidas del servidor en el momento del evento
- Usar `DateTime.UtcNow` y convertir a zona horaria de Colombia
- Incluir la cultura española para los nombres de meses: `new CultureInfo("es-CO")`
- Agregar "COT" al final de la hora para indicar la zona horaria

---

**Versión:** 1.0
**Fecha:** 01 de Noviembre, 2025
**Autor:** Wild Tour Development Team
