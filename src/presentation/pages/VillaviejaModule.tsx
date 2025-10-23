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
import VillaviejaDiscover from '../components/villavieja/VillaviejaDiscover';
import VillaviejaExperiences from '../components/villavieja/VillaviejaExperiences';
import VillaviejaServicesHub from '../components/villavieja/VillaviejaServicesHub';
import VillaviejaPlan from '../components/villavieja/VillaviejaPlan';
import VillaviejaReservationModal from '../components/villavieja/VillaviejaReservationModal';

type VillaviajaSectionType =
  | 'home'
  | 'discover'
  | 'experiences'
  | 'services'
  | 'plan';

interface SectionTab {
  id: VillaviajaSectionType;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const VillaviejaModule: React.FC = () => {
  const [activeSection, setActiveSection] = useState<VillaviajaSectionType>('home');
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  const sections: SectionTab[] = [
    {
      id: 'home',
      name: 'Inicio',
      icon: <Navigation className="w-5 h-5" />,
      description: 'Bienvenido a Villavieja'
    },
    {
      id: 'discover',
      name: 'Descubre Villavieja',
      icon: <Mountain className="w-5 h-5" />,
      description: 'Historia, cultura y atracciones'
    },
    {
      id: 'experiences',
      name: 'Tours y Experiencias',
      icon: <Package className="w-5 h-5" />,
      description: 'Paquetes y actividades guiadas'
    },
    {
      id: 'services',
      name: 'Servicios Locales',
      icon: <Car className="w-5 h-5" />,
      description: 'Alojamiento, gastronomía y guías'
    },
    {
      id: 'plan',
      name: 'Planifica tu Viaje',
      icon: <Info className="w-5 h-5" />,
      description: 'Información práctica y logística'
    }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <VillaviejaHome onNavigateToSection={setActiveSection} onReserve={() => setIsReservationModalOpen(true)} />;
      case 'discover':
        return <VillaviejaDiscover />;
      case 'experiences':
        return <VillaviejaExperiences />;
      case 'services':
        return <VillaviejaServicesHub />;
      case 'plan':
        return <VillaviejaPlan />;
      default:
        return <VillaviejaHome onNavigateToSection={setActiveSection} onReserve={() => setIsReservationModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-accent-50">
      {/* Header Hero Section - Only show full hero on non-home sections */}
      {activeSection !== 'home' && (
        <div className="relative h-64 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${villaviejaDestination.images.main})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 via-accent-900/60 to-accent-900/70" />
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
      <div className="bg-white shadow-lg sticky top-0 z-40 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'flex-shrink-0 px-6 py-4 flex items-center space-x-3 border-b-2 transition-colors duration-200',
                  activeSection === section.id
                    ? 'border-primary-500 text-primary-600 bg-primary-50'
                    : 'border-transparent text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                )}
              >
                {section.icon}
                <div className="text-left">
                  <div className="font-medium">{section.name}</div>
                  <div className="text-xs text-neutral-500">{section.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-4">
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
      <div className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Explora Más de Villavieja</h3>
            <p className="text-neutral-300 max-w-2xl mx-auto">
              Descubre todos los secretos de la Capital Paleontológica de Colombia y planifica tu aventura perfecta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {sections.slice(0, 4).map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="bg-neutral-800 hover:bg-neutral-700 rounded-xl p-6 text-left transition-colors duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  {section.icon}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <h4 className="font-semibold mb-2">{section.name}</h4>
                <p className="text-sm text-neutral-400">{section.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Reservation Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsReservationModalOpen(true)}
          variant="primary"
          className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-2xl rounded-full px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Reservar Ahora
        </Button>
      </div>

      {/* Reservation Modal */}
      <VillaviejaReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
      />
    </div>
  );
};

export default VillaviejaModule;