import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, X, Loader2, User } from 'lucide-react';
import { userApi } from '../../infrastructure/services/userApi';
import { useAuthStore } from '../../application/state/useAuthStore';
import { Button } from '../../shared/ui/Button';

interface AvatarUploadProps {
  currentAvatar?: string;
  onUploadSuccess?: (avatarUrl: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40',
};

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export default function AvatarUpload({
  currentAvatar,
  onUploadSuccess,
  size = 'lg',
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useAuthStore();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validaciones del lado del cliente
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('El archivo es demasiado grande. Máximo 5MB.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Formato no permitido. Usa JPG, PNG o WEBP.');
      return;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir archivo
    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await userApi.uploadAvatar(file);

      // Actualizar el estado del usuario con la nueva URL del avatar
      if (user) {
        setUser({
          ...user,
          avatar: result.avatarUrl,
        });
      }

      // Callback opcional
      if (onUploadSuccess) {
        onUploadSuccess(result.avatarUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayAvatar = previewUrl || currentAvatar || user?.avatar;
  const baseUrl = 'http://localhost:5116'; // URL base de tu backend

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Container */}
      <div className="relative group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center relative`}
        >
          {displayAvatar ? (
            <img
              src={displayAvatar.startsWith('http') ? displayAvatar : `${baseUrl}${displayAvatar}`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className={`${iconSizeClasses[size]} text-white`} />
          )}

          {/* Overlay con botón de cambiar */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleButtonClick}
              disabled={isUploading}
              className="text-white"
            >
              {isUploading ? (
                <Loader2 className={`${iconSizeClasses[size]} animate-spin`} />
              ) : (
                <Camera className={iconSizeClasses[size]} />
              )}
            </button>
          </div>
        </motion.div>

        {/* Botón de eliminar preview */}
        {previewUrl && !isUploading && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={clearPreview}
            className="absolute -top-2 -right-2 bg-error-500 text-white rounded-full p-1.5 hover:bg-error-600 transition-colors shadow-md"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Botón de subir */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleButtonClick}
        disabled={isUploading}
        className="gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Cambiar foto
          </>
        )}
      </Button>

      {/* Mensaje de error */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error-600 text-center"
        >
          {error}
        </motion.p>
      )}

      {/* Información */}
      <p className="text-xs text-neutral-500 text-center max-w-xs">
        JPG, PNG o WEBP. Máximo 5MB.
      </p>
    </div>
  );
}
