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
  Bed,
  UtensilsCrossed,
  Car,
  Award,
  ArrowRight,
  Filter,
  Eye
} from 'lucide-react';
import { villaviejaPackages } from '../../../data/villaviejaData';

type PackageType = 'Todos' | 'Individual/Pareja' | 'Aventura' | 'Familiar' | 'Especializado' | 'Romántico';
type PackageDuration = 'Todos' | '1 día' | '2 días' | '3+ días';

const VillaviejaPackages: React.FC = () => {
  const [selectedType, setSelectedType] = useState<PackageType>('Todos');
  const [selectedDuration, setSelectedDuration] = useState<PackageDuration>('Todos');
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [favoritePackages, setFavoritePackages] = useState<string[]>([]);

  const packageIcons = {
    'Individual/Pareja': <Heart className="w-5 h-5" />,
    'Aventura': <Mountain className="w-5 h-5" />,
    'Familiar': <Users className="w-5 h-5" />,
    'Especializado': <Telescope className="w-5 h-5" />,
    'Romántico': <Heart className="w-5 h-5" />
  };

  const difficultyColors = {
    'Fácil': 'bg-success-100 text-success-800 border-success-200',
    'Moderado': 'bg-warning-100 text-warning-800 border-warning-200',
    'Intermedio': 'bg-primary-100 text-primary-800 border-primary-200'
  };

  const packageGradients = {
    'Individual/Pareja': 'from-blue-600 to-cyan-600',
    'Aventura': 'from-accent-600 to-secondary-600',
    'Familiar': 'from-green-600 to-emerald-600',
    'Especializado': 'from-purple-600 to-indigo-600',
    'Romántico': 'from-pink-600 to-rose-600'
  };

  const filteredPackages = villaviejaPackages.filter(pkg => {
    const typeMatch = selectedType === 'Todos' || pkg.type === selectedType;
    const durationMatch = selectedDuration === 'Todos' ||
      (selectedDuration === '1 día' && pkg.duration.includes('1 día')) ||
      (selectedDuration === '2 días' && pkg.duration.includes('2 días')) ||
      (selectedDuration === '3+ días' && (pkg.duration.includes('3 días') || parseInt(pkg.duration) >= 3));
    return typeMatch && durationMatch;
  });

  const toggleFavorite = (packageId: string) => {
    setFavoritePackages(prev =>
      prev.includes(packageId)
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    );
  };

  const getDurationDays = (duration: string): number => {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1]) : 1;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-neutral-100/20 backdrop-blur-sm rounded-full p-3">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Experiencias y Paquetes</h2>
              <p className="text-purple-100">Aventuras completas diseñadas para ti</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed opacity-90">
            Descubre nuestros paquetes cuidadosamente diseñados que combinan las mejores experiencias de Villavieja en itinerarios perfectos para cada tipo de viajero.
          </p>
        </div>

        {/* Package Stats */}
        <div className="p-6">
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
        </div>
      </div>

      {/* Filters */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Filter className="w-6 h-6 text-neutral-600" />
          <h3 className="text-xl font-bold text-primary-700">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">Tipo de Experiencia</label>
            <div className="flex flex-wrap gap-2">
              {(['Todos', 'Individual/Pareja', 'Aventura', 'Familiar', 'Especializado', 'Romántico'] as PackageType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedType === type
                      ? 'bg-primary-100 border-purple-300 text-primary-800'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {type !== 'Todos' && packageIcons[type as keyof typeof packageIcons]}
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">Duración</label>
            <div className="flex flex-wrap gap-2">
              {(['Todos', '1 día', '2 días', '3+ días'] as PackageDuration[]).map((duration) => (
                <button
                  key={duration}
                  onClick={() => setSelectedDuration(duration)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedDuration === duration
                      ? 'bg-primary-100 border-blue-300 text-blue-800'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-neutral-600">
          Mostrando {filteredPackages.length} de {villaviejaPackages.length} paquetes
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow">
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
                  className={`bg-neutral-100/90 backdrop-blur-sm rounded-full p-2 hover:bg-neutral-100 transition-colors ${
                    favoritePackages.includes(pkg.id) ? 'text-secondary-500' : 'text-neutral-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favoritePackages.includes(pkg.id) ? 'fill-current' : ''}`} />
                </button>
                <button className="bg-neutral-100/90 backdrop-blur-sm rounded-full p-2 hover:bg-neutral-100 transition-colors">
                  <Eye className="w-4 h-4 text-neutral-600" />
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
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {pkg.minPersons}-{pkg.maxPersons} personas
                </span>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-primary-700 mb-2">Ideal para:</h4>
                <div className="flex flex-wrap gap-2">
                  {pkg.bestFor.map((audience, index) => (
                    <span key={index} className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
                      {audience}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setExpandedPackage(expandedPackage === pkg.id ? null : pkg.id)}
                className="w-full bg-neutral-100 text-neutral-700 py-2 rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-2 mb-4"
              >
                <span>{expandedPackage === pkg.id ? 'Ocultar detalles' : 'Ver detalles completos'}</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${expandedPackage === pkg.id ? 'rotate-90' : ''}`} />
              </button>

              {expandedPackage === pkg.id && (
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

                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h5 className="font-medium text-primary-700 mb-2">Información del paquete</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-neutral-600">Duración:</span>
                        <p className="font-medium text-primary-700">{pkg.duration}</p>
                      </div>
                      <div>
                        <span className="text-neutral-600">Grupo:</span>
                        <p className="font-medium text-primary-700">{pkg.minPersons}-{pkg.maxPersons} personas</p>
                      </div>
                      <div>
                        <span className="text-neutral-600">Dificultad:</span>
                        <p className="font-medium text-primary-700">{pkg.difficulty}</p>
                      </div>
                      <div>
                        <span className="text-neutral-600">Tipo:</span>
                        <p className="font-medium text-primary-700">{pkg.type}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button className={`bg-gradient-to-r ${packageGradients[pkg.type as keyof typeof packageGradients]} text-white py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}>
                  <Calendar className="w-4 h-4" />
                  <span>Reservar Ahora</span>
                </button>
                <button className="bg-neutral-100 text-neutral-700 py-3 rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Consultar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Package Comparison */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <Award className="w-6 h-6" />
            <h3 className="text-xl font-bold">Comparación de Paquetes</h3>
          </div>
          <p className="text-indigo-100 mt-2">Encuentra el paquete perfecto para tu viaje</p>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold text-primary-700">Paquete</th>
                  <th className="text-center py-3 px-4 font-semibold text-primary-700">Duración</th>
                  <th className="text-center py-3 px-4 font-semibold text-primary-700">Personas</th>
                  <th className="text-center py-3 px-4 font-semibold text-primary-700">Precio</th>
                  <th className="text-center py-3 px-4 font-semibold text-primary-700">Tipo</th>
                  <th className="text-center py-3 px-4 font-semibold text-primary-700">Dificultad</th>
                </tr>
              </thead>
              <tbody>
                {villaviejaPackages.slice(0, 4).map((pkg) => (
                  <tr key={pkg.id} className="border-b border-gray-100 hover:bg-neutral-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-primary-700">{pkg.name}</div>
                      <div className="text-neutral-600 text-xs">{pkg.description.substring(0, 60)}...</div>
                    </td>
                    <td className="text-center py-3 px-4 text-neutral-700">{pkg.duration}</td>
                    <td className="text-center py-3 px-4 text-neutral-700">{pkg.minPersons}-{pkg.maxPersons}</td>
                    <td className="text-center py-3 px-4">
                      <div className="font-bold text-success-600">${pkg.price.toLocaleString()}</div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="bg-neutral-100 text-primary-600 px-2 py-1 rounded-full text-xs">
                        {pkg.type}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${difficultyColors[pkg.difficulty as keyof typeof difficultyColors]}`}>
                        {pkg.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Booking Tips */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
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

export default VillaviejaPackages;