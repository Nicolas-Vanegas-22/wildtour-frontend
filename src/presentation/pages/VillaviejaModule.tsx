import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Calendar,
  Star,
  Users,
  Mountain,
  Camera,
  Telescope,
  UtensilsCrossed,
  Bed,
  Car,
  Info,
  Package,
  ChevronRight,
  Navigation
} from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { cn } from '../../shared/utils/cn';
import { villaviejaDestination } from '../../data/villaviejaData';
import VillaviejaHome from '../components/villavieja/VillaviejaHome';
import VillaviejaInfo from '../components/villavieja/VillaviejaInfo';
import VillaviejaAttractions from '../components/villavieja/VillaviejaAttractions';
import VillaviejaActivities from '../components/villavieja/VillaviejaActivities';
import VillaviejaAccommodations from '../components/villavieja/VillaviejaAccommodations';
import VillaviejaGastronomy from '../components/villavieja/VillaviejaGastronomy';
import VillaviejaServices from '../components/villavieja/VillaviejaServices';
import VillaviejaPackages from '../components/villavieja/VillaviejaPackages';
import VillaviajaPracticalInfo from '../components/villavieja/VillaviajaPracticalInfo';

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

interface SectionTab {
  id: VillaviajaSectionType;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const VillaviejaModule: React.FC = () => {
  const [activeSection, setActiveSection] = useState<VillaviajaSectionType>('home');

  const sections: SectionTab[] = [
    {
      id: 'home',
      name: 'Inicio',
      icon: <Navigation className="w-5 h-5" />,
      description: 'Bienvenido a Villavieja'
    },
    {
      id: 'accommodations',
      name: 'Hoteles',
      icon: <Bed className="w-5 h-5" />,
      description: 'Alojamientos únicos'
    },
    {
      id: 'services',
      name: 'Guías',
      icon: <Users className="w-5 h-5" />,
      description: 'Expertos locales'
    },
    {
      id: 'packages',
      name: 'Experiencias',
      icon: <Package className="w-5 h-5" />,
      description: 'Paquetes completos'
    },
    {
      id: 'info',
      name: 'Información del Destino',
      icon: <Info className="w-5 h-5" />,
      description: 'Historia, cultura y clima'
    },
    {
      id: 'attractions',
      name: 'Atracciones Turísticas',
      icon: <Mountain className="w-5 h-5" />,
      description: 'Desierto de la Tatacoa y más'
    },
    {
      id: 'activities',
      name: 'Actividades Disponibles',
      icon: <Camera className="w-5 h-5" />,
      description: 'Senderismo, astronomía, fotografía'
    },
    {
      id: 'accommodations',
      name: 'Alojamientos',
      icon: <Bed className="w-5 h-5" />,
      description: 'Hoteles, glamping, camping'
    },
    {
      id: 'gastronomy',
      name: 'Gastronomía Local',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      description: 'Restaurantes y platos típicos'
    },
    {
      id: 'services',
      name: 'Servicios y Logística',
      icon: <Car className="w-5 h-5" />,
      description: 'Transporte, guías, equipos'
    },
    {
      id: 'packages',
      name: 'Experiencias y Paquetes',
      icon: <Package className="w-5 h-5" />,
      description: 'Paquetes completos 1-3 días'
    },
    {
      id: 'practical',
      name: 'Información Práctica',
      icon: <Navigation className="w-5 h-5" />,
      description: 'Qué llevar, seguridad, contactos'
    }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <VillaviejaHome onNavigateToSection={setActiveSection} />;
      case 'info':
        return <VillaviejaInfo />;
      case 'attractions':
        return <VillaviejaAttractions />;
      case 'activities':
        return <VillaviejaActivities />;
      case 'accommodations':
        return <VillaviejaAccommodations />;
      case 'gastronomy':
        return <VillaviejaGastronomy />;
      case 'services':
        return <VillaviejaServices />;
      case 'packages':
        return <VillaviejaPackages />;
      case 'practical':
        return <VillaviajaPracticalInfo />;
      default:
        return <VillaviejaHome onNavigateToSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-secondary-50 to-accent-50">
      {/* Header Hero Section - Only show full hero on non-home sections */}
      {activeSection !== 'home' && (
        <div className="relative h-64 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${villaviejaDestination.images.main})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-coral-900/70 via-secondary-900/60 to-accent-900/70" />
          </div>

          <div className="relative h-full flex items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <h1 className="text-4xl font-bold mb-3 drop-shadow-lg">
                {villaviejaDestination.name}
              </h1>
              <p className="text-lg mb-4 opacity-90 max-w-2xl mx-auto">
                {villaviejaDestination.shortDescription}
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <MapPin className="w-4 h-4" />
                  <span>{villaviejaDestination.location.city}, {villaviejaDestination.location.department}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Clock className="w-4 h-4" />
                  <span>{villaviejaDestination.duration.recommended}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{villaviejaDestination.rating} ({villaviejaDestination.totalReviews} reseñas)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white shadow-lg sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'flex-shrink-0 px-6 py-4 flex items-center space-x-3 border-b-2 transition-colors duration-200',
                  activeSection === section.id
                    ? 'border-coral-500 text-coral-600 bg-coral-50'
                    : 'border-transparent text-gray-600 hover:text-coral-600 hover:bg-coral-50'
                )}
              >
                {section.icon}
                <div className="text-left">
                  <div className="font-medium">{section.name}</div>
                  <div className="text-xs text-gray-500">{section.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-coral-600 to-secondary-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Telescope className="w-6 h-6 mb-1" />
              <div className="font-semibold">Astronomía</div>
              <div className="text-sm opacity-80">Cielos únicos</div>
            </div>
            <div className="flex flex-col items-center">
              <Mountain className="w-6 h-6 mb-1" />
              <div className="font-semibold">Desierto</div>
              <div className="text-sm opacity-80">330 km²</div>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="w-6 h-6 mb-1" />
              <div className="font-semibold">Todo el año</div>
              <div className="text-sm opacity-80">Mejor: Dic-Mar</div>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-6 h-6 mb-1" />
              <div className="font-semibold">Para todos</div>
              <div className="text-sm opacity-80">Familias y aventureros</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderActiveSection()}
      </div>

      {/* Footer Navigation */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Explora Más de Villavieja</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Descubre todos los secretos de la Capital Paleontológica de Colombia y planifica tu aventura perfecta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {sections.slice(0, 4).map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-left transition-colors duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  {section.icon}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <h4 className="font-semibold mb-2">{section.name}</h4>
                <p className="text-sm text-gray-400">{section.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaviejaModule;