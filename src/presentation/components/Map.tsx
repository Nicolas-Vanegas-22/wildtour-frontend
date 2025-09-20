import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

interface MapLocation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  category: 'hospedaje' | 'tours' | 'transporte' | 'gastronomia' | 'entretenimiento';
  rating?: number;
  price?: string;
  image?: string;
}

interface MapProps {
  center?: { lat: number; lng: number };
  locations?: MapLocation[];
  height?: string;
  showControls?: boolean;
  onLocationClick?: (location: MapLocation) => void;
  className?: string;
  zoom?: number;
}

// Iconos personalizados para diferentes categorías
const categoryIcons = {
  hospedaje: '🏨',
  tours: '🎯',
  transporte: '🚗',
  gastronomia: '🍽️',
  entretenimiento: '🎪'
};

const categoryColors = {
  hospedaje: '#3B82F6',
  tours: '#10B981',
  transporte: '#F59E0B',
  gastronomia: '#EF4444',
  entretenimiento: '#8B5CF6'
};

export default function Map({
  center = { lat: 4.5709, lng: -74.2973 }, // Bogotá por defecto
  locations = [],
  height = '400px',
  showControls = true,
  onLocationClick,
  className = '',
  zoom = 10
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtrar ubicaciones por categoría
  const filteredLocations = selectedCategory === 'all'
    ? locations
    : locations.filter(loc => loc.category === selectedCategory);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Limpiar mapa existente
    if (mapRef.current) {
      mapRef.current.remove();
    }

    // Crear nuevo mapa
    const map = L.map(mapContainerRef.current).setView([center.lat, center.lng], zoom);
    mapRef.current = map;

    // Agregar capa de tiles con mejor estilo para turismo
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center.lat, center.lng, zoom]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Limpiar marcadores existentes
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Agregar nuevos marcadores
    filteredLocations.forEach(location => {
      // Crear icono personalizado
      const iconHtml = `
        <div style="
          background-color: ${categoryColors[location.category]};
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          font-size: 18px;
        ">
          ${categoryIcons[location.category]}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([location.lat, location.lng], { icon: customIcon })
        .addTo(mapRef.current!);

      // Crear popup personalizado
      const popupContent = `
        <div class="p-3 min-w-[250px]">
          ${location.image ? `<img src="${location.image}" alt="${location.title}" class="w-full h-32 object-cover rounded-lg mb-2"/>` : ''}
          <h3 class="font-bold text-lg text-gray-800 mb-1">${location.title}</h3>
          ${location.description ? `<p class="text-gray-600 text-sm mb-2">${location.description}</p>` : ''}
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              ${location.rating ? `
                <div class="flex items-center mr-2">
                  <span class="text-yellow-500">★</span>
                  <span class="text-sm font-medium ml-1">${location.rating}</span>
                </div>
              ` : ''}
              <span class="inline-block px-2 py-1 bg-${categoryColors[location.category]} text-white text-xs rounded-full">
                ${location.category}
              </span>
            </div>
            ${location.price ? `<span class="font-bold text-green-600">${location.price}</span>` : ''}
          </div>
          <button
            onclick="window.selectLocation('${location.id}')"
            class="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Ver detalles
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      // Agregar evento de click
      marker.on('click', () => {
        if (onLocationClick) {
          onLocationClick(location);
        }
      });

      markersRef.current.push(marker);
    });

    // Ajustar vista para mostrar todos los marcadores
    if (filteredLocations.length > 1) {
      const group = new L.FeatureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }

  }, [filteredLocations, onLocationClick]);

  // Función global para manejar clicks desde popups
  useEffect(() => {
    (window as any).selectLocation = (locationId: string) => {
      const location = locations.find(loc => loc.id === locationId);
      if (location && onLocationClick) {
        onLocationClick(location);
      }
    };

    return () => {
      delete (window as any).selectLocation;
    };
  }, [locations, onLocationClick]);

  return (
    <div className={`relative ${className}`}>
      {/* Controles de filtro */}
      {showControls && locations.length > 0 && (
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Filtrar por categoría:</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({locations.length})
            </button>
            {Object.entries(categoryIcons).map(([category, icon]) => {
              const count = locations.filter(loc => loc.category === category).length;
              if (count === 0) return null;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors flex items-center gap-1 ${
                    selectedCategory === category
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category ? categoryColors[category as keyof typeof categoryColors] : undefined
                  }}
                >
                  <span>{icon}</span>
                  <span className="capitalize">{category}</span>
                  <span>({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Contenedor del mapa */}
      <div
        ref={mapContainerRef}
        style={{ height, width: '100%' }}
        className="rounded-lg border border-gray-200 shadow-sm"
      />

      {/* Leyenda */}
      {showControls && locations.length > 0 && (
        <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Leyenda:</h4>
          <div className="space-y-1">
            {Object.entries(categoryIcons).map(([category, icon]) => {
              const count = locations.filter(loc => loc.category === category).length;
              if (count === 0) return null;

              return (
                <div key={category} className="flex items-center text-xs">
                  <div
                    className="w-4 h-4 rounded-full mr-2 flex items-center justify-center text-xs"
                    style={{ backgroundColor: categoryColors[category as keyof typeof categoryColors] }}
                  >
                    {icon}
                  </div>
                  <span className="capitalize text-gray-700">{category}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
