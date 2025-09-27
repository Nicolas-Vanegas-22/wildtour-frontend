import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Heart,
  Star,
  Send,
  Image as ImageIcon,
  X,
  ThumbsUp,
  MoreVertical
} from 'lucide-react';
import { Review, PostComment } from '../../domain/models/ServicePost';
import { servicePostApi } from '../../infrastructure/services/servicePostApi';
import { Button } from '../../shared/ui/Button';
import { cn } from '../../shared/utils/cn';
import { useAuthStore } from '../../application/state/useAuthStore';

interface PostCommentsProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostComments({ postId, isOpen, onClose }: PostCommentsProps) {
  const [activeTab, setActiveTab] = useState<'comments' | 'reviews'>('comments');
  const [comments, setComments] = useState<PostComment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      loadComments();
      loadReviews();
    }
  }, [isOpen, postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await servicePostApi.getComments(postId);
      setComments(response.comments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await servicePostApi.getReviews(postId);
      setReviews(response.reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !isAuthenticated) return;

    try {
      const comment = await servicePostApi.createComment(postId, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-100 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('comments')}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors',
                activeTab === 'comments'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:text-primary-700'
              )}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Comentarios ({comments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors',
                activeTab === 'reviews'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:text-primary-700'
              )}
            >
              <Star className="w-5 h-5" />
              <span>Reseñas ({reviews.length})</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {activeTab === 'comments' ? (
            <CommentsTab
              comments={comments}
              loading={loading}
              newComment={newComment}
              setNewComment={setNewComment}
              onSubmitComment={handleSubmitComment}
              isAuthenticated={isAuthenticated}
            />
          ) : (
            <ReviewsTab
              reviews={reviews}
              loading={loading}
              showReviewForm={showReviewForm}
              setShowReviewForm={setShowReviewForm}
              postId={postId}
              onReviewCreated={loadReviews}
              isAuthenticated={isAuthenticated}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Tab de Comentarios
interface CommentsTabProps {
  comments: PostComment[];
  loading: boolean;
  newComment: string;
  setNewComment: (value: string) => void;
  onSubmitComment: () => void;
  isAuthenticated: boolean;
}

function CommentsTab({
  comments,
  loading,
  newComment,
  setNewComment,
  onSubmitComment,
  isAuthenticated
}: CommentsTabProps) {
  return (
    <div className="p-6">
      {/* Escribir comentario */}
      {isAuthenticated && (
        <div className="mb-6">
          <div className="flex space-x-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Tu avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                rows={3}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              <div className="flex justify-end mt-2">
                <Button
                  onClick={onSubmitComment}
                  disabled={!newComment.trim()}
                  size="sm"
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Comentar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="loading-spinner w-6 h-6 border-4 border-primary-600 border-t-transparent rounded-full"></div>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-8 text-neutral-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No hay comentarios aún</p>
            <p className="text-sm">Sé el primero en comentar</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Tab de Reseñas
interface ReviewsTabProps {
  reviews: Review[];
  loading: boolean;
  showReviewForm: boolean;
  setShowReviewForm: (show: boolean) => void;
  postId: string;
  onReviewCreated: () => void;
  isAuthenticated: boolean;
}

function ReviewsTab({
  reviews,
  loading,
  showReviewForm,
  setShowReviewForm,
  postId,
  onReviewCreated,
  isAuthenticated
}: ReviewsTabProps) {
  return (
    <div className="p-6">
      {/* Botón para crear reseña */}
      {isAuthenticated && !showReviewForm && (
        <div className="mb-6">
          <Button
            onClick={() => setShowReviewForm(true)}
            variant="outline"
            fullWidth
            leftIcon={<Star className="w-4 h-4" />}
          >
            Escribir Reseña
          </Button>
        </div>
      )}

      {/* Formulario de reseña */}
      {showReviewForm && (
        <ReviewForm
          postId={postId}
          onClose={() => setShowReviewForm(false)}
          onReviewCreated={() => {
            setShowReviewForm(false);
            onReviewCreated();
          }}
        />
      )}

      {/* Lista de reseñas */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="loading-spinner w-6 h-6 border-4 border-primary-600 border-t-transparent rounded-full"></div>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))
        ) : (
          <div className="text-center py-8 text-neutral-500">
            <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No hay reseñas aún</p>
            <p className="text-sm">Comparte tu experiencia</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de comentario individual
function CommentItem({ comment }: { comment: PostComment }) {
  const [liked, setLiked] = useState(comment.isLiked);
  const [likes, setLikes] = useState(comment.likes);

  return (
    <div className="flex space-x-3">
      <img
        src={comment.user.avatar}
        alt={comment.user.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="bg-neutral-50 rounded-2xl px-4 py-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-primary-700">{comment.user.name}</span>
            <span className="text-xs text-neutral-500">
              {new Date(comment.createdAt).toLocaleDateString('es-CO')}
            </span>
          </div>
          <p className="text-neutral-700">{comment.content}</p>
        </div>

        <div className="flex items-center space-x-4 mt-2 ml-4">
          <button
            onClick={() => {
              setLiked(!liked);
              setLikes(liked ? likes - 1 : likes + 1);
            }}
            className={cn(
              'flex items-center space-x-1 text-sm',
              liked ? 'text-secondary-500' : 'text-neutral-500 hover:text-secondary-500'
            )}
          >
            <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
            <span>{likes}</span>
          </button>
          <button className="text-sm text-neutral-500 hover:text-neutral-700">
            Responder
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente de reseña individual
function ReviewItem({ review }: { review: Review }) {
  return (
    <div className="border-b border-gray-100 pb-6 last:border-b-0">
      <div className="flex items-start space-x-3">
        <img
          src={review.user.avatar}
          alt={review.user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-primary-700">{review.user.name}</h4>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-500">
                  {new Date(review.createdAt).toLocaleDateString('es-CO')}
                </span>
              </div>
            </div>
            <button className="p-1 hover:bg-neutral-100 rounded">
              <MoreVertical className="w-4 h-4 text-neutral-400" />
            </button>
          </div>

          <p className="text-neutral-700 mb-3">{review.comment}</p>

          {/* Imágenes de la reseña */}
          {review.images && review.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {review.images.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Reseña ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button
              className={cn(
                'flex items-center space-x-1 text-sm',
                review.isHelpful
                  ? 'text-primary-600'
                  : 'text-neutral-500 hover:text-primary-600'
              )}
            >
              <ThumbsUp className={cn('w-4 h-4', review.isHelpful && 'fill-current')} />
              <span>Útil ({review.helpful})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Formulario para crear reseña
interface ReviewFormProps {
  postId: string;
  onClose: () => void;
  onReviewCreated: () => void;
}

function ReviewForm({ postId, onClose, onReviewCreated }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim()) return;

    try {
      setLoading(true);
      await servicePostApi.createReview(postId, {
        rating,
        comment,
        images: images.length > 0 ? images : undefined
      });
      onReviewCreated();
    } catch (error) {
      console.error('Error creating review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-50 rounded-2xl p-4 mb-6">
      <h3 className="font-semibold text-primary-700 mb-4">Escribir Reseña</h3>

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Calificación
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={cn(
                  'w-6 h-6 transition-colors',
                  star <= rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 hover:text-yellow-300'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comentario */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Tu experiencia
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comparte tu experiencia con este servicio..."
          rows={4}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3">
        <Button onClick={onClose} variant="ghost" size="sm">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || !comment.trim()}
          loading={loading}
          size="sm"
        >
          Publicar Reseña
        </Button>
      </div>
    </div>
  );
}