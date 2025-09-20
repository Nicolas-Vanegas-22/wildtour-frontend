import React, { useState } from 'react';
import {
  Star,
  Camera,
  X,
  Upload,
  Check,
  AlertCircle,
  Heart,
  Users,
  MapPin,
  Clock
} from 'lucide-react';
import { CreateReviewRequest, ReviewRating } from '../../domain/models/Review';
import '../styles/account-settings.css';

interface ReviewFormProps {
  destinationId: string;
  destinationName: string;
  bookingId?: string;
  onSubmit: (review: CreateReviewRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  destinationId,
  destinationName,
  bookingId,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travelWith, setTravelWith] = useState<'solo' | 'couple' | 'family' | 'friends' | 'business'>('solo');
  const [recommendedFor, setRecommendedFor] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [rating, setRating] = useState<ReviewRating>({
    overall: 0,
    categories: {
      service: 0,
      cleanliness: 0,
      location: 0,
      valueForMoney: 0,
      facilities: 0
    }
  });

  const categories = [
    { key: 'service', label: 'Servicio al cliente', icon: '🤝' },
    { key: 'cleanliness', label: 'Limpieza', icon: '✨' },
    { key: 'location', label: 'Ubicación', icon: '📍' },
    { key: 'valueForMoney', label: 'Relación calidad-precio', icon: '💰' },
    { key: 'facilities', label: 'Instalaciones', icon: '🏢' }
  ];

  const travelWithOptions = [
    { value: 'solo', label: 'Solo/a', icon: '🚶' },
    { value: 'couple', label: 'En pareja', icon: '💑' },
    { value: 'family', label: 'En familia', icon: '👨‍👩‍👧‍👦' },
    { value: 'friends', label: 'Con amigos', icon: '👥' },
    { value: 'business', label: 'Viaje de negocios', icon: '💼' }
  ];

  const recommendedForOptions = [
    'Familias con niños',
    'Parejas románticas',
    'Aventureros',
    'Fotógrafos',
    'Amantes de la naturaleza',
    'Buscadores de cultura',
    'Viajeros económicos',
    'Viajeros de lujo',
    'Grupos grandes',
    'Personas mayores',
    'Jóvenes mochileros',
    'Viajeros de negocios'
  ];

  const handleRatingChange = (category: keyof ReviewRating['categories'] | 'overall', value: number) => {
    if (category === 'overall') {
      setRating(prev => ({ ...prev, overall: value }));
    } else {
      setRating(prev => ({
        ...prev,
        categories: { ...prev.categories, [category]: value }
      }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (selectedFiles.length + validFiles.length <= 5) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    } else {
      alert('Máximo 5 archivos permitidos');
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRecommendedFor = (option: string) => {
    setRecommendedFor(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || rating.overall === 0 || !travelDate) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const reviewData: CreateReviewRequest = {
      destinationId,
      bookingId,
      title: title.trim(),
      content: content.trim(),
      rating,
      media: selectedFiles,
      travelDate,
      travelWith,
      recommendedFor
    };

    onSubmit(reviewData);
  };

  const canProceedToStep2 = rating.overall > 0 && Object.values(rating.categories).every(r => r > 0);
  const canProceedToStep3 = title.trim() && content.trim() && travelDate;

  const renderStarRating = (
    value: number,
    onChange: (value: number) => void,
    label: string,
    size: 'sm' | 'lg' = 'sm'
  ) => {
    const starSize = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';

    return (
      <div className="flex items-center space-x-2">
        <span className={`font-medium text-gray-700 ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>
          {label}:
        </span>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className={`${starSize} transition-colors hover:scale-110 transform`}
            >
              <Star
                className={`w-full h-full ${
                  star <= value
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 hover:text-yellow-200'
                }`}
              />
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-600 ml-2">
          {value > 0 ? `${value}/5` : 'Sin calificar'}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Escribir Reseña</h2>
              <p className="text-blue-100 mt-1">{destinationName}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            {[1, 2, 3].map(stepNum => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum <= step ? 'bg-white text-blue-600' : 'bg-blue-400 text-blue-100'
                }`}>
                  {stepNum < step ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-12 h-1 ${stepNum < step ? 'bg-white' : 'bg-blue-400'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Calificaciones */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">¿Cómo calificarías tu experiencia?</h3>
                <p className="text-gray-600">Comparte tu opinión para ayudar a otros viajeros</p>
              </div>

              {/* Calificación General */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Calificación General</h4>
                {renderStarRating(rating.overall, (value) => handleRatingChange('overall', value), '', 'lg')}
                <div className="mt-2 text-sm text-gray-600">
                  {rating.overall === 0 && 'Selecciona una calificación'}
                  {rating.overall === 1 && 'Muy malo'}
                  {rating.overall === 2 && 'Malo'}
                  {rating.overall === 3 && 'Regular'}
                  {rating.overall === 4 && 'Bueno'}
                  {rating.overall === 5 && 'Excelente'}
                </div>
              </div>

              {/* Calificaciones por Categoría */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Calificaciones Detalladas</h4>
                <div className="space-y-4">
                  {categories.map(category => (
                    <div key={category.key} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{category.icon}</span>
                        <span className="font-medium text-gray-900">{category.label}</span>
                      </div>
                      {renderStarRating(
                        rating.categories[category.key as keyof ReviewRating['categories']],
                        (value) => handleRatingChange(category.key as keyof ReviewRating['categories'], value),
                        ''
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Reseña Escrita */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cuéntanos tu experiencia</h3>
                <p className="text-gray-600">Describe tu visita con detalles que ayuden a otros viajeros</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de tu reseña *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Experiencia increíble en San Agustín"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={100}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {title.length}/100
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu reseña *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe tu experiencia: ¿qué te gustó más? ¿qué mejorarías? ¿recomendarías este destino?"
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={2000}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {content.length}/2000
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de tu visita *
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Con quién viajaste?
                  </label>
                  <select
                    value={travelWith}
                    onChange={(e) => setTravelWith(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {travelWithOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Fotos y Recomendaciones */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Añade fotos y recomendaciones</h3>
                <p className="text-gray-600">Esto es opcional pero ayuda mucho a otros viajeros</p>
              </div>

              {/* Upload de fotos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos de tu visita (máximo 5)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      Haz clic para subir fotos o videos
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, MP4 hasta 10MB cada uno
                    </p>
                  </label>
                </div>

                {/* Preview de archivos */}
                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Upload className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recomendaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ¿Para quién recomendarías este destino?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {recommendedForOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleRecommendedFor(option)}
                      className={`p-3 rounded-lg border-2 text-sm transition-colors ${
                        recommendedFor.includes(option)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between">
            <button
              onClick={step > 1 ? () => setStep(step - 1) : onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {step > 1 ? 'Anterior' : 'Cancelar'}
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !canProceedToStep2) ||
                  (step === 2 && !canProceedToStep3)
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Publicar Reseña</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;