import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Thermometer,
  CloudRain,
  Wind,
  Sun,
  Mountain,
  Calendar,
  Info,
  ChevronDown,
  ChevronUp,
  Navigation,
  Ruler,
  Camera
} from 'lucide-react';
import { villaviejaInfo } from '../../../data/villaviejaData';

const VillaviejaInfo: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('history');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const infoSections = [
    {
      id: 'history',
      title: 'Historia de Villavieja',
      icon: <Clock className="w-6 h-6" />,
      content: villaviejaInfo.history,
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'culture',
      title: 'Cultura y Tradiciones',
      icon: <Info className="w-6 h-6" />,
      content: villaviejaInfo.culture,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'climate',
      title: 'Clima y Condiciones',
      icon: <Thermometer className="w-6 h-6" />,
      content: villaviejaInfo.climate,
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop',
      title: 'Formaciones del Desierto de la Tatacoa',
      description: 'Las icónicas formaciones rojizas de la zona Cusco'
    },
    {
      url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
      title: 'Laberinto de los Hoyos',
      description: 'Formaciones grises que crean un paisaje único'
    },
    {
      url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
      title: 'Cielos Nocturnos',
      description: 'Uno de los mejores cielos para astronomía en Colombia'
    },
    {
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      title: 'Museo Paleontológico',
      description: 'Fósiles únicos de hace 13 millones de años'
    },
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      title: 'Paisajes Desérticos',
      description: 'Vistas panorámicas del segundo desierto más grande de Colombia'
    },
    {
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      title: 'Atardeceres Únicos',
      description: 'Colores espectaculares al final del día'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-accent-600 to-secondary-600 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-neutral-100/20 backdrop-blur-sm rounded-full p-3">
              <Mountain className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Villavieja, Huila</h2>
              <p className="text-accent-100">Capital Paleontológica de Colombia</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed opacity-90">
            Descubre un destino único donde el desierto, la ciencia y la historia se encuentran para crear una experiencia inolvidable en el corazón del Huila.
          </p>
        </div>

        {/* Quick Facts */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-primary-700 mb-6">Datos Rápidos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-accent-50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Ruler className="w-5 h-5 text-accent-600" />
                <span className="font-semibold text-primary-700">Área</span>
              </div>
              <p className="text-accent-700">{villaviejaInfo.location.area}</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Mountain className="w-5 h-5 text-primary-600" />
                <span className="font-semibold text-primary-700">Altitud</span>
              </div>
              <p className="text-primary-700">{villaviejaInfo.location.altitude}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Navigation className="w-5 h-5 text-success-600" />
                <span className="font-semibold text-primary-700">Desde Neiva</span>
              </div>
              <p className="text-green-700">{villaviejaInfo.location.distanceFromNeiva}</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                <span className="font-semibold text-primary-700">Coordenadas</span>
              </div>
              <p className="text-purple-700 text-sm">
                {villaviejaInfo.location.coordinates.latitude}°N, {Math.abs(villaviejaInfo.location.coordinates.longitude)}°W
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Information Sections */}
      <div className="space-y-4">
        {infoSections.map((section) => (
          <div key={section.id} className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className={`w-full p-6 bg-gradient-to-r ${section.color} text-white flex items-center justify-between hover:opacity-90 transition-opacity`}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-neutral-100/20 backdrop-blur-sm rounded-full p-2">
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold">{section.title}</h3>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </button>

            {expandedSection === section.id && (
              <div className="p-6">
                <div className="prose prose-lg max-w-none text-neutral-700">
                  {section.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Access Routes */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-success-600 to-primary-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <Navigation className="w-6 h-6" />
            <h3 className="text-xl font-bold">Cómo Llegar</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {villaviejaInfo.location.accessRoutes.map((route, index) => (
              <div key={index} className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold text-primary-700">Ruta {index + 1}</span>
                </div>
                <p className="text-green-700">{route}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <Camera className="w-6 h-6" />
            <h3 className="text-xl font-bold">Galería de Fotos</h3>
          </div>
          <p className="text-purple-100 mt-2">Explora la belleza única de Villavieja</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h4 className="font-semibold mb-1">{image.title}</h4>
                    <p className="text-sm text-gray-200">{image.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Climate Details */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <Thermometer className="w-6 h-6" />
            <h3 className="text-xl font-bold">Condiciones Climáticas Detalladas</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <Sun className="w-8 h-8 text-secondary-500 mx-auto mb-3" />
              <h4 className="font-semibold text-primary-700 mb-2">Temperatura Máxima</h4>
              <p className="text-2xl font-bold text-secondary-600">35-40°C</p>
              <p className="text-sm text-neutral-600">Durante el día</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold text-primary-700 mb-2">Temperatura Mínima</h4>
              <p className="text-2xl font-bold text-primary-600">15-20°C</p>
              <p className="text-sm text-neutral-600">Durante la noche</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 text-center">
              <CloudRain className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold text-primary-700 mb-2">Precipitaciones</h4>
              <p className="text-2xl font-bold text-success-600">500-600mm</p>
              <p className="text-sm text-neutral-600">Anuales</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <Wind className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h4 className="font-semibold text-primary-700 mb-2">Humedad</h4>
              <p className="text-2xl font-bold text-primary-600">40-60%</p>
              <p className="text-sm text-neutral-600">Relativa</p>
            </div>
          </div>

          <div className="mt-6 bg-warning-50 border border-warning-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-warning-600" />
              <span className="font-semibold text-warning-800">Mejor época para visitar</span>
            </div>
            <p className="text-yellow-700">
              La época seca (Diciembre a Marzo) es ideal para todas las actividades, especialmente la observación astronómica. Los cielos están despejados el 80% del tiempo durante estos meses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaviejaInfo;