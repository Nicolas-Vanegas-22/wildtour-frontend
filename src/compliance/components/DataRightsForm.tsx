import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Eye, Edit, Trash2, StopCircle, Download,
  Upload, AlertCircle, CheckCircle, Clock, Send, User
} from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useAuthStore } from '../../application/state/useAuthStore';

type DataRightType =
  | 'access'           // Acceso - Conocer datos
  | 'rectification'    // Rectificación - Corregir datos
  | 'cancellation'     // Cancelación - Eliminar datos
  | 'opposition'       // Oposición - Oponerse al tratamiento
  | 'portability'      // Portabilidad - Obtener datos
  | 'revocation'       // Revocación - Retirar consentimiento
  | 'complaint';       // Queja - Reportar infracciones

interface DataRightRequest {
  type: DataRightType;
  title: string;
  description: string;
  details: string;
  documents?: File[];
  urgency: 'low' | 'medium' | 'high';
  legalBasis: string;
  requestedAction: string;
  additionalInfo?: string;
}

interface DataRightOption {
  type: DataRightType;
  title: string;
  description: string;
  icon: React.ReactNode;
  legalArticle: string;
  timeframe: string;
  examples: string[];
  requiresDocuments: boolean;
}

const dataRightOptions: DataRightOption[] = [
  {
    type: 'access',
    title: 'Derecho de Acceso',
    description: 'Conocer qué datos personales tenemos sobre usted y cómo los utilizamos',
    icon: <Eye className="w-5 h-5" />,
    legalArticle: 'Art. 8 y 13 Ley 1581/2012',
    timeframe: '10 días hábiles',
    examples: [
      'Información personal almacenada',
      'Finalidades del tratamiento',
      'Terceros que han recibido sus datos',
      'Tiempo de conservación'
    ],
    requiresDocuments: true
  },
  {
    type: 'rectification',
    title: 'Derecho de Rectificación',
    description: 'Corregir datos personales inexactos, incompletos o desactualizados',
    icon: <Edit className="w-5 h-5" />,
    legalArticle: 'Art. 8 y 14 Ley 1581/2012',
    timeframe: '5 días hábiles',
    examples: [
      'Corregir información de contacto',
      'Actualizar datos personales',
      'Completar información faltante',
      'Modificar preferencias'
    ],
    requiresDocuments: true
  },
  {
    type: 'cancellation',
    title: 'Derecho de Cancelación',
    description: 'Solicitar la eliminación de sus datos personales de nuestros registros',
    icon: <Trash2 className="w-5 h-5" />,
    legalArticle: 'Art. 8 y 14 Ley 1581/2012',
    timeframe: '15 días hábiles',
    examples: [
      'Eliminar cuenta de usuario',
      'Borrar historial de navegación',
      'Remover datos de marketing',
      'Cancelar suscripciones'
    ],
    requiresDocuments: true
  },
  {
    type: 'opposition',
    title: 'Derecho de Oposición',
    description: 'Oponerse al tratamiento de sus datos para finalidades específicas',
    icon: <StopCircle className="w-5 h-5" />,
    legalArticle: 'Art. 8 y 14 Ley 1581/2012',
    timeframe: '10 días hábiles',
    examples: [
      'Oponerse a marketing directo',
      'Rechazar análisis de comportamiento',
      'Detener transferencias a terceros',
      'Suspender procesamiento automatizado'
    ],
    requiresDocuments: false
  },
  {
    type: 'portability',
    title: 'Derecho de Portabilidad',
    description: 'Obtener sus datos en formato estructurado y portable',
    icon: <Download className="w-5 h-5" />,
    legalArticle: 'Art. 8 y 13 Ley 1581/2012',
    timeframe: '15 días hábiles',
    examples: [
      'Exportar perfil de usuario',
      'Descargar historial de reservas',
      'Obtener datos en formato JSON/CSV',
      'Migrar a otra plataforma'
    ],
    requiresDocuments: true
  },
  {
    type: 'revocation',
    title: 'Revocación de Consentimiento',
    description: 'Retirar el consentimiento otorgado para el tratamiento de datos',
    icon: <StopCircle className="w-5 h-5" />,
    legalArticle: 'Art. 8 y 15 Ley 1581/2012',
    timeframe: '2 días hábiles',
    examples: [
      'Retirar consentimiento de marketing',
      'Cancelar autorización de análisis',
      'Revocar compartir con terceros',
      'Detener comunicaciones comerciales'
    ],
    requiresDocuments: false
  },
  {
    type: 'complaint',
    title: 'Presentar Queja',
    description: 'Reportar posibles infracciones en el tratamiento de sus datos',
    icon: <AlertCircle className="w-5 h-5" />,
    legalArticle: 'Art. 8 y 14 Ley 1581/2012',
    timeframe: '15 días hábiles',
    examples: [
      'Uso no autorizado de datos',
      'Violación de seguridad',
      'Tratamiento sin consentimiento',
      'Negativa a ejercer derechos'
    ],
    requiresDocuments: true
  }
];

const DataRightsForm: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedRight, setSelectedRight] = useState<DataRightType | null>(null);
  const [formData, setFormData] = useState<Partial<DataRightRequest>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedOption = dataRightOptions.find(option => option.type === selectedRight);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRight || !selectedOption) return;

    setIsSubmitting(true);

    try {
      // Preparar datos de la solicitud
      const requestData: DataRightRequest = {
        type: selectedRight,
        title: selectedOption.title,
        description: formData.description || '',
        details: formData.details || '',
        documents: uploadedFiles,
        urgency: formData.urgency || 'medium',
        legalBasis: selectedOption.legalArticle,
        requestedAction: formData.requestedAction || '',
        additionalInfo: formData.additionalInfo
      };

      // Simular envío (aquí iría la llamada a la API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Marcar como enviado
      setSubmitted(true);

      // Limpiar formulario después de 3 segundos
      setTimeout(() => {
        setSubmitted(false);
        setSelectedRight(null);
        setFormData({});
        setUploadedFiles([]);
      }, 3000);

    } catch (error) {
      console.error('Error al enviar solicitud:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2">
          Solicitud Enviada Exitosamente
        </h3>
        <p className="text-green-600 mb-4">
          Su solicitud ha sido registrada y será procesada según los plazos legales establecidos.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 inline-block">
          <p className="text-sm text-green-700">
            <strong>Número de solicitud:</strong> DRT-{Date.now()}<br />
            <strong>Tiempo de respuesta:</strong> {selectedOption?.timeframe || '15 días hábiles'}<br />
            <strong>Estado:</strong> En proceso
          </p>
        </div>
      </motion.div>
    );
  }

  if (!selectedRight) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-neutral-800 mb-3">
            Ejercer Derechos de Protección de Datos
          </h2>
          <p className="text-neutral-600">
            Según la Ley 1581 de 2012, usted tiene los siguientes derechos sobre sus datos personales.
            Seleccione el derecho que desea ejercer:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {dataRightOptions.map((option) => (
            <motion.button
              key={option.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRight(option.type)}
              className="text-left p-6 border border-neutral-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all"
            >
              <div className="flex items-start">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mr-4 text-primary-600">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-800 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    {option.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary-600 font-medium">
                      {option.legalArticle}
                    </span>
                    <span className="text-xs text-neutral-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {option.timeframe}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">
                Información Importante
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Todas las solicitudes requieren verificación de identidad</li>
                <li>• Los plazos de respuesta son establecidos por la Ley 1581 de 2012</li>
                <li>• Puede presentar reclamos ante la Superintendencia de Industria y Comercio (SIC)</li>
                <li>• El ejercicio de estos derechos es gratuito</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => setSelectedRight(null)}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-4"
        >
          ←
        </button>
        <div>
          <h2 className="text-2xl font-display font-bold text-neutral-800">
            {selectedOption?.title}
          </h2>
          <p className="text-neutral-600">
            {selectedOption?.description}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del usuario */}
        <div className="bg-neutral-50 rounded-xl p-6">
          <h3 className="font-semibold text-neutral-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Información del Solicitante
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={`${user?.person?.firstName || ''} ${user?.person?.lastName || ''}`}
                disabled
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-100 text-neutral-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-100 text-neutral-600"
              />
            </div>
          </div>
        </div>

        {/* Detalles de la solicitud */}
        <div>
          <h3 className="font-semibold text-neutral-800 mb-4">
            Detalles de la Solicitud
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Descripción de la solicitud *
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
                placeholder={`Describa específicamente qué ${selectedOption?.title.toLowerCase()} desea ejercer...`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Acción específica solicitada *
              </label>
              <input
                type="text"
                value={formData.requestedAction || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, requestedAction: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ejemplo: Eliminar datos de marketing, Corregir número de teléfono, etc."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Urgencia
                </label>
                <select
                  value={formData.urgency || 'medium'}
                  onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Baja - Sin urgencia</option>
                  <option value="medium">Media - Procesamiento normal</option>
                  <option value="high">Alta - Requiere atención prioritaria</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Base Legal
                </label>
                <input
                  type="text"
                  value={selectedOption?.legalArticle || ''}
                  disabled
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-100 text-neutral-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Información adicional
              </label>
              <textarea
                value={formData.additionalInfo || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                placeholder="Información adicional que considere relevante para su solicitud..."
              />
            </div>
          </div>
        </div>

        {/* Documentos de soporte */}
        {selectedOption?.requiresDocuments && (
          <div>
            <h3 className="font-semibold text-neutral-800 mb-4">
              Documentos de Soporte
            </h3>

            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6">
              <div className="text-center">
                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-600 mb-2">
                  Suba documentos que respalden su solicitud
                </p>
                <p className="text-sm text-neutral-500 mb-4">
                  Cédula de ciudadanía, autorización, etc. (PDF, JPG, PNG - Máx. 5MB)
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Seleccionar Archivos
                </Button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-neutral-700 mb-2">Archivos seleccionados:</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-neutral-500 mr-2" />
                          <span className="text-sm text-neutral-700">{file.name}</span>
                          <span className="text-xs text-neutral-500 ml-2">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Información legal */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-amber-800 mb-3">
            Información Legal Importante
          </h3>
          <div className="text-sm text-amber-700 space-y-2">
            <p><strong>Base legal:</strong> {selectedOption?.legalArticle}</p>
            <p><strong>Plazo de respuesta:</strong> {selectedOption?.timeframe}</p>
            <p><strong>Ejemplos de este derecho:</strong></p>
            <ul className="ml-4">
              {selectedOption?.examples.map((example, index) => (
                <li key={index}>• {example}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSelectedRight(null)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !formData.description || !formData.requestedAction}
            className="flex-1"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Enviar Solicitud
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DataRightsForm;