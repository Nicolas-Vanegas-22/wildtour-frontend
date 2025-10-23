import React, { useState } from 'react';
import {
  Package,
  Calendar,
  Users,
  Star,
  Clock,
  DollarSign,
  CheckCircle,
  X,
  Heart,
  MapPin,
  Telescope,
  Mountain,
  Camera,
  Bike,
  Tent,
  Award,
  ArrowRight,
  Filter,
  Eye,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { villaviejaPackages, villaviejaActivities } from '../../../data/villaviejaData';

type ViewMode = 'paquetes' | 'actividades';
type PackageType = 'Todos' | 'Individual/Pareja' | 'Aventura' | 'Familiar' | 'Especializado' | 'Romántico';
type ActivityCategory = 'Todos' | 'Naturaleza' | 'Ciencia' | 'Arte' | 'Aventura';
type DifficultyLevel = 'Todos' | 'Fácil' | 'Intermedio' | 'Moderado' | 'Avanzado';

const VillaviejaExperiences: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('paquetes');
  const [selectedPackageType, setSelectedPackageType] = useState<PackageType>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('Todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Todos');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [favoritePackages, setFavoritePackages] = useState<string[]>([]);

  const packageIcons = {
    'Individual/Pareja': <Heart className="w-5 h-5" />,
    'Aventura': <Mountain className="w-5 h-5" />,
    'Familiar': <Users className="w-5 h-5" />,
    'Especializado': <Telescope className="w-5 h-5" />,
    'Romántico': <Heart className="w-5 h-5" />
  };

  const categoryIcons = {
    Naturaleza: <Mountain className="w-5 h-5" />,
    Ciencia: <Telescope className="w-5 h-5" />,
    Arte: <Camera className="w-5 h-5" />,
    Aventura: <Bike className="w-5 h-5" />
  };

  const difficultyColors = {
    'Fácil': 'bg-success-100 text-success-800 border-success-200',
    'Moderado': 'bg-warning-100 text-warning-800 border-warning-200',
    'Intermedio': 'bg-primary-100 text-primary-800 border-primary-200',
    'Avanzado': 'bg-error-100 text-error-800 border-red-200'
  };

  const packageGradients = {
    'Individual/Pareja': 'from-blue-600 to-cyan-600',
    'Aventura': 'from-accent-600 to-secondary-600',
    'Familiar': 'from-green-600 to-emerald-600',
    'Especializado': 'from-purple-600 to-indigo-600',
    'Romántico': 'from-pink-600 to-rose-600'
  };

  const activityGradients = {
    'Naturaleza': 'from-green-600 to-emerald-600',
    'Ciencia': 'from-purple-600 to-indigo-600',
    'Arte': 'from-pink-600 to-rose-600',
    'Aventura': 'from-accent-600 to-secondary-600'
  };

  const filteredPackages = villaviejaPackages.filter(pkg => {
    const typeMatch = selectedPackageType === 'Todos' || pkg.type === selectedPackageType;
    return typeMatch;
  });

  const filteredActivities = villaviejaActivities.filter(activity => {
    const categoryMatch = selectedCategory === 'Todos' || activity.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'Todos' || activity.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const toggleFavorite = (packageId: string) => {
    setFavoritePackages(prev =>
      prev.includes(packageId)
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Tours y Experiencias</h2>
              <p className="text-purple-100">Paquetes completos y actividades individuales</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed opacity-90">
            Elige entre nuestros paquetes turísticos completos o selecciona actividades individuales para crear tu propia aventura en Villavieja.
          </p>
        </div>

        {/* View Toggle */}
        <div className="p-6 bg-neutral-50 border-b border-neutral-200">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setViewMode('paquetes')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                viewMode === 'paquetes'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Paquetes Completos</span>
            </button>
            <button
              onClick={() => setViewMode('actividades')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                viewMode === 'actividades'
                  ? 'bg-success-600 text-white shadow-lg'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span>Actividades Individuales</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6">
          {viewMode === 'paquetes' ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Package className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-primary-700">{villaviejaPackages.length}</h3>
                <p className="text-sm text-neutral-600">Paquetes disponibles</p>
              </div>
              <div className="text-center">
                <div className="bg-success-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-success-600" />
                </div>
                <h3 className="font-semibold text-primary-700">1-3</h3>
                <p className="text-sm text-neutral-600">Días de duración</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-primary-700">1-12</h3>
                <p className="text-sm text-neutral-600">Personas por grupo</p>
              </div>
              <div className="text-center">
                <div className="bg-accent-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="font-semibold text-primary-700">185K-680K</h3>
                <p className="text-sm text-neutral-600">Rango de precios</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8 text-warning-600" />
                </div>
                <h3 className="font-semibold text-primary-700">Premium</h3>
                <p className="text-sm text-neutral-600">Calidad garantizada</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-success-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Mountain className="w-8 h-8 text-success-600" />
                </div>
                <h3 className="font-semibold text-primary-700">{villaviejaActivities.filter(a => a.category === 'Naturaleza').length}</h3>
                <p className="text-sm text-neutral-600">Ecoturismo</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Telescope className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-primary-700">{villaviejaActivities.filter(a => a.category === 'Ciencia').length}</h3>
                <p className="text-sm text-neutral-600">Astronomía</p>
              </div>
              <div className="text-center">
                <div className="bg-accent-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Bike className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="font-semibold text-primary-700">{villaviejaActivities.filter(a => a.category === 'Aventura').length}</h3>
                <p className="text-sm text-neutral-600">Aventura</p>
              </div>
              <div className="text-center">
                <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="font-semibold text-primary-700">{villaviejaActivities.filter(a => a.category === 'Arte').length}</h3>
                <p className="text-sm text-neutral-600">Fotografía</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Filter className="w-6 h-6 text-neutral-600" />
          <h3 className="text-xl font-bold text-primary-700">Filtros</h3>
        </div>

        {viewMode === 'paquetes' ? (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">Tipo de Experiencia</label>
            <div className="flex flex-wrap gap-2">
              {(['Todos', 'Individual/Pareja', 'Aventura', 'Familiar', 'Especializado', 'Romántico'] as PackageType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedPackageType(type)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedPackageType === type
                      ? 'bg-primary-100 border-purple-300 text-primary-800'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {type !== 'Todos' && packageIcons[type as keyof typeof packageIcons]}
                  <span>{type}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-neutral-600">
              Mostrando {filteredPackages.length} de {villaviejaPackages.length} paquetes
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Categoría</label>
              <div className="flex flex-wrap gap-2">
                {(['Todos', 'Naturaleza', 'Ciencia', 'Arte', 'Aventura'] as ActivityCategory[]).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      selectedCategory === category
                        ? 'bg-success-100 border-green-300 text-green-800'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {category !== 'Todos' && categoryIcons[category as keyof typeof categoryIcons]}
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Dificultad</label>
              <div className="flex flex-wrap gap-2">
                {(['Todos', 'Fácil', 'Intermedio', 'Moderado', 'Avanzado'] as DifficultyLevel[]).map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedDifficulty === difficulty
                        ? 'bg-primary-100 border-blue-300 text-blue-800'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-2 text-sm text-neutral-600">
              Mostrando {filteredActivities.length} de {villaviejaActivities.length} actividades
            </div>
          </div>
        )}
      </div>

      {/* Content Grid - Paquetes */}
      {viewMode === 'paquetes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow">
              <div className="relative">
                <img
                  src={`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop`}
                  alt={pkg.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    pkg.type === 'Aventura' ? 'bg-accent-100 text-accent-800' :
                    pkg.type === 'Familiar' ? 'bg-success-100 text-success-800' :
                    pkg.type === 'Especializado' ? 'bg-primary-100 text-primary-800' :
                    pkg.type === 'Romántico' ? 'bg-pink-100 text-pink-800' :
                    'bg-primary-100 text-primary-800'
                  }`}>
                    {pkg.type}
                  </span>
                </div>

                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => toggleFavorite(pkg.id)}
                    className={`bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors ${
                      favoritePackages.includes(pkg.id) ? 'text-secondary-500' : 'text-neutral-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favoritePackages.includes(pkg.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{pkg.minPersons}-{pkg.maxPersons} personas</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-neutral-700 leading-relaxed">{pkg.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-primary-700">
                      ${pkg.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600">por persona</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${difficultyColors[pkg.difficulty as keyof typeof difficultyColors]}`}>
                    {pkg.difficulty}
                  </span>
                  <span className="bg-neutral-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                    {pkg.duration}
                  </span>
                </div>

                <button
                  onClick={() => setExpandedItem(expandedItem === pkg.id ? null : pkg.id)}
                  className="w-full bg-neutral-100 text-neutral-700 py-2 rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-2 mb-4"
                >
                  <span>{expandedItem === pkg.id ? 'Ocultar detalles' : 'Ver detalles completos'}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform ${expandedItem === pkg.id ? 'rotate-90' : ''}`} />
                </button>

                {expandedItem === pkg.id && (
                  <div className="space-y-6 border-t pt-6">
                    <div>
                      <h4 className="font-semibold text-primary-700 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        Incluye
                      </h4>
                      <ul className="space-y-2">
                        {pkg.included.map((item, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-neutral-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary-700 mb-3 flex items-center">
                        <X className="w-5 h-5 text-secondary-500 mr-2" />
                        No Incluye
                      </h4>
                      <ul className="space-y-2">
                        {pkg.notIncluded.map((item, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-neutral-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <button className={`w-full bg-gradient-to-r ${packageGradients[pkg.type as keyof typeof packageGradients]} text-white py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}>
                  <Calendar className="w-4 h-4" />
                  <span>Reservar Ahora</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Grid - Actividades */}
      {viewMode === 'actividades' && (
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
                    onClick={() => setExpandedItem(expandedItem === activity.id ? null : activity.id)}
                    className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                  >
                    <ArrowRight className={`w-5 h-5 transition-transform ${expandedItem === activity.id ? 'rotate-90' : ''}`} />
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
                    <Clock className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-primary-700">{activity.duration}</p>
                    <p className="text-xs text-neutral-600">Duración</p>
                  </div>
                  <div className="text-center">
                    <DollarSign className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-primary-700">${activity.price.toLocaleString()}</p>
                    <p className="text-xs text-neutral-600">Precio COP</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-primary-700">{activity.difficulty}</p>
                    <p className="text-xs text-neutral-600">Nivel</p>
                  </div>
                </div>

                {expandedItem === activity.id && (
                  <div className="space-y-6 border-t pt-6">
                    <div>
                      <h4 className="font-semibold text-primary-700 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        Incluye
                      </h4>
                      <ul className="space-y-2">
                        {activity.included.map((item, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-neutral-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary-700 mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                        Requisitos
                      </h4>
                      <ul className="space-y-2">
                        {activity.requirements.map((req, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-neutral-700 text-sm">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <button className={`w-full bg-gradient-to-r ${activityGradients[activity.category as keyof typeof activityGradients]} text-white py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 mt-4`}>
                  <Star className="w-5 h-5" />
                  <span>Reservar Actividad</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Tips */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6" />
            <h3 className="text-xl font-bold">Consejos para Reservar</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-primary-700 mb-3">Reserva Anticipada</h4>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Mejor disponibilidad de fechas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Descuentos por reserva temprana</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Mejor selección de alojamientos</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary-700 mb-3">Grupos y Familias</h4>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Descuentos para grupos de 6+</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Actividades adaptadas para niños</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Opciones de alojamiento familiar</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary-700 mb-3">Temporada Ideal</h4>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>Dic-Mar: Mejor clima</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>Cielos más despejados</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>Temperaturas más suaves</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaviejaExperiences;
