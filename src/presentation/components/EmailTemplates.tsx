import React from 'react';

interface EmailTemplateProps {
  userFirstName: string;
  [key: string]: any;
}

// Plantilla base de email
const EmailLayout: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
  <div style={{
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    color: '#333333'
  }}>
    {/* Header */}
    <div style={{
      backgroundColor: '#2563eb',
      padding: '30px 20px',
      textAlign: 'center' as const
    }}>
      <h1 style={{
        color: '#ffffff',
        fontSize: '28px',
        fontWeight: 'bold',
        margin: '0',
        letterSpacing: '1px'
      }}>
        WildTour
      </h1>
      <p style={{
        color: '#dbeafe',
        fontSize: '14px',
        margin: '5px 0 0 0'
      }}>
        Descubre Colombia como nunca antes
      </p>
    </div>

    {/* Content */}
    <div style={{ padding: '40px 30px' }}>
      <h2 style={{
        color: '#1f2937',
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '20px',
        textAlign: 'center' as const
      }}>
        {title}
      </h2>
      {children}
    </div>

    {/* Footer */}
    <div style={{
      backgroundColor: '#f9fafb',
      padding: '30px 20px',
      borderTop: '1px solid #e5e7eb',
      textAlign: 'center' as const
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          color: '#374151',
          fontSize: '16px',
          fontWeight: '600',
          margin: '0 0 10px 0'
        }}>
          ¿Necesitas ayuda?
        </h3>
        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          margin: '0'
        }}>
          Contáctanos en{' '}
          <a href="mailto:soporte@wildtour.com" style={{ color: '#2563eb', textDecoration: 'none' }}>
            soporte@wildtour.com
          </a>
          {' '}o visita nuestro{' '}
          <a href="https://wildtour.com/ayuda" style={{ color: '#2563eb', textDecoration: 'none' }}>
            centro de ayuda
          </a>
        </p>
      </div>

      <div style={{
        padding: '20px 0',
        borderTop: '1px solid #e5e7eb'
      }}>
        <p style={{
          color: '#9ca3af',
          fontSize: '12px',
          margin: '0 0 10px 0'
        }}>
          © 2024 WildTour. Todos los derechos reservados.
        </p>
        <p style={{
          color: '#9ca3af',
          fontSize: '12px',
          margin: '0'
        }}>
          Si no deseas recibir estos emails,{' '}
          <a href="#" style={{ color: '#6b7280', textDecoration: 'underline' }}>
            puedes darte de baja aquí
          </a>
        </p>
      </div>
    </div>
  </div>
);

// Plantilla de confirmación de reserva
export const BookingConfirmationEmail: React.FC<EmailTemplateProps & {
  bookingId: string;
  destinationName: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  guestCount: number;
}> = ({
  userFirstName,
  bookingId,
  destinationName,
  checkInDate,
  checkOutDate,
  totalAmount,
  guestCount
}) => (
  <EmailLayout title="¡Tu reserva ha sido confirmada!">
    <div style={{ textAlign: 'center' as const, marginBottom: '30px' }}>
      <div style={{
        backgroundColor: '#dcfce7',
        border: '2px solid #16a34a',
        borderRadius: '8px',
        padding: '20px',
        display: 'inline-block'
      }}>
        <p style={{
          color: '#15803d',
          fontSize: '18px',
          fontWeight: '600',
          margin: '0'
        }}>
          ✓ Reserva confirmada
        </p>
      </div>
    </div>

    <p style={{
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '25px'
    }}>
      Hola {userFirstName},
    </p>

    <p style={{
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '30px'
    }}>
      ¡Excelentes noticias! Tu reserva ha sido confirmada exitosamente. Te esperamos para vivir una experiencia inolvidable.
    </p>

    {/* Detalles de la reserva */}
    <div style={{
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '25px',
      marginBottom: '30px'
    }}>
      <h3 style={{
        color: '#1e293b',
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '20px',
        margin: '0 0 20px 0'
      }}>
        Detalles de tu reserva
      </h3>

      <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
        <tr>
          <td style={{ padding: '8px 0', color: '#64748b', fontWeight: '500' }}>ID de reserva:</td>
          <td style={{ padding: '8px 0', color: '#1e293b', fontWeight: '600' }}>{bookingId}</td>
        </tr>
        <tr>
          <td style={{ padding: '8px 0', color: '#64748b', fontWeight: '500' }}>Destino:</td>
          <td style={{ padding: '8px 0', color: '#1e293b', fontWeight: '600' }}>{destinationName}</td>
        </tr>
        <tr>
          <td style={{ padding: '8px 0', color: '#64748b', fontWeight: '500' }}>Fecha de inicio:</td>
          <td style={{ padding: '8px 0', color: '#1e293b', fontWeight: '600' }}>{checkInDate}</td>
        </tr>
        <tr>
          <td style={{ padding: '8px 0', color: '#64748b', fontWeight: '500' }}>Fecha de fin:</td>
          <td style={{ padding: '8px 0', color: '#1e293b', fontWeight: '600' }}>{checkOutDate}</td>
        </tr>
        <tr>
          <td style={{ padding: '8px 0', color: '#64748b', fontWeight: '500' }}>Huéspedes:</td>
          <td style={{ padding: '8px 0', color: '#1e293b', fontWeight: '600' }}>{guestCount} persona{guestCount > 1 ? 's' : ''}</td>
        </tr>
        <tr>
          <td style={{ padding: '8px 0', color: '#64748b', fontWeight: '500' }}>Total pagado:</td>
          <td style={{ padding: '8px 0', color: '#059669', fontWeight: '700' }}>
            ${totalAmount.toLocaleString('es-CO')} COP
          </td>
        </tr>
      </table>
    </div>

    {/* Botón de acción */}
    <div style={{ textAlign: 'center' as const, marginBottom: '30px' }}>
      <a
        href={`https://wildtour.com/mis-reservas/${bookingId}`}
        style={{
          backgroundColor: '#2563eb',
          color: '#ffffff',
          padding: '14px 28px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '600',
          display: 'inline-block'
        }}
      >
        Ver detalles completos
      </a>
    </div>

    <div style={{
      backgroundColor: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <h4 style={{
        color: '#92400e',
        fontSize: '16px',
        fontWeight: '600',
        margin: '0 0 10px 0'
      }}>
        Importante recordar:
      </h4>
      <ul style={{
        color: '#92400e',
        fontSize: '14px',
        margin: '0',
        paddingLeft: '20px'
      }}>
        <li>Lleva tu documento de identidad</li>
        <li>Verifica las condiciones climáticas</li>
        <li>Llega 15 minutos antes del inicio</li>
      </ul>
    </div>
  </EmailLayout>
);

// Plantilla de recordatorio de viaje
export const TripReminderEmail: React.FC<EmailTemplateProps & {
  destinationName: string;
  checkInDate: string;
  daysUntilTrip: number;
  bookingId: string;
}> = ({ userFirstName, destinationName, checkInDate, daysUntilTrip, bookingId }) => (
  <EmailLayout title="Recordatorio de tu próximo viaje">
    <div style={{ textAlign: 'center' as const, marginBottom: '30px' }}>
      <div style={{
        backgroundColor: '#fef3c7',
        border: '2px solid #f59e0b',
        borderRadius: '8px',
        padding: '20px',
        display: 'inline-block'
      }}>
        <p style={{
          color: '#92400e',
          fontSize: '18px',
          fontWeight: '600',
          margin: '0'
        }}>
          ⏰ {daysUntilTrip} día{daysUntilTrip > 1 ? 's' : ''} para tu viaje
        </p>
      </div>
    </div>

    <p style={{
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '25px'
    }}>
      Hola {userFirstName},
    </p>

    <p style={{
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '30px'
    }}>
      Tu aventura a <strong>{destinationName}</strong> está muy cerca. El {checkInDate} comenzará una experiencia que recordarás para siempre.
    </p>

    {/* Lista de preparativos */}
    <div style={{
      backgroundColor: '#f0f9ff',
      border: '1px solid #0ea5e9',
      borderRadius: '8px',
      padding: '25px',
      marginBottom: '30px'
    }}>
      <h3 style={{
        color: '#0c4a6e',
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '15px',
        margin: '0 0 15px 0'
      }}>
        Preparativos recomendados:
      </h3>
      <ul style={{
        color: '#0c4a6e',
        fontSize: '15px',
        lineHeight: '1.6',
        margin: '0',
        paddingLeft: '20px'
      }}>
        <li>Verifica que tu documento de identidad esté vigente</li>
        <li>Revisa el pronóstico del tiempo y empaca ropa adecuada</li>
        <li>Confirma tu transporte al punto de encuentro</li>
        <li>Trae cámara para capturar los mejores momentos</li>
        <li>Lleva protector solar y repelente</li>
      </ul>
    </div>

    <div style={{ textAlign: 'center' as const, marginBottom: '20px' }}>
      <a
        href={`https://wildtour.com/mis-reservas/${bookingId}`}
        style={{
          backgroundColor: '#2563eb',
          color: '#ffffff',
          padding: '14px 28px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '600',
          display: 'inline-block',
          marginRight: '10px'
        }}
      >
        Ver mi reserva
      </a>
      <a
        href="https://wildtour.com/guias-viaje"
        style={{
          backgroundColor: '#ffffff',
          color: '#2563eb',
          padding: '14px 28px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '600',
          display: 'inline-block',
          border: '2px solid #2563eb'
        }}
      >
        Guías de viaje
      </a>
    </div>
  </EmailLayout>
);

// Plantilla de confirmación de pago
export const PaymentConfirmationEmail: React.FC<EmailTemplateProps & {
  amount: number;
  paymentMethod: string;
  transactionId: string;
  bookingId: string;
  destinationName: string;
}> = ({ userFirstName, amount, paymentMethod, transactionId, bookingId, destinationName }) => (
  <EmailLayout title="Pago procesado exitosamente">
    <div style={{ textAlign: 'center' as const, marginBottom: '30px' }}>
      <div style={{
        backgroundColor: '#dcfce7',
        border: '2px solid #16a34a',
        borderRadius: '8px',
        padding: '20px',
        display: 'inline-block'
      }}>
        <p style={{
          color: '#15803d',
          fontSize: '18px',
          fontWeight: '600',
          margin: '0'
        }}>
          ✓ Pago confirmado
        </p>
      </div>
    </div>

    <p style={{
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '25px'
    }}>
      Hola {userFirstName},
    </p>

    <p style={{
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '30px'
    }}>
      Tu pago ha sido procesado exitosamente. Tu reserva para <strong>{destinationName}</strong> está confirmada.
    </p>

    {/* Detalles del pago */}
    <div style={{
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '25px',
      marginBottom: '30px'
    }}>
      <h3 style={{
        color: '#1e293b',
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '20px',
        margin: '0 0 20px 0'
      }}>
        Detalles del pago
      </h3>

      <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
        <tr>
          <td style={{ padding: '8px 0', color: '#64748b', fontWeight: '500' }}>Monto:</td>
          <td style={{ padding: '8px 0', color: '#059669', fontWeight: '700', fontSize: '18px' }}>
            ${amount.toLocaleString('es-CO')} COP
          </td>
        </tr>
        <tr>
          <td style={{ padding: '8px 0', color: '#64748b', fontWeight: '500' }}>Método de pago:</td>
          <td style={{ padding: '8px 0', color: '#1e293b', fontWeight: '600' }}>{paymentMethod}</td>
        </tr>
        <tr>
          <td style={{ padding: '8px 0', color: '#64748b', fontWeight: '500' }}>ID de transacción:</td>
          <td style={{ padding: '8px 0', color: '#1e293b', fontWeight: '600' }}>{transactionId}</td>
        </tr>
        <tr>
          <td style={{ padding: '8px 0', color: '#64748b', fontWeight: '500' }}>Reserva:</td>
          <td style={{ padding: '8px 0', color: '#1e293b', fontWeight: '600' }}>{bookingId}</td>
        </tr>
      </table>
    </div>

    <div style={{ textAlign: 'center' as const, marginBottom: '20px' }}>
      <a
        href={`https://wildtour.com/mis-reservas/${bookingId}`}
        style={{
          backgroundColor: '#2563eb',
          color: '#ffffff',
          padding: '14px 28px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '600',
          display: 'inline-block',
          marginRight: '10px'
        }}
      >
        Ver mi reserva
      </a>
      <a
        href={`https://wildtour.com/recibos/${transactionId}`}
        style={{
          backgroundColor: '#ffffff',
          color: '#2563eb',
          padding: '14px 28px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '600',
          display: 'inline-block',
          border: '2px solid #2563eb'
        }}
      >
        Descargar recibo
      </a>
    </div>
  </EmailLayout>
);

// Plantilla de nueva reseña para proveedores
export const NewReviewEmail: React.FC<EmailTemplateProps & {
  reviewerName: string;
  rating: number;
  comment: string;
  serviceName: string;
  reviewId: string;
}> = ({ userFirstName, reviewerName, rating, comment, serviceName, reviewId }) => (
  <EmailLayout title="Nueva reseña recibida">
    <p style={{
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '25px'
    }}>
      Hola {userFirstName},
    </p>

    <p style={{
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '30px'
    }}>
      Has recibido una nueva reseña para tu servicio <strong>{serviceName}</strong>.
    </p>

    {/* Detalles de la reseña */}
    <div style={{
      backgroundColor: '#fefce8',
      border: '1px solid #eab308',
      borderRadius: '8px',
      padding: '25px',
      marginBottom: '30px'
    }}>
      <div style={{ marginBottom: '15px' }}>
        <span style={{ color: '#a16207', fontSize: '14px', fontWeight: '500' }}>Calificación:</span>
        <div style={{ marginTop: '5px' }}>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < rating ? '#f59e0b' : '#d1d5db', fontSize: '20px' }}>
              ★
            </span>
          ))}
          <span style={{ color: '#a16207', fontSize: '16px', fontWeight: '600', marginLeft: '10px' }}>
            {rating}/5
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <span style={{ color: '#a16207', fontSize: '14px', fontWeight: '500' }}>De:</span>
        <p style={{ color: '#a16207', fontSize: '16px', fontWeight: '600', margin: '5px 0 0 0' }}>
          {reviewerName}
        </p>
      </div>

      <div>
        <span style={{ color: '#a16207', fontSize: '14px', fontWeight: '500' }}>Comentario:</span>
        <p style={{
          color: '#a16207',
          fontSize: '15px',
          lineHeight: '1.6',
          margin: '10px 0 0 0',
          fontStyle: 'italic',
          padding: '15px',
          backgroundColor: '#fffbeb',
          borderRadius: '6px'
        }}>
          "{comment}"
        </p>
      </div>
    </div>

    <div style={{ textAlign: 'center' as const, marginBottom: '20px' }}>
      <a
        href={`https://wildtour.com/resenas/${reviewId}`}
        style={{
          backgroundColor: '#2563eb',
          color: '#ffffff',
          padding: '14px 28px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '600',
          display: 'inline-block',
          marginRight: '10px'
        }}
      >
        Responder reseña
      </a>
      <a
        href="https://wildtour.com/panel-proveedor/resenas"
        style={{
          backgroundColor: '#ffffff',
          color: '#2563eb',
          padding: '14px 28px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '600',
          display: 'inline-block',
          border: '2px solid #2563eb'
        }}
      >
        Ver todas las reseñas
      </a>
    </div>
  </EmailLayout>
);

// Plantilla de bienvenida para nuevos usuarios
export const WelcomeEmail: React.FC<EmailTemplateProps> = ({ userFirstName }) => (
  <EmailLayout title="¡Bienvenido a WildTour!">
    <p style={{
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '25px'
    }}>
      Hola {userFirstName},
    </p>

    <p style={{
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '30px'
    }}>
      ¡Bienvenido a WildTour! Estamos emocionados de tenerte como parte de nuestra comunidad de aventureros que descubren lo mejor de Colombia.
    </p>

    <div style={{
      backgroundColor: '#f0f9ff',
      border: '1px solid #0ea5e9',
      borderRadius: '8px',
      padding: '25px',
      marginBottom: '30px'
    }}>
      <h3 style={{
        color: '#0c4a6e',
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '15px',
        margin: '0 0 15px 0'
      }}>
        ¿Qué puedes hacer ahora?
      </h3>
      <ul style={{
        color: '#0c4a6e',
        fontSize: '15px',
        lineHeight: '1.6',
        margin: '0',
        paddingLeft: '20px'
      }}>
        <li>Explora destinos únicos en todo el país</li>
        <li>Reserva experiencias auténticas con guías locales</li>
        <li>Comparte tus aventuras y deja reseñas</li>
        <li>Conecta con otros viajeros apasionados</li>
      </ul>
    </div>

    <div style={{ textAlign: 'center' as const, marginBottom: '20px' }}>
      <a
        href="https://wildtour.com/destinos"
        style={{
          backgroundColor: '#2563eb',
          color: '#ffffff',
          padding: '14px 28px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '600',
          display: 'inline-block',
          marginRight: '10px'
        }}
      >
        Explorar destinos
      </a>
      <a
        href="https://wildtour.com/perfil"
        style={{
          backgroundColor: '#ffffff',
          color: '#2563eb',
          padding: '14px 28px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '600',
          display: 'inline-block',
          border: '2px solid #2563eb'
        }}
      >
        Completar perfil
      </a>
    </div>
  </EmailLayout>
);