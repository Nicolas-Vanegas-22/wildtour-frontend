import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Clock,
  Users,
  Star,
  Filter,
  Plus,
  Search,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';
import { ServicePost } from '../../domain/models/ServicePost';
import { servicePostApi } from '../../infrastructure/services/servicePostApi';
import { Button } from '../../shared/ui/Button';
import { cn } from '../../shared/utils/cn';
import { useAuthStore } from '../../application/state/useAuthStore';
import CreateServicePost from '../components/CreateServicePost';
import PostComments from '../components/PostComments';

export default function ServiceFeed() {
  const [posts, setPosts] = useState<ServicePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    serviceType: '',
    location: '',
    priceRange: { min: 0, max: 1000000 }
  });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, [filters]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await servicePostApi.getServicePosts(filters);
      setPosts(response.posts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.isLiked) {
        await servicePostApi.unlikePost(postId);
      } else {
        await servicePostApi.likePost(postId);
      }

      // Actualizar el estado local
      setPosts(posts.map(p =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleBookmark = async (postId: string) => {
    if (!isAuthenticated) return;

    try {
      await servicePostApi.bookmarkPost(postId);
      setPosts(posts.map(p =>
        p.id === postId
          ? { ...p, isBookmarked: !p.isBookmarked }
          : p
      ));
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  };

  const handleShowComments = (postId: string) => {
    setSelectedPostId(postId);
    setShowComments(true);
  };

  const formatPrice = (price: ServicePost['price']) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: price.currency,
      minimumFractionDigits: 0
    }).format(price.amount) + ` ${price.unit}`;
  };

  const getServiceTypeColor = (type: ServicePost['serviceType']) => {
    const colors = {
      guia: 'bg-primary-100 text-primary-700',
      transporte: 'bg-sky-100 text-sky-700',
      alojamiento: 'bg-coral-100 text-coral-700',
      comida: 'bg-accent-100 text-accent-700',
      actividad: 'bg-secondary-100 text-secondary-700',
      experiencia: 'bg-purple-100 text-purple-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getServiceTypeLabel = (type: ServicePost['serviceType']) => {
    const labels = {
      guia: 'Guía Turístico',
      transporte: 'Transporte',
      alojamiento: 'Alojamiento',
      comida: 'Gastronomía',
      actividad: 'Actividad',
      experiencia: 'Experiencia'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Feed de Servicios Turísticos
              </h1>
              <p className="text-gray-600">
                Descubre los mejores servicios de prestadores locales
              </p>
            </div>

            {isAuthenticated && user?.role === 'provider' && (
              <Button
                onClick={() => setShowCreatePost(true)}
                leftIcon={<Plus className="w-5 h-5" />}
                variant="primary"
              >
                Publicar Servicio
              </Button>
            )}
          </div>

          {/* Filtros */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar servicios..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <select
              value={filters.serviceType}
              onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todos los servicios</option>
              <option value="guia">Guías</option>
              <option value="transporte">Transporte</option>
              <option value="alojamiento">Alojamiento</option>
              <option value="comida">Gastronomía</option>
              <option value="actividad">Actividades</option>
              <option value="experiencia">Experiencias</option>
            </select>

            <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
              Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {posts.map((post) => (
            <ServicePostCard
              key={post.id}
              post={post}
              onLike={() => handleLike(post.id)}
              onBookmark={() => handleBookmark(post.id)}
              onShowComments={() => handleShowComments(post.id)}
              onReserve={() => navigate(`/servicios/${post.id}/reservar`)}
              formatPrice={formatPrice}
              getServiceTypeColor={getServiceTypeColor}
              getServiceTypeLabel={getServiceTypeLabel}
            />
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay publicaciones disponibles
              </h3>
              <p className="text-gray-600 mb-4">
                Sé el primero en publicar un servicio turístico
              </p>
              {isAuthenticated && user?.role === 'provider' && (
                <Button
                  onClick={() => setShowCreatePost(true)}
                  variant="primary"
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  Crear Primera Publicación
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <CreateServicePost
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={loadPosts}
      />

      <PostComments
        postId={selectedPostId}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </div>
  );
}

// Componente individual de publicación
interface ServicePostCardProps {
  post: ServicePost;
  onLike: () => void;
  onBookmark: () => void;
  onShowComments: () => void;
  onReserve: () => void;
  formatPrice: (price: ServicePost['price']) => string;
  getServiceTypeColor: (type: ServicePost['serviceType']) => string;
  getServiceTypeLabel: (type: ServicePost['serviceType']) => string;
}

function ServicePostCard({
  post,
  onLike,
  onBookmark,
  onShowComments,
  onReserve,
  formatPrice,
  getServiceTypeColor,
  getServiceTypeLabel
}: ServicePostCardProps) {
  const [showAllImages, setShowAllImages] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Header del Post */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={post.provider.avatar}
              alt={post.provider.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{post.provider.businessName}</h3>
                {post.provider.verified && (
                  <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{post.provider.name}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{post.provider.location.city}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span>{post.provider.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={cn('px-3 py-1 rounded-full text-xs font-medium', getServiceTypeColor(post.serviceType))}>
              {getServiceTypeLabel(post.serviceType)}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('es-CO')}
            </span>
          </div>
        </div>
      </div>

      {/* Contenido del Post */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">{post.description}</p>

        {/* Imágenes */}
        {post.images.length > 0 && (
          <div className="mb-4">
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={post.images[currentImageIndex]}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
              {post.images.length > 1 && (
                <>
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-lg text-sm">
                    {currentImageIndex + 1} / {post.images.length}
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {post.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          'w-2 h-2 rounded-full transition-colors',
                          currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Información del Servicio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-primary-600" />
            <div>
              <div className="font-semibold text-gray-900">{formatPrice(post.price)}</div>
              <div className="text-xs text-gray-600">Precio</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-coral-600" />
            <div>
              <div className="font-semibold text-gray-900">{post.location.name}</div>
              <div className="text-xs text-gray-600">Ubicación</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-sky-600" />
            <div>
              <div className="font-semibold text-gray-900">
                {post.availability.maxCapacity - post.availability.currentBookings} disponibles
              </div>
              <div className="text-xs text-gray-600">Capacidad</div>
            </div>
          </div>
        </div>

        {/* Features/Características */}
        {post.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {post.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
              {post.features.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  +{post.features.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-primary-600 text-sm hover:underline cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Acciones del Post */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={onLike}
              className={cn(
                'flex items-center space-x-2 transition-colors',
                post.isLiked
                  ? 'text-red-500'
                  : 'text-gray-600 hover:text-red-500'
              )}
            >
              <Heart className={cn('w-5 h-5', post.isLiked && 'fill-current')} />
              <span className="text-sm font-medium">{post.likes}</span>
            </button>

            <button
              onClick={onShowComments}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Comentar</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-600 hover:text-sky-600 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">{post.shares}</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onBookmark}
              className={cn(
                'p-2 rounded-lg transition-colors',
                post.isBookmarked
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              )}
            >
              <Bookmark className={cn('w-5 h-5', post.isBookmarked && 'fill-current')} />
            </button>

            <Button variant="primary" size="sm" onClick={onReserve}>
              Reservar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}