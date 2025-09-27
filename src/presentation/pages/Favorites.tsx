import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Edit,
  Trash2,
  Star,
  MapPin,
  Calendar,
  Users,
  Tag,
  StickyNote,
  Share2,
  Download,
  ChevronDown,
  X,
  Folder,
  FolderPlus
} from 'lucide-react';
import { useFavoritesStore } from '../../application/state/useFavoritesStore';
import { useToast } from '../hooks/useToast';
import { Button } from '../../shared/ui/Button';
import { cn } from '../../shared/utils/cn';
import { FavoriteItem, FavoritesCollection, FavoriteFilters, CreateCollectionData } from '../../domain/models/Favorites';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'service_post' | 'accommodation' | 'activity' | 'package';

export default function Favorites() {
  const {
    collections,
    currentCollection,
    favoriteItems,
    loading,
    error,
    totalCount,
    loadFavorites,
    loadCollections,
    setCurrentCollection,
    createCollection,
    removeFromFavorites,
    searchFavorites,
    clearError
  } = useFavoritesStore();

  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredItems, setFilteredItems] = useState<FavoriteItem[]>(favoriteItems);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Filtros
  const [filters, setFilters] = useState<FavoriteFilters>({
    itemType: [],
    tags: [],
    availability: 'all'
  });

  useEffect(() => {
    if (favoriteItems.length === 0) {
      loadFavorites();
      loadCollections();
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, favoriteItems, currentCollection]);

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      clearError();
    }
  }, [error]);

  const applyFilters = async () => {
    try {
      const baseItems = currentCollection?.items || favoriteItems;
      let results = baseItems;

      if (searchQuery || Object.keys(filters).some(key => {
        const value = filters[key as keyof FavoriteFilters];
        return Array.isArray(value) ? value.length > 0 : value !== 'all' && value !== undefined;
      })) {
        results = await searchFavorites(searchQuery, filters);
      }

      setFilteredItems(results);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const handleCollectionChange = (collection: FavoritesCollection | null) => {
    setCurrentCollection(collection);
    setSelectedItems(new Set());
    setShowBulkActions(false);
  };

  const handleRemoveFromFavorites = async (itemId: string) => {
    try {
      await removeFromFavorites(itemId);
      showToast('Eliminado de favoritos', 'success');
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    } catch (error) {
      // Error ya manejado en el store
    }
  };

  const handleBulkRemove = async () => {
    if (selectedItems.size === 0) return;

    const confirmed = window.confirm(`¿Eliminar ${selectedItems.size} elementos de favoritos?`);
    if (!confirmed) return;

    try {
      for (const itemId of selectedItems) {
        await removeFromFavorites(itemId);
      }
      showToast(`${selectedItems.size} elementos eliminados`, 'success');
      setSelectedItems(new Set());
      setShowBulkActions(false);
    } catch (error) {
      // Error ya manejado en el store
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      setShowBulkActions(newSet.size > 0);
      return newSet;
    });
  };

  const formatPrice = (price: FavoriteItem['itemData']['price']) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: price.currency,
      minimumFractionDigits: 0
    }).format(price.amount);
  };

  const getItemTypeLabel = (type: FavoriteItem['itemType']) => {
    const labels = {
      service_post: 'Servicio',
      accommodation: 'Alojamiento',
      activity: 'Actividad',
      package: 'Paquete'
    };
    return labels[type];
  };

  const getItemTypeColor = (type: FavoriteItem['itemType']) => {
    const colors = {
      service_post: 'bg-blue-100 text-blue-800',
      accommodation: 'bg-green-100 text-green-800',
      activity: 'bg-orange-100 text-orange-800',
      package: 'bg-purple-100 text-purple-800'
    };
    return colors[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Mis Favoritos
              </h1>
              <p className="text-gray-600 text-lg">
                {totalCount} {totalCount === 1 ? 'servicio guardado' : 'servicios guardados'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateCollection(true)}
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                Nueva colección
              </Button>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Explorar servicios
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de colecciones */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Colecciones</h3>

              <div className="space-y-2">
                <button
                  onClick={() => handleCollectionChange(null)}
                  className={cn(
                    'w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-colors',
                    !currentCollection
                      ? 'bg-primary-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  )}
                >
                  <Heart className="w-5 h-5" />
                  <div>
                    <div className="font-medium">Todos</div>
                    <div className="text-xs opacity-75">{totalCount} elementos</div>
                  </div>
                </button>

                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => handleCollectionChange(collection)}
                    className={cn(
                      'w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-colors',
                      currentCollection?.id === collection.id
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    )}
                  >
                    <Folder className="w-5 h-5" style={{ color: currentCollection?.id === collection.id ? 'white' : collection.color }} />
                    <div>
                      <div className="font-medium">{collection.name}</div>
                      <div className="text-xs opacity-75">{collection.items.length} elementos</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {/* Controles de búsqueda y filtros */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
                {/* Búsqueda */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar en favoritos..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Controles */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                      'px-4 py-3 rounded-xl border-2 font-medium transition-all flex items-center space-x-2',
                      showFilters
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300'
                    )}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filtros</span>
                  </button>

                  {/* Vista */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        'p-2 rounded-md transition-colors',
                        viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      )}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        'p-2 rounded-md transition-colors',
                        viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Panel de filtros */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t border-gray-200 pt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de servicio
                      </label>
                      <select
                        value={filters.itemType?.[0] || ''}
                        onChange={(e) => setFilters({
                          ...filters,
                          itemType: e.target.value ? [e.target.value as FavoriteItem['itemType']] : []
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Todos los tipos</option>
                        <option value="service_post">Servicios</option>
                        <option value="accommodation">Alojamiento</option>
                        <option value="activity">Actividades</option>
                        <option value="package">Paquetes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Disponibilidad
                      </label>
                      <select
                        value={filters.availability}
                        onChange={(e) => setFilters({
                          ...filters,
                          availability: e.target.value as 'all' | 'available' | 'unavailable'
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="all">Todas</option>
                        <option value="available">Disponibles</option>
                        <option value="unavailable">No disponibles</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setFilters({ itemType: [], tags: [], availability: 'all' });
                          setSearchQuery('');
                        }}
                        className="w-full"
                      >
                        Limpiar filtros
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Acciones masivas */}
            {showBulkActions && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary-600 text-white rounded-2xl p-4 mb-6 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium">
                    {selectedItems.size} elementos seleccionados
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBulkRemove}
                    className="text-white hover:bg-white/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedItems(new Set());
                      setShowBulkActions(false);
                    }}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            )}

            {/* Lista de favoritos */}
            {!loading && (
              <div className={cn(
                'grid gap-6',
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              )}>
                {filteredItems.map((item, index) => (
                  <FavoriteCard
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                    index={index}
                    isSelected={selectedItems.has(item.itemId)}
                    onSelect={() => toggleItemSelection(item.itemId)}
                    onRemove={() => handleRemoveFromFavorites(item.itemId)}
                    formatPrice={formatPrice}
                    getItemTypeLabel={getItemTypeLabel}
                    getItemTypeColor={getItemTypeColor}
                  />
                ))}
              </div>
            )}

            {/* Estado vacío */}
            {!loading && filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== 'all')
                    ? 'No se encontraron favoritos'
                    : 'Aún no tienes favoritos'
                  }
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== 'all')
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Explora nuestros servicios y guarda los que más te gusten'
                  }
                </p>
                <Button variant="primary">
                  Explorar servicios
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal crear colección */}
      {showCreateCollection && (
        <CreateCollectionModal
          onClose={() => setShowCreateCollection(false)}
          onCreate={createCollection}
        />
      )}
    </div>
  );
}

// Componente de tarjeta de favorito
interface FavoriteCardProps {
  item: FavoriteItem;
  viewMode: ViewMode;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  formatPrice: (price: FavoriteItem['itemData']['price']) => string;
  getItemTypeLabel: (type: FavoriteItem['itemType']) => string;
  getItemTypeColor: (type: FavoriteItem['itemType']) => string;
}

function FavoriteCard({
  item,
  viewMode,
  index,
  isSelected,
  onSelect,
  onRemove,
  formatPrice,
  getItemTypeLabel,
  getItemTypeColor
}: FavoriteCardProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={cn(
          'bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border transition-all duration-300',
          isSelected ? 'border-primary-500 bg-primary-50/50' : 'border-white/20 hover:shadow-xl'
        )}
      >
        <div className="p-6">
          <div className="flex items-start space-x-4">
            {/* Checkbox de selección */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="mt-2 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            />

            {/* Imagen */}
            <div className="flex-shrink-0">
              <img
                src={item.itemData.image}
                alt={item.itemData.title}
                className="w-24 h-24 rounded-2xl object-cover"
              />
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                    {item.itemData.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.itemData.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.itemData.location.name}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {item.itemData.rating}
                    </div>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      getItemTypeColor(item.itemType)
                    )}>
                      {getItemTypeLabel(item.itemType)}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-xl font-bold text-primary-600 mb-1">
                    {formatPrice(item.itemData.price)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.itemData.price.unit}
                  </div>
                </div>
              </div>

              {/* Tags y notas */}
              {(item.tags?.length || item.notes) && (
                <div className="mb-3 space-y-2">
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs flex items-center"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      <div className="flex items-start space-x-2">
                        <StickyNote className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-800">{item.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Acciones y fecha */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Agregado el {formatDate(item.addedAt)}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/servicios/${item.itemId}`}>
                      Ver servicio
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Vista de cuadrícula
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border transition-all duration-300 overflow-hidden group',
        isSelected ? 'border-primary-500 bg-primary-50/50' : 'border-white/20 hover:shadow-xl'
      )}
    >
      {/* Imagen */}
      <div className="relative">
        <img
          src={item.itemData.image}
          alt={item.itemData.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Checkbox */}
        <div className="absolute top-3 left-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 text-primary-600 bg-white/90 border-gray-300 rounded focus:ring-primary-500"
          />
        </div>

        {/* Tipo de servicio */}
        <div className="absolute top-3 right-3">
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            getItemTypeColor(item.itemType)
          )}>
            {getItemTypeLabel(item.itemType)}
          </span>
        </div>

        {/* Disponibilidad */}
        {!item.itemData.availability.available && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
              No disponible
            </span>
          </div>
        )}

        {/* Rating y precio */}
        <div className="absolute bottom-3 right-3 text-white">
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-black/50 rounded-lg px-2 py-1">
              <Star className="w-3 h-3 mr-1 text-yellow-400" />
              <span className="text-xs font-medium">{item.itemData.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
            {item.itemData.title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="w-3 h-3 mr-1" />
            {item.itemData.location.name}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.itemData.description}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {item.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs"
              >
                #{tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Precio y acciones */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xl font-bold text-primary-600">
              {formatPrice(item.itemData.price)}
            </div>
            <div className="text-xs text-gray-500">{item.itemData.price.unit}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {formatDate(item.addedAt)}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/servicios/${item.itemId}`}>
                Ver
              </Link>
            </Button>
            <button
              onClick={onRemove}
              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Modal para crear colección
interface CreateCollectionModalProps {
  onClose: () => void;
  onCreate: (data: CreateCollectionData) => Promise<void>;
}

function CreateCollectionModal({ onClose, onCreate }: CreateCollectionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onCreate({
        name: name.trim(),
        description: description.trim() || undefined,
        color,
        isPublic
      });
      showToast('Colección creada exitosamente', 'success');
      onClose();
    } catch (error) {
      // Error ya manejado en el store
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Nueva Colección</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Mi nueva colección"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe tu colección..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex space-x-2">
                {colors.map(colorOption => (
                  <button
                    key={colorOption}
                    type="button"
                    onClick={() => setColor(colorOption)}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all',
                      color === colorOption ? 'border-gray-400 scale-110' : 'border-transparent'
                    )}
                    style={{ backgroundColor: colorOption }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                Hacer pública esta colección
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!name.trim() || loading}
                className="flex-1"
              >
                {loading ? 'Creando...' : 'Crear'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}