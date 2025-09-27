import React, { useState } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  User,
  Calendar,
  Clock,
  Users,
  MapPin,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../../../shared/ui';
import { Button } from '../../../shared/ui';
import { cn } from '../../../shared/utils/cn';
import {
  CreateGuideReviewRequest,
  GuideRatingCategories,
  TOUR_TYPES,
  TRAVEL_WITH_OPTIONS,
  RECOMMENDED_FOR_OPTIONS
} from '../../../domain/models/GuideReview';
import { GuideRatingSystem } from './GuideRatingSystem';
import { useToast } from '../../hooks/useToast';

interface GuideReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  guideId: string;
  guideName: string;
  onSubmit: (review: CreateGuideReviewRequest) => Promise<void>;
  loading?: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
}

export const GuideReviewModal: React.FC<GuideReviewModalProps> = ({
  isOpen,
  onClose,
  guideId,
  guideName,
  onSubmit,
  loading = false
}) => {
  const { showToast } = useToast();

  // Estados del formulario
  const [formData, setFormData] = useState<Partial<CreateGuideReviewRequest>>({
    guideId,
    title: '',
    comment: '',
    tourType: '',
    tourDuration: 4,
    groupSize: 2,
    tourDate: '',
    travelWith: 'couple',
    recommendedFor: [],
    rating: {
      knowledge: 0,
      communication: 0,
      punctuality: 0,
      professionalism: 0,
      overall: 0
    }
  });

  const [mediaFiles, setMediaFiles] = useState<FileWithPreview[]>([]);
  const [currentStep, setCurrentStep] = useState<'basic' | 'rating' | 'media' | 'review'>('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      guideId,
      title: '',
      comment: '',
      tourType: '',
      tourDuration: 4,
      groupSize: 2,
      tourDate: '',
      travelWith: 'couple',
      recommendedFor: [],
      rating: {
        knowledge: 0,
        communication: 0,
        punctuality: 0,
        professionalism: 0,
        overall: 0
      }
    });
    setMediaFiles([]);
    setCurrentStep('basic');
    setErrors({});
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  // Validaciones por paso
  const validateStep = (step: string): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 'basic':
        if (!formData.tourDate) newErrors.tourDate = 'La fecha del tour es requerida';
        if (!formData.tourType) newErrors.tourType = 'El tipo de tour es requerido';
        if (!formData.tourDuration || formData.tourDuration < 1) newErrors.tourDuration = 'La duración debe ser mayor a 0';
        if (!formData.groupSize || formData.groupSize < 1) newErrors.groupSize = 'El tamaño del grupo debe ser mayor a 0';
        break;

      case 'rating':
        if (!formData.rating?.knowledge) newErrors.knowledge = 'Califica el conocimiento';
        if (!formData.rating?.communication) newErrors.communication = 'Califica la comunicación';
        if (!formData.rating?.punctuality) newErrors.punctuality = 'Califica la puntualidad';
        if (!formData.rating?.professionalism) newErrors.professionalism = 'Califica el profesionalismo';
        break;

      case 'review':
        if (!formData.title?.trim()) newErrors.title = 'El título es requerido';
        if (!formData.comment?.trim()) newErrors.comment = 'El comentario es requerido';
        if (formData.comment && formData.comment.length < 10) newErrors.comment = 'El comentario debe tener al menos 10 caracteres';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    const steps: Array<typeof currentStep> = ['basic', 'rating', 'media', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const steps: Array<typeof currentStep> = ['basic', 'rating', 'media', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (mediaFiles.length + files.length > 10) {
      showToast('Máximo 10 archivos permitidos', 'error');
      return;
    }

    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        showToast(`${file.name} es muy grande. Máximo 10MB`, 'error');
        return;
      }

      const fileWithPreview = file as FileWithPreview;
      if (file.type.startsWith('image/')) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }

      setMediaFiles(prev => [...prev, fileWithPreview]);
    });

    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => {
      const file = prev[index];
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async () => {
    if (!validateStep('review')) return;

    try {
      const reviewData: CreateGuideReviewRequest = {
        guideId: formData.guideId!,
        title: formData.title!,
        comment: formData.comment!,
        tourType: formData.tourType!,
        tourDuration: formData.tourDuration!,
        groupSize: formData.groupSize!,
        tourDate: formData.tourDate!,
        travelWith: formData.travelWith!,
        recommendedFor: formData.recommendedFor!,
        rating: formData.rating!,
        media: mediaFiles.length > 0 ? mediaFiles : undefined
      };

      await onSubmit(reviewData);
      showToast('Review enviada exitosamente', 'success');
      handleClose();
    } catch (error) {
      showToast('Error al enviar la review', 'error');
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'basic', label: 'Información Básica', icon: <Calendar className="w-4 h-4" /> },
      { key: 'rating', label: 'Calificación', icon: <Star className="w-4 h-4" /> },
      { key: 'media', label: 'Multimedia', icon: <ImageIcon className="w-4 h-4" /> },
      { key: 'review', label: 'Comentarios', icon: <User className="w-4 h-4" /> }
    ];

    return (
      <div className="flex justify-between mb-6">
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;
          const isCompleted = steps.findIndex(s => s.key === currentStep) > index;

          return (
            <div key={step.key} className="flex items-center">
              <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors',
                isActive && 'border-primary-600 bg-primary-600 text-white',
                isCompleted && 'border-success-600 bg-success-600 text-white',
                !isActive && !isCompleted && 'border-neutral-300 text-neutral-400'
              )}>
                {step.icon}
              </div>
              <div className="hidden sm:block ml-2">
                <div className={cn(
                  'text-sm font-medium',
                  isActive && 'text-primary-600',
                  isCompleted && 'text-success-600',
                  !isActive && !isCompleted && 'text-neutral-400'
                )}>
                  {step.label}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'hidden sm:block w-12 h-px ml-4 mr-4',
                  isCompleted ? 'bg-success-600' : 'bg-neutral-300'
                )} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderBasicStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Fecha del Tour *
          </label>
          <input
            type="date"
            value={formData.tourDate || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, tourDate: e.target.value }))}
            className={cn(
              'w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500',
              errors.tourDate && 'border-error-500'
            )}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.tourDate && <p className="text-error-500 text-sm mt-1">{errors.tourDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Tipo de Tour *
          </label>
          <select
            value={formData.tourType || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, tourType: e.target.value }))}
            className={cn(
              'w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500',
              errors.tourType && 'border-error-500'
            )}
          >
            <option value="">Selecciona un tipo</option>
            {TOUR_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.tourType && <p className="text-error-500 text-sm mt-1">{errors.tourType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Duración (horas) *
          </label>
          <input
            type="number"
            min="1"
            max="24"
            value={formData.tourDuration || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, tourDuration: parseInt(e.target.value) }))}
            className={cn(
              'w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500',
              errors.tourDuration && 'border-error-500'
            )}
          />
          {errors.tourDuration && <p className="text-error-500 text-sm mt-1">{errors.tourDuration}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Tamaño del Grupo *
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={formData.groupSize || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, groupSize: parseInt(e.target.value) }))}
            className={cn(
              'w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500',
              errors.groupSize && 'border-error-500'
            )}
          />
          {errors.groupSize && <p className="text-error-500 text-sm mt-1">{errors.groupSize}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          ¿Con quién viajaste? *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {TRAVEL_WITH_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, travelWith: option.value }))}
              className={cn(
                'flex flex-col items-center p-3 border-2 rounded-lg transition-colors',
                formData.travelWith === option.value
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-neutral-300 hover:border-neutral-400'
              )}
            >
              <span className="text-xl mb-1">{option.icon}</span>
              <span className="text-sm text-center">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRatingStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          Califica tu experiencia con {guideName}
        </h3>
        <p className="text-neutral-600">
          Ayuda a otros viajeros conociendo tu experiencia en cada aspecto
        </p>
      </div>

      <GuideRatingSystem
        rating={formData.rating!}
        onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
        showLabels={true}
        size="md"
      />

      {Object.keys(errors).some(key => ['knowledge', 'communication', 'punctuality', 'professionalism'].includes(key)) && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <p className="text-error-700 text-sm">
            Por favor, califica todos los aspectos del servicio del guía
          </p>
        </div>
      )}
    </div>
  );

  const renderMediaStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          Agrega fotos o videos (Opcional)
        </h3>
        <p className="text-neutral-600">
          Comparte imágenes de tu experiencia para ayudar a otros viajeros
        </p>
      </div>

      {/* Upload area */}
      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
        <input
          type="file"
          id="media-upload"
          multiple
          accept="image/*,video/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label htmlFor="media-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600 mb-2">
            Haz clic para subir archivos o arrástralos aquí
          </p>
          <p className="text-neutral-500 text-sm">
            Máximo 10 archivos, 10MB cada uno
          </p>
        </label>
      </div>

      {/* Preview de archivos */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mediaFiles.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                {file.type.startsWith('image/') ? (
                  <img
                    src={file.preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              <p className="text-xs text-neutral-500 mt-1 truncate">
                {file.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Título de tu Review *
        </label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Ej: Experiencia increíble en el desierto"
          className={cn(
            'w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500',
            errors.title && 'border-error-500'
          )}
        />
        {errors.title && <p className="text-error-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Cuéntanos sobre tu experiencia *
        </label>
        <textarea
          value={formData.comment || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
          rows={6}
          placeholder="Describe tu experiencia con el guía, qué te gustó más, qué mejorarías..."
          className={cn(
            'w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none',
            errors.comment && 'border-error-500'
          )}
        />
        {errors.comment && <p className="text-error-500 text-sm mt-1">{errors.comment}</p>}
        <p className="text-neutral-500 text-sm mt-1">
          {formData.comment?.length || 0} caracteres (mínimo 10)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Recomendado para:
        </label>
        <div className="flex flex-wrap gap-2">
          {RECOMMENDED_FOR_OPTIONS.map((option) => {
            const isSelected = formData.recommendedFor?.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  const current = formData.recommendedFor || [];
                  const updated = isSelected
                    ? current.filter(item => item !== option)
                    : [...current, option];
                  setFormData(prev => ({ ...prev, recommendedFor: updated }));
                }}
                className={cn(
                  'px-3 py-1 rounded-full text-sm transition-colors',
                  isSelected
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'basic':
        return renderBasicStep();
      case 'rating':
        return renderRatingStep();
      case 'media':
        return renderMediaStep();
      case 'review':
        return renderReviewStep();
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-neutral-100 rounded-xl shadow-xl"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  Calificar a {guideName}
                </h2>
                <p className="text-neutral-600">
                  Comparte tu experiencia para ayudar a otros viajeros
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={loading}
                className="p-1"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              {renderStepIndicator()}
              {renderCurrentStep()}
            </CardContent>

            {/* Botones de navegación */}
            <div className="flex justify-between items-center p-6 border-t bg-neutral-50">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 'basic' || loading}
              >
                Anterior
              </Button>

              <div className="flex gap-3">
                {currentStep !== 'review' ? (
                  <Button
                    variant="primary"
                    onClick={handleNext}
                    disabled={loading}
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="min-w-[120px]"
                  >
                    {loading ? 'Enviando...' : 'Enviar Review'}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GuideReviewModal;