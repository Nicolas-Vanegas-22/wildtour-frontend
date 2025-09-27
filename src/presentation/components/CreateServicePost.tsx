import React, { useState } from 'react';
import {
  X,
  Upload,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Tag,
  Image as ImageIcon,
  Plus,
  Minus
} from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { cn } from '../../shared/utils/cn';
import { CreateServicePostData } from '../../domain/models/ServicePost';
import { servicePostApi } from '../../infrastructure/services/servicePostApi';

interface CreateServicePostProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export default function CreateServicePost({ isOpen, onClose, onPostCreated }: CreateServicePostProps) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateServicePostData>({
    title: '',
    description: '',
    images: [],
    serviceType: 'guia',
    price: {
      amount: 0,
      currency: 'COP',
      unit: 'por persona'
    },
    location: {
      name: '',
      coordinates: undefined
    },
    availability: {
      dates: [],
      maxCapacity: 1,
      currentBookings: 0
    },
    features: [],
    tags: []
  });

  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages = [...formData.images, ...files];
    const newPreviews = [...imagePreview];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newPreviews.push(event.target?.result as string);
        setImagePreview([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImagePreview(newPreviews);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim().toLowerCase()]
      });
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await servicePostApi.createServicePost(formData);
      onPostCreated();
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        images: [],
        serviceType: 'guia',
        price: { amount: 0, currency: 'COP', unit: 'por persona' },
        location: { name: '' },
        availability: { dates: [], maxCapacity: 1, currentBookings: 0 },
        features: [],
        tags: []
      });
      setImagePreview([]);
      setCurrentStep(1);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() && formData.description.trim() && formData.serviceType;
      case 2:
        return formData.price.amount > 0 && formData.location.name.trim() && formData.availability.maxCapacity > 0;
      case 3:
        return true; // Opcional
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-100 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-2xl font-bold text-primary-700">Crear Publicación de Servicio</h2>
            <p className="text-neutral-600">Paso {currentStep} de 3</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 bg-neutral-50">
          <div className="flex items-center">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    step <= currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-300 text-neutral-600'
                  )}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={cn(
                      'flex-1 h-1 mx-4',
                      step < currentStep ? 'bg-primary-600' : 'bg-neutral-300'
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>Información Básica</span>
            <span>Detalles del Servicio</span>
            <span>Extras y Características</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Paso 1: Información Básica */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Título del Servicio *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Tour guiado por el Desierto de la Tatacoa"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe tu servicio, qué incluye, qué pueden esperar los turistas..."
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tipo de Servicio *
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as any })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="guia">Guía Turístico</option>
                  <option value="transporte">Transporte</option>
                  <option value="alojamiento">Alojamiento</option>
                  <option value="comida">Gastronomía</option>
                  <option value="actividad">Actividad</option>
                  <option value="experiencia">Experiencia</option>
                </select>
              </div>

              {/* Upload de Imágenes */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Imágenes del Servicio
                </label>
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <ImageIcon className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                    <p className="text-neutral-600">Haz clic para subir imágenes</p>
                    <p className="text-sm text-neutral-500">PNG, JPG hasta 10MB cada una</p>
                  </label>
                </div>

                {/* Preview de Imágenes */}
                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-secondary-500 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Paso 2: Detalles del Servicio */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Precio *
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={formData.price.amount}
                      onChange={(e) => setFormData({
                        ...formData,
                        price: { ...formData.price, amount: Number(e.target.value) }
                      })}
                      placeholder="50000"
                      className="flex-1 px-4 py-3 border border-neutral-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <select
                      value={formData.price.unit}
                      onChange={(e) => setFormData({
                        ...formData,
                        price: { ...formData.price, unit: e.target.value }
                      })}
                      className="px-4 py-3 border border-l-0 border-neutral-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="por persona">por persona</option>
                      <option value="por grupo">por grupo</option>
                      <option value="por día">por día</option>
                      <option value="por hora">por hora</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Capacidad Máxima *
                  </label>
                  <input
                    type="number"
                    value={formData.availability.maxCapacity}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: { ...formData.availability, maxCapacity: Number(e.target.value) }
                    })}
                    placeholder="8"
                    min="1"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Ubicación del Servicio *
                </label>
                <input
                  type="text"
                  value={formData.location.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, name: e.target.value }
                  })}
                  placeholder="Ej: Desierto de la Tatacoa, Villavieja, Huila"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          )}

          {/* Paso 3: Extras y Características */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Características */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Características del Servicio
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Ej: Incluye transporte, Guía certificado..."
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <Button onClick={addFeature} size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    Agregar
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{feature}</span>
                      <button
                        onClick={() => removeFeature(index)}
                        className="hover:bg-primary-200 rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Etiquetas (Tags)
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ej: aventura, naturaleza, astronomía..."
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm" leftIcon={<Tag className="w-4 h-4" />}>
                    Agregar
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-2 bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>#{tag}</span>
                      <button
                        onClick={() => removeTag(index)}
                        className="hover:bg-neutral-200 rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-neutral-200">
          <Button
            onClick={prevStep}
            variant="outline"
            disabled={currentStep === 1}
          >
            Anterior
          </Button>

          <div className="flex space-x-3">
            <Button onClick={onClose} variant="ghost">
              Cancelar
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                variant="primary"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={loading}
                disabled={!isStepValid()}
                variant="primary"
              >
                Publicar Servicio
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}