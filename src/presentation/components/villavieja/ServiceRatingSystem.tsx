import React, { useState } from 'react';
import {
  Star,
  StarHalf,
  Clock,
  Car,
  Shield,
  UserCheck,
  Wrench,
  Sparkles,
  Settings,
  DollarSign,
  Stethoscope,
  Building,
  GraduationCap,
  Timer,
  Zap,
  Fuel,
  Store,
  TrendingDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../shared/utils/cn';
import {
  ServiceRatingCategories,
  ServiceType,
  SERVICE_RATING_CATEGORIES,
  TransportationRatingCategories,
  EquipmentRatingCategories,
  HealthServiceRatingCategories,
  FuelServiceRatingCategories
} from '../../../domain/models/ServiceReview';

interface ServiceRatingSystemProps {
  serviceType: ServiceType;
  rating?: ServiceRatingCategories;
  onRatingChange?: (rating: ServiceRatingCategories) => void;
  readonly?: boolean;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readonly = false,
  size = 'md',
  showValue = false
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const displayValue = hoverValue ?? value;

  const handleStarClick = (starValue: number) => {
    if (!readonly && onChange) {
      onChange(starValue);
    }
  };

  const handleStarHover = (starValue: number) => {
    if (!readonly) {
      setHoverValue(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(null);
    }
  };

  const renderStar = (starIndex: number) => {
    const isFilled = starIndex <= displayValue;
    const isHalfFilled = starIndex - 0.5 === displayValue;

    return (
      <motion.button
        key={starIndex}
        type="button"
        onClick={() => handleStarClick(starIndex)}
        onMouseEnter={() => handleStarHover(starIndex)}
        disabled={readonly}
        className={cn(
          'focus:outline-none',
          !readonly && 'hover:scale-110 cursor-pointer',
          readonly && 'cursor-default'
        )}
        whileHover={!readonly ? { scale: 1.1 } : {}}
        whileTap={!readonly ? { scale: 0.95 } : {}}
      >
        {isHalfFilled ? (
          <StarHalf
            className={cn(
              sizeClasses[size],
              'text-warning-400 fill-current'
            )}
          />
        ) : (
          <Star
            className={cn(
              sizeClasses[size],
              isFilled ? 'text-warning-400 fill-current' : 'text-neutral-300',
              'transition-colors duration-150'
            )}
          />
        )}
      </motion.button>
    );
  };

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map(renderStar)}
      {showValue && (
        <span className="ml-2 text-sm font-medium text-neutral-700">
          {displayValue.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// Función auxiliar para obtener el rating inicial por defecto
const getDefaultRating = (serviceType: ServiceType): ServiceRatingCategories => {
  const baseRating = { overall: 0 };

  switch (serviceType) {
    case 'transportation':
      return { ...baseRating, punctuality: 0, comfort: 0, safety: 0, driverService: 0 } as TransportationRatingCategories;
    case 'equipment':
      return { ...baseRating, quality: 0, condition: 0, functionality: 0, valueForMoney: 0 } as EquipmentRatingCategories;
    case 'health':
      return { ...baseRating, attention: 0, facilities: 0, professionalism: 0, availability: 0 } as HealthServiceRatingCategories;
    case 'fuel':
      return { ...baseRating, serviceSpeed: 0, fuelQuality: 0, facilities: 0, priceCompetitive: 0 } as FuelServiceRatingCategories;
    default:
      return baseRating as ServiceRatingCategories;
  }
};

export const ServiceRatingSystem: React.FC<ServiceRatingSystemProps> = ({
  serviceType,
  rating,
  onRatingChange,
  readonly = false,
  showLabels = true,
  size = 'md',
  className
}) => {
  const currentRating = rating || getDefaultRating(serviceType);
  const categories = SERVICE_RATING_CATEGORIES[serviceType];

  if (!categories) {
    return null;
  }

  const renderIcon = (iconName: string, className?: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'Clock': Clock,
      'Car': Car,
      'Shield': Shield,
      'UserCheck': UserCheck,
      'Star': Star,
      'Wrench': Wrench,
      'Sparkles': Sparkles,
      'Settings': Settings,
      'DollarSign': DollarSign,
      'Stethoscope': Stethoscope,
      'Building': Building,
      'GraduationCap': GraduationCap,
      'Timer': Timer,
      'Zap': Zap,
      'Fuel': Fuel,
      'Store': Store,
      'TrendingDown': TrendingDown
    };

    const IconComponent = iconMap[iconName] || Star;
    return <IconComponent className={cn("w-5 h-5", className)} />;
  };

  const handleCategoryRatingChange = (
    category: string,
    value: number
  ) => {
    if (onRatingChange) {
      const newRating = { ...currentRating, [category]: value };

      // Calcular promedio general automáticamente si no es readonly
      if (!readonly && category !== 'overall') {
        const categoryEntries = Object.entries(newRating).filter(([key]) => key !== 'overall');
        const average = categoryEntries.reduce((sum, [_, val]) => sum + (val as number), 0) / categoryEntries.length;
        (newRating as any).overall = Math.round(average * 10) / 10;
      }

      onRatingChange(newRating);
    }
  };

  const getAverageRating = () => {
    const categoryEntries = Object.entries(currentRating).filter(([key]) => key !== 'overall');
    const sum = categoryEntries.reduce((acc, [_, value]) => acc + (value as number), 0);
    return categoryEntries.length > 0 ? sum / categoryEntries.length : 0;
  };

  const getServiceTypeLabel = () => {
    switch (serviceType) {
      case 'transportation': return 'Transporte';
      case 'equipment': return 'Equipo';
      case 'health': return 'Servicio de Salud';
      case 'fuel': return 'Estación de Servicio';
      default: return 'Servicio';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Calificación general */}
      <div className="bg-gradient-to-r from-warning-50 to-accent-50 p-4 rounded-lg border border-warning-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {renderIcon(categories.overall.icon)}
            <div>
              <h3 className="font-semibold text-neutral-900">
                {categories.overall.label}
              </h3>
              {showLabels && (
                <p className="text-sm text-neutral-600">
                  {getServiceTypeLabel()}: {categories.overall.description}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-warning-600">
              {(currentRating as any).overall > 0 ? (currentRating as any).overall.toFixed(1) : getAverageRating().toFixed(1)}
            </div>
            <div className="text-sm text-neutral-500">de 5.0</div>
          </div>
        </div>
        <StarRating
          value={(currentRating as any).overall > 0 ? (currentRating as any).overall : getAverageRating()}
          onChange={(value) => handleCategoryRatingChange('overall', value)}
          readonly={readonly}
          size={size}
        />
      </div>

      {/* Categorías individuales */}
      <div className="space-y-3">
        {Object.entries(categories)
          .filter(([key]) => key !== 'overall')
          .map(([categoryKey, categoryInfo]) => {
            return (
              <div key={categoryKey} className="flex items-center justify-between p-3 bg-neutral-100 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  {renderIcon(categoryInfo.icon)}
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900">
                      {categoryInfo.label}
                    </h4>
                    {showLabels && (
                      <p className="text-sm text-neutral-600">
                        {categoryInfo.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StarRating
                    value={(currentRating as any)[categoryKey] || 0}
                    onChange={(value) => handleCategoryRatingChange(categoryKey, value)}
                    readonly={readonly}
                    size={size}
                  />
                  {(currentRating as any)[categoryKey] > 0 && (
                    <span className="text-sm font-medium text-neutral-700 min-w-[2rem] text-center">
                      {(currentRating as any)[categoryKey].toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Resumen estadístico para modo readonly */}
      {readonly && (currentRating as any).overall > 0 && (
        <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
          <h4 className="font-medium text-neutral-900 mb-2">Resumen de Calificación</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-600">Promedio General:</span>
              <span className="ml-2 font-semibold text-warning-600">
                {(currentRating as any).overall.toFixed(1)}/5.0
              </span>
            </div>
            <div>
              <span className="text-neutral-600">Categoría Mejor:</span>
              <span className="ml-2 font-semibold text-success-600">
                {Object.entries(currentRating)
                  .filter(([key]) => key !== 'overall')
                  .reduce((best, [key, value]) =>
                    (value as number) > best.value ? { key, value: value as number } : best,
                    { key: '', value: 0 }
                  ).value.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRatingSystem;