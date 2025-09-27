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
  Languages,
  Shield,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Camera,
  Telescope,
  Bike,
  MessageSquare,
  Eye,
  Plus
} from 'lucide-react';
import { villaviejaServices, villaviejaGuides, villaviejaServicesWithReviews } from '../../../data/villaviejaData';
import { GuideProfile, CreateGuideReviewRequest } from '../../../domain/models/GuideReview';
import { ServiceWithReviews, ServiceType, CreateServiceReviewRequest } from '../../../domain/models/ServiceReview';
import GuideReviewCard from './GuideReviewCard';
import GuideReviewModal from './GuideReviewModal';
import { GuideRatingSystem } from './GuideRatingSystem';
import ServiceReviewCard from './ServiceReviewCard';
import ServiceReviewModal from './ServiceReviewModal';
import { ServiceRatingSystem } from './ServiceRatingSystem';

type ServiceCategory = 'Todos' | 'Transporte' | 'Guías' | 'Equipos' | 'Salud' | 'Combustible';

const VillaviejaServices: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('Todos');
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [selectedGuideProfile, setSelectedGuideProfile] = useState<GuideProfile | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewModalGuide, setReviewModalGuide] = useState<{ id: string; name: string } | null>(null);

  // Estados para servicios
  const [selectedService, setSelectedService] = useState<ServiceWithReviews | null>(null);
  const [showServiceReviewModal, setShowServiceReviewModal] = useState(false);
  const [reviewModalService, setReviewModalService] = useState<{
    id: string;
    name: string;
    provider: string;
    type: ServiceType;
  } | null>(null);

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
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-neutral-100/20 backdrop-blur-sm rounded-full p-3">
              <Navigation className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Servicios y Logística</h2>
              <p className="text-primary-100">Todo lo que necesitas para tu viaje</p>
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
                    ? 'bg-primary-100 border-primary-300 text-primary-800'
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

      {/* Transportation Services */}
      {(activeCategory === 'Todos' || activeCategory === 'Transporte') && (
        <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-6">
            <div className="flex items-center space-x-3">
              <Car className="w-6 h-6" />
              <h3 className="text-xl font-bold">Servicios de Transporte</h3>
            </div>
            <p className="text-primary-100 mt-2">Opciones cómodas y seguras para llegar y moverse</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {villaviejaServicesWithReviews.transportation.map((service, index) => (
                <div key={service.id} className="bg-primary-50 rounded-xl p-6 border border-primary-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-primary-100 rounded-full p-3">
                      <Car className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-700">{service.name}</h4>
                      <p className="text-sm text-primary-700">{service.provider}</p>
                    </div>
                  </div>

                  {/* Rating y estadísticas */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-warning-400 fill-current" />
                        <span className="font-bold text-primary-700 ml-1">{service.stats.averageRating.toFixed(1)}</span>
                        <span className="text-neutral-600 text-sm ml-1">({service.stats.totalReviews} reviews)</span>
                      </div>
                    </div>
                    <ServiceRatingSystem
                      serviceType={service.type}
                      rating={service.stats.categoryAverages}
                      readonly
                      showLabels={false}
                      size="sm"
                    />
                  </div>

                  <div className="space-y-3 text-sm mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Ruta:</span>
                      <span className="font-medium text-primary-700">{service.baseInfo.route || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Frecuencia:</span>
                      <span className="font-medium text-primary-700">{service.baseInfo.frequency || service.baseInfo.available}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Precio:</span>
                      <span className="font-bold text-primary-600">
                        {service.baseInfo.price ? `$${service.baseInfo.price.toLocaleString()}` :
                         service.baseInfo.pricePerKm ? `$${service.baseInfo.pricePerKm.toLocaleString()}/km` :
                         service.baseInfo.priceBase ? `$${service.baseInfo.priceBase.toLocaleString()} base` : 'Consultar'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 mb-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="bg-primary-600 text-white py-2 px-3 rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center justify-center space-x-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Contactar</span>
                      </button>
                      <button
                        onClick={() => setSelectedService(service)}
                        className="bg-primary-100 text-primary-700 py-2 px-3 rounded-lg hover:bg-primary-200 transition-colors text-sm flex items-center justify-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ver Reviews</span>
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setReviewModalService({
                          id: service.id,
                          name: service.name,
                          provider: service.provider,
                          type: service.type
                        });
                        setShowServiceReviewModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-warning-500 to-accent-500 text-white py-2 px-3 rounded-lg hover:from-warning-600 hover:to-accent-600 transition-colors text-sm flex items-center justify-center space-x-1"
                    >
                      <Star className="w-3 h-3" />
                      <span>Calificar Servicio</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Guide Services */}
      {(activeCategory === 'Todos' || activeCategory === 'Guías') && (
        <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6" />
              <h3 className="text-xl font-bold">Guías Especializados</h3>
            </div>
            <p className="text-purple-100 mt-2">Expertos locales para enriquecer tu experiencia</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {villaviejaGuides.map((guide, index) => (
                <div key={guide.id} className="bg-purple-50 rounded-xl p-6 border border-primary-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-primary-100 rounded-full p-3">
                      {guide.avatar ? (
                        <img
                          src={guide.avatar}
                          alt={guide.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-8 h-8 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-700">{guide.name}</h4>
                      <p className="text-sm text-purple-700">{guide.specialty}</p>
                    </div>
                  </div>

                  {/* Rating y estadísticas */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-warning-400 fill-current" />
                        <span className="font-bold text-primary-700 ml-1">{guide.stats.averageRating.toFixed(1)}</span>
                        <span className="text-neutral-600 text-sm ml-1">({guide.stats.totalReviews} reviews)</span>
                      </div>
                    </div>
                    <GuideRatingSystem
                      rating={guide.stats.categoryAverages}
                      readonly
                      showLabels={false}
                      size="sm"
                    />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-accent-500" />
                      <span className="text-sm text-neutral-700">{guide.experience} de experiencia</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Languages className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-neutral-700">{guide.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-success-500" />
                      <span className="text-sm text-neutral-700">{guide.isVerified ? 'Verificado' : 'Certificado'}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold text-primary-700 mb-2">Certificaciones</h5>
                    <div className="space-y-1">
                      {guide.certifications.slice(0, 2).map((cert, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-success-500" />
                          <span className="text-xs text-neutral-600">{cert}</span>
                        </div>
                      ))}
                      {guide.certifications.length > 2 && (
                        <p className="text-xs text-neutral-500">+{guide.certifications.length - 2} más</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary-600">
                      ${guide.pricePerDay.toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600">por día</div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 mb-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedGuide(selectedGuide === guide.contact ? null : guide.contact)}
                        className="bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center justify-center space-x-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Contactar</span>
                      </button>
                      <button
                        onClick={() => setSelectedGuideProfile(guide)}
                        className="bg-primary-100 text-purple-700 py-2 px-3 rounded-lg hover:bg-purple-200 transition-colors text-sm flex items-center justify-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ver Perfil</span>
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setReviewModalGuide({ id: guide.id, name: guide.name });
                        setShowReviewModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-warning-500 to-accent-500 text-white py-2 px-3 rounded-lg hover:from-warning-600 hover:to-accent-600 transition-colors text-sm flex items-center justify-center space-x-1"
                    >
                      <Star className="w-3 h-3" />
                      <span>Calificar Guía</span>
                    </button>
                  </div>

                  {selectedGuide === guide.contact && (
                    <div className="mt-4 p-3 bg-neutral-100 rounded-lg border">
                      <p className="text-sm text-neutral-700">Contacto: {guide.contact}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de perfil de guía */}
      {selectedGuideProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-neutral-100 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-neutral-100/20 rounded-full flex items-center justify-center">
                    {selectedGuideProfile.avatar ? (
                      <img
                        src={selectedGuideProfile.avatar}
                        alt={selectedGuideProfile.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Users className="w-10 h-10" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedGuideProfile.name}</h2>
                    <p className="text-purple-100">{selectedGuideProfile.specialty}</p>
                    <p className="text-purple-200 text-sm">{selectedGuideProfile.experience} • {selectedGuideProfile.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGuideProfile(null)}
                  className="text-white hover:bg-neutral-100/10 rounded-full p-2"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4">
                <GuideRatingSystem
                  rating={selectedGuideProfile.stats.categoryAverages}
                  readonly
                  showLabels={false}
                  size="md"
                />
              </div>
            </div>

            <div className="p-6">
              {/* Bio */}
              {selectedGuideProfile.bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Acerca de mí</h3>
                  <p className="text-neutral-700 leading-relaxed">{selectedGuideProfile.bio}</p>
                </div>
              )}

              {/* Reviews recientes */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Reviews Recientes</h3>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-bold">{selectedGuideProfile.stats.averageRating.toFixed(1)}</span>
                    <span className="text-neutral-600">({selectedGuideProfile.stats.totalReviews} reviews)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedGuideProfile.reviews.slice(0, 3).map((review) => (
                    <GuideReviewCard
                      key={review.id}
                      review={review}
                      compact
                    />
                  ))}
                  {selectedGuideProfile.reviews.length > 3 && (
                    <p className="text-center text-neutral-600 py-2">
                      Y {selectedGuideProfile.reviews.length - 3} reviews más...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de review para guías */}
      {showReviewModal && reviewModalGuide && (
        <GuideReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setReviewModalGuide(null);
          }}
          guideId={reviewModalGuide.id}
          guideName={reviewModalGuide.name}
          onSubmit={async (reviewData: CreateGuideReviewRequest) => {
            console.log('Enviando review de guía:', reviewData);
            // Aquí iría la lógica para enviar la review al backend
          }}
        />
      )}

      {/* Modal de perfil de servicio */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-neutral-100 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-neutral-100/20 rounded-full flex items-center justify-center">
                    {selectedService.type === 'transportation' && <Car className="w-8 h-8" />}
                    {selectedService.type === 'equipment' && <Wrench className="w-8 h-8" />}
                    {selectedService.type === 'health' && <Heart className="w-8 h-8" />}
                    {selectedService.type === 'fuel' && <Fuel className="w-8 h-8" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedService.name}</h2>
                    <p className="text-primary-100">{selectedService.provider}</p>
                    <p className="text-primary-200 text-sm">{selectedService.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-white hover:bg-neutral-100/10 rounded-full p-2"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4">
                <ServiceRatingSystem
                  serviceType={selectedService.type}
                  rating={selectedService.stats.categoryAverages}
                  readonly
                  showLabels={false}
                  size="md"
                />
              </div>
            </div>

            <div className="p-6">
              {/* Reviews recientes */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Reviews Recientes</h3>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-bold">{selectedService.stats.averageRating.toFixed(1)}</span>
                    <span className="text-neutral-600">({selectedService.stats.totalReviews} reviews)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedService.reviews.slice(0, 3).map((review) => (
                    <ServiceReviewCard
                      key={review.id}
                      review={review}
                      compact
                    />
                  ))}
                  {selectedService.reviews.length > 3 && (
                    <p className="text-center text-neutral-600 py-2">
                      Y {selectedService.reviews.length - 3} reviews más...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de review para servicios */}
      {showServiceReviewModal && reviewModalService && (
        <ServiceReviewModal
          isOpen={showServiceReviewModal}
          onClose={() => {
            setShowServiceReviewModal(false);
            setReviewModalService(null);
          }}
          serviceId={reviewModalService.id}
          serviceName={reviewModalService.name}
          providerName={reviewModalService.provider}
          serviceType={reviewModalService.type}
          onSubmit={async (reviewData: CreateServiceReviewRequest) => {
            console.log('Enviando review de servicio:', reviewData);
            // Aquí iría la lógica para enviar la review al backend
          }}
        />
      )}

      {/* Equipment Rental */}
      {(activeCategory === 'Todos' || activeCategory === 'Equipos') && (
        <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-accent-600 to-accent-700 text-white p-6">
            <div className="flex items-center space-x-3">
              <Wrench className="w-6 h-6" />
              <h3 className="text-xl font-bold">Alquiler de Equipos</h3>
            </div>
            <p className="text-accent-100 mt-2">Equipos profesionales para tus actividades</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {villaviejaServicesWithReviews.equipment.map((service, index) => (
                <div key={service.id} className="bg-accent-50 rounded-xl p-6 border border-accent-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-accent-100 rounded-full p-3">
                      {equipmentIcons[service.name as keyof typeof equipmentIcons] || <Wrench className="w-6 h-6 text-accent-600" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-700">{service.name}</h4>
                      <p className="text-sm text-accent-700">{service.provider}</p>
                    </div>
                  </div>

                  {/* Rating y estadísticas */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-warning-400 fill-current" />
                        <span className="font-bold text-primary-700 ml-1">{service.stats.averageRating.toFixed(1)}</span>
                        <span className="text-neutral-600 text-sm ml-1">({service.stats.totalReviews} reviews)</span>
                      </div>
                    </div>
                    <ServiceRatingSystem
                      serviceType={service.type}
                      rating={service.stats.categoryAverages}
                      readonly
                      showLabels={false}
                      size="sm"
                    />
                  </div>

                  <p className="text-neutral-700 mb-4 text-sm leading-relaxed">{service.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-accent-600">
                      ${service.baseInfo.pricePerDay?.toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600">por día</div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 mb-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-accent-600 text-white py-2 px-3 rounded-lg hover:bg-accent-700 transition-colors text-sm flex items-center justify-center space-x-1">
                        <Camera className="w-3 h-3" />
                        <span>Reservar</span>
                      </button>
                      <button
                        onClick={() => setSelectedService(service)}
                        className="bg-accent-100 text-accent-700 py-2 px-3 rounded-lg hover:bg-accent-200 transition-colors text-sm flex items-center justify-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ver Reviews</span>
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setReviewModalService({
                          id: service.id,
                          name: service.name,
                          provider: service.provider,
                          type: service.type
                        });
                        setShowServiceReviewModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-warning-500 to-accent-500 text-white py-2 px-3 rounded-lg hover:from-warning-600 hover:to-accent-600 transition-colors text-sm flex items-center justify-center space-x-1"
                    >
                      <Star className="w-3 h-3" />
                      <span>Calificar Equipo</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Health Services */}
      {(activeCategory === 'Todos' || activeCategory === 'Salud') && (
        <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-error-600 to-error-500 text-white p-6">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6" />
              <h3 className="text-xl font-bold">Servicios de Salud</h3>
            </div>
            <p className="text-error-100 mt-2">Atención médica y farmacia disponible</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {villaviejaServicesWithReviews.health.map((service, index) => (
                <div key={service.id} className="bg-error-50 rounded-xl p-6 border border-error-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-error-100 rounded-full p-3">
                      <Heart className="w-6 h-6 text-error-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-700">{service.name}</h4>
                      <p className="text-sm text-error-700">{service.provider}</p>
                    </div>
                  </div>

                  {/* Rating y estadísticas */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-warning-400 fill-current" />
                        <span className="font-bold text-primary-700 ml-1">{service.stats.averageRating.toFixed(1)}</span>
                        <span className="text-neutral-600 text-sm ml-1">({service.stats.totalReviews} reviews)</span>
                      </div>
                    </div>
                    <ServiceRatingSystem
                      serviceType={service.type}
                      rating={service.stats.categoryAverages}
                      readonly
                      showLabels={false}
                      size="sm"
                    />
                  </div>

                  <div className="space-y-3 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-error-500" />
                      <span className="text-neutral-700">{service.baseInfo.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-primary-500" />
                      <span className="text-neutral-700">{service.baseInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-success-500" />
                      <span className="text-neutral-700">{service.baseInfo.schedule}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold text-primary-700 mb-2">Servicios disponibles</h5>
                    <div className="flex flex-wrap gap-2">
                      {service.baseInfo.services.map((serv, idx) => (
                        <span key={idx} className="bg-error-100 text-error-800 px-2 py-1 rounded-full text-xs">
                          {serv}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 mb-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-error-600 text-white py-2 px-3 rounded-lg hover:bg-error-700 transition-colors text-sm flex items-center justify-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>Contactar</span>
                      </button>
                      <button
                        onClick={() => setSelectedService(service)}
                        className="bg-error-100 text-error-700 py-2 px-3 rounded-lg hover:bg-error-200 transition-colors text-sm flex items-center justify-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ver Reviews</span>
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setReviewModalService({
                          id: service.id,
                          name: service.name,
                          provider: service.provider,
                          type: service.type
                        });
                        setShowServiceReviewModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-warning-500 to-accent-500 text-white py-2 px-3 rounded-lg hover:from-warning-600 hover:to-accent-600 transition-colors text-sm flex items-center justify-center space-x-1"
                    >
                      <Star className="w-3 h-3" />
                      <span>Calificar Servicio</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fuel Stations */}
      {(activeCategory === 'Todos' || activeCategory === 'Combustible') && (
        <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-warning-600 to-warning-500 text-white p-6">
            <div className="flex items-center space-x-3">
              <Fuel className="w-6 h-6" />
              <h3 className="text-xl font-bold">Estaciones de Servicio</h3>
            </div>
            <p className="text-warning-100 mt-2">Combustible y servicios para vehículos</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {villaviejaServicesWithReviews.fuel.map((service, index) => (
                <div key={service.id} className="bg-warning-50 rounded-xl p-6 border border-warning-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-warning-100 rounded-full p-3">
                      <Fuel className="w-6 h-6 text-warning-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-700">{service.name}</h4>
                      <p className="text-sm text-warning-700">{service.baseInfo.address}</p>
                    </div>
                  </div>

                  {/* Rating y estadísticas */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-warning-400 fill-current" />
                        <span className="font-bold text-primary-700 ml-1">{service.stats.averageRating.toFixed(1)}</span>
                        <span className="text-neutral-600 text-sm ml-1">({service.stats.totalReviews} reviews)</span>
                      </div>
                    </div>
                    <ServiceRatingSystem
                      serviceType={service.type}
                      rating={service.stats.categoryAverages}
                      readonly
                      showLabels={false}
                      size="sm"
                    />
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold text-primary-700 mb-2">Combustibles disponibles</h5>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {service.baseInfo.fuels.map((fuel, idx) => (
                        <span key={idx} className="bg-warning-100 text-warning-800 px-2 py-1 rounded-full text-sm">
                          {fuel}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold text-primary-700 mb-2">Servicios adicionales</h5>
                    <div className="flex flex-wrap gap-2">
                      {service.baseInfo.services.map((serv, idx) => (
                        <span key={idx} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-sm">
                          {serv}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-neutral-600 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{service.baseInfo.schedule}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-warning-600 text-white py-2 px-3 rounded-lg hover:bg-warning-700 transition-colors text-sm flex items-center justify-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>Dirección</span>
                      </button>
                      <button
                        onClick={() => setSelectedService(service)}
                        className="bg-warning-100 text-warning-700 py-2 px-3 rounded-lg hover:bg-warning-200 transition-colors text-sm flex items-center justify-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ver Reviews</span>
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setReviewModalService({
                          id: service.id,
                          name: service.name,
                          provider: service.provider,
                          type: service.type
                        });
                        setShowServiceReviewModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-warning-500 to-accent-500 text-white py-2 px-3 rounded-lg hover:from-warning-600 hover:to-accent-600 transition-colors text-sm flex items-center justify-center space-x-1"
                    >
                      <Star className="w-3 h-3" />
                      <span>Calificar Servicio</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Information */}
      <div className="bg-neutral-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-error-600 to-accent-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-xl font-bold">Información de Emergencia</h3>
          </div>
          <p className="text-error-100 mt-2">Números importantes para tu seguridad</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-error-50 rounded-lg p-4 border border-error-200">
              <h4 className="font-bold text-error-800 mb-2">Policía Nacional</h4>
              <p className="text-2xl font-bold text-error-600">123</p>
              <p className="text-sm text-error-700">Línea nacional</p>
            </div>
            <div className="bg-accent-50 rounded-lg p-4 border border-accent-200">
              <h4 className="font-bold text-accent-800 mb-2">Bomberos</h4>
              <p className="text-2xl font-bold text-accent-600">119</p>
              <p className="text-sm text-accent-700">Emergencias</p>
            </div>
            <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
              <h4 className="font-bold text-primary-800 mb-2">Cruz Roja</h4>
              <p className="text-2xl font-bold text-primary-600">132</p>
              <p className="text-sm text-primary-700">Primeros auxilios</p>
            </div>
            <div className="bg-success-50 rounded-lg p-4 border border-success-200">
              <h4 className="font-bold text-success-800 mb-2">Centro de Salud</h4>
              <p className="text-lg font-bold text-success-600">+57 8 8390123</p>
              <p className="text-sm text-success-700">24 horas</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-primary-200">
              <h4 className="font-bold text-primary-800 mb-2">Defensa Civil</h4>
              <p className="text-2xl font-bold text-primary-600">144</p>
              <p className="text-sm text-purple-700">Emergencias</p>
            </div>
            <div className="bg-warning-50 rounded-lg p-4 border border-warning-200">
              <h4 className="font-bold text-warning-800 mb-2">Información Turística</h4>
              <p className="text-lg font-bold text-warning-600">+57 300 XXX XXXX</p>
              <p className="text-sm text-warning-700">Asistencia 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaviejaServices;