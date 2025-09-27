import React, { useState } from 'react';
import {
  MessageCircle,
  Send,
  X,
  User,
  Calendar,
  Edit3,
  Check,
  AlertCircle
} from 'lucide-react';
import { CreateResponseRequest } from '../../domain/models/Review';
import '../styles/account-settings.css';

interface ReviewResponseProps {
  reviewId: string;
  reviewTitle: string;
  reviewContent: string;
  userName: string;
  userAvatar?: string;
  existingResponse?: {
    id: string;
    content: string;
    authorName: string;
    authorRole: 'provider' | 'admin';
    createdAt: string;
    updatedAt?: string;
  };
  onSubmit: (response: CreateResponseRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  canEdit?: boolean;
}

const ReviewResponse: React.FC<ReviewResponseProps> = ({
  reviewId,
  reviewTitle,
  reviewContent,
  userName,
  userAvatar,
  existingResponse,
  onSubmit,
  onCancel,
  isLoading = false,
  canEdit = true
}) => {
  const [content, setContent] = useState(existingResponse?.content || '');
  const [isEditing, setIsEditing] = useState(!existingResponse);
  const [errors, setErrors] = useState<{ content?: string }>({});

  const validateForm = () => {
    const newErrors: { content?: string } = {};

    if (!content.trim()) {
      newErrors.content = 'La respuesta no puede estar vacía';
    } else if (content.trim().length < 10) {
      newErrors.content = 'La respuesta debe tener al menos 10 caracteres';
    } else if (content.trim().length > 1000) {
      newErrors.content = 'La respuesta no puede exceder 1000 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const responseData: CreateResponseRequest = {
      reviewId,
      content: content.trim()
    };

    onSubmit(responseData);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (existingResponse) {
      setContent(existingResponse.content);
      setIsEditing(false);
    } else {
      onCancel();
    }
  };

  const quickResponses = [
    "Gracias por tu reseña. Nos alegra saber que disfrutaste tu experiencia con nosotros.",
    "Apreciamos tus comentarios y trabajaremos para mejorar en los aspectos que mencionas.",
    "Lamentamos que tu experiencia no haya sido completamente satisfactoria. Nos pondremos en contacto contigo para resolver cualquier inconveniente.",
    "Gracias por elegir nuestros servicios. Tu opinión es muy valiosa para nosotros.",
    "Nos complace saber que cumplimos con tus expectativas. Esperamos verte de nuevo pronto."
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-100 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-6 h-6" />
              <h3 className="text-xl font-bold">
                {existingResponse && !isEditing ? 'Ver Respuesta' :
                 existingResponse && isEditing ? 'Editar Respuesta' : 'Responder a Reseña'}
              </h3>
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Original Review */}
          <div className="bg-neutral-50 rounded-xl p-4 mb-6">
            <h4 className="text-lg font-semibold text-primary-700 mb-3">Reseña Original</h4>

            <div className="flex items-start space-x-3">
              <img
                src={userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=40`}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-primary-700">{userName}</span>
                  <span className="text-sm text-neutral-500">•</span>
                  <span className="text-sm text-neutral-500">Usuario verificado</span>
                </div>
                <h5 className="font-semibold text-primary-700 mb-2">{reviewTitle}</h5>
                <p className="text-neutral-700 leading-relaxed">{reviewContent}</p>
              </div>
            </div>
          </div>

          {/* Response Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-primary-700">
                {existingResponse ? 'Tu Respuesta' : 'Escribir Respuesta'}
              </h4>

              {existingResponse && !isEditing && canEdit && (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar</span>
                </button>
              )}
            </div>

            {!isEditing && existingResponse ? (
              // View existing response
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-primary-700">{existingResponse.authorName}</span>
                    <span className="text-sm text-neutral-600 ml-2">
                      ({existingResponse.authorRole === 'provider' ? 'Proveedor' : 'Administrador'})
                    </span>
                  </div>
                </div>
                <p className="text-neutral-700 leading-relaxed mb-3">{existingResponse.content}</p>
                <div className="flex items-center text-sm text-neutral-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    Respondido el {new Date(existingResponse.createdAt).toLocaleDateString('es-CO')}
                    {existingResponse.updatedAt && existingResponse.updatedAt !== existingResponse.createdAt && (
                      <span> • Editado el {new Date(existingResponse.updatedAt).toLocaleDateString('es-CO')}</span>
                    )}
                  </span>
                </div>
              </div>
            ) : (
              // Edit/Create response form
              <div className="space-y-4">
                {/* Quick Response Suggestions */}
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">
                    Respuestas Sugeridas (opcional)
                  </label>
                  <div className="grid gap-2">
                    {quickResponses.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setContent(suggestion)}
                        className="text-left p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-neutral-200 text-sm transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Response Text Area */}
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">
                    Tu respuesta *
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      if (errors.content) {
                        setErrors(prev => ({ ...prev, content: undefined }));
                      }
                    }}
                    rows={6}
                    placeholder="Escribe una respuesta profesional y constructiva..."
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors.content ? 'border-red-300 focus:border-secondary-500' : 'border-neutral-300 focus:border-blue-500'
                    }`}
                    maxLength={1000}
                  />

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm text-neutral-500">
                      {content.length}/1000 caracteres
                    </div>
                    {errors.content && (
                      <div className="flex items-center text-secondary-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span>{errors.content}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Guidelines */}
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                  <h5 className="font-medium text-warning-800 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Consejos para una buena respuesta
                  </h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Agradece al cliente por tomarse el tiempo de escribir la reseña</li>
                    <li>• Responde de manera profesional y constructiva</li>
                    <li>• Si hay críticas, explica cómo planeas mejorar</li>
                    <li>• Invita al cliente a contactarte directamente si es necesario</li>
                    <li>• Mantén un tono amigable y profesional</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="bg-neutral-50 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !content.trim()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{existingResponse ? 'Actualizar Respuesta' : 'Enviar Respuesta'}</span>
                </>
              )}
            </button>
          </div>
        )}

        {!isEditing && existingResponse && (
          <div className="bg-neutral-50 px-6 py-4 flex justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResponse;