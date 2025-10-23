import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function ServiceFeed() {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceType, setServiceType] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Feed de Servicios Turísticos
            </h1>
            <p className="text-gray-600">
              Descubre los mejores servicios de prestadores locales
            </p>
          </div>
        </div>
        
        {/* Barra de búsqueda y filtros */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <label htmlFor="searchServices" className="sr-only">
                Buscar servicios
              </label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
              <input
                id="searchServices"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar servicios..."
                aria-label="Buscar servicios"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="serviceType" className="text-sm font-medium text-gray-700">
              Tipo de servicio
            </label>
            <select
              id="serviceType"
              name="serviceType"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              aria-label="Filtrar por tipo de servicio"
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todos los servicios</option>
              <option value="guia">Guías</option>
              <option value="transporte">Transporte</option>
              <option value="alojamiento">Alojamiento</option>
              <option value="comida">Gastronomía</option>
              <option value="actividad">Actividades</option>
              <option value="experiencia">Experiencias</option>
            </select>
          </div>
        </div>

        {/* Lista de servicios (placeholder) */}
        <div className="space-y-6">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay publicaciones disponibles
            </h3>
            <p className="text-gray-600 mb-4">
              Sé el primero en publicar un servicio turístico
            </p>
            <button
              type="button"
              aria-label="Crear nueva publicación"
              className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              Crear Primera Publicación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}