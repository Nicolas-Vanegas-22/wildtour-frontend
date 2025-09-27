import React, { useState } from 'react';
import {
  Star,
  StarHalf,
  GraduationCap,
  MessageCircle,
  Clock,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../shared/utils/cn';
import { GuideRatingCategories, RATING_CATEGORIES } from '../../../domain/models/GuideReview';

interface GuideRatingSystemProps {
  rating?: GuideRatingCategories;
  onRatingChange?: (rating: GuideRatingCategories) => void;
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

export const GuideRatingSystem: React.FC<GuideRatingSystemProps> = ({
  rating = {
    knowledge: 0,
    communication: 0,
    punctuality: 0,
    professionalism: 0,
    overall: 0
  },
  onRatingChange,
  readonly = false,
  showLabels = true,
  size = 'md',
  className
}) => {
  const renderIcon = (iconName: string, className?: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'GraduationCap': GraduationCap,
      'MessageCircle': MessageCircle,
      'Clock': Clock,
      'Star': Star,
      'Trophy': Trophy
    };

    const IconComponent = iconMap[iconName] || Star;
    return <IconComponent className={cn("w-5 h-5", className)} />;
  };
  const handleCategoryRatingChange = (
    category: keyof GuideRatingCategories,
    value: number
  ) => {
    if (onRatingChange) {
      const newRating = { ...rating, [category]: value };

      // Calcular promedio general automáticamente si no es readonly
      if (!readonly && category !== 'overall') {
        const categories = Object.entries(newRating).filter(([key]) => key !== 'overall');
        const average = categories.reduce((sum, [_, val]) => sum + val, 0) / categories.length;
        newRating.overall = Math.round(average * 10) / 10;
      }

      onRatingChange(newRating);
    }
  };

  const getAverageRating = () => {
    const categories = Object.entries(rating).filter(([key]) => key !== 'overall');
    const sum = categories.reduce((acc, [_, value]) => acc + value, 0);
    return categories.length > 0 ? sum / categories.length : 0;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Calificación general */}
      <div className="bg-gradient-to-r from-warning-50 to-accent-50 p-4 rounded-lg border border-warning-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {renderIcon(RATING_CATEGORIES.overall.icon)}
            <div>
              <h3 className="font-semibold text-neutral-900">
                {RATING_CATEGORIES.overall.label}
              </h3>
              {showLabels && (
                <p className="text-sm text-neutral-600">
                  {RATING_CATEGORIES.overall.description}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-warning-600">
              {rating.overall > 0 ? rating.overall.toFixed(1) : getAverageRating().toFixed(1)}
            </div>
            <div className="text-sm text-neutral-500">de 5.0</div>
          </div>
        </div>
        <StarRating
          value={rating.overall > 0 ? rating.overall : getAverageRating()}
          onChange={(value) => handleCategoryRatingChange('overall', value)}
          readonly={readonly}
          size={size}
        />
      </div>

      {/* Categorías individuales */}
      <div className="space-y-3">
        {Object.entries(RATING_CATEGORIES)
          .filter(([key]) => key !== 'overall')
          .map(([categoryKey, categoryInfo]) => {
            const key = categoryKey as keyof Omit<GuideRatingCategories, 'overall'>;
            return (
              <div key={key} className="flex items-center justify-between p-3 bg-neutral-100 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors">
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
                    value={rating[key]}
                    onChange={(value) => handleCategoryRatingChange(key, value)}
                    readonly={readonly}
                    size={size}
                  />
                  {rating[key] > 0 && (
                    <span className="text-sm font-medium text-neutral-700 min-w-[2rem] text-center">
                      {rating[key].toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Resumen estadístico para modo readonly */}
      {readonly && rating.overall > 0 && (
        <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
          <h4 className="font-medium text-neutral-900 mb-2">Resumen de Calificación</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-600">Promedio General:</span>
              <span className="ml-2 font-semibold text-warning-600">
                {rating.overall.toFixed(1)}/5.0
              </span>
            </div>
            <div>
              <span className="text-neutral-600">Categoría Mejor:</span>
              <span className="ml-2 font-semibold text-success-600">
                {Object.entries(rating)
                  .filter(([key]) => key !== 'overall')
                  .reduce((best, [key, value]) =>
                    value > best.value ? { key, value } : best,
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

export default GuideRatingSystem;