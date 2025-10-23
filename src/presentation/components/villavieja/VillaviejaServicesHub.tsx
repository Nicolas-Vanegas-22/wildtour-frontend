import React, { useState } from 'react';
import {
  Bed,
  UtensilsCrossed,
  Navigation,
  Star,
  Users,
  Car,
  Wrench,
  Heart,
  Package
} from 'lucide-react';

// Importar los componentes existentes
import VillaviejaAccommodations from './VillaviejaAccommodations';
import VillaviejaGastronomy from './VillaviejaGastronomy';
import VillaviejaServices from './VillaviejaServices';

type ServiceTab = 'alojamiento' | 'gastronomia' | 'servicios';

const VillaviejaServicesHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ServiceTab>('alojamiento');

  const tabs = [
    {
      id: 'alojamiento' as ServiceTab,
      name: 'Alojamiento',
      icon: <Bed className="w-5 h-5" />,
      description: 'Hoteles, glamping y más',
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'gastronomia' as ServiceTab,
      name: 'Gastronomía',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      description: 'Restaurantes y platos típicos',
      gradient: 'from-accent-600 to-secondary-600'
    },
    {
      id: 'servicios' as ServiceTab,
      name: 'Servicios Locales',
      icon: <Navigation className="w-5 h-5" />,
      description: 'Transporte, guías y equipos',
      gradient: 'from-primary-600 to-purple-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Servicios Locales</h2>
              <p className="text-purple-100">Todo lo que necesitas para tu estadía</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed opacity-90">
            Explora nuestra selección completa de alojamientos, restaurantes, servicios de transporte, guías especializados y equipos para tu aventura en Villavieja.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[200px] px-6 py-4 flex flex-col items-center border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 bg-white'
                      : 'border-transparent hover:bg-white/50'
                  }`}
                >
                  <div className={`flex items-center space-x-2 mb-1 ${
                    activeTab === tab.id ? 'text-primary-600' : 'text-neutral-600'
                  }`}>
                    {tab.icon}
                    <span className="font-semibold">{tab.name}</span>
                  </div>
                  <p className={`text-xs ${
                    activeTab === tab.id ? 'text-primary-500' : 'text-neutral-500'
                  }`}>
                    {tab.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-6 bg-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`bg-gradient-to-r ${tabs.find(t => t.id === activeTab)?.gradient} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2`}>
                <div className="text-white">
                  {tabs.find(t => t.id === activeTab)?.icon}
                </div>
              </div>
              <h3 className="font-semibold text-primary-700">
                {activeTab === 'alojamiento' ? '20+' : activeTab === 'gastronomia' ? '15+' : '30+'}
              </h3>
              <p className="text-sm text-neutral-600">
                {activeTab === 'alojamiento' ? 'Opciones' : activeTab === 'gastronomia' ? 'Restaurantes' : 'Servicios'}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                <Star className="w-8 h-8 text-warning-600" />
              </div>
              <h3 className="font-semibold text-primary-700">4.5+</h3>
              <p className="text-sm text-neutral-600">Calificación</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                <Users className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="font-semibold text-primary-700">1000+</h3>
              <p className="text-sm text-neutral-600">Visitantes</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-primary-700">100%</h3>
              <p className="text-sm text-neutral-600">Auténtico</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'alojamiento' && <VillaviejaAccommodations />}
        {activeTab === 'gastronomia' && <VillaviejaGastronomy />}
        {activeTab === 'servicios' && <VillaviejaServices />}
      </div>

      {/* Call to Action */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className={`bg-gradient-to-r ${tabs.find(t => t.id === activeTab)?.gradient} text-white p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">¿Necesitas ayuda para planificar?</h3>
              <p className="text-white/90">
                Nuestro equipo puede ayudarte a armar el paquete perfecto combinando alojamiento, gastronomía y servicios.
              </p>
            </div>
            <button className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-colors flex items-center space-x-2 whitespace-nowrap">
              <Car className="w-5 h-5" />
              <span>Contactar Asesor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaviejaServicesHub;
