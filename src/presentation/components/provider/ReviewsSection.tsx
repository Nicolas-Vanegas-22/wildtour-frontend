import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, User, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { ServiceReview } from '../../../domain/models/ProviderService';
import { reviewApi } from '../../../infrastructure/services/providerServiceApi';
import { Button } from '../../../shared/ui/Button';
import { useToast } from '../../hooks/useToast';

interface ReviewsSectionProps {
  serviceId: string;
  canReview?: boolean; // Si el usuario actual puede dejar una reseña
}

export default function ReviewsSection({ serviceId, canReview = false }: ReviewsSectionProps) {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [expanded, setExpanded] = useState(true);

  // Formulario de nueva reseña
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [serviceId]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await reviewApi.getServiceReviews(serviceId);
      setReviews(response.reviews);
      setAverageRating(response.averageRating);
      setTotal(response.total);
    } catch (error) {
      showToast('Error al cargar las reseñas', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newReview.rating === 0) {
      showToast('Por favor selecciona una calificación', 'error');
      return;
    }

    if (newReview.comment.trim().length < 10) {
      showToast('El comentario debe tener al menos 10 caracteres', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewApi.createReview({
        serviceId,
        rating: newReview.rating,
        comment: newReview.comment,
      });
      showToast('Reseña publicada exitosamente', 'success');
      setNewReview({ rating: 0, comment: '' });
      setShowReviewForm(false);
      await fetchReviews();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al publicar la reseña';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const StarRating = ({ rating, size = 'md', interactive = false, onChange }: any) => {
    const [hoverRating, setHoverRating] = useState(0);
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={() => interactive && onChange && onChange(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}
            disabled={!interactive}
          >
            <Star
              className={`${sizeClasses[size]} ${
                star <= (hoverRating || rating)
                  ? 'text-warning-500 fill-current'
                  : 'text-neutral-300 fill-current'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-warning-500 fill-current" />
            <h3 className="text-xl font-display font-bold text-neutral-900">
              Calificaciones y Reseñas
            </h3>
          </div>
          {total > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-neutral-900">{averageRating.toFixed(1)}</span>
              <div className="text-sm text-neutral-600">
                <div className="font-medium">de 5.0</div>
                <div>{total} reseñas</div>
              </div>
            </div>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-neutral-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-400" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-neutral-200"
          >
            <div className="p-6 space-y-6">
              {/* Formulario de nueva reseña (solo para turistas) */}
              {canReview && (
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
                  {showReviewForm ? (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Tu calificación
                        </label>
                        <StarRating
                          rating={newReview.rating}
                          size="lg"
                          interactive
                          onChange={(rating: number) => setNewReview({ ...newReview, rating })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Tu comentario
                        </label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                          rows={4}
                          placeholder="Comparte tu experiencia con este servicio..."
                          maxLength={500}
                        />
                        <div className="text-xs text-neutral-500 mt-1 text-right">
                          {newReview.comment.length}/500
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1"
                        >
                          {isSubmitting ? 'Publicando...' : 'Publicar Reseña'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowReviewForm(false);
                            setNewReview({ rating: 0, comment: '' });
                          }}
                          disabled={isSubmitting}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <Button onClick={() => setShowReviewForm(true)} className="w-full">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Escribir una Reseña
                    </Button>
                  )}
                </div>
              )}

              {/* Lista de reseñas */}
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto" />
                  <p className="text-neutral-600 mt-4">Cargando reseñas...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-2">
                    Sin reseñas aún
                  </h4>
                  <p className="text-neutral-600">
                    Sé el primero en compartir tu experiencia con este servicio
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-neutral-50 rounded-xl p-5 border border-neutral-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {review.userAvatar ? (
                            <img
                              src={review.userAvatar}
                              alt={review.userName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-primary-600" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-neutral-900">{review.userName}</div>
                            <div className="text-xs text-neutral-500">{formatDate(review.createdAt)}</div>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-neutral-700 leading-relaxed">{review.comment}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
