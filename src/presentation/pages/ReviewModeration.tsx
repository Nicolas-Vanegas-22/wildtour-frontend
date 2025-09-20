import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Flag,
  MessageCircle,
  User,
  Calendar,
  Star,
  AlertTriangle,
  Clock,
  FileText,
  MoreHorizontal,
  ChevronDown,
  Download,
  RefreshCw
} from 'lucide-react';
import { Review, ReviewStatus, ModerationAction } from '../../domain/models/Review';
import { mockReviews } from '../../data/mockData';
import '../styles/account-settings.css';

interface ReviewForModeration {
  id: string;
  destinationId: string;
  destinationName: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  updatedAt?: string;
  status: 'published' | 'flagged' | 'hidden' | 'deleted';
  flags: {
    id: string;
    reason: 'spam' | 'offensive' | 'inappropriate' | 'fake' | 'other';
    description?: string;
    reportedBy: string;
    reportedAt: string;
  }[];
  moderationHistory: {
    action: 'approved' | 'hidden' | 'deleted' | 'flagged';
    reason?: string;
    moderator: string;
    timestamp: string;
  }[];
}

export default function ReviewModeration() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'flagged' | 'pending' | 'hidden'>('flagged');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most_flagged'>('newest');
  const [selectedReview, setSelectedReview] = useState<ReviewForModeration | null>(null);
  const [moderationAction, setModerationAction] = useState<'approve' | 'hide' | 'delete' | ''>('');
  const [moderationReason, setModerationReason] = useState('');

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['moderation-reviews', filter, sortBy],
    queryFn: () => AdminRepo.getReviewsForModeration({ filter, sortBy })
  });

  const { data: moderationStats } = useQuery({
    queryKey: ['moderation-stats'],
    queryFn: () => AdminRepo.getModerationStats()
  });

  const moderateReviewMutation = useMutation({
    mutationFn: ({ reviewId, action, reason }: { reviewId: string; action: string; reason?: string }) =>
      AdminRepo.moderateReview(reviewId, action, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['moderation-stats'] });
      setSelectedReview(null);
      setModerationAction('');
      setModerationReason('');
      alert('Acción de moderación aplicada exitosamente');
    },
    onError: () => {
      alert('Error al aplicar la moderación');
    }
  });

  const bulkModerationMutation = useMutation({
    mutationFn: ({ reviewIds, action, reason }: { reviewIds: string[]; action: string; reason?: string }) =>
      AdminRepo.bulkModerateReviews(reviewIds, action, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['moderation-stats'] });
      alert('Moderación masiva aplicada exitosamente');
    }
  });

  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

  const handleSelectReview = (reviewId: string) => {
    setSelectedReviews(prev =>
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReviews.length === reviewsData?.items?.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviewsData?.items?.map((r: ReviewForModeration) => r.id) || []);
    }
  };

  const handleModeration = () => {
    if (!selectedReview || !moderationAction) return;

    moderateReviewMutation.mutate({
      reviewId: selectedReview.id,
      action: moderationAction,
      reason: moderationReason
    });
  };

  const handleBulkModeration = (action: string) => {
    if (selectedReviews.length === 0) {
      alert('Selecciona al menos una opinión');
      return;
    }

    const reason = prompt('Razón para la moderación (opcional):');
    bulkModerationMutation.mutate({
      reviewIds: selectedReviews,
      action,
      reason: reason || undefined
    });
    setSelectedReviews([]);
  };

  const getStatusBadge = (status: string, flagsCount: number) => {
    switch (status) {
      case 'published':
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            flagsCount > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
          }`}>
            {flagsCount > 0 ? `Publicado (${flagsCount} reportes)` : 'Publicado'}
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Reportado ({flagsCount})
          </span>
        );
      case 'hidden':
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            Oculto
          </span>
        );
      case 'deleted':
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-black text-white">
            Eliminado
          </span>
        );
      default:
        return null;
    }
  };

  const getFlagReasonText = (reason: string) => {
    const reasons = {
      spam: 'Spam',
      offensive: 'Contenido ofensivo',
      inappropriate: 'Contenido inapropiado',
      fake: 'Opinión falsa',
      other: 'Otro'
    };
    return reasons[reason as keyof typeof reasons] || reason;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Moderación de Opiniones</h1>
          <p className="text-gray-600">Gestiona y modera las opiniones de usuarios</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-3xl font-bold text-orange-600">{moderationStats?.pending || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reportadas</p>
              <p className="text-3xl font-bold text-red-600">{moderationStats?.flagged || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ocultas</p>
              <p className="text-3xl font-bold text-gray-600">{moderationStats?.hidden || 0}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aprobadas (Hoy)</p>
              <p className="text-3xl font-bold text-green-600">{moderationStats?.approvedToday || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex flex-wrap items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Filtrar:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">Todas</option>
                <option value="flagged">Reportadas</option>
                <option value="pending">Pendientes</option>
                <option value="hidden">Ocultas</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguos</option>
                <option value="most_flagged">Más reportados</option>
              </select>
            </div>
          </div>

          {selectedReviews.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{selectedReviews.length} seleccionadas</span>
              <button
                onClick={() => handleBulkModeration('approve')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Aprobar
              </button>
              <button
                onClick={() => handleBulkModeration('hide')}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Ocultar
              </button>
              <button
                onClick={() => handleBulkModeration('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={selectedReviews.length === reviewsData?.items?.length && reviewsData?.items?.length > 0}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Seleccionar todas ({reviewsData?.items?.length || 0})
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {reviewsData?.items?.map((review: ReviewForModeration) => (
            <div key={review.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={selectedReviews.includes(review.id)}
                  onChange={() => handleSelectReview(review.id)}
                  className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />

                <img
                  src={review.userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&size=40`}
                  alt={review.userName}
                  className="w-10 h-10 rounded-full"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{review.userName}</h4>
                      <p className="text-sm text-gray-500">
                        {review.destinationName} • {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      {getStatusBadge(review.status, review.flags.length)}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  {review.images && review.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}

                  {review.flags.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h5 className="font-medium text-red-800 mb-2">Reportes ({review.flags.length})</h5>
                      <div className="space-y-2">
                        {review.flags.map((flag) => (
                          <div key={flag.id} className="text-sm">
                            <span className="font-medium text-red-700">{getFlagReasonText(flag.reason)}</span>
                            {flag.description && <span className="text-red-600"> - {flag.description}</span>}
                            <span className="text-red-500 ml-2">
                              ({new Date(flag.reportedAt).toLocaleDateString()})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {review.moderationHistory.length > 0 && (
                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Historial de moderación</h5>
                      <div className="space-y-1">
                        {review.moderationHistory.slice(0, 3).map((history, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            <span className="font-medium">{history.action}</span>
                            {history.reason && <span> - {history.reason}</span>}
                            <span className="text-gray-500 ml-2">
                              por {history.moderator} ({new Date(history.timestamp).toLocaleDateString()})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedReview(review)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Moderar
                    </button>
                    <button className="text-gray-600 hover:text-gray-700 text-sm">
                      Ver historial completo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!reviewsData?.items || reviewsData.items.length === 0) && (
          <div className="p-12 text-center">
            <p className="text-gray-500">No hay opiniones para moderar con los filtros seleccionados.</p>
          </div>
        )}
      </div>

      {/* Moderation Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Moderar Opinión</h3>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Review Content */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <img
                    src={selectedReview.userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedReview.userName)}&size=32`}
                    alt={selectedReview.userName}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{selectedReview.userName}</p>
                    <p className="text-sm text-gray-500">{selectedReview.destinationName}</p>
                  </div>
                </div>
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= selectedReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700">{selectedReview.comment}</p>
              </div>

              {/* Moderation Actions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Acción</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="approve"
                        checked={moderationAction === 'approve'}
                        onChange={(e) => setModerationAction(e.target.value as any)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-green-700">Aprobar - La opinión es válida y apropiada</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="hide"
                        checked={moderationAction === 'hide'}
                        onChange={(e) => setModerationAction(e.target.value as any)}
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="ml-2 text-yellow-700">Ocultar - Ocultar temporalmente de la vista pública</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="delete"
                        checked={moderationAction === 'delete'}
                        onChange={(e) => setModerationAction(e.target.value as any)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-red-700">Eliminar - Eliminar permanentemente por violación</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razón (opcional)
                  </label>
                  <textarea
                    value={moderationReason}
                    onChange={(e) => setModerationReason(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Explica la razón de tu decisión..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleModeration}
                    disabled={!moderationAction || moderateReviewMutation.isPending}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {moderateReviewMutation.isPending ? 'Aplicando...' : 'Aplicar moderación'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}