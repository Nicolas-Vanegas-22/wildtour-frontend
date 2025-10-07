import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield, ArrowLeft, Scale, FileText, Clock, CheckCircle,
  AlertTriangle, Eye, Edit, Trash2, StopCircle, Download,
  HelpCircle, ExternalLink, Phone, Mail, MapPin
} from 'lucide-react';
import DataRightsForm from '../../compliance/components/DataRightsForm';
import { useAuthStore } from '../../application/state/useAuthStore';
import { Button } from '../../shared/ui/Button';

interface RequestStatus {
  id: string;
  type: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  submittedDate: string;
  expectedDate: string;
  description: string;
}

const DataRights: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'form' | 'status' | 'info'>('form');
  const [requests, setRequests] = useState<RequestStatus[]>([]);

  // Simular solicitudes existentes
  useEffect(() => {
    if (isAuthenticated) {
      // Datos simulados - en producción vendrían de una API
      setRequests([
        {
          id: 'DRT-2025001',
          type: 'access',
          title: 'Solicitud de Acceso a Datos',
          status: 'processing',
          submittedDate: '2025-01-15',
          expectedDate: '2025-01-25',
          description: 'Solicitud para conocer todos los datos personales almacenados'
        },
        {
          id: 'DRT-2025002',
          type: 'rectification',
          title: 'Rectificación de Información',
          status: 'completed',
          submittedDate: '2025-01-10',
          expectedDate: '2025-01-15',
          description: 'Corrección de número de teléfono en el perfil'
        }
      ]);
    }
  }, [isAuthenticated]);

  const getStatusColor = (status: RequestStatus['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const getStatusIcon = (status: RequestStatus['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4 animate-pulse" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: RequestStatus['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'En proceso';
      case 'completed': return 'Completada';
      case 'rejected': return 'Rechazada';
      default: return 'Desconocido';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
            Acceso Requerido
          </h2>
          <p className="text-neutral-600 mb-6">
            Para ejercer sus derechos de protección de datos, debe iniciar sesión en su cuenta.
          </p>
          <div className="space-y-3">
            <Link to="/login">
              <Button className="w-full" size="lg">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/registro">
              <Button variant="outline" className="w-full" size="lg">
                Crear Cuenta
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Link
            to="/"
            className="inline-flex items-center text-neutral-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center shadow-lg">
              <Scale className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4">
            Derechos de Protección de Datos
          </h1>
          <p className="text-neutral-600 text-lg max-w-3xl mx-auto">
            Ejerza sus derechos fundamentales sobre sus datos personales según la
            <strong className="text-primary-600"> Ley 1581 de 2012 de Colombia</strong>
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-white/20">
            {[
              { id: 'form', label: 'Nueva Solicitud', icon: <FileText className="w-4 h-4" /> },
              { id: 'status', label: 'Mis Solicitudes', icon: <Clock className="w-4 h-4" /> },
              { id: 'info', label: 'Información Legal', icon: <Scale className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-6 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 font-medium shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-8"
        >
          {activeTab === 'form' && <DataRightsForm />}

          {activeTab === 'status' && (
            <div>
              <h2 className="text-2xl font-display font-bold text-neutral-800 mb-6">
                Estado de sus Solicitudes
              </h2>

              {requests.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                    No hay solicitudes registradas
                  </h3>
                  <p className="text-neutral-500 mb-6">
                    Aún no ha enviado ninguna solicitud de derechos de datos.
                  </p>
                  <Button onClick={() => setActiveTab('form')}>
                    Crear Primera Solicitud
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-neutral-200 rounded-xl p-6 hover:border-primary-200 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-neutral-800 mr-3">
                              {request.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              <span className="ml-1">{getStatusText(request.status)}</span>
                            </span>
                          </div>
                          <p className="text-neutral-600 mb-2">{request.description}</p>
                          <div className="text-sm text-neutral-500">
                            <strong>ID:</strong> {request.id}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-neutral-700">Fecha de envío:</span>
                          <div className="text-neutral-600">
                            {new Date(request.submittedDate).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-neutral-700">Fecha esperada:</span>
                          <div className="text-neutral-600">
                            {new Date(request.expectedDate).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-neutral-700">Días restantes:</span>
                          <div className="text-neutral-600">
                            {Math.ceil((new Date(request.expectedDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días
                          </div>
                        </div>
                      </div>

                      {request.status === 'completed' && (
                        <div className="mt-4 pt-4 border-t border-neutral-200">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Descargar Respuesta
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-neutral-800 mb-6">
                  Información Legal - Ley 1581 de 2012
                </h2>

                {/* Derechos fundamentales */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    {
                      icon: <Eye className="w-6 h-6" />,
                      title: 'Derecho de Acceso',
                      description: 'Conocer qué datos tenemos sobre usted',
                      article: 'Art. 8 y 13',
                      time: '10 días hábiles'
                    },
                    {
                      icon: <Edit className="w-6 h-6" />,
                      title: 'Derecho de Rectificación',
                      description: 'Corregir datos inexactos o incompletos',
                      article: 'Art. 8 y 14',
                      time: '5 días hábiles'
                    },
                    {
                      icon: <Trash2 className="w-6 h-6" />,
                      title: 'Derecho de Cancelación',
                      description: 'Solicitar la eliminación de sus datos',
                      article: 'Art. 8 y 14',
                      time: '15 días hábiles'
                    },
                    {
                      icon: <StopCircle className="w-6 h-6" />,
                      title: 'Derecho de Oposición',
                      description: 'Oponerse al tratamiento de datos',
                      article: 'Art. 8 y 14',
                      time: '10 días hábiles'
                    }
                  ].map((right, index) => (
                    <div key={index} className="border border-neutral-200 rounded-xl p-6">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4 text-primary-600">
                          {right.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-800 mb-2">{right.title}</h3>
                          <p className="text-neutral-600 mb-3">{right.description}</p>
                          <div className="space-y-1 text-sm">
                            <div className="text-primary-600 font-medium">{right.article}</div>
                            <div className="text-neutral-500">Plazo: {right.time}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Marco legal */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-blue-800 mb-4">Marco Legal Aplicable</h3>
                  <div className="space-y-3 text-sm text-blue-700">
                    <div className="flex items-start">
                      <Scale className="w-4 h-4 mr-2 mt-0.5" />
                      <div>
                        <strong>Ley 1581 de 2012:</strong> Ley General de Protección de Datos Personales
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Scale className="w-4 h-4 mr-2 mt-0.5" />
                      <div>
                        <strong>Decreto 1377 de 2013:</strong> Reglamentario de la Ley 1581 de 2012
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Scale className="w-4 h-4 mr-2 mt-0.5" />
                      <div>
                        <strong>Constitución Política:</strong> Art. 15 - Derecho a la intimidad
                      </div>
                    </div>
                  </div>
                </div>

                {/* Procedimiento */}
                <div className="mb-8">
                  <h3 className="font-semibold text-neutral-800 mb-4">Procedimiento para Ejercer Derechos</h3>
                  <div className="space-y-4">
                    {[
                      'Envíe su solicitud a través de este portal o por correo electrónico',
                      'Adjunte copia de su documento de identidad',
                      'Especifique claramente el derecho que desea ejercer',
                      'Proporcione información detallada sobre su solicitud',
                      'Espere respuesta dentro de los plazos legales establecidos'
                    ].map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-neutral-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contacto */}
                <div className="border border-neutral-200 rounded-xl p-6">
                  <h3 className="font-semibold text-neutral-800 mb-4">Contacto para Protección de Datos</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-primary-600 mr-3" />
                        <div>
                          <div className="font-medium text-neutral-800">Correo Electrónico</div>
                          <div className="text-neutral-600">privacidad@wildtour.co</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-primary-600 mr-3" />
                        <div>
                          <div className="font-medium text-neutral-800">Teléfono</div>
                          <div className="text-neutral-600">+57 (1) 234-5678</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                        <div>
                          <div className="font-medium text-neutral-800">Dirección</div>
                          <div className="text-neutral-600">
                            Calle 123 #45-67<br />
                            Bogotá, Colombia
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
                      <div className="text-sm text-neutral-600">
                        <strong>Superintendencia de Industria y Comercio (SIC):</strong> Si no está satisfecho con
                        nuestra respuesta, puede presentar una queja ante la SIC, autoridad de control en
                        materia de protección de datos personales en Colombia.
                        <a
                          href="https://www.sic.gov.co"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 font-medium ml-1 inline-flex items-center"
                        >
                          Visitar SIC
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DataRights;