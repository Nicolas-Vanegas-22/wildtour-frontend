import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Star, DollarSign, Navigation, Phone, Globe } from 'lucide-react';
import { cn } from '../../shared/utils/cn';
import type { Destination } from '../../domain/models/Destination';
import 'leaflet/dist/leaflet.css';

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  destinations: Destination[];
  selectedDestination?: string;
  onDestinationSelect?: (destination: Destination) => void;
  height?: string;
  className?: string;
  center?: [number, number];
  zoom?: number;
  showControls?: boolean;
}

// Icono personalizado para destinos destacados
const createCustomIcon = (color: string = '#3B82F6', featured: boolean = false) => {
  const size = featured ? 40 : 30;
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        ${featured ? 'animation: pulse 2s infinite;' : ''}
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5" fill="${color}"/>
        </svg>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

// Componente para centrar el mapa automáticamente
function MapController({ destinations, selectedDestination }: { destinations: Destination[], selectedDestination?: string }) {
  const map = useMap();

  useEffect(() => {
    if (destinations.length > 0) {
      if (selectedDestination) {
        const destination = destinations.find(d => d.id === selectedDestination);
        if (destination && destination.location.coordinates) {
          map.setView([destination.location.coordinates.lat, destination.location.coordinates.lng], 12);
        }
      } else {
        // Ajustar vista para mostrar todos los destinos
        const validDestinations = destinations.filter(d => d.location.coordinates);
        if (validDestinations.length > 0) {
          const bounds = L.latLngBounds(
            validDestinations.map(d => [d.location.coordinates!.lat, d.location.coordinates!.lng])
          );
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      }
    }
  }, [map, destinations, selectedDestination]);

  return null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  destinations,
  selectedDestination,
  onDestinationSelect,
  height = '400px',
  className,
  center = [4.5709, -74.2973], // Colombia center
  zoom = 6,
  showControls = true,
}) => {
  const [mapReady, setMapReady] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Filtrar destinos que tienen coordenadas
  const validDestinations = destinations.filter(d => d.location.coordinates);

  return (
    <div className={cn('relative rounded-xl overflow-hidden shadow-lg', className)}>
      <div style={{ height }}>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className="z-10"
          whenReady={() => setMapReady(true)}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mapReady && (
            <>
              <MapController destinations={validDestinations} selectedDestination={selectedDestination} />

              {validDestinations.map((destination) => {
                const { lat, lng } = destination.location.coordinates!;
                const isSelected = selectedDestination === destination.id;
                const iconColor = destination.featured ? '#F59E0B' : isSelected ? '#EF4444' : '#3B82F6';

                return (
                  <Marker
                    key={destination.id}
                    position={[lat, lng]}
                    icon={createCustomIcon(iconColor, destination.featured)}
                    eventHandlers={{
                      click: () => {
                        onDestinationSelect?.(destination);
                      },
                    }}
                  >
                    <Popup className="destination-popup">
                      <div className="w-80 max-w-sm">
                        {/* Header con imagen */}
                        <div className="relative h-32 -m-3 mb-3 rounded-t-lg overflow-hidden">
                          <img
                            src={destination.images.main}
                            alt={destination.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                          {destination.featured && (
                            <div className="absolute top-2 left-2">
                              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                Destacado
                              </span>
                            </div>
                          )}

                          <div className="absolute bottom-2 left-2 text-white">
                            <h3 className="font-bold text-lg">{destination.name}</h3>
                            <div className="flex items-center text-sm opacity-90">
                              <MapPin className="w-3 h-3 mr-1" />
                              {destination.location.city}, {destination.location.department}
                            </div>
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {destination.shortDescription}
                          </p>

                          {/* Rating y precio */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-semibold">{destination.rating.toFixed(1)}</span>
                              <span className="text-sm text-gray-500">({destination.totalReviews})</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">
                                {formatPrice(destination.priceRange.min)}
                              </div>
                              <div className="text-xs text-gray-500">por persona</div>
                            </div>
                          </div>

                          {/* Categorías */}
                          <div className="flex flex-wrap gap-1">
                            {destination.categories.slice(0, 3).map(category => (
                              <span
                                key={category.id}
                                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs"
                              >
                                {category.icon} {category.name}
                              </span>
                            ))}
                          </div>

                          {/* Botones de acción */}
                          <div className="flex space-x-2 pt-2">
                            <button
                              onClick={() => {
                                const route = destination.slug === 'desierto-de-la-tatacoa' ? '/villavieja' : `/destinos/${destination.slug}`;
                                window.open(route, '_blank');
                              }}
                              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              Ver Detalles
                            </button>
                            <button
                              onClick={() => {
                                if (destination.location.coordinates) {
                                  const { lat, lng } = destination.location.coordinates;
                                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                                }
                              }}
                              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                              title="Abrir en Google Maps"
                            >
                              <Navigation className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </>
          )}
        </MapContainer>
      </div>

      {/* Controles adicionales */}
      {showControls && (
        <div className="absolute top-4 right-4 z-20 bg-white rounded-lg shadow-lg p-2 space-y-2">
          <button
            onClick={() => {
              // Lógica para centrar en ubicación actual
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  const { latitude, longitude } = position.coords;
                  // Aquí podrías actualizar el centro del mapa
                  console.log('User location:', latitude, longitude);
                });
              }
            }}
            className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Mi ubicación"
          >
            <Navigation className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              // Lógica para vista satelital
              console.log('Switch to satellite view');
            }}
            className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Vista satelital"
          >
            <Globe className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Leyenda */}
      {showControls && (
        <div className="absolute bottom-4 left-4 z-20 bg-white rounded-lg shadow-lg p-3">
          <div className="text-xs font-semibold text-gray-700 mb-2">Leyenda</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Destino regular</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Destino destacado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Seleccionado</span>
            </div>
          </div>
        </div>
      )}

      {/* Información del mapa */}
      <div className="absolute bottom-4 right-4 z-20 bg-black/70 text-white px-2 py-1 rounded text-xs">
        {validDestinations.length} destinos mostrados
      </div>

      <style jsx>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .destination-popup .leaflet-popup-content {
          margin: 8px 12px;
          line-height: 1.4;
          font-size: 13px;
          font-size: 1.08333em;
          min-height: 1px;
        }

        .destination-popup .leaflet-popup-content-wrapper {
          padding: 1px;
          text-align: left;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default InteractiveMap;