import React, { useState } from 'react';
import {
  Car,
  Users,
  Wrench,
  Heart,
  Fuel,
  Phone,
  Clock,
  MapPin,
  DollarSign,
  Star,
  Award,
  Language,
  Shield,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Camera,
  Telescope,
  Bike
} from 'lucide-react';
import { villaviejaServices } from '../../../data/villaviejaData';

type ServiceCategory = 'Todos' | 'Transporte' | 'Guías' | 'Equipos' | 'Salud' | 'Combustible';

const VillaviejaServices: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('Todos');
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const categoryIcons = {
    'Transporte': <Car className="w-5 h-5" />,
    'Guías': <Users className="w-5 h-5" />,
    'Equipos': <Wrench className="w-5 h-5" />,
    'Salud': <Heart className="w-5 h-5" />,
    'Combustible': <Fuel className="w-5 h-5" />
  };

  const equipmentIcons = {
    'Telescopio Profesional': <Telescope className="w-6 h-6" />,
    'Equipo de Camping Completo': <Shield className="w-6 h-6" />,
    'Bicicletas de Montaña': <Bike className="w-6 h-6" />
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Navigation className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Servicios y Logística</h2>
              <p className="text-blue-100">Todo lo que necesitas para tu viaje</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed opacity-90">
            Servicios completos de transporte, guías especializados, equipos de calidad y apoyo médico para garantizar una experiencia segura y cómoda en Villavieja.
          </p>
        </div>

        {/* Service Categories */}
        <div className="p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {(['Todos', 'Transporte', 'Guías', 'Equipos', 'Salud', 'Combustible'] as ServiceCategory[]).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-colors ${
                  activeCategory === category
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category !== 'Todos' && categoryIcons[category as keyof typeof categoryIcons]}
                <span className="font-medium">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transportation Services */}
      {(activeCategory === 'Todos' || activeCategory === 'Transporte') && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <Car className="w-6 h-6" />
              <h3 className="text-xl font-bold">Servicios de Transporte</h3>
            </div>
            <p className="text-green-100 mt-2">Opciones cómodas y seguras para llegar y moverse</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {villaviejaServices.transportation.map((transport, index) => (
                <div key={index} className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <Car className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{transport.type}</h4>
                      <p className="text-sm text-green-700">{transport.provider}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Ruta:</span>
                      <span className="font-medium text-gray-900">{transport.route}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Frecuencia:</span>
                      <span className="font-medium text-gray-900">{transport.frequency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Precio:</span>
                      <span className="font-bold text-green-600">${transport.price?.toLocaleString() || transport.pricePerKm?.toLocaleString() + '/km' || transport.priceBase?.toLocaleString() + ' base'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duración:</span>
                      <span className="font-medium text-gray-900">{transport.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Horario:</span>
                      <span className="font-medium text-gray-900">{transport.schedule}</span>
                    </div>
                  </div>

                  {transport.contact && (
                    <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Contactar</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Guide Services */}
      {(activeCategory === 'Todos' || activeCategory === 'Guías') && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6" />
              <h3 className="text-xl font-bold">Guías Especializados</h3>
            </div>
            <p className="text-purple-100 mt-2">Expertos locales para enriquecer tu experiencia</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {villaviejaServices.guides.map((guide, index) => (
                <div key={index} className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-purple-100 rounded-full p-3">
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{guide.name}</h4>
                      <p className="text-sm text-purple-700">{guide.specialty}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-700">{guide.experience} de experiencia</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Language className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-700">{guide.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Certificado</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Certificaciones</h5>
                    <div className="space-y-1">
                      {guide.certifications.map((cert, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-gray-600">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-purple-600">
                      ${guide.pricePerDay.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">por día</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedGuide(selectedGuide === guide.contact ? null : guide.contact)}
                      className="bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center justify-center space-x-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Contactar</span>
                    </button>
                    <button className="bg-purple-100 text-purple-700 py-2 px-3 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                      Ver Perfil
                    </button>
                  </div>

                  {selectedGuide === guide.contact && (
                    <div className="mt-4 p-3 bg-white rounded-lg border">
                      <p className="text-sm text-gray-700">Contacto: {guide.contact}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Equipment Rental */}
      {(activeCategory === 'Todos' || activeCategory === 'Equipos') && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <Wrench className="w-6 h-6" />
              <h3 className="text-xl font-bold">Alquiler de Equipos</h3>
            </div>
            <p className="text-orange-100 mt-2">Equipos profesionales para tus actividades</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {villaviejaServices.equipment.map((equipment, index) => (
                <div key={index} className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-orange-100 rounded-full p-3">
                      {equipmentIcons[equipment.item as keyof typeof equipmentIcons] || <Wrench className="w-6 h-6 text-orange-600" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{equipment.item}</h4>
                      <p className="text-sm text-orange-700">{equipment.provider}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">{equipment.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-orange-600">
                      ${equipment.pricePerDay.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">por día</div>
                  </div>

                  <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Reservar Equipo</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Health Services */}
      {(activeCategory === 'Todos' || activeCategory === 'Salud') && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6" />
              <h3 className="text-xl font-bold">Servicios de Salud</h3>
            </div>
            <p className="text-red-100 mt-2">Atención médica y farmacia disponible</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {villaviejaServices.healthServices.map((service, index) => (
                <div key={index} className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-red-100 rounded-full p-3">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{service.name}</h4>
                      <p className="text-sm text-red-700">{service.type}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="text-gray-700">{service.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">{service.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">{service.schedule}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Servicios disponibles</h5>
                    <div className="flex flex-wrap gap-2">
                      {service.services.map((serv, idx) => (
                        <span key={idx} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                          {serv}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Contactar</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fuel Stations */}
      {(activeCategory === 'Todos' || activeCategory === 'Combustible') && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <Fuel className="w-6 h-6" />
              <h3 className="text-xl font-bold">Estaciones de Servicio</h3>
            </div>
            <p className="text-yellow-100 mt-2">Combustible y servicios para vehículos</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {villaviejaServices.fuelStations.map((station, index) => (
                <div key={index} className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-yellow-100 rounded-full p-3">
                      <Fuel className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{station.name}</h4>
                      <p className="text-sm text-yellow-700">{station.address}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Combustibles disponibles</h5>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {station.fuels.map((fuel, idx) => (
                        <span key={idx} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                          {fuel}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Servicios adicionales</h5>
                    <div className="flex flex-wrap gap-2">
                      {station.services.map((service, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{station.schedule}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Information */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-xl font-bold">Información de Emergencia</h3>
          </div>
          <p className="text-red-100 mt-2">Números importantes para tu seguridad</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h4 className="font-bold text-red-800 mb-2">Policía Nacional</h4>
              <p className="text-2xl font-bold text-red-600">123</p>
              <p className="text-sm text-red-700">Línea nacional</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h4 className="font-bold text-orange-800 mb-2">Bomberos</h4>
              <p className="text-2xl font-bold text-orange-600">119</p>
              <p className="text-sm text-orange-700">Emergencias</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">Cruz Roja</h4>
              <p className="text-2xl font-bold text-blue-600">132</p>
              <p className="text-sm text-blue-700">Primeros auxilios</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-green-800 mb-2">Centro de Salud</h4>
              <p className="text-lg font-bold text-green-600">+57 8 8390123</p>
              <p className="text-sm text-green-700">24 horas</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-bold text-purple-800 mb-2">Defensa Civil</h4>
              <p className="text-2xl font-bold text-purple-600">144</p>
              <p className="text-sm text-purple-700">Emergencias</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-2">Información Turística</h4>
              <p className="text-lg font-bold text-yellow-600">+57 300 XXX XXXX</p>
              <p className="text-sm text-yellow-700">Asistencia 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaviejaServices;