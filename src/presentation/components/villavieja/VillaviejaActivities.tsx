import React, { useState } from 'react';
import {
  Mountain,
  Telescope,
  Camera,
  Bike,
  Tent,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Filter,
  Star,
  ArrowRight,
  Calendar,
  MapPin,
  Activity
} from 'lucide-react';
import { villaviejaActivities } from '../../../data/villaviejaData';

type ActivityCategory = 'Todos' | 'Naturaleza' | 'Ciencia' | 'Arte' | 'Aventura';
type DifficultyLevel = 'Todos' | 'Fácil' | 'Intermedio' | 'Moderado' | 'Avanzado';

const VillaviejaActivities: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('Todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Todos');
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  const categoryIcons = {
    Naturaleza: <Mountain className="w-5 h-5" />,
    Ciencia: <Telescope className="w-5 h-5" />,
    Arte: <Camera className="w-5 h-5" />,
    Aventura: <Bike className="w-5 h-5" />
  };

  const difficultyColors = {
    'Fácil': 'bg-green-100 text-green-800 border-green-200',
    'Intermedio': 'bg-blue-100 text-blue-800 border-blue-200',
    'Moderado': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Avanzado': 'bg-red-100 text-red-800 border-red-200'
  };

  const activityGradients = {
    'Naturaleza': 'from-green-600 to-emerald-600',
    'Ciencia': 'from-purple-600 to-indigo-600',
    'Arte': 'from-pink-600 to-rose-600',
    'Aventura': 'from-orange-600 to-red-600'
  };

  const filteredActivities = villaviejaActivities.filter(activity => {
    const categoryMatch = selectedCategory === 'Todos' || activity.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'Todos' || activity.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Actividades Disponibles</h2>
              <p className="text-green-100">Aventuras únicas en el desierto y más</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed opacity-90">
            Desde caminatas ecológicas hasta observación astronómica, Villavieja ofrece actividades para todos los gustos y niveles de experiencia.
          </p>
        </div>

        {/* Activity Stats */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Mountain className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{villaviejaActivities.filter(a => a.category === 'Naturaleza').length}</h3>
              <p className="text-sm text-gray-600">Ecoturismo</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Telescope className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{villaviejaActivities.filter(a => a.category === 'Ciencia').length}</h3>
              <p className="text-sm text-gray-600">Astronomía</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Bike className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{villaviejaActivities.filter(a => a.category === 'Aventura').length}</h3>
              <p className="text-sm text-gray-600">Aventura</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Camera className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{villaviejaActivities.filter(a => a.category === 'Arte').length}</h3>
              <p className="text-sm text-gray-600">Fotografía</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Filter className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-bold text-gray-900">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Categoría</label>
            <div className="flex flex-wrap gap-2">
              {(['Todos', 'Naturaleza', 'Ciencia', 'Arte', 'Aventura'] as ActivityCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-100 border-green-300 text-green-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category !== 'Todos' && categoryIcons[category as keyof typeof categoryIcons]}
                  <span>{category}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Dificultad</label>
            <div className="flex flex-wrap gap-2">
              {(['Todos', 'Fácil', 'Intermedio', 'Moderado', 'Avanzado'] as DifficultyLevel[]).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedDifficulty === difficulty
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredActivities.length} de {villaviejaActivities.length} actividades
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className={`bg-gradient-to-r ${activityGradients[activity.category as keyof typeof activityGradients]} text-white p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    {categoryIcons[activity.category as keyof typeof categoryIcons]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{activity.name}</h3>
                    <p className="text-white/80 text-sm">{activity.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                >
                  <ArrowRight className={`w-5 h-5 transition-transform ${expandedActivity === activity.id ? 'rotate-90' : ''}`} />
                </button>
              </div>

              <p className="text-white/90 leading-relaxed mb-4">
                {activity.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${difficultyColors[activity.difficulty as keyof typeof difficultyColors]}`}>
                  {activity.difficulty}
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {activity.duration}
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  ${activity.price.toLocaleString()} COP
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{activity.duration}</p>
                  <p className="text-xs text-gray-600">Duración</p>
                </div>
                <div className="text-center">
                  <DollarSign className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">${activity.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Precio COP</p>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{activity.difficulty}</p>
                  <p className="text-xs text-gray-600">Nivel</p>
                </div>
              </div>

              {expandedActivity === activity.id && (
                <div className="space-y-6 border-t pt-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Incluye
                    </h4>
                    <ul className="space-y-2">
                      {activity.included.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                      Requisitos
                    </h4>
                    <ul className="space-y-2">
                      {activity.requirements.map((req, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Información adicional</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600">Disponible todo el año</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span className="text-gray-600">Punto de encuentro en centro</span>
                      </div>
                    </div>
                  </div>

                  <button className={`w-full bg-gradient-to-r ${activityGradients[activity.category as keyof typeof activityGradients]} text-white py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}>
                    <Star className="w-5 h-5" />
                    <span>Reservar Actividad</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Activity Packages */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <Tent className="w-6 h-6" />
            <h3 className="text-xl font-bold">Paquetes de Actividades</h3>
          </div>
          <p className="text-indigo-100 mt-2">Combina varias actividades y ahorra</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Mountain className="w-5 h-5 text-green-600 mr-2" />
                Paquete Ecoturismo
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li>• Senderismo Ecológico (4h)</li>
                <li>• Fotografía de Paisajes (6h)</li>
                <li>• Observación Astronómica (3h)</li>
              </ul>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-green-600">$220.000</span>
                  <span className="text-sm text-gray-500 line-through ml-2">$270.000</span>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Ahorra $50.000</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Bike className="w-5 h-5 text-orange-600 mr-2" />
                Paquete Aventura
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li>• Ciclismo de Montaña (5h)</li>
                <li>• Camping bajo las Estrellas (12h)</li>
                <li>• Senderismo Ecológico (4h)</li>
              </ul>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-orange-600">$280.000</span>
                  <span className="text-sm text-gray-500 line-through ml-2">$310.000</span>
                </div>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Ahorra $30.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-xl font-bold">Recomendaciones de Seguridad</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Antes de la Actividad</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Hidratarse adecuadamente</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Verificar condiciones climáticas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Informar itinerario a familiares</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Revisar equipo necesario</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Durante la Actividad</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Seguir instrucciones del guía</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Mantenerse en grupo</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Hidratarse frecuentemente</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Respetar la vida silvestre</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaviejaActivities;