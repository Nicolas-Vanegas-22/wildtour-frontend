import React from 'react';
import {
  MapPin,
  Calendar,
  Star,
  Users,
  Mountain,
  Telescope,
  Camera,
  UtensilsCrossed,
  Bed,
  Car,
  Package,
  ChevronRight,
  Award,
  Clock,
  Thermometer,
  Info,
  Heart,
  Navigation
} from 'lucide-react';
import { villaviejaDestination, villaviejaInfo } from '../../../data/villaviejaData';
import { Button } from '../../../shared/ui/Button';
import { cn } from '../../../shared/utils/cn';

type VillaviajaSectionType =
  | 'home'
  | 'info'
  | 'attractions'
  | 'activities'
  | 'accommodations'
  | 'gastronomy'
  | 'services'
  | 'packages'
  | 'practical';

interface VillaviejaHomeProps {
  onNavigateToSection: (section: VillaviajaSectionType) => void;
}

const VillaviejaHome: React.FC<VillaviejaHomeProps> = ({ onNavigateToSection }) => {
  const quickStats = [
    { icon: <Mountain className="w-6 h-6" />, label: 'Desierto', value: '330 km²', color: 'text-orange-600' },
    { icon: <Telescope className="w-6 h-6" />, label: 'Astronomía', value: 'Cielos únicos', color: 'text-purple-600' },
    { icon: <Calendar className="w-6 h-6" />, label: 'Mejor época', value: 'Dic - Mar', color: 'text-blue-600' },
    { icon: <Users className="w-6 h-6" />, label: 'Para todos', value: 'Familias', color: 'text-green-600' }
  ];

  const highlights = [
    {
      title: 'Desierto de la Tatacoa',
      description: 'El segundo desierto más grande de Colombia con paisajes surrealistas',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop',
      section: 'attractions'
    },
    {
      title: 'Observación Astronómica',
      description: 'Uno de los mejores cielos para contemplar las estrellas en el país',
      image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop',
      section: 'activities'
    },
    {
      title: 'Museo Paleontológico',
      description: 'Fósiles únicos de hace 13 millones de años',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      section: 'attractions'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden rounded-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${villaviejaDestination.images.main})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-coral-900/80 via-secondary-900/60 to-accent-900/70" />
        </div>

        <div className="relative h-full flex items-center justify-center text-center text-white px-6">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
              Bienvenido a Villavieja
            </h1>
            <p className="text-xl mb-6 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Capital Paleontológica de Colombia, hogar del majestuoso Desierto de la Tatacoa
              y uno de los mejores destinos para la observación astronómica en el país
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {quickStats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className={stat.color}>{stat.icon}</div>
                  <div>
                    <span className="font-semibold">{stat.value}</span>
                    <span className="opacity-80 ml-1">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Descubre la Magia del Desierto Colombiano
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="bg-coral-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-10 h-10 text-coral-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Paisajes Únicos</h3>
              <p className="text-gray-600">
                Formaciones rocosas rojizas y grises que crean un escenario surrealista único en Colombia
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Telescope className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cielos Estrellados</h3>
              <p className="text-gray-600">
                Observa las constelaciones con una claridad excepcional en uno de los mejores cielos de América
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Historia Milenaria</h3>
              <p className="text-gray-600">
                Explora fósiles de 13 millones de años y vestigios de culturas precolombinas
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-coral-50 to-secondary-50 rounded-xl p-6 border border-coral-200">
            <p className="text-lg text-gray-700 leading-relaxed">
              {villaviejaInfo.history.split('\n\n')[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {highlights.map((highlight, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow cursor-pointer"
               onClick={() => onNavigateToSection(highlight.section)}>
            <div className="relative h-48">
              <img
                src={highlight.image}
                alt={highlight.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{highlight.title}</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">{highlight.description}</p>
              <button className="flex items-center space-x-2 text-coral-600 hover:text-coral-700 font-medium group">
                <span>Explorar</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Cards */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Planifica tu Aventura
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => onNavigateToSection('accommodations')}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-blue-100 rounded-full p-3 group-hover:bg-blue-200 transition-colors">
                <Bed className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Hoteles</h3>
                <p className="text-sm text-gray-600">Desde $25.000</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 text-left">
              Encuentra el alojamiento perfecto desde camping hasta hoteles boutique
            </p>
          </button>

          <button
            onClick={() => onNavigateToSection('services')}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-green-100 rounded-full p-3 group-hover:bg-green-200 transition-colors">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Guías</h3>
                <p className="text-sm text-gray-600">Desde $70.000/día</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 text-left">
              Guías especializados en astronomía, geología y ecoturismo
            </p>
          </button>

          <button
            onClick={() => onNavigateToSection('packages')}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-purple-100 rounded-full p-3 group-hover:bg-purple-200 transition-colors">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Experiencias</h3>
                <p className="text-sm text-gray-600">1-3 días</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 text-left">
              Paquetes completos que incluyen actividades, alojamiento y comidas
            </p>
          </button>

          <button
            onClick={() => onNavigateToSection('gastronomy')}
            className="bg-gradient-to-br from-coral-50 to-secondary-50 rounded-xl p-6 border border-coral-200 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-coral-100 rounded-full p-3 group-hover:bg-coral-200 transition-colors">
                <UtensilsCrossed className="w-6 h-6 text-coral-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Gastronomía</h3>
                <p className="text-sm text-gray-600">Sabores únicos</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 text-left">
              Descubre la auténtica cocina huilense y productos locales
            </p>
          </button>
        </div>
      </div>

      {/* Weather and Practical Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Thermometer className="w-6 h-6 text-red-500 mr-2" />
            Condiciones Climáticas
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">40°C</div>
              <div className="text-sm text-red-700">Máxima (día)</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">15°C</div>
              <div className="text-sm text-blue-700">Mínima (noche)</div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Época ideal:</strong> Diciembre a Marzo para mejor clima y cielos despejados
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Navigation className="w-6 h-6 text-blue-500 mr-2" />
            Cómo Llegar
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Car className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium text-gray-900">Desde Neiva</div>
                <div className="text-sm text-gray-600">45 minutos en vehículo</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-medium text-gray-900">Buses frecuentes</div>
                <div className="text-sm text-gray-600">Cada 30 minutos desde Neiva</div>
              </div>
            </div>
          </div>
          <Button
            onClick={() => onNavigateToSection('practical')}
            variant="primary"
            fullWidth
            leftIcon={<Info className="w-4 h-4" />}
          >
            Ver información completa
          </Button>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-coral-600 to-secondary-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          ¡Comienza tu Aventura en Villavieja!
        </h2>
        <p className="text-xl mb-6 opacity-90">
          Explora el desierto, contempla las estrellas y vive una experiencia única en Colombia
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => onNavigateToSection('packages')}
            variant="secondary"
            leftIcon={<Package className="w-5 h-5" />}
          >
            Ver Paquetes
          </Button>
          <Button
            onClick={() => onNavigateToSection('accommodations')}
            variant="coral"
            leftIcon={<Heart className="w-5 h-5" />}
          >
            Reservar Ahora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VillaviejaHome;