import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Info, Clock, FileText, Scale, Globe } from 'lucide-react';

interface AvisoPrivacidadProps {
  tipo: 'registro' | 'reservas' | 'marketing' | 'cookies' | 'general';
  mostrarCompleto?: boolean;
  className?: string;
}

const avisos = {
  registro: {
    titulo: 'Aviso de Privacidad - Registro de Usuario',
    icono: <Shield className="w-5 h-5" />,
    color: 'blue',
    contenido: {
      responsable: 'Wild Tour SAS se identifica como responsable del tratamiento de sus datos personales.',
      finalidades: [
        'Crear y gestionar su cuenta de usuario',
        'Verificar su identidad y autenticidad',
        'Proporcionar servicios de turismo personalizados',
        'Enviar comunicaciones relacionadas con el servicio',
        'Cumplir obligaciones legales y contractuales'
      ],
      datosRecopilados: [
        'Nombres y apellidos completos',
        'Número de documento de identidad',
        'Correo electrónico personal',
        'Número de teléfono móvil',
        'Nombre de usuario elegido',
        'Fecha y hora de registro'
      ],
      baseLegal: 'Consentimiento expreso - Art. 9 Ley 1581/2012',
      retencion: '5 años desde el cierre de la cuenta o última actividad',
      derechos: 'Puede ejercer sus derechos de acceso, rectificación, cancelación y oposición',
      contacto: 'privacidad@wildtour.co'
    }
  },
  reservas: {
    titulo: 'Aviso de Privacidad - Proceso de Reservas',
    icono: <Calendar className="w-5 h-5" />,
    color: 'green',
    contenido: {
      responsable: 'Wild Tour SAS procesará sus datos para completar la reserva solicitada.',
      finalidades: [
        'Procesar y confirmar su reserva de servicios turísticos',
        'Coordinar con prestadores de servicios (hoteles, guías, transporte)',
        'Generar facturas y comprobantes de pago',
        'Brindar soporte durante su experiencia turística',
        'Gestionar modificaciones o cancelaciones'
      ],
      datosRecopilados: [
        'Información personal del titular y acompañantes',
        'Preferencias específicas del viaje',
        'Información de pago y facturación',
        'Datos de contacto de emergencia',
        'Requerimientos especiales (alimentarios, médicos, etc.)'
      ],
      baseLegal: 'Ejecución contractual - Art. 10 Ley 1581/2012',
      retencion: '7 años (obligaciones fiscales y contables)',
      terceros: 'Se compartirá con prestadores de servicios turísticos necesarios para completar su reserva',
      derechos: 'Sus derechos se mantienen durante todo el proceso',
      contacto: 'reservas@wildtour.co'
    }
  },
  marketing: {
    titulo: 'Aviso de Privacidad - Marketing y Comunicaciones',
    icono: <Megaphone className="w-5 h-5" />,
    color: 'purple',
    contenido: {
      responsable: 'Wild Tour SAS utilizará sus datos para comunicaciones comerciales.',
      finalidades: [
        'Enviar ofertas promocionales personalizadas',
        'Informar sobre nuevos destinos y servicios',
        'Realizar encuestas de satisfacción',
        'Invitar a eventos y actividades especiales',
        'Análisis de comportamiento para mejores ofertas'
      ],
      datosRecopilados: [
        'Datos de perfil y preferencias',
        'Historial de reservas y servicios utilizados',
        'Interacciones con comunicaciones anteriores',
        'Datos de navegación y comportamiento en la plataforma'
      ],
      baseLegal: 'Consentimiento específico - Art. 9 Ley 1581/2012',
      retencion: '2 años desde la última interacción o hasta revocación del consentimiento',
      revocacion: 'Puede retirar su consentimiento en cualquier momento sin afectar servicios básicos',
      derechos: 'Derecho de oposición disponible en cada comunicación',
      contacto: 'marketing@wildtour.co'
    }
  },
  cookies: {
    titulo: 'Aviso de Privacidad - Cookies y Tecnologías Similares',
    icono: <Cookie className="w-5 h-5" />,
    color: 'amber',
    contenido: {
      responsable: 'Wild Tour SAS utiliza cookies para mejorar su experiencia de navegación.',
      finalidades: [
        'Mantener su sesión activa y configuraciones',
        'Recordar sus preferencias y configuraciones',
        'Analizar el uso del sitio web para mejoras',
        'Mostrar publicidad relevante y personalizada',
        'Integrar funcionalidades de redes sociales'
      ],
      tiposCookies: [
        'Esenciales: Necesarias para el funcionamiento básico',
        'Funcionales: Mejoran la experiencia de usuario',
        'Analíticas: Ayudan a entender el uso del sitio',
        'Publicitarias: Permiten mostrar anuncios relevantes',
        'Redes Sociales: Facilitan el compartir contenido'
      ],
      baseLegal: 'Interés legítimo (esenciales) y Consentimiento (opcionales)',
      retencion: 'Variable según el tipo: desde sesión hasta 24 meses',
      control: 'Puede gestionar sus preferencias desde el centro de cookies',
      terceros: 'Google Analytics, Facebook Pixel, redes sociales',
      contacto: 'cookies@wildtour.co'
    }
  },
  general: {
    titulo: 'Aviso General de Privacidad',
    icono: <Shield className="w-5 h-5" />,
    color: 'neutral',
    contenido: {
      responsable: 'Wild Tour SAS es responsable del tratamiento de todos sus datos personales.',
      finalidades: [
        'Prestación integral de servicios turísticos',
        'Gestión de la relación comercial',
        'Cumplimiento de obligaciones legales',
        'Mejora continua de nuestros servicios',
        'Comunicaciones según sus preferencias'
      ],
      principios: [
        'Licitud: Tratamiento conforme a la ley',
        'Finalidad: Uso específico y legítimo',
        'Libertad: Consentimiento libre e informado',
        'Veracidad: Datos exactos y actualizados',
        'Transparencia: Información clara y accesible',
        'Acceso: Derecho a conocer sus datos',
        'Circulación restringida: Protección de la privacidad',
        'Seguridad: Medidas técnicas y administrativas',
        'Confidencialidad: Protección de la información'
      ],
      baseLegal: 'Ley 1581 de 2012 y Decreto 1377 de 2013',
      retencion: 'Según la finalidad específica de cada tratamiento',
      derechos: 'Acceso, rectificación, cancelación, oposición y revocación',
      contacto: 'privacidad@wildtour.co - Tel: +57 (1) 234-5678'
    }
  }
};

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Cookie = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <circle cx="8" cy="8" r="1" fill="currentColor" />
    <circle cx="16" cy="8" r="1" fill="currentColor" />
    <circle cx="8" cy="16" r="1" fill="currentColor" />
    <circle cx="16" cy="16" r="1" fill="currentColor" />
    <circle cx="12" cy="10" r="1" fill="currentColor" />
    <circle cx="12" cy="14" r="1" fill="currentColor" />
  </svg>
);

const Megaphone = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);

const AvisoPrivacidad: React.FC<AvisoPrivacidadProps> = ({
  tipo,
  mostrarCompleto = false,
  className = ''
}) => {
  const aviso = avisos[tipo];
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    amber: 'border-amber-200 bg-amber-50',
    neutral: 'border-neutral-200 bg-neutral-50'
  };

  if (!mostrarCompleto) {
    // Versión compacta para formularios
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className={`border rounded-xl p-4 ${colorClasses[aviso.color]} ${className}`}
      >
        <div className="flex items-start">
          <div className={`p-2 rounded-lg mr-3 ${
            aviso.color === 'blue' ? 'bg-blue-100 text-blue-600' :
            aviso.color === 'green' ? 'bg-green-100 text-green-600' :
            aviso.color === 'purple' ? 'bg-purple-100 text-purple-600' :
            aviso.color === 'amber' ? 'bg-amber-100 text-amber-600' :
            'bg-neutral-100 text-neutral-600'
          }`}>
            {aviso.icono}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-800 mb-2">
              {aviso.titulo}
            </h3>
            <p className="text-sm text-neutral-700 mb-3">
              {aviso.contenido.responsable}
            </p>

            <div className="text-xs text-neutral-600 space-y-1">
              <p><strong>Base legal:</strong> {aviso.contenido.baseLegal}</p>
              <p><strong>Retención:</strong> {aviso.contenido.retencion}</p>
              <p><strong>Contacto:</strong> {aviso.contenido.contacto}</p>
            </div>

            <div className="mt-3 p-3 bg-white rounded-lg border border-neutral-200">
              <p className="text-xs text-neutral-600">
                <strong>Sus derechos:</strong> {aviso.contenido.derechos}.
                Puede ejercerlos contactando a <strong>{aviso.contenido.contacto}</strong> o
                a través de nuestro portal de derechos.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Versión completa para páginas dedicadas
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className={`p-6 ${colorClasses[aviso.color]} border-b border-neutral-200`}>
        <div className="flex items-center">
          <div className={`p-3 rounded-xl mr-4 ${
            aviso.color === 'blue' ? 'bg-blue-100 text-blue-600' :
            aviso.color === 'green' ? 'bg-green-100 text-green-600' :
            aviso.color === 'purple' ? 'bg-purple-100 text-purple-600' :
            aviso.color === 'amber' ? 'bg-amber-100 text-amber-600' :
            'bg-neutral-100 text-neutral-600'
          }`}>
            {aviso.icono}
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-neutral-800">
              {aviso.titulo}
            </h2>
            <p className="text-neutral-600">
              Información específica sobre el tratamiento de datos
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Responsable */}
        <div>
          <h3 className="font-semibold text-neutral-800 mb-3 flex items-center">
            <Scale className="w-5 h-5 mr-2 text-neutral-600" />
            Responsable del Tratamiento
          </h3>
          <p className="text-neutral-700">{aviso.contenido.responsable}</p>
        </div>

        {/* Finalidades */}
        <div>
          <h3 className="font-semibold text-neutral-800 mb-3 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-neutral-600" />
            Finalidades del Tratamiento
          </h3>
          <ul className="space-y-2">
            {aviso.contenido.finalidades.map((finalidad, index) => (
              <li key={index} className="flex items-start text-neutral-700">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                {finalidad}
              </li>
            ))}
          </ul>
        </div>

        {/* Datos recopilados */}
        {aviso.contenido.datosRecopilados && (
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3 flex items-center">
              <Database className="w-5 h-5 mr-2 text-neutral-600" />
              Datos Recopilados
            </h3>
            <ul className="space-y-2">
              {aviso.contenido.datosRecopilados.map((dato, index) => (
                <li key={index} className="flex items-start text-neutral-700">
                  <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  {dato}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tipos de cookies */}
        {aviso.contenido.tiposCookies && (
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3 flex items-center">
              <Cookie className="w-5 h-5 mr-2 text-neutral-600" />
              Tipos de Cookies
            </h3>
            <ul className="space-y-2">
              {aviso.contenido.tiposCookies.map((tipo, index) => (
                <li key={index} className="flex items-start text-neutral-700">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  {tipo}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Principios */}
        {aviso.contenido.principios && (
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-neutral-600" />
              Principios del Tratamiento
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {aviso.contenido.principios.map((principio, index) => (
                <div key={index} className="flex items-start text-sm text-neutral-700">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  {principio}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Base legal */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
            <Scale className="w-5 h-5 mr-2" />
            Base Legal
          </h3>
          <p className="text-blue-700">{aviso.contenido.baseLegal}</p>
        </div>

        {/* Información adicional en grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-neutral-50 rounded-xl p-4">
            <h4 className="font-semibold text-neutral-800 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Retención
            </h4>
            <p className="text-sm text-neutral-700">{aviso.contenido.retencion}</p>
          </div>

          <div className="bg-neutral-50 rounded-xl p-4">
            <h4 className="font-semibold text-neutral-800 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              Contacto
            </h4>
            <p className="text-sm text-neutral-700">{aviso.contenido.contacto}</p>
          </div>
        </div>

        {/* Terceros */}
        {aviso.contenido.terceros && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Compartir con Terceros
            </h3>
            <p className="text-amber-700">{aviso.contenido.terceros}</p>
          </div>
        )}

        {/* Revocación */}
        {aviso.contenido.revocacion && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Revocación de Consentimiento
            </h3>
            <p className="text-green-700">{aviso.contenido.revocacion}</p>
          </div>
        )}

        {/* Derechos del titular */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
          <h3 className="font-semibold text-primary-800 mb-2 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Sus Derechos (Ley 1581/2012)
          </h3>
          <p className="text-primary-700 mb-3">{aviso.contenido.derechos}</p>
          <div className="text-sm text-primary-600">
            <p><strong>Para ejercer sus derechos contacte:</strong></p>
            <p>• Email: {aviso.contenido.contacto}</p>
            <p>• Portal de derechos: <a href="/data-rights" className="underline">wildtour.co/data-rights</a></p>
            <p>• Teléfono: +57 (1) 234-5678</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AvisoPrivacidad;