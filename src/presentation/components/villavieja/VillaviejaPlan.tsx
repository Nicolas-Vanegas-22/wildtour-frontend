import React, { useState } from 'react';
import {
  Navigation,
  ShoppingBag,
  Shield,
  Phone,
  MapPin,
  Wifi,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Sun,
  Thermometer,
  Camera,
  Heart,
  Pill,
  Car,
  Info,
  Clock,
  Battery,
  Smartphone,
  Signal,
  Download
} from 'lucide-react';
import { practicalInfo } from '../../../data/villaviejaData';

type InfoCategory = 'Todos' | 'Equipaje' | 'Seguridad' | 'Emergencias' | 'Servicios' | 'Conectividad';

const VillaviajaPracticalInfo: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<InfoCategory>('Todos');
  const [expandedSection, setExpandedSection] = useState<string | null>('packing');

  const categoryIcons = {
    'Equipaje': <ShoppingBag className="w-5 h-5" />,
    'Seguridad': <Shield className="w-5 h-5" />,
    'Emergencias': <Phone className="w-5 h-5" />,
    'Servicios': <MapPin className="w-5 h-5" />,
    'Conectividad': <Wifi className="w-5 h-5" />
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-neutral-100/20 backdrop-blur-sm rounded-full p-3">
              <Navigation className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Información Práctica</h2>
              <p className="text-teal-100">Todo lo que necesitas saber para tu viaje</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed opacity-90">
            Prepárate para tu aventura en Villavieja con esta guía completa que incluye qué llevar, consejos de seguridad, contactos de emergencia y servicios disponibles.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {(['Todos', 'Equipaje', 'Seguridad', 'Emergencias', 'Servicios', 'Conectividad'] as InfoCategory[]).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-colors ${
                  activeCategory === category
                    ? 'bg-teal-100 border-teal-300 text-teal-800'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {category !== 'Todos' && categoryIcons[category as keyof typeof categoryIcons]}
                <span className="font-medium">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* What to Pack */}
      {(activeCategory === 'Todos' || activeCategory === 'Equipaje') && (
        <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
          <button
            onClick={() => toggleSection('packing')}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-6 h-6" />
              <h3 className="text-xl font-bold">Qué Llevar en tu Equipaje</h3>
            </div>
            <Navigation className={`w-6 h-6 transition-transform ${expandedSection === 'packing' ? 'rotate-90' : ''}`} />
          </button>

          {expandedSection === 'packing' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-primary-700 mb-4 flex items-center">
                    <Sun className="w-5 h-5 text-yellow-500 mr-2" />
                    Ropa y Calzado
                  </h4>
                  <ul className="space-y-3">
                    {practicalInfo.whatToPack.clothing.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-neutral-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-primary-700 mb-4 flex items-center">
                    <Heart className="w-5 h-5 text-secondary-500 mr-2" />
                    Artículos Personales
                  </h4>
                  <ul className="space-y-3">
                    {practicalInfo.whatToPack.personalItems.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-neutral-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-primary-700 mb-4 flex items-center">
                    <Camera className="w-5 h-5 text-blue-500 mr-2" />
                    Opcionales
                  </h4>
                  <ul className="space-y-3">
                    {practicalInfo.whatToPack.optional.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Info className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                        <span className="text-neutral-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-warning-50 border border-warning-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Thermometer className="w-5 h-5 text-warning-600" />
                  <span className="font-semibold text-warning-800">Recordatorio Climático</span>
                </div>
                <p className="text-yellow-700 text-sm">
                  Villavieja tiene un clima desértico con temperaturas que varían de 15°C en la noche a 40°C durante el día.
                  La variación térmica es alta, así que prepárate para ambos extremos.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Safety Recommendations */}
      {(activeCategory === 'Todos' || activeCategory === 'Seguridad') && (
        <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
          <button
            onClick={() => toggleSection('safety')}
            className="w-full bg-gradient-to-r from-accent-600 to-secondary-600 text-white p-6 flex items-center justify-between hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6" />
              <h3 className="text-xl font-bold">Recomendaciones de Seguridad</h3>
            </div>
            <Navigation className={`w-6 h-6 transition-transform ${expandedSection === 'safety' ? 'rotate-90' : ''}`} />
          </button>

          {expandedSection === 'safety' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {practicalInfo.safetyRecommendations.map((recommendation, index) => (
                  <div key={index} className="bg-accent-50 rounded-lg p-4 border border-accent-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-accent-600 mt-1 flex-shrink-0" />
                      <p className="text-accent-800 text-sm font-medium">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="font-semibold text-red-800 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Precauciones Especiales en el Desierto
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-red-800 mb-2">Hidratación</h5>
                    <ul className="space-y-1 text-sm text-secondary-700">
                      <li>• Beber agua cada 15-20 minutos</li>
                      <li>• Evitar bebidas alcohólicas</li>
                      <li>• Reconocer signos de deshidratación</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-red-800 mb-2">Protección Solar</h5>
                    <ul className="space-y-1 text-sm text-secondary-700">
                      <li>• Reaplicar protector cada 2 horas</li>
                      <li>• Usar ropa de manga larga</li>
                      <li>• Buscar sombra regularmente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Emergency Contacts */}
      {(activeCategory === 'Todos' || activeCategory === 'Emergencias') && (
        <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
          <button
            onClick={() => toggleSection('emergency')}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 flex items-center justify-between hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center space-x-3">
              <Phone className="w-6 h-6" />
              <h3 className="text-xl font-bold">Contactos de Emergencia</h3>
            </div>
            <Navigation className={`w-6 h-6 transition-transform ${expandedSection === 'emergency' ? 'rotate-90' : ''}`} />
          </button>

          {expandedSection === 'emergency' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {practicalInfo.emergencyContacts.map((contact, index) => (
                  <div key={index} className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-red-100 rounded-full p-2">
                        <Phone className="w-4 h-4 text-secondary-600" />
                      </div>
                      <h4 className="font-semibold text-red-800">{contact.service}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-secondary-600">{contact.number}</div>
                      {contact.local && (
                        <div className="text-sm text-secondary-700">Local: {contact.local}</div>
                      )}
                      {contact.hours && (
                        <div className="text-sm text-secondary-700">{contact.hours}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 border border-primary-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-5 h-5 text-primary-600" />
                  <span className="font-semibold text-blue-800">Importante</span>
                </div>
                <p className="text-primary-700 text-sm">
                  Guarda estos números en tu teléfono antes de viajar. En caso de emergencia en áreas remotas del desierto,
                  dirígete al punto de encuentro más cercano o busca a un guía certificado.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Banking and Services */}
      {(activeCategory === 'Todos' || activeCategory === 'Servicios') && (
        <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
          <button
            onClick={() => toggleSection('services')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6" />
              <h3 className="text-xl font-bold">Servicios Bancarios y Comerciales</h3>
            </div>
            <Navigation className={`w-6 h-6 transition-transform ${expandedSection === 'services' ? 'rotate-90' : ''}`} />
          </button>

          {expandedSection === 'services' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {practicalInfo.banking.map((bank, index) => (
                  <div key={index} className="bg-blue-50 rounded-xl p-6 border border-primary-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-primary-100 rounded-full p-3">
                        <CreditCard className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-800">{bank.name}</h4>
                        <p className="text-sm text-primary-600">{bank.location}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h5 className="font-semibold text-blue-800 mb-2">Servicios disponibles</h5>
                        <div className="flex flex-wrap gap-2">
                          {bank.services.map((service, idx) => (
                            <span key={idx} className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-primary-700">
                        <Clock className="w-4 h-4" />
                        <span>{bank.hours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-warning-50 border border-warning-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-warning-600" />
                  <span className="font-semibold text-warning-800">Consejos Financieros</span>
                </div>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>• Lleva efectivo suficiente para pequeños comercios</li>
                  <li>• Los pagos con tarjeta no están disponibles en todos los lugares</li>
                  <li>• Retira dinero en Neiva antes de llegar a Villavieja</li>
                  <li>• Guarda dinero en varios lugares seguros</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Connectivity */}
      {(activeCategory === 'Todos' || activeCategory === 'Conectividad') && (
        <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
          <button
            onClick={() => toggleSection('connectivity')}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex items-center justify-between hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center space-x-3">
              <Wifi className="w-6 h-6" />
              <h3 className="text-xl font-bold">Conectividad y Comunicaciones</h3>
            </div>
            <Navigation className={`w-6 h-6 transition-transform ${expandedSection === 'connectivity' ? 'rotate-90' : ''}`} />
          </button>

          {expandedSection === 'connectivity' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-primary-700 mb-4 flex items-center">
                    <Signal className="w-5 h-5 text-purple-500 mr-2" />
                    Cobertura Móvil
                  </h4>
                  <div className="space-y-3">
                    {practicalInfo.connectivity.mobile.map((provider, index) => (
                      <div key={index} className="bg-purple-50 rounded-lg p-3 border border-primary-200">
                        <p className="text-primary-800 text-sm">{provider}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-primary-700 mb-4 flex items-center">
                    <Wifi className="w-5 h-5 text-blue-500 mr-2" />
                    Internet
                  </h4>
                  <div className="space-y-3">
                    {practicalInfo.connectivity.internet.map((info, index) => (
                      <div key={index} className="bg-blue-50 rounded-lg p-3 border border-primary-200">
                        <p className="text-blue-800 text-sm">{info}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-primary-700 mb-4 flex items-center">
                  <Smartphone className="w-5 h-5 text-green-500 mr-2" />
                  Recomendaciones de Conectividad
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {practicalInfo.connectivity.recommendations.map((recommendation, index) => (
                    <div key={index} className="bg-green-50 rounded-lg p-4 border border-success-200">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-success-600 mt-1 flex-shrink-0" />
                        <p className="text-green-800 text-sm">{recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h4 className="font-semibold text-indigo-800 mb-4 flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Aplicaciones Recomendadas (Descarga Offline)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-neutral-100 rounded-lg p-3">
                    <h5 className="font-medium text-indigo-800 mb-1">Mapas</h5>
                    <p className="text-sm text-indigo-600">Google Maps, Maps.me</p>
                  </div>
                  <div className="bg-neutral-100 rounded-lg p-3">
                    <h5 className="font-medium text-indigo-800 mb-1">Clima</h5>
                    <p className="text-sm text-indigo-600">Weather Underground</p>
                  </div>
                  <div className="bg-neutral-100 rounded-lg p-3">
                    <h5 className="font-medium text-indigo-800 mb-1">Traducción</h5>
                    <p className="text-sm text-indigo-600">Google Translate</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Reference Card */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6">
          <div className="flex items-center space-x-3">
            <Info className="w-6 h-6" />
            <h3 className="text-xl font-bold">Tarjeta de Referencia Rápida</h3>
          </div>
          <p className="text-gray-300 mt-2">Información esencial al alcance de tu mano</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Phone className="w-8 h-8 text-secondary-600" />
              </div>
              <h4 className="font-semibold text-primary-700 mb-1">Emergencias</h4>
              <p className="text-2xl font-bold text-secondary-600">123</p>
              <p className="text-sm text-neutral-600">Policía Nacional</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="font-semibold text-primary-700 mb-1">Centro de Salud</h4>
              <p className="text-lg font-bold text-primary-600">8390123</p>
              <p className="text-sm text-neutral-600">24 horas</p>
            </div>

            <div className="text-center">
              <div className="bg-success-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Thermometer className="w-8 h-8 text-success-600" />
              </div>
              <h4 className="font-semibold text-primary-700 mb-1">Temperatura</h4>
              <p className="text-lg font-bold text-success-600">15° - 40°C</p>
              <p className="text-sm text-neutral-600">Noche - Día</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="font-semibold text-primary-700 mb-1">Desde Neiva</h4>
              <p className="text-lg font-bold text-primary-600">45 min</p>
              <p className="text-sm text-neutral-600">En vehículo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaviajaPracticalInfo;