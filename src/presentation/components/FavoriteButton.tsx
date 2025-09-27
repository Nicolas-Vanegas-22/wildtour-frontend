import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../shared/utils/cn';
import { useFavoritesStore } from '../../application/state/useFavoritesStore';
import { useAuthStore } from '../../application/state/useAuthStore';
import { useToast } from '../hooks/useToast';
import { CreateFavoriteData } from '../../domain/models/Favorites';

interface FavoriteButtonProps {
  itemId: string;
  itemType: CreateFavoriteData['itemType'];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline' | 'ghost';
  showLabel?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

export function FavoriteButton({
  itemId,
  itemType,
  className,
  size = 'md',
  variant = 'filled',
  showLabel = false,
  onToggle
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, addToFavorites, removeFromFavorites, loading } = useFavoritesStore();
  const { showToast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);

  const isItemFavorite = isFavorite(itemId);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getVariantClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2';

    if (isItemFavorite) {
      switch (variant) {
        case 'filled':
          return `${baseClasses} bg-secondary-500 text-white hover:bg-secondary-600 shadow-lg hover:shadow-xl`;
        case 'outline':
          return `${baseClasses} border-2 border-secondary-500 text-secondary-500 bg-neutral-100 hover:bg-secondary-50`;
        case 'ghost':
          return `${baseClasses} text-secondary-500 hover:bg-secondary-50`;
      }
    } else {
      switch (variant) {
        case 'filled':
          return `${baseClasses} bg-neutral-100/90 text-neutral-600 hover:text-secondary-500 hover:bg-neutral-100 shadow-md`;
        case 'outline':
          return `${baseClasses} border-2 border-neutral-300 text-neutral-600 bg-neutral-100 hover:border-secondary-500 hover:text-secondary-500`;
        case 'ghost':
          return `${baseClasses} text-neutral-600 hover:text-secondary-500 hover:bg-secondary-50`;
      }
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Inicia sesión para guardar favoritos', 'error');
      return;
    }

    if (loading) return;

    setIsAnimating(true);

    try {
      if (isItemFavorite) {
        await removeFromFavorites(itemId);
        showToast('Eliminado de favoritos', 'success');
        onToggle?.(false);
      } else {
        await addToFavorites({
          itemType,
          itemId
        });
        showToast('Agregado a favoritos', 'success');
        onToggle?.(true);
      }
    } catch (error) {
      // Error ya manejado en el store
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <motion.button
        onClick={handleClick}
        disabled={loading}
        className={cn(
          sizeClasses[size],
          getVariantClasses(),
          loading && 'opacity-50 cursor-not-allowed',
          'relative overflow-hidden'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Icono principal */}
        <motion.div
          className="relative"
          animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={cn(
              iconSizes[size],
              isItemFavorite ? 'fill-current' : '',
              'transition-colors duration-200'
            )}
          />
        </motion.div>

        {/* Efecto de ondas al hacer click */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              className="absolute inset-0 rounded-full bg-secondary-400"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </motion.button>

      {/* Label opcional */}
      {showLabel && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <span className="text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded-full shadow-sm">
            {isItemFavorite ? 'En favoritos' : 'Agregar a favoritos'}
          </span>
        </div>
      )}

      {/* Tooltip en hover */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
          {isItemFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </div>
  );
}

// Componente especializado para cards de servicios
interface ServiceCardFavoriteButtonProps extends Omit<FavoriteButtonProps, 'itemType'> {
  serviceId: string;
}

export function ServiceCardFavoriteButton({
  serviceId,
  className = "absolute top-3 right-3",
  size = "md",
  variant = "filled",
  ...props
}: ServiceCardFavoriteButtonProps) {
  return (
    <FavoriteButton
      itemId={serviceId}
      itemType="service_post"
      className={className}
      size={size}
      variant={variant}
      {...props}
    />
  );
}

// Hook personalizado para obtener el estado de favorito
export function useFavoriteStatus(itemId: string) {
  const { isFavorite, addToFavorites, removeFromFavorites, loading, getFavoriteByItemId } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useToast();

  const isItemFavorite = isFavorite(itemId);
  const favoriteData = getFavoriteByItemId(itemId);

  const toggleFavorite = async (itemType: CreateFavoriteData['itemType'], options?: {
    notes?: string;
    tags?: string[];
  }) => {
    if (!isAuthenticated) {
      showToast('Inicia sesión para guardar favoritos', 'error');
      return false;
    }

    try {
      if (isItemFavorite) {
        await removeFromFavorites(itemId);
        showToast('Eliminado de favoritos', 'success');
        return false;
      } else {
        await addToFavorites({
          itemType,
          itemId,
          notes: options?.notes,
          tags: options?.tags
        });
        showToast('Agregado a favoritos', 'success');
        return true;
      }
    } catch (error) {
      return isItemFavorite;
    }
  };

  return {
    isFavorite: isItemFavorite,
    favoriteData,
    toggleFavorite,
    loading
  };
}