import React, { useState, useEffect } from 'react';
import {
  Star,
  ThumbsUp,
  Flag,
  Calendar,
  User,
  Filter,
  ChevronDown,
  MessageCircle,
  Camera,
  Play,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Review, ReviewFilters, ReviewStats, CreateResponseRequest } from '../../domain/models/Review';
import { mockReviews } from '../../data/mockData';
import ReviewForm from './ReviewForm';
import ReviewResponse from './ReviewResponse';
import '../styles/account-settings.css';

interface ReviewListProps {
  destinationId: string;
  showWriteButton?: boolean;
  maxReviews?: number;
  canRespond?: boolean; // Si el usuario actual puede responder a reseñas (proveedor/admin)
  userRole?: 'tourist' | 'provider' | 'admin';
}

const ReviewList: React.FC<ReviewListProps> = ({
  destinationId,
  showWriteButton = true,
  maxReviews,
  canRespond = false,
  userRole = 'tourist'
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedReviewForResponse, setSelectedReviewForResponse] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest_rated' | 'lowest_rated' | 'most_helpful'>('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterVerified, setFilterVerified] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [destinationId]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [reviews, sortBy, filterRating, filterVerified]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      // Simulación de carga desde API
      const destinationReviews = mockReviews.filter(r => r.destinationId === destinationId);

      // Calcular estadísticas
      const totalReviews = destinationReviews.length;
      const averageRating = totalReviews > 0
        ? destinationReviews.reduce((sum, r) => sum + r.rating.overall, 0) / totalReviews
        : 0;

      const ratingDistribution = {
        1: destinationReviews.filter(r => r.rating.overall === 1).length,
        2: destinationReviews.filter(r => r.rating.overall === 2).length,
        3: destinationReviews.filter(r => r.rating.overall === 3).length,
        4: destinationReviews.filter(r => r.rating.overall === 4).length,
        5: destinationReviews.filter(r => r.rating.overall === 5).length,
      };

      const categoryAverages = {
        service: totalReviews > 0 ? destinationReviews.reduce((sum, r) => sum + r.rating.categories.service, 0) / totalReviews : 0,
        cleanliness: totalReviews > 0 ? destinationReviews.reduce((sum, r) => sum + r.rating.categories.cleanliness, 0) / totalReviews : 0,
        location: totalReviews > 0 ? destinationReviews.reduce((sum, r) => sum + r.rating.categories.location, 0) / totalReviews : 0,
        valueForMoney: totalReviews > 0 ? destinationReviews.reduce((sum, r) => sum + r.rating.categories.valueForMoney, 0) / totalReviews : 0,
        facilities: totalReviews > 0 ? destinationReviews.reduce((sum, r) => sum + r.rating.categories.facilities, 0) / totalReviews : 0,
      };

      const reviewStats: ReviewStats = {
        totalReviews,
        averageRating,
        ratingDistribution,
        categoryAverages,
        verifiedReviews: destinationReviews.filter(r => r.verified).length,
        recentReviews: destinationReviews.filter(r =>
          new Date(r.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length
      };

      setReviews(destinationReviews);
      setStats(reviewStats);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...reviews];

    // Aplicar filtros
    if (filterRating !== null) {
      filtered = filtered.filter(review => review.rating.overall === filterRating);
    }

    if (filterVerified !== null) {
      filtered = filtered.filter(review => review.verified === filterVerified);
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest_rated':
          return b.rating.overall - a.rating.overall;
        case 'lowest_rated':
          return a.rating.overall - b.rating.overall;
        case 'most_helpful':
          return b.helpfulVotes - a.helpfulVotes;
        default:
          return 0;
      }
    });

    // Limitar número de reseñas si se especifica
    if (maxReviews) {
      filtered = filtered.slice(0, maxReviews);
    }

    setFilteredReviews(filtered);
  };

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      setIsLoading(true);
      // Aquí se enviaría la reseña al backend
      console.log('Enviando reseña:', reviewData);

      // Simulación de respuesta exitosa
      setTimeout(() => {
        alert('¡Reseña enviada exitosamente! Será revisada antes de publicarse.');
        setShowReviewForm(false);
        loadReviews(); // Recargar reseñas
      }, 1000);
    } catch (error) {
      console.error('Error enviando reseña:', error);
      alert('Error al enviar la reseña. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpfulVote = (reviewId: string) => {
    // Simulación de voto útil
    console.log('Voto útil para reseña:', reviewId);
  };

  const handleReportReview = (reviewId: string) => {
    // Simulación de reporte
    const reason = prompt('¿Por qué reportas esta reseña?\n1. Spam\n2. Contenido inapropiado\n3. Información falsa\n4. Otro');
    if (reason) {
      console.log('Reportando reseña:', reviewId, 'Razón:', reason);
      alert('Reseña reportada. Nuestro equipo la revisará.');
    }
  };

  const handleRespond = (review: Review) => {
    setSelectedReviewForResponse(review);
    setShowResponseModal(true);
  };

  const handleResponseSubmit = async (responseData: CreateResponseRequest) => {
    try {
      setIsLoading(true);
      // Aquí se enviaría la respuesta al backend
      console.log('Enviando respuesta:', responseData);

      // Simulación de respuesta exitosa
      setTimeout(() => {
        // Actualizar la reseña con la nueva respuesta
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review.id === responseData.reviewId
              ? {
                  ...review,
                  response: {
                    id: `response-${Date.now()}`,
                    authorId: 'current-user-id',
                    authorName: userRole === 'admin' ? 'Administrador' : 'Proveedor',
                    authorRole: userRole === 'admin' ? 'admin' : 'provider',
                    content: responseData.content,
                    createdAt: new Date().toISOString(),
                  }
                }
              : review
          )
        );

        alert('¡Respuesta enviada exitosamente!');
        setShowResponseModal(false);
        setSelectedReviewForResponse(null);
      }, 1000);
    } catch (error) {
      console.error('Error enviando respuesta:', error);
      alert('Error al enviar la respuesta. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number, showNumber: boolean = true) => {
    return (
      <div className="flex items-center">
        <div className="flex">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        {showNumber && (
          <span className="ml-2 text-sm font-medium text-gray-700">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    );
  };

  const renderRatingBar = (rating: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium">{rating}</span>
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
        </div>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 w-8">{count}</span>
      </div>
    );
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas de Reseñas */}
      {stats && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Resumen General */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              {renderStars(stats.averageRating, false)}
              <div className="text-sm text-gray-600 mt-2">
                Basado en {stats.totalReviews} reseñas
              </div>
              {stats.verifiedReviews > 0 && (
                <div className="flex items-center justify-center mt-2 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {stats.verifiedReviews} verificadas
                </div>
              )}
            </div>

            {/* Distribución de Calificaciones */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 mb-3">Distribución de calificaciones</h4>
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating}>
                  {renderRatingBar(rating, stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution], stats.totalReviews)}
                </div>
              ))}
            </div>

            {/* Calificaciones por Categoría */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Por categorías</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Servicio</span>
                  <div className="flex items-center">
                    {renderStars(stats.categoryAverages.service)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Limpieza</span>
                  <div className="flex items-center">
                    {renderStars(stats.categoryAverages.cleanliness)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ubicación</span>
                  <div className="flex items-center">
                    {renderStars(stats.categoryAverages.location)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Precio/Calidad</span>
                  <div className="flex items-center">
                    {renderStars(stats.categoryAverages.valueForMoney)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Instalaciones</span>
                  <div className="flex items-center">
                    {renderStars(stats.categoryAverages.facilities)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header con botón de escribir reseña */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Reseñas de viajeros ({filteredReviews.length})
          </h3>
          {stats && stats.recentReviews > 0 && (
            <p className="text-sm text-gray-600">
              {stats.recentReviews} reseñas en los últimos 30 días
            </p>
          )}
        </div>

        {showWriteButton && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Escribir reseña</span>
          </button>
        )}
      </div>

      {/* Filtros y Ordenamiento */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {(filterRating !== null || filterVerified !== null) && (
              <button
                onClick={() => {
                  setFilterRating(null);
                  setFilterVerified(null);
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="highest_rated">Mejor calificados</option>
              <option value="lowest_rated">Peor calificados</option>
              <option value="most_helpful">Más útiles</option>
            </select>
          </div>
        </div>

        {/* Panel de Filtros */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilterRating(null)}
                    className={`px-3 py-1 rounded text-sm ${
                      filterRating === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Todas
                  </button>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFilterRating(rating)}
                      className={`px-3 py-1 rounded text-sm flex items-center space-x-1 ${
                        filterRating === rating ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <span>{rating}</span>
                      <Star className="w-3 h-3 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verificación
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilterVerified(null)}
                    className={`px-3 py-1 rounded text-sm ${
                      filterVerified === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFilterVerified(true)}
                    className={`px-3 py-1 rounded text-sm flex items-center space-x-1 ${
                      filterVerified === true ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>Verificadas</span>
                  </button>
                  <button
                    onClick={() => setFilterVerified(false)}
                    className={`px-3 py-1 rounded text-sm ${
                      filterVerified === false ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Sin verificar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Reseñas */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {reviews.length === 0 ? 'Aún no hay reseñas' : 'No se encontraron reseñas con estos filtros'}
          </h3>
          <p className="text-gray-600 mb-4">
            {reviews.length === 0
              ? '¡Sé el primero en compartir tu experiencia!'
              : 'Intenta cambiar los filtros para ver más reseñas'
            }
          </p>
          {showWriteButton && reviews.length === 0 && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Escribir la primera reseña
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header de la reseña */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&size=48`}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                      {review.verified && (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span>Verificado</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      {renderStars(review.rating.overall)}
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido de la reseña */}
              <div className="mb-4">
                <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                <p className="text-gray-700 leading-relaxed">{review.content}</p>
              </div>

              {/* Información adicional */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Viajó {review.travelWith === 'family' ? 'en familia' :
                         review.travelWith === 'couple' ? 'en pareja' :
                         review.travelWith === 'friends' ? 'con amigos' :
                         review.travelWith === 'solo' ? 'solo/a' : 'en negocios'}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {new Date(review.travelDate).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
                </span>
                {review.recommendedFor.map((rec, i) => (
                  <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Para {rec.toLowerCase()}
                  </span>
                ))}
              </div>

              {/* Multimedia */}
              {review.media && review.media.length > 0 && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {review.media.slice(0, 4).map((media, i) => (
                      <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={media.caption || `Foto ${i + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        )}
                        {review.media.length > 4 && i === 3 && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-semibold">
                            +{review.media.length - 4}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleHelpfulVote(review.id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">Útil ({review.helpfulVotes})</span>
                  </button>
                  <button
                    onClick={() => handleReportReview(review.id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                    <span className="text-sm">Reportar</span>
                  </button>

                  {/* Botón de responder solo para proveedores/admins */}
                  {canRespond && !review.response && (
                    <button
                      onClick={() => handleRespond(review)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Responder</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {review.status === 'flagged' && (
                    <div className="flex items-center text-orange-600 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      <span>Reportada</span>
                    </div>
                  )}

                  {/* Indicador de respuesta */}
                  {review.response && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span>Respondida</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Respuesta del proveedor */}
              {review.response && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-gray-900 text-sm">
                        Respuesta del {review.response.authorRole === 'provider' ? 'proveedor' : 'administrador'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(review.response.createdAt).toLocaleDateString('es-CO')}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{review.response.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de formulario de reseña */}
      {showReviewForm && (
        <ReviewForm
          destinationId={destinationId}
          destinationName="Destino seleccionado"
          onSubmit={handleReviewSubmit}
          onCancel={() => setShowReviewForm(false)}
          isLoading={isLoading}
        />
      )}

      {/* Modal de respuesta a reseña */}
      {showResponseModal && selectedReviewForResponse && (
        <ReviewResponse
          reviewId={selectedReviewForResponse.id}
          reviewTitle={selectedReviewForResponse.title}
          reviewContent={selectedReviewForResponse.content}
          userName={selectedReviewForResponse.userName}
          userAvatar={selectedReviewForResponse.userAvatar}
          existingResponse={selectedReviewForResponse.response}
          onSubmit={handleResponseSubmit}
          onCancel={() => {
            setShowResponseModal(false);
            setSelectedReviewForResponse(null);
          }}
          isLoading={isLoading}
          canEdit={userRole === 'provider' || userRole === 'admin'}
        />
      )}
    </div>
  );
};

export default ReviewList;