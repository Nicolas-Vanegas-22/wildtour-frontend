import { useNavigate, createSearchParams } from 'react-router-dom';
import { useState } from 'react';

interface SearchFilters {
  query: string;
  location: string;
  category: string;
  tourismType: string;
  budget: string;
  rating: string;
  dates: {
    checkIn: string;
    checkOut: string;
  };
}

export default function SearchBar() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    category: '',
    tourismType: '',
    budget: '',
    rating: '',
    dates: {
      checkIn: '',
      checkOut: ''
    }
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const nav = useNavigate();

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const updateDates = (key: keyof SearchFilters['dates'], value: string) => {
    setFilters(prev => ({
      ...prev,
      dates: { ...prev.dates, [key]: value }
    }));
  };

  const handleSearch = () => {
    const searchParams: Record<string, string> = {};

    if (filters.query) searchParams.q = filters.query;
    if (filters.location) searchParams.location = filters.location;
    if (filters.category) searchParams.category = filters.category;
    if (filters.tourismType) searchParams.type = filters.tourismType;
    if (filters.budget) searchParams.budget = filters.budget;
    if (filters.rating) searchParams.rating = filters.rating;
    if (filters.dates.checkIn) searchParams.checkIn = filters.dates.checkIn;
    if (filters.dates.checkOut) searchParams.checkOut = filters.dates.checkOut;

    nav({ pathname: '/destinos', search: `?${createSearchParams(searchParams)}` });
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      location: '',
      category: '',
      tourismType: '',
      budget: '',
      rating: '',
      dates: { checkIn: '', checkOut: '' }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Query */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿Qué buscas?
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Destino, actividad, hospedaje..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Ciudad, región..."
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar
          </button>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="border-t pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center"
        >
          <svg className={`w-4 h-4 mr-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showAdvanced ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
            >
              <option value="">Todas</option>
              <option value="hospedaje">Hospedaje</option>
              <option value="tours">Tours y actividades</option>
              <option value="transporte">Transporte</option>
              <option value="gastronomia">Gastronomía</option>
              <option value="entretenimiento">Entretenimiento</option>
            </select>
          </div>

          {/* Tourism Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de turismo
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={filters.tourismType}
              onChange={(e) => updateFilter('tourismType', e.target.value)}
            >
              <option value="">Cualquiera</option>
              <option value="aventura">Aventura</option>
              <option value="cultural">Cultural</option>
              <option value="naturaleza">Naturaleza</option>
              <option value="relax">Relax</option>
              <option value="gastronomico">Gastronómico</option>
              <option value="historico">Histórico</option>
              <option value="deportivo">Deportivo</option>
              <option value="fotografico">Fotográfico</option>
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Presupuesto
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={filters.budget}
              onChange={(e) => updateFilter('budget', e.target.value)}
            >
              <option value="">Cualquiera</option>
              <option value="low">Económico ($ - $$)</option>
              <option value="medium">Medio ($$ - $$$)</option>
              <option value="high">Alto ($$$ - $$$$)</option>
              <option value="luxury">Lujo ($$$$+)</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calificación mínima
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={filters.rating}
              onChange={(e) => updateFilter('rating', e.target.value)}
            >
              <option value="">Cualquiera</option>
              <option value="4">4+ estrellas</option>
              <option value="3">3+ estrellas</option>
              <option value="2">2+ estrellas</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Date Range (if applicable) */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de entrada
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={filters.dates.checkIn}
              onChange={(e) => updateDates('checkIn', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de salida
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={filters.dates.checkOut}
              onChange={(e) => updateDates('checkOut', e.target.value)}
              min={filters.dates.checkIn}
            />
          </div>
        </div>
      )}
    </div>
  );
}
