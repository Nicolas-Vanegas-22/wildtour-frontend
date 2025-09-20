import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Clock,
  Users,
  Share,
  Heart,
  Camera,
  Play,
  ChevronRight,
  ChevronLeft,
  ThermometerSun,
  Droplets,
  Wind,
  Sun,
  Cloud,
  CloudRain,
  Mountain,
  TreePine,
  Car,
  Bus,
  Plane,
  Shield,
  Check,
  AlertCircle,
  Phone,
  Mail,
  Globe,
  DollarSign,
  CreditCard,
  Filter,
  Grid,
  List,
  ChevronDown,
  Badge,
  Zap,
  Coffee,
  Wifi,
  Utensils,
  Bed
} from 'lucide-react';
import '../styles/account-settings.css';
import { mockDestinations, mockReviews } from '../../data/mockData';
import { Destination, Activity, Accommodation } from '../../domain/models/Destination';
import { Review } from '../../domain/models/Review';

type TabType = 'overview' | 'activities' | 'accommodations' | 'reviews' | 'location';

export default function DestinationDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Simulación de datos (en producción vendría del backend)
  const destination = mockDestinations.find(d => d.slug === slug);
  const reviews = mockReviews.filter(r => r.destinationId === destination?.id);

  useEffect(() => {
    // Simulación de carga
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del destino...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Mountain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Destino no encontrado</h1>
          <p className="text-gray-600 mb-4">El destino que buscas no existe o ha sido removido.</p>
          <Link
            to="/destinos"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver todos los destinos
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const weatherIcons = {
    'Soleado': Sun,
    'Nublado': Cloud,
    'Lluvia': CloudRain,
    'Despejado': Sun
  };

  const tabs = [
    { id: 'overview', label: 'Información General', icon: Mountain },
    { id: 'activities', label: 'Actividades', icon: Zap },
    { id: 'accommodations', label: 'Alojamientos', icon: Bed },
    { id: 'reviews', label: 'Opiniones', icon: Star },
    { id: 'location', label: 'Ubicación', icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header con navegación */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:text-red-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors">
                <Share className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Galería de imágenes */}
      <div className="relative h-64 md:h-96 lg:h-[500px] overflow-hidden">
        <img
          src={destination.images.gallery[selectedImageIndex] || destination.images.main}
          alt={destination.name}
          className="w-full h-full object-cover"
        />

        {/* Overlay con información básica */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center space-x-2 mb-2">
                {destination.categories.map(category => (
                  <span
                    key={category.id}
                    className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {category.icon} {category.name}
                  </span>
                ))}
                {destination.featured && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full text-sm font-bold">
                    ⭐ Destacado
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 animated-text-gradient">
                {destination.name}
              </h1>
              <div className="flex items-center space-x-4 text-lg">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {destination.location.city}, {destination.location.department}
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-1 fill-current text-yellow-400" />
                  <span className="font-semibold">{destination.rating.toFixed(1)}</span>
                  <span className="text-gray-300 ml-1">({destination.totalReviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación de imágenes */}
        {destination.images.gallery.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImageIndex(
                selectedImageIndex > 0 ? selectedImageIndex - 1 : destination.images.gallery.length - 1
              )}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSelectedImageIndex(
                selectedImageIndex < destination.images.gallery.length - 1 ? selectedImageIndex + 1 : 0
              )}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Thumbnails */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => setIsImageModalOpen(true)}
            className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-colors flex items-center space-x-2"
          >
            <Camera className="w-4 h-4" />
            <span>Ver todas las fotos</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            {/* Navegación por tabs */}
            <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                          isActive
                            ? 'border-blue-600 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Contenido de tabs */}
              <div className="p-6">
                {activeTab === 'overview' && <OverviewTab destination={destination} />}
                {activeTab === 'activities' && <ActivitiesTab activities={destination.activities} />}
                {activeTab === 'accommodations' && <AccommodationsTab accommodations={destination.accommodations} />}
                {activeTab === 'reviews' && <ReviewsTab reviews={reviews} destinationId={destination.id} />}
                {activeTab === 'location' && <LocationTab destination={destination} />}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DestinationSidebar destination={destination} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para la tab de información general
function OverviewTab({ destination }: { destination: Destination }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const WeatherIcon = destination.weather.currentCondition.includes('Soleado') ? Sun :
                     destination.weather.currentCondition.includes('Nublado') ? Cloud : Sun;

  return (
    <div className="space-y-8">
      {/* Descripción principal */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre este destino</h2>
        <p className="text-gray-700 text-lg leading-relaxed">{destination.description}</p>
      </div>

      {/* Información práctica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Información de Precios
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Desde:</span>
              <span className="text-lg font-bold text-gray-900">{formatPrice(destination.priceRange.min)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hasta:</span>
              <span className="text-lg font-bold text-gray-900">{formatPrice(destination.priceRange.max)}</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Incluye:</strong> {destination.priceRange.includes.join(', ')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Duración Recomendada
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mínimo:</span>
              <span className="font-semibold">{destination.duration.minimum}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recomendado:</span>
              <span className="font-semibold text-blue-600">{destination.duration.recommended}</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                <Badge className="w-4 h-4 inline mr-1" />
                Dificultad: <strong>{destination.difficulty}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Clima actual */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <WeatherIcon className="w-5 h-5 mr-2 text-yellow-600" />
          Clima Actual
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{destination.weather.temperature.avg}°C</div>
            <div className="text-sm text-gray-600">Temperatura</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{destination.weather.humidity}%</div>
            <div className="text-sm text-gray-600">Humedad</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{destination.weather.precipitation}mm</div>
            <div className="text-sm text-gray-600">Precipitación</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{destination.weather.season}</div>
            <div className="text-sm text-gray-600">Temporada</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>Mejor época para visitar:</strong> {destination.weather.bestTimeToVisit.join(', ')}
          </p>
        </div>
      </div>

      {/* Cómo llegar */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-red-600" />
          Cómo Llegar
        </h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Bus className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <div className="font-medium text-gray-900">En Bus</div>
              <div className="text-gray-600">{destination.howToGetThere.byBus}</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Car className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <div className="font-medium text-gray-900">En Carro</div>
              <div className="text-gray-600">{destination.howToGetThere.byCar}</div>
            </div>
          </div>
          {destination.howToGetThere.byPlane && (
            <div className="flex items-start space-x-3">
              <Plane className="w-5 h-5 text-purple-600 mt-1" />
              <div>
                <div className="font-medium text-gray-900">En Avión</div>
                <div className="text-gray-600">{destination.howToGetThere.byPlane}</div>
              </div>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg p-3 mt-4">
            <div className="flex items-center text-sm text-gray-700">
              <Clock className="w-4 h-4 mr-2" />
              <strong>Tiempo estimado:</strong> {destination.howToGetThere.estimatedTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para la tab de actividades
function ActivitiesTab({ activities }: { activities: Activity[] }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800';
      case 'Moderado': return 'bg-yellow-100 text-yellow-800';
      case 'Difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Actividades Disponibles</h2>
        <span className="text-sm text-gray-600">{activities.length} actividades</span>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12">
          <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay actividades disponibles</h3>
          <p className="text-gray-600">Las actividades para este destino estarán disponibles próximamente.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 card-hover-effect"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.name}</h3>
                  <p className="text-gray-600 mb-3">{activity.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(activity.difficulty)}`}>
                      {activity.difficulty}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {activity.category}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {activity.duration}
                    </span>
                  </div>
                </div>

                <div className="md:text-right md:ml-6">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatPrice(activity.price)}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">por persona</div>
                  <Link
                    to={`/booking/${destination.id}?type=activity&itemId=${activity.id}&startDate=${new Date().toISOString().split('T')[0]}&guests=1`}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shimmer-button inline-block text-center"
                  >
                    Reservar
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      Incluye
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {activity.included.map((item, i) => (
                        <li key={i} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {activity.requirements && activity.requirements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
                        Requisitos
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {activity.requirements.map((req, i) => (
                          <li key={i} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para la tab de alojamientos
function AccommodationsTab({ accommodations }: { accommodations: Accommodation[] }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getAccommodationIcon = (type: string) => {
    switch (type) {
      case 'Hotel': return '🏨';
      case 'Hostal': return '🏠';
      case 'Cabañas': return '🏕️';
      case 'Glamping': return '⛺';
      case 'Casa Rural': return '🏡';
      default: return '🏨';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Alojamientos Disponibles</h2>
        <span className="text-sm text-gray-600">{accommodations.length} opciones</span>
      </div>

      {accommodations.length === 0 ? (
        <div className="text-center py-12">
          <Bed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay alojamientos disponibles</h3>
          <p className="text-gray-600">Los alojamientos para este destino estarán disponibles próximamente.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {accommodations.map((accommodation, index) => (
            <div
              key={accommodation.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 card-hover-effect"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img
                    src={accommodation.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'}
                    alt={accommodation.name}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>

                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{getAccommodationIcon(accommodation.type)}</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                          {accommodation.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{accommodation.name}</h3>
                      <div className="flex items-center mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-semibold">{accommodation.rating.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm ml-1">({accommodation.totalReviews} reviews)</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatPrice(accommodation.pricePerNight)}
                      </div>
                      <div className="text-sm text-gray-600">por noche</div>
                      <div className="text-sm text-gray-500">hasta {accommodation.maxGuests} huéspedes</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{accommodation.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Servicios incluidos</h4>
                    <div className="flex flex-wrap gap-2">
                      {accommodation.amenities.map((amenity, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-sm flex items-center"
                        >
                          {amenity === 'WiFi' && <Wifi className="w-3 h-3 mr-1" />}
                          {amenity === 'Desayuno incluido' && <Coffee className="w-3 h-3 mr-1" />}
                          {amenity === 'Restaurante' && <Utensils className="w-3 h-3 mr-1" />}
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        accommodation.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {accommodation.available ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>

                    {accommodation.available ? (
                      <Link
                        to={`/booking/${destination.id}?type=accommodation&itemId=${accommodation.id}&startDate=${new Date().toISOString().split('T')[0]}&endDate=${new Date(Date.now() + 86400000).toISOString().split('T')[0]}&guests=1`}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shimmer-button inline-block text-center"
                      >
                        Reservar
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed"
                      >
                        No disponible
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para la tab de opiniones
function ReviewsTab({ reviews, destinationId }: { reviews: Review[], destinationId: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Opiniones de Viajeros</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Escribir reseña
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sé el primero en opinar</h3>
          <p className="text-gray-600 mb-4">Comparte tu experiencia para ayudar a otros viajeros</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Escribir la primera reseña
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-xl p-6 section-enter"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-4">
                <img
                  src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}&size=50`}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating.overall ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            ✓ Verificado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                  <p className="text-gray-700 mb-3">{review.content}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      Viajó {review.travelWith === 'family' ? 'en familia' :
                             review.travelWith === 'couple' ? 'en pareja' :
                             review.travelWith === 'friends' ? 'con amigos' :
                             review.travelWith === 'solo' ? 'solo' : 'en negocios'}
                    </span>
                    {review.recommendedFor.map((rec, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        Recomendado para {rec}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button className="hover:text-blue-600 transition-colors">
                      👍 Útil ({review.helpfulVotes})
                    </button>
                    <button className="hover:text-red-600 transition-colors">
                      Reportar
                    </button>
                  </div>

                  {review.response && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="font-semibold text-gray-900 text-sm">
                          Respuesta del {review.response.authorRole === 'provider' ? 'proveedor' : 'administrador'}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(review.response.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{review.response.content}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para la tab de ubicación
function LocationTab({ destination }: { destination: Destination }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Ubicación y Mapa</h2>

      <div className="bg-gray-200 rounded-xl h-64 md:h-96 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <MapPin className="w-12 h-12 mx-auto mb-2" />
          <p>Mapa interactivo próximamente</p>
          <p className="text-sm">Lat: {destination.location.latitude}, Lng: {destination.location.longitude}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Ubicación</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Dirección</div>
              <div className="text-gray-600">{destination.location.address}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Globe className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Ubicación</div>
              <div className="text-gray-600">
                {destination.location.city}, {destination.location.department}, {destination.location.country}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente del sidebar
function DestinationSidebar({ destination }: { destination: Destination }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Tarjeta de reserva rápida */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-gray-900">
            Desde {formatPrice(destination.priceRange.min)}
          </div>
          <div className="text-gray-600">por persona</div>
        </div>

        <Link
          to={`/booking/${destination.id}?startDate=${new Date().toISOString().split('T')[0]}&guests=1`}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold mb-4 shimmer-button inline-block text-center"
        >
          Reservar Ahora
        </Link>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">✓ Cancelación gratuita</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">✓ Confirmación instantánea</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">✓ Pago seguro</span>
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Necesitas ayuda?</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors">
            <Phone className="w-4 h-4" />
            <span>Llamar ahora</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors">
            <Mail className="w-4 h-4" />
            <span>Enviar mensaje</span>
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Características</h3>
        <div className="flex flex-wrap gap-2">
          {destination.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
