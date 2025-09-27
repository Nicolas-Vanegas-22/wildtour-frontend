import React, { useState } from 'react';
import {
  Bed,
  Star,
  Users,
  MapPin,
  DollarSign,
  Wifi,
  Car,
  Coffee,
  Waves,
  Wind,
  Filter,
  ChevronDown,
  Heart,
  Eye,
  Calendar,
  CheckCircle,
  Award,
  Telescope,
  Home
} from 'lucide-react';
import { villaviejaAccommodations } from '../../../data/villaviejaData';

type AccommodationType = 'Todos' | 'Hotel' | 'Glamping' | 'Hostería' | 'Casa Rural' | 'Camping';
type PriceRange = 'Todos' | 'Económico' | 'Moderado' | 'Premium' | 'Lujo';
type SortBy = 'precio-asc' | 'precio-desc' | 'rating' | 'nombre';

const VillaviejaAccommodations: React.FC = () => {
  const [selectedType, setSelectedType] = useState<AccommodationType>('Todos');
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>('Todos');
  const [sortBy, setSortBy] = useState<SortBy>('rating');
  const [showFilters, setShowFilters] = useState(false);

  const accommodationIcons = {
    'Hotel': <Bed className="w-5 h-5" />,
    'Glamping': <Telescope className="w-5 h-5" />,
    'Hostería': <Home className="w-5 h-5" />,
    'Casa Rural': <Home className="w-5 h-5" />,
    'Camping': <Wind className="w-5 h-5" />
  };

  const amenityIcons = {
    'WiFi': <Wifi className="w-4 h-4" />,
    'Wifi': <Wifi className="w-4 h-4" />,
    'Piscina': <Waves className="w-4 h-4" />,
    'Aire acondicionado': <Wind className="w-4 h-4" />,
    'Restaurante': <Coffee className="w-4 h-4" />,
    'Desayuno incluido': <Coffee className="w-4 h-4" />,
    'Observatorio': <Telescope className="w-4 h-4" />,
    'Parking': <Car className="w-4 h-4" />,
    'Spa': <Award className="w-4 h-4" />
  };

  const getPriceCategory = (price: number): string => {
    if (price <= 50000) return 'Económico';
    if (price <= 150000) return 'Moderado';
    if (price <= 250000) return 'Premium';
    return 'Lujo';
  };

  const filteredAccommodations = villaviejaAccommodations.filter(acc => {
    const typeMatch = selectedType === 'Todos' || acc.type === selectedType;
    const priceCategory = getPriceCategory(acc.pricePerNight);
    const priceMatch = selectedPriceRange === 'Todos' || priceCategory === selectedPriceRange;
    return typeMatch && priceMatch;
  });

  const sortedAccommodations = [...filteredAccommodations].sort((a, b) => {
    switch (sortBy) {
      case 'precio-asc':
        return a.pricePerNight - b.pricePerNight;
      case 'precio-desc':
        return b.pricePerNight - a.pricePerNight;
      case 'rating':
        return b.rating - a.rating;
      case 'nombre':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-neutral-100/20 backdrop-blur-sm rounded-full p-3">
              <Bed className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Alojamientos</h2>
              <p className="text-blue-100">Hospedaje perfecto para tu aventura</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed opacity-90">
            Desde hoteles boutique hasta experiencias de glamping bajo las estrellas, encuentra el alojamiento ideal para tu estadía en Villavieja.
          </p>
        </div>

        {/* Accommodation Stats */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {Object.entries(accommodationIcons).map(([type, icon]) => {
              const count = villaviejaAccommodations.filter(acc => acc.type === type).length;
              return (
                <div key={type} className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <div className="text-primary-600">{icon}</div>
                  </div>
                  <h3 className="font-semibold text-primary-700">{count}</h3>
                  <p className="text-sm text-neutral-600">{type}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Filter className="w-6 h-6 text-neutral-600" />
            <h3 className="text-xl font-bold text-primary-700">Filtros y Ordenamiento</h3>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <span>Filtros</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Tipo de Alojamiento</label>
              <div className="space-y-2">
                {(['Todos', 'Hotel', 'Glamping', 'Hostería', 'Casa Rural', 'Camping'] as AccommodationType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedType === type
                        ? 'bg-primary-100 text-primary-800 border border-blue-300'
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {type !== 'Todos' && accommodationIcons[type as keyof typeof accommodationIcons]}
                      <span>{type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Rango de Precio</label>
              <div className="space-y-2">
                {(['Todos', 'Económico', 'Moderado', 'Premium', 'Lujo'] as PriceRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedPriceRange(range)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedPriceRange === range
                        ? 'bg-success-100 text-success-800 border border-green-300'
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {range === 'Económico' && 'Hasta $50.000'}
                    {range === 'Moderado' && '$50.001 - $150.000'}
                    {range === 'Premium' && '$150.001 - $250.000'}
                    {range === 'Lujo' && 'Más de $250.000'}
                    {range === 'Todos' && 'Todos los precios'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="rating">Mejor calificación</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre A-Z</option>
              </select>
            </div>
          </div>
        )}

        <div className="pt-4 text-sm text-neutral-600">
          Mostrando {sortedAccommodations.length} de {villaviejaAccommodations.length} alojamientos
        </div>
      </div>

      {/* Accommodations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sortedAccommodations.map((accommodation) => (
          <div key={accommodation.id} className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow">
            <div className="relative">
              <img
                src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=300&fit=crop`}
                alt={accommodation.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  accommodation.type === 'Hotel' ? 'bg-primary-100 text-primary-800' :
                  accommodation.type === 'Glamping' ? 'bg-primary-100 text-primary-800' :
                  accommodation.type === 'Hostería' ? 'bg-success-100 text-success-800' :
                  accommodation.type === 'Casa Rural' ? 'bg-accent-100 text-amber-800' :
                  'bg-neutral-100 text-primary-600'
                }`}>
                  {accommodation.type}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="bg-neutral-100/90 backdrop-blur-sm rounded-full p-2 hover:bg-neutral-100 transition-colors">
                  <Heart className="w-4 h-4 text-neutral-600" />
                </button>
                <button className="bg-neutral-100/90 backdrop-blur-sm rounded-full p-2 hover:bg-neutral-100 transition-colors">
                  <Eye className="w-4 h-4 text-neutral-600" />
                </button>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="bg-neutral-100/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-700">
                  ${accommodation.pricePerNight.toLocaleString()}/noche
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary-700 mb-1">{accommodation.name}</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(accommodation.rating)}
                    <span className="text-sm text-neutral-600 ml-2">
                      {accommodation.rating} ({accommodation.totalReviews} reseñas)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-700">
                    ${accommodation.pricePerNight.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-600">por noche</div>
                </div>
              </div>

              <p className="text-neutral-700 mb-4 leading-relaxed">
                {accommodation.description}
              </p>

              <div className="flex items-center space-x-4 mb-4 text-sm text-neutral-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Hasta {accommodation.maxGuests} huéspedes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{accommodation.available ? 'Disponible' : 'No disponible'}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-primary-700 mb-3">Servicios incluidos</h4>
                <div className="flex flex-wrap gap-2">
                  {accommodation.amenities.slice(0, 6).map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-1 bg-neutral-100 px-3 py-1 rounded-full text-sm">
                      {amenityIcons[amenity as keyof typeof amenityIcons] || <CheckCircle className="w-4 h-4 text-green-500" />}
                      <span className="text-neutral-700">{amenity}</span>
                    </div>
                  ))}
                  {accommodation.amenities.length > 6 && (
                    <span className="text-sm text-neutral-500">+{accommodation.amenities.length - 6} más</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button className="flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span>Ver Disponibilidad</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-neutral-100 text-neutral-700 py-3 rounded-lg hover:bg-neutral-200 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>Ver Detalles</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Price Comparison */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-6 h-6" />
            <h3 className="text-xl font-bold">Comparación de Precios</h3>
          </div>
          <p className="text-green-100 mt-2">Encuentra la mejor opción para tu presupuesto</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-green-50 rounded-xl p-4 border border-success-200">
              <h4 className="font-semibold text-green-800 mb-2">Económico</h4>
              <p className="text-2xl font-bold text-success-600 mb-1">$25.000 - $50.000</p>
              <p className="text-sm text-green-700">Camping y hostales básicos</p>
              <ul className="mt-3 space-y-1 text-sm text-success-600">
                <li>• Servicios básicos</li>
                <li>• Ambiente social</li>
                <li>• Experiencia auténtica</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-primary-200">
              <h4 className="font-semibold text-blue-800 mb-2">Moderado</h4>
              <p className="text-2xl font-bold text-primary-600 mb-1">$50.000 - $150.000</p>
              <p className="text-sm text-primary-700">Hosterías y hoteles sencillos</p>
              <ul className="mt-3 space-y-1 text-sm text-primary-600">
                <li>• Habitación privada</li>
                <li>• Desayuno incluido</li>
                <li>• WiFi y servicios</li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-primary-200">
              <h4 className="font-semibold text-primary-800 mb-2">Premium</h4>
              <p className="text-2xl font-bold text-primary-600 mb-1">$150.000 - $250.000</p>
              <p className="text-sm text-purple-700">Hoteles boutique y glamping</p>
              <ul className="mt-3 space-y-1 text-sm text-primary-600">
                <li>• Comodidades premium</li>
                <li>• Experiencias únicas</li>
                <li>• Servicios especializados</li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2">Lujo</h4>
              <p className="text-2xl font-bold text-accent-600 mb-1">$250.000+</p>
              <p className="text-sm text-amber-700">Experiencias exclusivas</p>
              <ul className="mt-3 space-y-1 text-sm text-accent-600">
                <li>• Máximo confort</li>
                <li>• Servicios personalizados</li>
                <li>• Ubicaciones privilegiadas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Tips */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6" />
            <h3 className="text-xl font-bold">Consejos para Reservar</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-primary-700 mb-3">Mejor época para reservar</h4>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Temporada alta: Diciembre - Marzo (reservar con 2 meses de anticipación)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Temporada media: Abril - Noviembre (reservar con 1 mes de anticipación)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Festivales astronómicos: reservar con 3 meses de anticipación</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary-700 mb-3">Incluye en tu reserva</h4>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Tours de observación astronómica</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Transporte desde/hacia Neiva</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Alimentación (especialmente cenas)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Seguro de viaje</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaviejaAccommodations;