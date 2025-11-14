import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Trash2, DollarSign, FileText } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { ProviderService, ServiceCategory } from '../../../domain/models/ProviderService';
import { providerServiceApi } from '../../../infrastructure/services/providerServiceApi';
import { useToast } from '../../hooks/useToast';
import { CATEGORIES_INFO } from '../../../data/customPackageServices';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingService?: ProviderService | null;
}

interface FormData {
  name: string;
  description: string;
  category: ServiceCategory | '';
  price: string;
}

interface ImagePreview {
  id: string;
  url: string;
  file?: File;
  isExisting: boolean;
}

export default function ServiceFormModal({
  isOpen,
  onClose,
  onSuccess,
  editingService,
}: ServiceFormModalProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    price: '',
  });
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (editingService) {
      setFormData({
        name: editingService.name,
        description: editingService.description,
        category: editingService.category,
        price: editingService.price.toString(),
      });
      setImages(
        editingService.images.map((img, index) => ({
          id: `existing-${index}`,
          url: img.url,
          isExisting: true,
        }))
      );
    } else {
      resetForm();
    }
  }, [editingService, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
    });
    setImages([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    if (images.length + files.length > 3) {
      showToast('Máximo 3 imágenes permitidas', 'error');
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        showToast(`${file.name} no es una imagen válida`, 'error');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} supera el tamaño máximo de 5MB`, 'error');
        return false;
      }
      return true;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [
          ...prev,
          {
            id: `new-${Date.now()}-${Math.random()}`,
            url: e.target?.result as string,
            file,
            isExisting: false,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.category || !formData.price) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }

    if (images.length === 0) {
      showToast('Debes agregar al menos una imagen', 'error');
      return;
    }

    if (images.length > 3) {
      showToast('Máximo 3 imágenes permitidas', 'error');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      showToast('El precio debe ser un número válido mayor a 0', 'error');
      return;
    }

    if (formData.description.length > 500) {
      showToast('La descripción no puede superar los 500 caracteres', 'error');
      return;
    }

    setIsLoading(true);

    try {
      if (editingService) {
        // Actualizar servicio
        const imagesToSend = images.map((img) => (img.isExisting ? img.url : img.file!));
        await providerServiceApi.updateService({
          id: editingService.id,
          name: formData.name,
          description: formData.description,
          category: formData.category as ServiceCategory,
          price,
          images: imagesToSend,
        });
        showToast('Servicio actualizado exitosamente', 'success');
      } else {
        // Crear nuevo servicio
        const newImages = images.filter((img) => img.file).map((img) => img.file!);
        await providerServiceApi.createService({
          name: formData.name,
          description: formData.description,
          category: formData.category as ServiceCategory,
          price,
          images: newImages,
        });
        showToast('Servicio creado exitosamente', 'success');
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el servicio';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <h2 className="text-2xl font-display font-bold text-neutral-900">
                  {editingService ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Nombre del servicio */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nombre del Servicio <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ej: Hotel Vista Hermosa"
                    required
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Categoría <span className="text-error-600">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                    required
                  >
                    <option value="">Selecciona una categoría...</option>
                    {CATEGORIES_INFO.map((cat) => (
                      <option key={cat.category} value={cat.category}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Descripción <span className="text-error-600">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Describe tu servicio..."
                      rows={4}
                      maxLength={500}
                      required
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-neutral-500">
                      {formData.description.length}/500
                    </div>
                  </div>
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Precio (COP) <span className="text-error-600">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="50000"
                      min="0"
                      step="1000"
                      required
                    />
                  </div>
                </div>

                {/* Imágenes */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Imágenes (Máximo 3) <span className="text-error-600">*</span>
                  </label>

                  {/* Drop Zone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      dragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-300 hover:border-neutral-400'
                    } ${images.length >= 3 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                      disabled={images.length >= 3}
                    />
                    <label
                      htmlFor="file-upload"
                      className={`cursor-pointer ${images.length >= 3 ? 'pointer-events-none' : ''}`}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-3 text-neutral-400" />
                      <p className="text-neutral-600 mb-1">
                        Arrastra imágenes aquí o <span className="text-primary-600 font-medium">examina</span>
                      </p>
                      <p className="text-xs text-neutral-500">PNG, JPG hasta 5MB - {images.length}/3</p>
                    </label>
                  </div>

                  {/* Vista previa de imágenes */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {images.map((img) => (
                        <div key={img.id} className="relative group">
                          <img
                            src={img.url}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg border border-neutral-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="absolute top-2 right-2 bg-error-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {img.isExisting && (
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                              Existente
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200">
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading
                    ? editingService
                      ? 'Actualizando...'
                      : 'Creando...'
                    : editingService
                    ? 'Actualizar Servicio'
                    : 'Crear Servicio'}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
