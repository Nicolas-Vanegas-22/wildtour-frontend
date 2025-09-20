import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Grid,
  List,
  Map,
  ArrowUpDown,
  SlidersHorizontal,
  X,
  ChevronDown,
  Compass,
  Mountain,
  Waves,
  TreePine,
  UtensilsCrossed,
  Camera
} from 'lucide-react';
import '../styles/account-settings.css';
import { mockDestinations, tourismCategories, colombianDepartments } from '../../data/mockData';
import { Destination, DestinationFilters } from '../../domain/models/Destination';
import { Button } from '../../shared/ui/Button';
import { cn } from '../../shared/utils/cn';

type ViewMode = 'grid' | 'list' | 'map';
type SortOption = 'name' | 'rating' | 'price' | 'popularity';

export default function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filtros
  const [filters, setFilters] = useState<DestinationFilters>({
    category: searchParams.getAll('category'),
    tourismType: searchParams.getAll('tourismType'),
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    difficulty: searchParams.getAll('difficulty'),
    rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
    location: {
      department: searchParams.get('department') || undefined,
    },
    featured: searchParams.get('featured') === 'true',
    available: true
  });

  // Simulación de datos filtrados
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>(mockDestinations);
  const [totalCount, setTotalCount] = useState(mockDestinations.length);

  // Iconos para tipos de turismo
  const tourismIcons = {
    'Aventura': Mountain,
    'Cultural': Camera,
    'Naturaleza': TreePine,
    'Gastronómico': UtensilsCrossed,
    'Histórico': Compass,
    'Religioso': Compass,
    'Deportivo': Mountain,
    'Relajación': Waves
  };

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, sortBy]);

  const applyFilters = () => {
    setIsLoading(true);

    // Simulación de filtrado (en producción esto vendría del backend)
    let filtered = mockDestinations.filter(destination => {
      // Filtro por búsqueda de texto
      if (searchQuery && !destination.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !destination.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Filtro por categorías
      if (filters.category && filters.category.length > 0) {
        const hasCategory = destination.categories.some(cat =>
          filters.category!.includes(cat.id)
        );
        if (!hasCategory) return false;
      }

      // Filtro por tipo de turismo
      if (filters.tourismType && filters.tourismType.length > 0) {
        if (!filters.tourismType.includes(destination.tourismType)) return false;
      }

      // Filtro por precio
      if (filters.priceMin && destination.priceRange.min < filters.priceMin) return false;
      if (filters.priceMax && destination.priceRange.max > filters.priceMax) return false;

      // Filtro por dificultad
      if (filters.difficulty && filters.difficulty.length > 0) {
        if (!filters.difficulty.includes(destination.difficulty)) return false;
      }

      // Filtro por rating
      if (filters.rating && destination.rating < filters.rating) return false;

      // Filtro por departamento
      if (filters.location?.department &&
          destination.location.department !== filters.location.department) return false;

      // Filtro por destacados
      if (filters.featured && !destination.featured) return false;

      return true;
    });

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'es');
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.priceRange.min - b.priceRange.min;
        case 'popularity':
        default:
          return b.totalReviews - a.totalReviews;
      }
    });

    setTimeout(() => {
      setFilteredDestinations(filtered);
      setTotalCount(filtered.length);
      setIsLoading(false);
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ q: searchQuery });
  };

  const updateSearchParams = (newParams: Record<string, string | string[]>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      params.delete(key);
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else if (value) {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      available: true
    });
    setSearchQuery('');
    setSearchParams(new URLSearchParams());
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header de búsqueda */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-bold animated-text-gradient mb-2">
              Descubre Colombia
            </h1>
            <p className="text-gray-600 text-lg">
              Encuentra tu próxima aventura en los destinos más increíbles del país
            </p>
          </div>

          {/* Barra de búsqueda */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar destinos, actividades, ciudades..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'px-6 py-3 rounded-xl border-2 font-medium transition-all duration-300 flex items-center space-x-2',
                showFilters
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300'
              )}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filtros</span>
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium shimmer-button"
            >
              Buscar
            </button>
          </form>

          {/* Controles de vista */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{totalCount}</span> destinos encontrados
            </div>

            <div className="flex items-center space-x-3">
              {/* Ordenamiento */}
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="popularity">Popularidad</option>
                  <option value="rating">Calificación</option>
                  <option value="price">Precio</option>
                  <option value="name">Nombre</option>
                </select>
              </div>

              {/* Botones de vista */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  )}
                  title="Vista en cuadrícula"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  )}
                  title="Vista en lista"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'map' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  )}
                  title="Vista de mapa"
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="border-t border-gray-200 bg-white/90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Categorías */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Categorías</h3>
                  <div className="space-y-2">
                    {tourismCategories.map(category => (
                      <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.category?.includes(category.id) || false}
                          onChange={(e) => {
                            const current = filters.category || [];
                            const updated = e.target.checked
                              ? [...current, category.id]
                              : current.filter(id => id !== category.id);
                            setFilters({ ...filters, category: updated });
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">
                          {category.icon} {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tipo de turismo */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Tipo de Turismo</h3>
                  <div className="space-y-2">
                    {Object.keys(tourismIcons).map(type => {
                      const Icon = tourismIcons[type as keyof typeof tourismIcons];
                      return (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.tourismType?.includes(type) || false}
                            onChange={(e) => {
                              const current = filters.tourismType || [];
                              const updated = e.target.checked
                                ? [...current, type]
                                : current.filter(t => t !== type);
                              setFilters({ ...filters, tourismType: updated });
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{type}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Precio */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Rango de Precio</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Precio mínimo</label>
                      <input
                        type="number"
                        value={filters.priceMin || ''}
                        onChange={(e) => setFilters({
                          ...filters,
                          priceMin: e.target.value ? Number(e.target.value) : undefined
                        })}
                        placeholder="0"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Precio máximo</label>
                      <input
                        type="number"
                        value={filters.priceMax || ''}
                        onChange={(e) => setFilters({
                          ...filters,
                          priceMax: e.target.value ? Number(e.target.value) : undefined
                        })}
                        placeholder="1000000"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Otros filtros */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Otros</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Departamento</label>
                      <select
                        value={filters.location?.department || ''}
                        onChange={(e) => setFilters({
                          ...filters,
                          location: { ...filters.location, department: e.target.value || undefined }
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Todos</option>
                        {colombianDepartments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Calificación mínima</label>
                      <select
                        value={filters.rating || ''}
                        onChange={(e) => setFilters({
                          ...filters,
                          rating: e.target.value ? Number(e.target.value) : undefined
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Cualquiera</option>
                        <option value="3">3+ ⭐</option>
                        <option value="4">4+ ⭐</option>
                        <option value="4.5">4.5+ ⭐</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                >
                  Limpiar filtros
                </Button>
                <Button
                  onClick={() => setShowFilters(false)}
                  variant="primary"
                >
                  Aplicar filtros
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
          </div>
        ) : viewMode === 'map' ? (
          <MapView destinations={filteredDestinations} />
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {filteredDestinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                viewMode={viewMode}
                animationDelay={index * 0.1}
              />
            ))}
          </div>
        )}

        {filteredDestinations.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="mb-4">
              <Compass className="w-16 h-16 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron destinos
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar tus filtros o buscar con otros términos
            </p>
            <Button
              onClick={clearFilters}
              variant="primary"
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de tarjeta de destino mejorado
interface DestinationCardProps {
  destination: Destination;
  viewMode: ViewMode;
  animationDelay?: number;
}

function DestinationCard({ destination, viewMode, animationDelay = 0 }: DestinationCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <div
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden card-hover-effect"
        style={{ animationDelay: `${animationDelay}s` }}
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <img
              src={destination.images.main}
              alt={destination.name}
              className="w-full h-48 md:h-full object-cover"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{destination.name}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {destination.location.city}, {destination.location.department}
                </div>
              </div>
              {destination.featured && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Destacado
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {destination.shortDescription}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {destination.categories.slice(0, 2).map(category => (
                <span
                  key={category.id}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs"
                >
                  {category.icon} {category.name}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium">{destination.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500 ml-1">({destination.totalReviews})</span>
                </div>
                <div className="text-sm text-gray-600">
                  {destination.duration.recommended}
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  Desde {formatPrice(destination.priceRange.min)}
                </div>
                <Button
                  asChild
                  variant="primary"
                  size="sm"
                >
                  <Link
                    to={destination.slug === 'desierto-de-la-tatacoa' ? '/villavieja' : `/destinos/${destination.slug}`}
                  >
                    Ver detalles
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden card-hover-effect section-enter"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className="relative">
        <img
          src={destination.images.main}
          alt={destination.name}
          className="w-full h-48 object-cover"
        />
        {destination.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Destacado
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center">
            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
            <span className="text-xs font-medium">{destination.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{destination.name}</h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-3 h-3 mr-1" />
            {destination.location.city}, {destination.location.department}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {destination.shortDescription}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {destination.categories.slice(0, 2).map(category => (
            <span
              key={category.id}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs"
            >
              {category.icon}
            </span>
          ))}
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs">
            {destination.difficulty}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {destination.duration.recommended}
          </div>
          <div className="text-sm text-gray-600">
            {destination.totalReviews} reviews
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(destination.priceRange.min)}
            </div>
            <div className="text-xs text-gray-500">por persona</div>
          </div>

          <Button
            asChild
            variant="primary"
            size="sm"
          >
            <Link
              to={destination.slug === 'desierto-de-la-tatacoa' ? '/villavieja' : `/destinos/${destination.slug}`}
            >
              Ver más
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Componente de vista de mapa
interface MapViewProps {
  destinations: Destination[];
}

function MapView({ destinations }: MapViewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="relative h-96 bg-gradient-to-br from-primary-100 to-accent-100">
        {/* Placeholder para el mapa */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Map className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Vista de Mapa
            </h3>
            <p className="text-gray-600 mb-4">
              Aquí se mostraría un mapa interactivo con los {destinations.length} destinos encontrados
            </p>
            <div className="text-sm text-gray-500">
              Integración con Google Maps próximamente
            </div>
          </div>
        </div>

        {/* Indicadores de destinos */}
        <div className="absolute top-4 left-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span className="font-medium">{destinations.length} destinos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de destinos en el mapa */}
      <div className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Destinos en el mapa
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {destinations.map((destination) => (
            <div key={destination.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {destination.name}
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {destination.location.city}
                </div>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
              >
                <Link
                  to={destination.slug === 'desierto-de-la-tatacoa' ? '/villavieja' : `/destinos/${destination.slug}`}
                >
                  Ver
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
