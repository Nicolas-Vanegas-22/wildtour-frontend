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
  Camera,
  Star,
  Telescope,
  Globe,
  Users,
  DollarSign,
  ArrowRight,
  Eye,
  Award,
  Zap
} from 'lucide-react';
import { villaviejaInfo, villaviejaAttractions } from '../../../data/villaviejaData';

const VillaviejaDiscover: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('history');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

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

  const categoryIcons = {
    'Formación Natural': <Mountain className="w-6 h-6" />,
    'Ciencia y Tecnología': <Telescope className="w-6 h-6" />,
    'Educativo Cultural': <Globe className="w-6 h-6" />,
    'Patrimonio Histórico': <Award className="w-6 h-6" />
  };

  const difficultyColors = {
    'Fácil': 'bg-success-100 text-success-800',
    'Moderado': 'bg-warning-100 text-warning-800',
    'Difícil': 'bg-error-100 text-error-800'
  };

  const attractionCards = villaviejaAttractions.map((attraction) => ({
    ...attraction,
    gradient: attraction.id === 'attr-1'
      ? 'from-accent-600 to-secondary-600'
      : attraction.id === 'attr-2'
      ? 'from-primary-600 to-secondary-600'
      : attraction.id === 'attr-3'
      ? 'from-secondary-600 to-primary-600'
      : 'from-accent-600 to-primary-600'
  }));

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
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-accent-600 to-secondary-600 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Mountain className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Descubre Villavieja</h2>
              <p className="text-accent-100">Capital Paleontológica de Colombia</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed opacity-90">
            Un destino único donde el desierto, la ciencia y la historia se encuentran para crear una experiencia inolvidable en el corazón del Huila.
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

      {/* Information Sections (Historia, Cultura, Clima) */}
      <div className="space-y-4">
        {infoSections.map((section) => (
          <div key={section.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className={`w-full p-6 bg-gradient-to-r ${section.color} text-white flex items-center justify-between hover:opacity-90 transition-opacity`}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
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

      {/* Divider: Atracciones Turísticas */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Mountain className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Atracciones Turísticas</h2>
              <p className="text-accent-100">Descubre las maravillas de Villavieja</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed opacity-90">
            Desde el majestuoso Desierto de la Tatacoa hasta fascinantes museos paleontológicos, Villavieja ofrece experiencias únicas que combinan naturaleza, ciencia e historia.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-accent-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Mountain className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="font-semibold text-primary-700">330 km²</h3>
              <p className="text-sm text-neutral-600">Área del desierto</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Telescope className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-primary-700">360°</h3>
              <p className="text-sm text-neutral-600">Vista panorámica</p>
            </div>
            <div className="text-center">
              <div className="bg-success-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Globe className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="font-semibold text-primary-700">13M años</h3>
              <p className="text-sm text-neutral-600">Fósiles antiguos</p>
            </div>
            <div className="text-center">
              <div className="bg-accent-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="font-semibold text-primary-700">Único</h3>
              <p className="text-sm text-neutral-600">En Colombia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Attraction - Tatacoa Desert */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&h=400&fit=crop"
            alt="Desierto de la Tatacoa"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/70 to-red-900/50" />
          <div className="absolute top-4 left-4">
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
              ⭐ Atracción Principal
            </span>
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-2xl font-bold mb-2">Desierto de la Tatacoa</h3>
            <p className="text-accent-100">El segundo desierto más grande de Colombia</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-primary-700">Zonas Principales</h4>
              <div className="space-y-3">
                <div className="bg-red-50 rounded-lg p-4">
                  <h5 className="font-medium text-red-800 mb-1">Zona Roja (Cusco)</h5>
                  <p className="text-secondary-600 text-sm">Formaciones arcillosas rojizas con paisajes surrealistas</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h5 className="font-medium text-primary-600 mb-1">Zona Gris (Los Hoyos)</h5>
                  <p className="text-neutral-600 text-sm">Laberintos de rocas grises con senderos únicos</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-primary-700">Información Práctica</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-accent-600" />
                  <span className="text-neutral-700">1-2 días recomendados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-success-600" />
                  <span className="text-neutral-700">$15.000 COP entrada</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-primary-600" />
                  <span className="text-neutral-700">Dificultad: Moderada</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <span className="text-neutral-700">Mejor: Diciembre - Marzo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Attractions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {attractionCards.slice(1).map((attraction) => (
          <div key={attraction.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className={`bg-gradient-to-r ${attraction.gradient} text-white p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    {categoryIcons[attraction.category as keyof typeof categoryIcons]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{attraction.name}</h3>
                    <p className="text-white/80 text-sm">{attraction.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedCard(expandedCard === attraction.id ? null : attraction.id)}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                >
                  {expandedCard === attraction.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              <p className="text-white/90 leading-relaxed">
                {attraction.description}
              </p>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[attraction.difficulty as keyof typeof difficultyColors]}`}>
                  {attraction.difficulty}
                </span>
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {attraction.timeRequired}
                </span>
                <span className="bg-success-100 text-success-800 px-3 py-1 rounded-full text-sm font-medium">
                  ${attraction.price.toLocaleString()} COP
                </span>
              </div>

              {expandedCard === attraction.id && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary-700 mb-3 flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 mr-2" />
                      Puntos Destacados
                    </h4>
                    <ul className="space-y-2">
                      {attraction.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-neutral-700 text-sm">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h5 className="font-medium text-primary-700 mb-2 flex items-center">
                      <Info className="w-4 h-4 text-blue-500 mr-2" />
                      Información Adicional
                    </h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-600">Mejor época:</span>
                        <p className="font-medium text-primary-700">{attraction.bestTimeToVisit}</p>
                      </div>
                      <div>
                        <span className="text-neutral-600">Tiempo sugerido:</span>
                        <p className="font-medium text-primary-700">{attraction.timeRequired}</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-accent-600 to-secondary-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Ver Detalles Completos</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Photo Gallery */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
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
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <Thermometer className="w-6 h-6" />
            <h3 className="text-xl font-bold">Condiciones Climáticas</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <Sun className="w-8 h-8 text-secondary-500 mx-auto mb-3" />
              <h4 className="font-semibold text-primary-700 mb-2">Temp. Máxima</h4>
              <p className="text-2xl font-bold text-secondary-600">35-40°C</p>
              <p className="text-sm text-neutral-600">Durante el día</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold text-primary-700 mb-2">Temp. Mínima</h4>
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

      {/* Access Routes */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
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

      {/* Combination Recommendations */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6" />
            <h3 className="text-xl font-bold">Combinaciones Recomendadas</h3>
          </div>
          <p className="text-indigo-100 mt-2">Maximiza tu experiencia combinando atracciones</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-accent-50 to-secondary-50 rounded-xl p-6 border border-accent-200">
              <h4 className="text-lg font-semibold text-primary-700 mb-3 flex items-center">
                <Mountain className="w-5 h-5 text-accent-600 mr-2" />
                Experiencia Completa Desierto
              </h4>
              <ul className="space-y-2 text-sm text-neutral-700 mb-4">
                <li>• Desierto de la Tatacoa (día completo)</li>
                <li>• Observatorio Astronómico (noche)</li>
                <li>• Museo Paleontológico (mañana siguiente)</li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-accent-600 font-semibold">2 días / 1 noche</span>
                <span className="bg-accent-100 text-accent-800 px-2 py-1 rounded-full text-xs">Recomendado</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-200">
              <h4 className="text-lg font-semibold text-primary-700 mb-3 flex items-center">
                <Globe className="w-5 h-5 text-primary-600 mr-2" />
                Ruta Científica y Cultural
              </h4>
              <ul className="space-y-2 text-sm text-neutral-700 mb-4">
                <li>• Museo Paleontológico (mañana)</li>
                <li>• Sitios Arqueológicos (tarde)</li>
                <li>• Observatorio Astronómico (noche)</li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-primary-600 font-semibold">1 día</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">Educativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaviejaDiscover;
