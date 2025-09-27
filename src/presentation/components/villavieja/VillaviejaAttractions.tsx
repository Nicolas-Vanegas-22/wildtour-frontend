import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Star,
  Camera,
  Mountain,
  Telescope,
  Globe,
  Calendar,
  Users,
  DollarSign,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  Eye,
  Award,
  Zap
} from 'lucide-react';
import { villaviejaAttractions } from '../../../data/villaviejaData';

const VillaviejaAttractions: React.FC = () => {
  const [selectedAttraction, setSelectedAttraction] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-accent-600 to-secondary-600 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-neutral-100/20 backdrop-blur-sm rounded-full p-3">
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
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
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
          <div key={attraction.id} className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
            <div className={`bg-gradient-to-r ${attraction.gradient} text-white p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-neutral-100/20 backdrop-blur-sm rounded-full p-2">
                    {categoryIcons[attraction.category as keyof typeof categoryIcons]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{attraction.name}</h3>
                    <p className="text-white/80 text-sm">{attraction.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedCard(expandedCard === attraction.id ? null : attraction.id)}
                  className="bg-neutral-100/20 backdrop-blur-sm rounded-full p-2 hover:bg-neutral-100/30 transition-colors"
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

      {/* Combination Recommendations */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
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

      {/* Tips for Visitors */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-success-600 to-primary-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <Info className="w-6 h-6" />
            <h3 className="text-xl font-bold">Consejos para Visitantes</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-primary-700 mb-3">Qué Llevar</h4>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Protector solar factor 50+</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Gorra y gafas de sol</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Agua suficiente (mínimo 2 litros)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Calzado cómodo para caminar</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Cámara fotográfica</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary-700 mb-3">Recomendaciones</h4>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Evita las horas más calurosas (11 AM - 3 PM)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Mejor visitar temprano en la mañana o tarde</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Contrata un guía local para mejor experiencia</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Reserva la observación astronómica con anticipación</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Respeta el entorno natural</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaviejaAttractions;