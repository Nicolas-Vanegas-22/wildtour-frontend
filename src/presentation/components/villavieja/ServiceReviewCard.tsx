import React, { useState } from 'react';
import {
  ThumbsUp,
  Flag,
  User,
  Calendar,
  Clock,
  Users,
  MapPin,
  Camera,
  Play,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Star,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../../shared/ui';
import { Button } from '../../../shared/ui';
import { cn } from '../../../shared/utils/cn';
import { ServiceReview, USED_FOR_OPTIONS } from '../../../domain/models/ServiceReview';
import { ServiceRatingSystem } from './ServiceRatingSystem';
import { formatRelativeTime, formatAbsoluteDate } from '../../../shared/utils/formatDate';

interface ServiceReviewCardProps {
  review: ServiceReview;
  onHelpfulClick?: (reviewId: string) => void;
  onReportClick?: (reviewId: string) => void;
  onResponseClick?: (reviewId: string) => void;
  showServiceInfo?: boolean;
  className?: string;
  compact?: boolean;
}

export const ServiceReviewCard: React.FC<ServiceReviewCardProps> = ({
  review,
  onHelpfulClick,
  onReportClick,
  onResponseClick,
  showServiceInfo = false,
  className,
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [showMediaModal, setShowMediaModal] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    return formatRelativeTime(dateString);
  };

  const getUsedForInfo = (value: string) => {
    return USED_FOR_OPTIONS.find(option => option.value === value);
  };

  const getServiceTypeLabel = () => {
    switch (review.serviceType) {
      case 'transportation': return 'Transporte';
      case 'equipment': return 'Equipo';
      case 'health': return 'Salud';
      case 'fuel': return 'Combustible';
      default: return 'Servicio';
    }
  };

  const shouldTruncateComment = compact && review.comment.length > 200;
  const displayComment = shouldTruncateComment && !isExpanded
    ? review.comment.slice(0, 200) + '...'
    : review.comment;

  const renderMedia = () => {
    if (!review.media?.length) return null;

    return (
      <div className="mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {review.media.slice(0, 4).map((media, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setShowMediaModal(index)}
            >
              {media.type === 'image' ? (
                <>
                  <img
                    src={media.url}
                    alt={media.caption || `Imagen ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </>
              )}

              {index === 3 && review.media.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    +{review.media.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVerifiedBadge = () => {
    if (!review.verified) return null;

    return (
      <div className="inline-flex items-center gap-1 bg-success-100 text-success-800 px-2 py-1 rounded-full text-xs font-medium">
        <Shield className="w-3 h-3" />
        Servicio Verificado
      </div>
    );
  };

  const getServiceTypeColor = () => {
    switch (review.serviceType) {
      case 'transportation': return 'green';
      case 'equipment': return 'orange';
      case 'health': return 'red';
      case 'fuel': return 'yellow';
      default: return 'gray';
    }
  };

  const color = getServiceTypeColor();

  return (
    <Card className={cn('overflow-hidden', className)} variant="elevated">
      <CardContent className="p-6">
        {/* Header con información del usuario y fechas */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
              {review.userAvatar ? (
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                review.userName.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-neutral-900">{review.userName}</h4>
                {renderVerifiedBadge()}
                <div className="flex items-center gap-1 text-neutral-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  {formatDate(review.createdAt)}
                </div>
              </div>

              {/* Información del servicio */}
              {showServiceInfo && (
                <div className="flex items-center gap-1 text-neutral-600 text-sm mt-1">
                  <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    color === 'green' && 'bg-success-100 text-success-800',
                    color === 'orange' && 'bg-accent-100 text-accent-800',
                    color === 'red' && 'bg-error-100 text-error-800',
                    color === 'yellow' && 'bg-warning-100 text-warning-800'
                  )}>
                    {getServiceTypeLabel()}
                  </span>
                  <span>• {review.serviceName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Menú de acciones */}
          <div className="flex items-center gap-1 ml-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReportClick?.(review.id)}
              className="text-neutral-500 hover:text-neutral-700 p-1"
            >
              <Flag className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Título de la review */}
        <h3 className="text-lg font-semibold text-neutral-900 mb-3">
          {review.title}
        </h3>

        {/* Sistema de rating */}
        <div className="mb-4">
          <ServiceRatingSystem
            serviceType={review.serviceType}
            rating={review.rating}
            readonly
            showLabels={false}
            size="sm"
          />
        </div>

        {/* Información del servicio utilizado */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-1 text-neutral-600">
            <MapPin className="w-4 h-4" />
            <span>{review.providerName}</span>
          </div>
          {review.duration && (
            <div className="flex items-center gap-1 text-neutral-600">
              <Clock className="w-4 h-4" />
              <span>{review.duration} min</span>
            </div>
          )}
          {review.groupSize && (
            <div className="flex items-center gap-1 text-neutral-600">
              <Users className="w-4 h-4" />
              <span>{review.groupSize} personas</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-neutral-600">
            <span>{getUsedForInfo(review.usedFor)?.icon}</span>
            <span>{getUsedForInfo(review.usedFor)?.label}</span>
          </div>
        </div>

        {/* Fecha del servicio */}
        <div className="text-sm text-neutral-600 mb-4">
          Servicio utilizado: {formatAbsoluteDate(review.serviceDate)}
        </div>

        {/* Comentario */}
        <div className="mb-4">
          <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
            {displayComment}
          </p>

          {shouldTruncateComment && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-primary-600 hover:text-primary-700 p-0 h-auto font-normal"
            >
              {isExpanded ? (
                <>
                  Ver menos <ChevronUp className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Ver más <ChevronDown className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>

        {/* Media */}
        {renderMedia()}

        {/* Recomendado para */}
        {review.recommendedFor.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-neutral-600 mb-2">Recomendado para:</p>
            <div className="flex flex-wrap gap-1">
              {review.recommendedFor.map((recommendation, index) => (
                <span
                  key={index}
                  className={cn(
                    'px-2 py-1 rounded-full text-xs',
                    color === 'green' && 'bg-success-100 text-success-800',
                    color === 'orange' && 'bg-accent-100 text-accent-800',
                    color === 'red' && 'bg-error-100 text-error-800',
                    color === 'yellow' && 'bg-warning-100 text-warning-800'
                  )}
                >
                  {recommendation}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Respuesta del proveedor */}
        <AnimatePresence>
          {review.providerResponse && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-primary-600" />
                <span className="font-semibold text-primary-900">Respuesta del proveedor</span>
                <span className="text-primary-600 text-sm">
                  {formatDate(review.providerResponse.createdAt)}
                </span>
              </div>
              <p className="text-neutral-700 leading-relaxed">
                {review.providerResponse.content}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Acciones */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onHelpfulClick?.(review.id)}
              className="text-neutral-500 hover:text-success-600 flex items-center gap-1"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Útil ({review.helpfulVotes})</span>
            </Button>

            {!review.providerResponse && onResponseClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onResponseClick(review.id)}
                className="text-neutral-500 hover:text-primary-600 flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Responder</span>
              </Button>
            )}
          </div>

          <div className="text-xs text-neutral-500">
            {review.status === 'pending' && 'Esperando moderación'}
            {review.reportedCount > 0 && (
              <span className="text-accent-600">
                {review.reportedCount} reportes
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceReviewCard;