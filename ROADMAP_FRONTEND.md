# 🎨 ROADMAP FRONTEND - WILDTOUR PLATFORM

**Última actualización:** Noviembre 2025

## 📊 Estado Actual del Frontend
- **Completitud:** 35% ✅
- **UI/UX:** Diseño moderno con TailwindCSS ✅
- **Estado:** Zustand implementado ✅
- **Routing:** React Router v6 ✅
- **Formularios:** React Hook Form + Zod ✅
- **Responsive:** Parcial (necesita mejoras)

---

# COMPONENTES Y PÁGINAS NECESARIAS

## 🎯 FASE 1 - CRÍTICOS PARA MVP (3-4 meses)

### 1. BÚSQUEDA Y FILTRADO AVANZADO

#### Componentes Necesarios

**SearchBar.tsx** - Barra de búsqueda mejorada con autocompletado
```tsx
import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { searchApi } from '@/infrastructure/services/searchApi';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      searchApi.autocomplete(debouncedQuery).then((data) => {
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      });
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedQuery]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Barra de búsqueda */}
      <div className="flex items-center gap-4 bg-white rounded-2xl shadow-lg p-4">
        {/* Campo de destino */}
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="¿A dónde quieres ir?"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Selector de fechas */}
        <div className="flex-1">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Fechas"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Botón de búsqueda */}
        <button
          onClick={() => onSearch(query, {})}
          className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-colors"
        >
          <Search className="w-5 h-5" />
          Buscar
        </button>
      </div>

      {/* Sugerencias de autocompletado */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden z-50">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(suggestion.text);
                setShowSuggestions(false);
                onSearch(suggestion.text, {});
              }}
              className="w-full px-4 py-3 hover:bg-neutral-50 flex items-center gap-3 text-left transition-colors"
            >
              {suggestion.type === 'destination' && (
                <MapPin className="w-5 h-5 text-primary-500" />
              )}
              <div>
                <div
                  className="font-medium text-neutral-900"
                  dangerouslySetInnerHTML={{ __html: suggestion.highlight }}
                />
                {suggestion.subtitle && (
                  <div className="text-sm text-neutral-500">{suggestion.subtitle}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

**SearchResults.tsx** - Página de resultados de búsqueda
```tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchFilters } from '@/components/search/SearchFilters';
import { ServiceCard } from '@/components/services/ServiceCard';
import { searchApi } from '@/infrastructure/services/searchApi';
import { motion } from 'framer-motion';

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [facets, setFacets] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const query = searchParams.get('q') || '';

  useEffect(() => {
    fetchResults();
  }, [query, filters, page]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const data = await searchApi.search({
        query,
        filters,
        page,
        limit: 20
      });

      setResults(data.results);
      setFacets(data.facets);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header con resultados */}
      <div className="bg-white border-b border-neutral-200 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-neutral-900">
            Resultados para "{query}"
          </h1>
          <p className="text-neutral-600 mt-1">
            {results.length} servicios encontrados
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar con filtros */}
          <aside className="w-80 flex-shrink-0">
            <SearchFilters
              facets={facets}
              onFilterChange={setFilters}
              activeFilters={filters}
            />
          </aside>

          {/* Grid de resultados */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-neutral-200 animate-pulse rounded-2xl"
                  />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-neutral-900">
                  No se encontraron resultados
                </h3>
                <p className="text-neutral-600 mt-2">
                  Intenta ajustar los filtros o busca otro destino
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ServiceCard service={service} />
                    </motion.div>
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-4 py-2 rounded-lg ${
                          page === i + 1
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
```

**SearchFilters.tsx** - Sidebar de filtros
```tsx
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SearchFiltersProps {
  facets: any;
  onFilterChange: (filters: any) => void;
  activeFilters: any;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  facets,
  onFilterChange,
  activeFilters
}) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true,
    rating: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key: string, value: any) => {
    onFilterChange({ ...activeFilters, [key]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sticky top-24">
      <h3 className="text-lg font-bold text-neutral-900 mb-6">Filtros</h3>

      {/* Filtro de precio */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between mb-3"
        >
          <span className="font-semibold text-neutral-900">Precio</span>
          {expandedSections.price ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Mín"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                value={activeFilters.priceRange?.min || ''}
                onChange={(e) =>
                  updateFilter('priceRange', {
                    ...activeFilters.priceRange,
                    min: Number(e.target.value)
                  })
                }
              />
              <input
                type="number"
                placeholder="Máx"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                value={activeFilters.priceRange?.max || ''}
                onChange={(e) =>
                  updateFilter('priceRange', {
                    ...activeFilters.priceRange,
                    max: Number(e.target.value)
                  })
                }
              />
            </div>
            {facets?.priceRange && (
              <div className="text-xs text-neutral-500">
                Rango: ${facets.priceRange.min.toLocaleString()} - $
                {facets.priceRange.max.toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filtro de categorías */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between mb-3"
        >
          <span className="font-semibold text-neutral-900">Categorías</span>
          {expandedSections.category ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        {expandedSections.category && facets?.categories && (
          <div className="space-y-2">
            {Object.entries(facets.categories).map(([category, count]) => (
              <label key={category} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeFilters.categories?.includes(category) || false}
                  onChange={(e) => {
                    const current = activeFilters.categories || [];
                    updateFilter(
                      'categories',
                      e.target.checked
                        ? [...current, category]
                        : current.filter((c) => c !== category)
                    );
                  }}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span className="text-sm text-neutral-700">
                  {category} ({count})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Filtro de calificación */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between mb-3"
        >
          <span className="font-semibold text-neutral-900">Calificación</span>
          {expandedSections.rating ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        {expandedSections.rating && (
          <div className="space-y-2">
            {[5, 4, 3].map((rating) => (
              <button
                key={rating}
                onClick={() => updateFilter('rating', { min: rating })}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeFilters.rating?.min === rating
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-neutral-50'
                }`}
              >
                <span className="flex items-center gap-1">
                  {rating}+ ⭐
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Botón limpiar filtros */}
      {Object.keys(activeFilters).length > 0 && (
        <button
          onClick={() => onFilterChange({})}
          className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-2 rounded-lg transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
};
```

---

### 2. CALENDARIO DE DISPONIBILIDAD

#### Componentes Necesarios

**AvailabilityCalendar.tsx** - Calendario interactivo con disponibilidad
```tsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { availabilityApi } from '@/infrastructure/services/availabilityApi';

interface AvailabilityCalendarProps {
  serviceId: string;
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  serviceId,
  onDateSelect,
  selectedDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailability();
  }, [currentMonth, serviceId]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const data = await availabilityApi.getMonthCalendar(
        serviceId,
        currentMonth.getMonth() + 1,
        currentMonth.getFullYear()
      );

      // Convertir array a objeto con fecha como key
      const availabilityMap = {};
      data.forEach((day) => {
        availabilityMap[day.date] = day;
      });

      setAvailability(availabilityMap);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Días del mes anterior para completar la primera semana
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayStatus = (date: Date) => {
    const key = getDateKey(date);
    const dayAvailability = availability[key];

    if (!dayAvailability) return 'unavailable';
    return dayAvailability.status;
  };

  const getDayClasses = (date: Date) => {
    if (!date) return '';

    const status = getDayStatus(date);
    const isSelected =
      selectedDate && getDateKey(date) === getDateKey(selectedDate);
    const isPast = date < new Date();

    if (isPast) {
      return 'text-neutral-300 cursor-not-allowed';
    }

    if (isSelected) {
      return 'bg-primary-600 text-white font-bold';
    }

    switch (status) {
      case 'available':
        return 'bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer';
      case 'limited':
        return 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 cursor-pointer';
      case 'sold_out':
      case 'blocked':
        return 'bg-red-50 text-red-400 cursor-not-allowed line-through';
      default:
        return 'bg-neutral-50 text-neutral-400 cursor-not-allowed';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-neutral-900">
          {currentMonth.toLocaleDateString('es-CO', {
            month: 'long',
            year: 'numeric'
          })}
        </h3>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-neutral-600"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      {loading ? (
        <div className="grid grid-cols-7 gap-2">
          {[...Array(35)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-neutral-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) =>
            date ? (
              <button
                key={index}
                onClick={() => {
                  const status = getDayStatus(date);
                  if (
                    status !== 'sold_out' &&
                    status !== 'blocked' &&
                    date >= new Date()
                  ) {
                    onDateSelect(date);
                  }
                }}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${getDayClasses(
                  date
                )}`}
              >
                {date.getDate()}
              </button>
            ) : (
              <div key={index} />
            )
          )}
        </div>
      )}

      {/* Leyenda */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded" />
            <span className="text-neutral-600">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded" />
            <span className="text-neutral-600">Pocas plazas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded" />
            <span className="text-neutral-600">Agotado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary-600 rounded" />
            <span className="text-neutral-600">Seleccionado</span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

**TimeSlotSelector.tsx** - Selector de horarios
```tsx
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { availabilityApi } from '@/infrastructure/services/availabilityApi';

interface TimeSlotSelectorProps {
  serviceId: string;
  date: Date;
  onSlotSelect: (slot: string) => void;
  selectedSlot?: string;
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  serviceId,
  date,
  onSlotSelect,
  selectedSlot
}) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (date) {
      fetchSlots();
    }
  }, [date, serviceId]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const data = await availabilityApi.getTimeSlots(serviceId, date);
      setSlots(data.slots || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!date) {
    return (
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 text-center">
        <Clock className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
        <p className="text-neutral-600">Selecciona una fecha primero</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
      <h3 className="text-lg font-bold text-neutral-900 mb-4">
        Horarios disponibles
      </h3>

      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-neutral-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-neutral-600">
            No hay horarios disponibles para esta fecha
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {slots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => slot.available && onSlotSelect(slot.time)}
              disabled={!slot.available}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                selectedSlot === slot.time
                  ? 'bg-primary-600 text-white'
                  : slot.available
                  ? 'bg-neutral-50 hover:bg-neutral-100 text-neutral-900'
                  : 'bg-neutral-50 text-neutral-400 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" />
                {slot.time}
              </div>
              {slot.available && (
                <div className="text-xs mt-1 opacity-70">
                  {slot.remaining}/{slot.capacity} plazas
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

### 3. CHECKOUT MEJORADO Y GUEST CHECKOUT

#### Componentes Necesarios

**GuestInfoStep.tsx** - Paso 1: Información del comprador
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, User } from 'lucide-react';

const guestInfoSchema = z.object({
  firstName: z.string().min(2, 'Mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono inválido'),
  documentType: z.enum(['CC', 'CE', 'PASSPORT']),
  documentNumber: z.string().min(5, 'Documento inválido')
});

type GuestInfoData = z.infer<typeof guestInfoSchema>;

interface GuestInfoStepProps {
  data: any;
  onNext: (data: any) => void;
}

export const GuestInfoStep: React.FC<GuestInfoStepProps> = ({ data, onNext }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<GuestInfoData>({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: data.guestInfo
  });

  const onSubmit = (formData: GuestInfoData) => {
    onNext({ guestInfo: formData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        Información del comprador
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-2">
            Nombre
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              {...register('firstName')}
              className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Juan"
            />
          </div>
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-2">
            Apellido
          </label>
          <input
            {...register('lastName')}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Pérez"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              {...register('email')}
              type="email"
              className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="juan@email.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-2">
            Teléfono
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              {...register('phone')}
              className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="3001234567"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Tipo de documento */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-2">
            Tipo de documento
          </label>
          <select
            {...register('documentType')}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="CC">Cédula de ciudadanía</option>
            <option value="CE">Cédula de extranjería</option>
            <option value="PASSPORT">Pasaporte</option>
          </select>
        </div>

        {/* Número de documento */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-2">
            Número de documento
          </label>
          <input
            {...register('documentNumber')}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="1234567890"
          />
          {errors.documentNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.documentNumber.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold mt-8 transition-colors"
      >
        Continuar
      </button>
    </form>
  );
};
```

**TravelersStep.tsx** - Paso 2: Información de viajeros
```tsx
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Users } from 'lucide-react';

interface TravelersStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export const TravelersStep: React.FC<TravelersStepProps> = ({ data, onNext, onBack }) => {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      travelers: data.travelers?.length > 0 ? data.travelers : [{}]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'travelers'
  });

  const onSubmit = (formData: any) => {
    onNext({ travelers: formData.travelers });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-7 h-7 text-primary-600" />
        <h2 className="text-2xl font-bold text-neutral-900">
          Información de los viajeros
        </h2>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="mb-6 p-6 bg-neutral-50 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Viajero {index + 1}</h3>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nombre completo
              </label>
              <input
                {...register(`travelers.${index}.fullName`)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Nombre completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Documento
              </label>
              <input
                {...register(`travelers.${index}.document`)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Número de documento"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Fecha de nacimiento
              </label>
              <input
                {...register(`travelers.${index}.birthDate`)}
                type="date"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nacionalidad
              </label>
              <input
                {...register(`travelers.${index}.nationality`)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Colombia"
                required
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({})}
        className="w-full border-2 border-dashed border-neutral-300 text-neutral-600 hover:border-primary-500 hover:text-primary-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Agregar otro viajero
      </button>

      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 py-3 rounded-xl font-semibold transition-colors"
        >
          Atrás
        </button>
        <button
          type="submit"
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          Continuar
        </button>
      </div>
    </form>
  );
};
```

**PaymentStep.tsx** - Paso 3: Pago
```tsx
import { useState } from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { checkoutApi } from '@/infrastructure/services/checkoutApi';
import { OrderSummary } from '../OrderSummary';
import { CouponInput } from '../CouponInput';

interface PaymentStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ data, onNext, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('mercadopago');
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Crear la orden de pago
      const order = await checkoutApi.createOrder({
        ...data,
        paymentMethod
      });

      if (paymentMethod === 'mercadopago') {
        // Redirigir a MercadoPago
        window.location.href = order.paymentUrl;
      } else {
        // Otro método de pago
        onNext({ payment: { orderId: order.id } });
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main content */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            Método de pago
          </h2>

          {/* Métodos de pago */}
          <div className="space-y-4 mb-6">
            <button
              type="button"
              onClick={() => setPaymentMethod('mercadopago')}
              className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-colors ${
                paymentMethod === 'mercadopago'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <Wallet className="w-6 h-6 text-primary-600" />
              <div className="text-left flex-1">
                <div className="font-semibold text-neutral-900">MercadoPago</div>
                <div className="text-sm text-neutral-600">
                  Tarjetas de crédito, débito, PSE y más
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('transfer')}
              className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-colors ${
                paymentMethod === 'transfer'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <CreditCard className="w-6 h-6 text-primary-600" />
              <div className="text-left flex-1">
                <div className="font-semibold text-neutral-900">
                  Transferencia bancaria
                </div>
                <div className="text-sm text-neutral-600">Pago directo a cuenta</div>
              </div>
            </button>
          </div>

          {/* Cupón de descuento */}
          <CouponInput
            checkoutId={data.checkoutId || 'temp'}
            onCouponApplied={setDiscount}
          />

          {/* Términos y condiciones */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1" required />
              <span className="text-sm text-neutral-700">
                Acepto los{' '}
                <a href="#" className="text-primary-600 hover:underline">
                  términos y condiciones
                </a>{' '}
                y las{' '}
                <a href="#" className="text-primary-600 hover:underline">
                  políticas de cancelación
                </a>
              </span>
            </label>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 py-3 rounded-xl font-semibold transition-colors"
            >
              Atrás
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold disabled:bg-neutral-300 transition-colors"
            >
              {loading ? 'Procesando...' : 'Pagar ahora'}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar - Resumen */}
      <div className="lg:col-span-1">
        <OrderSummary data={data} discount={discount} />
      </div>
    </div>
  );
};
```

**ConfirmationStep.tsx** - Paso 4: Confirmación
```tsx
import { CheckCircle, Download, Mail, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfirmationStepProps {
  data: any;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ data }) => {
  const bookingCode = data.payment?.bookingCode || 'WT-123456';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </motion.div>

      <h2 className="text-3xl font-bold text-neutral-900 mb-2">
        ¡Reserva confirmada!
      </h2>
      <p className="text-neutral-600 mb-8">
        Tu reserva ha sido procesada exitosamente
      </p>

      {/* Código de reserva */}
      <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6 mb-8">
        <div className="text-sm text-neutral-600 mb-2">Código de reserva</div>
        <div className="text-3xl font-bold text-primary-600 tracking-wider">
          {bookingCode}
        </div>
      </div>

      {/* Información de la reserva */}
      <div className="text-left space-y-4 mb-8">
        <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
          <Calendar className="w-5 h-5 text-primary-600" />
          <div>
            <div className="text-sm text-neutral-600">Fecha</div>
            <div className="font-semibold text-neutral-900">
              {data.date || '15 de diciembre, 2025'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
          <Mail className="w-5 h-5 text-primary-600" />
          <div>
            <div className="text-sm text-neutral-600">Confirmación enviada a</div>
            <div className="font-semibold text-neutral-900">
              {data.guestInfo?.email || 'email@example.com'}
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold transition-colors">
          <Download className="w-5 h-5" />
          Descargar voucher
        </button>
        <button className="flex items-center justify-center gap-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 py-3 rounded-xl font-semibold transition-colors">
          Ver mis reservas
        </button>
      </div>

      <p className="text-sm text-neutral-500 mt-6">
        Hemos enviado la confirmación y el voucher a tu email
      </p>
    </div>
  );
};
```

**MultiStepCheckout.tsx** - Checkout paso a paso
```tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { GuestInfoStep } from './steps/GuestInfoStep';
import { TravelersStep } from './steps/TravelersStep';
import { PaymentStep } from './steps/PaymentStep';
import { ConfirmationStep } from './steps/ConfirmationStep';

const steps = [
  { id: 1, name: 'Información', component: GuestInfoStep },
  { id: 2, name: 'Viajeros', component: TravelersStep },
  { id: 3, name: 'Pago', component: PaymentStep },
  { id: 4, name: 'Confirmación', component: ConfirmationStep }
];

export const MultiStepCheckout: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    guestInfo: {},
    travelers: [],
    payment: {}
  });

  const CurrentStepComponent = steps.find(s => s.id === currentStep)?.component;

  const nextStep = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step.id
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`ml-3 font-medium ${
                    currentStep >= step.id
                      ? 'text-neutral-900'
                      : 'text-neutral-500'
                  }`}
                >
                  {step.name}
                </span>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > step.id
                        ? 'bg-green-500'
                        : 'bg-neutral-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {CurrentStepComponent && (
              <CurrentStepComponent
                data={formData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
```

**OrderSummary.tsx** - Resumen de la orden
```tsx
import { Tag, Calendar, Users, DollarSign } from 'lucide-react';

interface OrderSummaryProps {
  data: any;
  discount?: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ data, discount = 0 }) => {
  const servicePrice = data.service?.price || 250000;
  const travelers = data.travelers?.length || 1;
  const subtotal = servicePrice * travelers;
  const taxes = subtotal * 0.19; // 19% IVA
  const total = subtotal + taxes - discount;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      <h3 className="text-lg font-bold text-neutral-900 mb-4">Resumen de reserva</h3>

      {/* Servicio info */}
      {data.service && (
        <div className="mb-6 pb-6 border-b border-neutral-200">
          <div className="flex gap-3">
            {data.service.image && (
              <img
                src={data.service.image}
                alt={data.service.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            <div>
              <h4 className="font-semibold text-neutral-900">{data.service.name}</h4>
              <p className="text-sm text-neutral-600 mt-1">{data.service.location}</p>
            </div>
          </div>
        </div>
      )}

      {/* Detalles */}
      <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200">
        {data.date && (
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-700">{data.date}</span>
          </div>
        )}
        {data.timeSlot && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-neutral-700">Horario: {data.timeSlot}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-sm">
          <Users className="w-4 h-4 text-neutral-500" />
          <span className="text-neutral-700">{travelers} viajero(s)</span>
        </div>
      </div>

      {/* Precios */}
      <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">
            ${servicePrice.toLocaleString()} x {travelers}
          </span>
          <span className="text-neutral-900 font-medium">
            ${subtotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Impuestos (19%)</span>
          <span className="text-neutral-900 font-medium">
            ${Math.round(taxes).toLocaleString()}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              Descuento
            </span>
            <span className="font-medium">-${discount.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-bold text-neutral-900">Total</span>
        <span className="text-2xl font-bold text-primary-600">
          ${Math.round(total).toLocaleString()}
        </span>
      </div>

      {/* Política de cancelación */}
      <div className="bg-neutral-50 rounded-lg p-4">
        <h4 className="font-semibold text-neutral-900 text-sm mb-2">
          Cancelación gratuita
        </h4>
        <p className="text-xs text-neutral-600">
          Cancela hasta 24 horas antes del inicio para obtener un reembolso completo
        </p>
      </div>
    </div>
  );
};
```

**CouponInput.tsx** - Input para aplicar cupones
```tsx
import { useState } from 'react';
import { Tag, CheckCircle, AlertCircle } from 'lucide-react';
import { checkoutApi } from '@/infrastructure/services/checkoutApi';

interface CouponInputProps {
  checkoutId: string;
  onCouponApplied: (discount: number) => void;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  checkoutId,
  onCouponApplied
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const applyCoupon = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setStatus('idle');

    try {
      const result = await checkoutApi.applyCoupon(checkoutId, code);

      setStatus('success');
      setMessage(`¡Cupón aplicado! ${result.coupon.description}`);
      onCouponApplied(result.discount);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Cupón no válido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-5 h-5 text-primary-600" />
        <span className="font-semibold text-neutral-900">
          ¿Tienes un cupón de descuento?
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="CÓDIGO"
          disabled={status === 'success'}
          className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100"
        />
        <button
          onClick={applyCoupon}
          disabled={loading || status === 'success' || !code.trim()}
          className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Aplicando...' : status === 'success' ? 'Aplicado' : 'Aplicar'}
        </button>
      </div>

      {message && (
        <div
          className={`mt-3 flex items-center gap-2 text-sm ${
            status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {status === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {message}
        </div>
      )}
    </div>
  );
};
```

---

### 4. SISTEMA DE MENSAJERÍA

#### Componentes Necesarios

**MessageBubble.tsx** - Componente de mensaje individual
```tsx
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
      avatar?: string;
    };
    createdAt: string;
    read: boolean;
  };
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isOwn && (
          <div className="flex-shrink-0">
            {message.sender.avatar ? (
              <img
                src={message.sender.avatar}
                alt={message.sender.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">
                {message.sender.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}

        {/* Message Content */}
        <div>
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-primary-600 text-white rounded-tr-sm'
                : 'bg-neutral-100 text-neutral-900 rounded-tl-sm'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>

          {/* Timestamp and read status */}
          <div
            className={`flex items-center gap-1 mt-1 text-xs text-neutral-500 ${
              isOwn ? 'justify-end' : 'justify-start'
            }`}
          >
            <span>
              {new Date(message.createdAt).toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            {isOwn && (
              <span>
                {message.read ? (
                  <CheckCheck className="w-4 h-4 text-blue-500" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

**TypingIndicator.tsx** - Indicador de escritura
```tsx
import { motion } from 'framer-motion';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 px-4 py-3 bg-neutral-100 rounded-2xl rounded-tl-sm">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-neutral-400 rounded-full"
            animate={{
              y: [0, -8, 0]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.15
            }}
          />
        ))}
      </div>
    </div>
  );
};
```

**ChatWindow.tsx** - Ventana de chat
```tsx
import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, MoreVertical } from 'lucide-react';
import { useSignalR } from '@/hooks/useSignalR';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  currentUserId
}) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { connection, isConnected } = useSignalR('/hubs/messages');

  useEffect(() => {
    if (connection && isConnected) {
      // Escuchar mensajes nuevos
      connection.on('ReceiveMessage', (message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      });

      // Escuchar indicador de escritura
      connection.on('UserTyping', (data) => {
        setTypingUser(data.name);
        setIsTyping(true);
      });

      connection.on('UserStoppedTyping', () => {
        setIsTyping(false);
        setTypingUser(null);
      });

      // Marcar como leído
      connection.on('MessagesRead', (data) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.conversationId === data.conversationId && msg.senderId === currentUserId
              ? { ...msg, read: true }
              : msg
          )
        );
      });

      // Cargar mensajes iniciales
      loadMessages();
    }

    return () => {
      if (connection) {
        connection.off('ReceiveMessage');
        connection.off('UserTyping');
        connection.off('UserStoppedTyping');
        connection.off('MessagesRead');
      }
    };
  }, [connection, isConnected, conversationId]);

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/messages/conversation/${conversationId}`);
      const data = await response.json();
      setMessages(data.data.messages);
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    if (!connection) return;

    // Enviar evento de "escribiendo"
    connection.invoke('StartTyping', conversationId);

    // Cancelar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Después de 3 segundos sin escribir, enviar evento de "dejó de escribir"
    typingTimeoutRef.current = setTimeout(() => {
      connection.invoke('StopTyping', conversationId);
    }, 3000);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !connection) return;

    try {
      await connection.invoke('SendMessage', conversationId, inputMessage);
      setInputMessage('');
      connection.invoke('StopTyping', conversationId);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
        <div>
          <h3 className="font-bold text-neutral-900">Chat</h3>
          {isTyping && typingUser && (
            <p className="text-sm text-neutral-500">{typingUser} está escribiendo...</p>
          )}
        </div>
        <button className="p-2 hover:bg-neutral-100 rounded-lg">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.sender.id === currentUserId}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-neutral-200">
        <div className="flex items-end gap-3">
          <button className="p-2 hover:bg-neutral-100 rounded-lg">
            <Paperclip className="w-5 h-5 text-neutral-600" />
          </button>
          <textarea
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            rows={1}
            className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
            className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

### 5. RESEÑAS Y RATINGS

#### Componentes Necesarios

**ReviewForm.tsx** - Formulario para crear reseñas
```tsx
import { useState } from 'react';
import { Star, Camera, X } from 'lucide-react';
import { reviewsApi } from '@/infrastructure/services/reviewsApi';

interface ReviewFormProps {
  bookingId: string;
  serviceName: string;
  onSubmit: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  bookingId,
  serviceName,
  onSubmit
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState([]);
  const [categoryRatings, setCategoryRatings] = useState({
    service: 0,
    value: 0,
    location: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

    setLoading(true);

    try {
      await reviewsApi.create({
        bookingId,
        rating,
        title,
        content,
        categoryRatings,
        photos
      });

      onSubmit();
    } catch (error) {
      console.error('Error creating review:', error);
      alert('Error al publicar la reseña');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    for (const file of files) {
      // Aquí subirías la foto a tu storage
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload/review-photo', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        setPhotos((prev) => [...prev, data.url]);
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        Califica tu experiencia en {serviceName}
      </h2>

      {/* Rating general */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-neutral-900 mb-3">
          Calificación general
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-10 h-10 ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-neutral-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Categorías de rating */}
      <div className="mb-8 space-y-4">
        <h3 className="font-semibold text-neutral-900">Califica por categoría</h3>

        {Object.keys(categoryRatings).map((category) => (
          <div key={category}>
            <label className="block text-sm text-neutral-700 mb-2 capitalize">
              {category === 'service'
                ? 'Servicio'
                : category === 'value'
                ? 'Relación calidad-precio'
                : 'Ubicación'}
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setCategoryRatings((prev) => ({ ...prev, [category]: star }))
                  }
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= categoryRatings[category]
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Título */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-neutral-900 mb-2">
          Título de tu reseña
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: ¡Experiencia inolvidable!"
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      {/* Contenido */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-neutral-900 mb-2">
          Cuéntanos tu experiencia
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Comparte los detalles de tu visita..."
          rows={6}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      {/* Fotos */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-neutral-900 mb-3">
          Agrega fotos (opcional)
        </label>
        <div className="flex gap-3 flex-wrap">
          {photos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== index))}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {photos.length < 5 && (
            <label className="w-24 h-24 border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
              <Camera className="w-6 h-6 text-neutral-400 mb-1" />
              <span className="text-xs text-neutral-500">Subir foto</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || rating === 0}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Publicando...' : 'Publicar reseña'}
        </button>
      </div>

      <p className="text-xs text-neutral-500 mt-4 text-center">
        Al publicar confirmas que has completado este servicio y aceptas nuestras{' '}
        <a href="#" className="text-primary-600 hover:underline">
          políticas de reseñas
        </a>
      </p>
    </form>
  );
};
```

**ReviewCard.tsx** - Tarjeta de reseña individual
```tsx
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface ReviewCardProps {
  review: {
    id: string;
    user: {
      name: string;
      avatar?: string;
      location?: string;
    };
    rating: number;
    title: string;
    content: string;
    photos?: string[];
    createdAt: string;
    helpful: number;
    categoryRatings?: {
      service: number;
      value: number;
      location: number;
    };
    providerResponse?: {
      content: string;
      createdAt: string;
    };
  };
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [markedHelpful, setMarkedHelpful] = useState(false);

  const displayPhotos = showAllPhotos ? review.photos : review.photos?.slice(0, 3);

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {review.user.avatar ? (
            <img
              src={review.user.avatar}
              alt={review.user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
              {review.user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* User info and rating */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-neutral-900">{review.user.name}</h4>
              {review.user.location && (
                <p className="text-sm text-neutral-500">{review.user.location}</p>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {new Date(review.createdAt).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Category ratings */}
          {review.categoryRatings && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="text-xs">
                <div className="text-neutral-600">Servicio</div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{review.categoryRatings.service}</span>
                </div>
              </div>
              <div className="text-xs">
                <div className="text-neutral-600">Calidad-Precio</div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{review.categoryRatings.value}</span>
                </div>
              </div>
              <div className="text-xs">
                <div className="text-neutral-600">Ubicación</div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{review.categoryRatings.location}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-bold text-neutral-900 mb-2">{review.title}</h3>

      {/* Content */}
      <p className="text-neutral-700 leading-relaxed mb-4">{review.content}</p>

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2">
            {displayPhotos?.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Review photo ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  /* Abrir lightbox */
                }}
              />
            ))}
          </div>
          {review.photos.length > 3 && !showAllPhotos && (
            <button
              onClick={() => setShowAllPhotos(true)}
              className="text-sm text-primary-600 hover:underline mt-2"
            >
              Ver todas las fotos ({review.photos.length})
            </button>
          )}
        </div>
      )}

      {/* Helpful button */}
      <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
        <button
          onClick={() => setMarkedHelpful(!markedHelpful)}
          className={`flex items-center gap-2 text-sm transition-colors ${
            markedHelpful ? 'text-primary-600' : 'text-neutral-600 hover:text-primary-600'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${markedHelpful ? 'fill-current' : ''}`} />
          Útil ({review.helpful + (markedHelpful ? 1 : 0)})
        </button>
      </div>

      {/* Provider response */}
      {review.providerResponse && (
        <div className="mt-4 ml-12 p-4 bg-neutral-50 rounded-xl border-l-4 border-primary-500">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-primary-600" />
            <span className="font-semibold text-sm text-neutral-900">
              Respuesta del prestador
            </span>
            <span className="text-xs text-neutral-500">
              {new Date(review.providerResponse.createdAt).toLocaleDateString('es-CO')}
            </span>
          </div>
          <p className="text-sm text-neutral-700">{review.providerResponse.content}</p>
        </div>
      )}
    </div>
  );
};
```

**ReviewStats.tsx** - Estadísticas de reseñas
```tsx
import { Star } from 'lucide-react';

interface ReviewStatsProps {
  stats: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
    categoryAverages?: {
      service: number;
      value: number;
      location: number;
    };
  };
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({ stats }) => {
  const getRatingPercentage = (count: number) => {
    return (count / stats.totalReviews) * 100;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-neutral-900 mb-6">
        Calificaciones y reseñas
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Overall rating */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-baseline gap-3">
            <span className="text-6xl font-bold text-neutral-900">
              {stats.averageRating.toFixed(1)}
            </span>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.round(stats.averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-neutral-600 mt-1">
                {stats.totalReviews.toLocaleString()} reseñas
              </p>
            </div>
          </div>
        </div>

        {/* Rating distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-700 w-12">
                {rating} estrellas
              </span>
              <div className="flex-1 bg-neutral-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-yellow-400 h-full rounded-full transition-all"
                  style={{
                    width: `${getRatingPercentage(stats.ratingDistribution[rating])}%`
                  }}
                />
              </div>
              <span className="text-sm text-neutral-600 w-12 text-right">
                {stats.ratingDistribution[rating]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category averages */}
      {stats.categoryAverages && (
        <div className="pt-6 border-t border-neutral-200">
          <h4 className="font-semibold text-neutral-900 mb-4">
            Calificaciones por categoría
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-50 rounded-xl p-4">
              <div className="text-sm text-neutral-600 mb-1">Servicio</div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-neutral-900">
                  {stats.categoryAverages.service.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4">
              <div className="text-sm text-neutral-600 mb-1">Calidad-Precio</div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-neutral-900">
                  {stats.categoryAverages.value.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4">
              <div className="text-sm text-neutral-600 mb-1">Ubicación</div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-neutral-900">
                  {stats.categoryAverages.location.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

# 📱 RESPONSIVE Y MOBILE

## Breakpoints de TailwindCSS
```
sm: 640px   // Móviles grandes
md: 768px   // Tablets
lg: 1024px  // Laptops
xl: 1280px  // Desktops
2xl: 1536px // Pantallas grandes
```

## Componentes Mobile-First

**MobileNavigation.tsx**
```tsx
import { Home, Search, Heart, User, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const MobileNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/search', icon: Search, label: 'Buscar' },
    { path: '/favorites', icon: Heart, label: 'Favoritos' },
    { path: '/profile', icon: User, label: 'Perfil' }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                isActive ? 'text-primary-600' : 'text-neutral-500'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
```

---

# 🔧 HOOKS PERSONALIZADOS

## useSignalR.ts
```typescript
import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

export const useSignalR = (hubUrl: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem('token') || ''
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        setIsConnected(true);
        console.log('SignalR Connected');
      })
      .catch((err) => console.error('SignalR Connection Error:', err));

    connection.onreconnecting(() => setIsConnected(false));
    connection.onreconnected(() => setIsConnected(true));
    connection.onclose(() => setIsConnected(false));

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [hubUrl]);

  return {
    connection: connectionRef.current,
    isConnected
  };
};
```

## useDebounce.ts
```typescript
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

---

# 🔌 API SERVICE LAYER

## Implementaciones completas de servicios API

**src/infrastructure/services/searchApi.ts**
```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const searchApi = {
  // Autocompletado de búsqueda
  autocomplete: async (query: string) => {
    const response = await axios.get(`${API_URL}/search/autocomplete`, {
      params: { q: query }
    });
    return response.data;
  },

  // Búsqueda principal con filtros
  search: async (params: {
    query: string;
    filters?: any;
    page?: number;
    limit?: number;
  }) => {
    const response = await axios.post(`${API_URL}/search`, params);
    return response.data.data;
  },

  // Obtener facetas para filtros
  getFacets: async (query: string) => {
    const response = await axios.get(`${API_URL}/search/facets`, {
      params: { q: query }
    });
    return response.data.data;
  }
};
```

**src/infrastructure/services/availabilityApi.ts**
```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const availabilityApi = {
  // Obtener calendario de un mes
  getMonthCalendar: async (serviceId: string, month: number, year: number) => {
    const response = await axios.get(
      `${API_URL}/availability/${serviceId}/calendar`,
      {
        params: { month, year }
      }
    );
    return response.data.data.calendar;
  },

  // Obtener slots de tiempo para una fecha
  getTimeSlots: async (serviceId: string, date: Date) => {
    const response = await axios.get(
      `${API_URL}/availability/${serviceId}/slots`,
      {
        params: { date: date.toISOString().split('T')[0] }
      }
    );
    return response.data.data;
  },

  // Reservar temporalmente un slot (hold)
  holdSlot: async (serviceId: string, date: string, timeSlot: string) => {
    const response = await axios.post(`${API_URL}/availability/hold`, {
      serviceId,
      date,
      timeSlot
    });
    return response.data.data;
  },

  // Liberar un slot retenido
  releaseHold: async (holdId: string) => {
    await axios.delete(`${API_URL}/availability/hold/${holdId}`);
  }
};
```

**src/infrastructure/services/checkoutApi.ts**
```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configurar token de autenticación
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const checkoutApi = {
  // Crear orden de checkout
  createOrder: async (data: {
    serviceId: string;
    date: string;
    timeSlot: string;
    guestInfo: any;
    travelers: any[];
    paymentMethod: string;
  }) => {
    const response = await axios.post(`${API_URL}/checkout/create`, data);
    return response.data.data;
  },

  // Aplicar cupón de descuento
  applyCoupon: async (checkoutId: string, code: string) => {
    const response = await axios.post(`${API_URL}/checkout/${checkoutId}/coupon`, {
      code
    });
    return response.data.data;
  },

  // Confirmar pago
  confirmPayment: async (orderId: string, paymentData: any) => {
    const response = await axios.post(
      `${API_URL}/checkout/${orderId}/confirm`,
      paymentData
    );
    return response.data.data;
  },

  // Obtener detalles de orden
  getOrder: async (orderId: string) => {
    const response = await axios.get(`${API_URL}/checkout/order/${orderId}`);
    return response.data.data;
  },

  // Cancelar orden
  cancelOrder: async (orderId: string, reason?: string) => {
    const response = await axios.post(`${API_URL}/checkout/${orderId}/cancel`, {
      reason
    });
    return response.data.data;
  }
};
```

**src/infrastructure/services/messagesApi.ts**
```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const messagesApi = {
  // Obtener conversaciones del usuario
  getConversations: async () => {
    const response = await axios.get(`${API_URL}/messages/conversations`);
    return response.data.data;
  },

  // Obtener mensajes de una conversación
  getMessages: async (conversationId: string, page = 1, limit = 50) => {
    const response = await axios.get(
      `${API_URL}/messages/conversation/${conversationId}`,
      {
        params: { page, limit }
      }
    );
    return response.data.data;
  },

  // Enviar mensaje (también disponible vía SignalR)
  sendMessage: async (conversationId: string, content: string) => {
    const response = await axios.post(`${API_URL}/messages/send`, {
      conversationId,
      content
    });
    return response.data.data;
  },

  // Marcar mensajes como leídos
  markAsRead: async (conversationId: string) => {
    await axios.post(`${API_URL}/messages/conversation/${conversationId}/read`);
  },

  // Crear nueva conversación
  createConversation: async (providerId: string, serviceId?: string) => {
    const response = await axios.post(`${API_URL}/messages/conversations`, {
      providerId,
      serviceId
    });
    return response.data.data;
  }
};
```

**src/infrastructure/services/reviewsApi.ts**
```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const reviewsApi = {
  // Obtener reseñas de un servicio
  getServiceReviews: async (
    serviceId: string,
    params?: {
      page?: number;
      limit?: number;
      sort?: 'recent' | 'rating' | 'helpful';
      rating?: number;
    }
  ) => {
    const response = await axios.get(`${API_URL}/reviews/service/${serviceId}`, {
      params
    });
    return response.data.data;
  },

  // Obtener estadísticas de reseñas
  getReviewStats: async (serviceId: string) => {
    const response = await axios.get(
      `${API_URL}/reviews/service/${serviceId}/stats`
    );
    return response.data.data;
  },

  // Crear nueva reseña
  create: async (reviewData: {
    bookingId: string;
    rating: number;
    title: string;
    content: string;
    categoryRatings?: {
      service: number;
      value: number;
      location: number;
    };
    photos?: string[];
  }) => {
    const response = await axios.post(`${API_URL}/reviews`, reviewData);
    return response.data.data;
  },

  // Marcar reseña como útil
  markHelpful: async (reviewId: string) => {
    const response = await axios.post(`${API_URL}/reviews/${reviewId}/helpful`);
    return response.data.data;
  },

  // Reportar reseña
  report: async (reviewId: string, reason: string) => {
    const response = await axios.post(`${API_URL}/reviews/${reviewId}/report`, {
      reason
    });
    return response.data.data;
  },

  // Responder a reseña (solo providers)
  respond: async (reviewId: string, content: string) => {
    const response = await axios.post(`${API_URL}/reviews/${reviewId}/respond`, {
      content
    });
    return response.data.data;
  }
};
```

**src/infrastructure/services/apiClient.ts** - Cliente base reutilizable
```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor para agregar token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor para manejo de errores
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient(
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
);
```

---

# 🛠️ ESTRUCTURA DE CARPETAS RECOMENDADA

```
src/
├── app/
│   └── router.tsx
├── domain/
│   └── models/
├── infrastructure/
│   └── services/
│       ├── apiClient.ts
│       ├── searchApi.ts
│       ├── availabilityApi.ts
│       ├── checkoutApi.ts
│       ├── messagesApi.ts
│       └── reviewsApi.ts
├── presentation/
│   ├── components/
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   └── SearchFilters.tsx
│   │   ├── availability/
│   │   │   ├── AvailabilityCalendar.tsx
│   │   │   └── TimeSlotSelector.tsx
│   │   ├── checkout/
│   │   │   ├── MultiStepCheckout.tsx
│   │   │   ├── CouponInput.tsx
│   │   │   └── OrderSummary.tsx
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── TypingIndicator.tsx
│   │   └── reviews/
│   │       ├── ReviewForm.tsx
│   │       ├── ReviewCard.tsx
│   │       └── ReviewStats.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Search.tsx
│   │   ├── ServiceDetail.tsx
│   │   ├── Checkout.tsx
│   │   └── MyBookings.tsx
│   └── hooks/
│       ├── useSignalR.ts
│       ├── useDebounce.ts
│       └── useAvailability.ts
└── main.tsx
```

---

# 📊 PRÓXIMOS PASOS

## Semana 1-2: Búsqueda
- [ ] Implementar SearchBar con autocompletado
- [ ] Crear página SearchResults
- [ ] Componente SearchFilters
- [ ] Integración con API de búsqueda

## Semana 3-4: Disponibilidad
- [ ] AvailabilityCalendar interactivo
- [ ] TimeSlotSelector
- [ ] Integración SignalR para tiempo real
- [ ] Estados de disponibilidad visual

## Semana 5-6: Checkout
- [ ] MultiStepCheckout component
- [ ] Guest checkout form
- [ ] CouponInput
- [ ] Integración con MercadoPago

## Semana 7-8: Comunicación y Reseñas
- [ ] ChatWindow con SignalR
- [ ] Sistema de notificaciones
- [ ] ReviewForm
- [ ] ReviewCard y estadísticas

---

# 🎨 GUÍA DE ESTILOS

## Colores
```css
/* Primary */
--primary-50: #f0f9ff;
--primary-600: #667eea;
--primary-700: #764ba2;

/* Neutral */
--neutral-50: #fafafa;
--neutral-900: #171717;

/* Success/Warning/Error */
--green-500: #22c55e;
--yellow-500: #eab308;
--red-500: #ef4444;
```

## Componentes Reutilizables
- Usar `rounded-xl` o `rounded-2xl` para bordes
- Sombras: `shadow-sm`, `shadow-lg`
- Transiciones: `transition-colors`, `transition-transform`
- Animaciones con Framer Motion

---

# 🔗 EJEMPLOS DE INTEGRACIÓN

## Ejemplo 1: Página de búsqueda completa

```tsx
// src/presentation/pages/Search.tsx
import { useState } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { useSearchParams } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const handleSearch = (query: string, filters: any) => {
    setSearchParams({ q: query, ...filters });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero section con búsqueda */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            Descubre experiencias increíbles en Colombia
          </h1>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Resultados */}
      {initialQuery && <SearchResults />}
    </div>
  );
};
```

## Ejemplo 2: Página de detalle de servicio con disponibilidad

```tsx
// src/presentation/pages/ServiceDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AvailabilityCalendar } from '@/components/availability/AvailabilityCalendar';
import { TimeSlotSelector } from '@/components/availability/TimeSlotSelector';
import { ReviewStats } from '@/components/reviews/ReviewStats';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { reviewsApi } from '@/infrastructure/services/reviewsApi';
import { availabilityApi } from '@/infrastructure/services/availabilityApi';

export const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);

  useEffect(() => {
    loadReviews();
  }, [serviceId]);

  const loadReviews = async () => {
    const [reviewsData, statsData] = await Promise.all([
      reviewsApi.getServiceReviews(serviceId!),
      reviewsApi.getReviewStats(serviceId!)
    ]);
    setReviews(reviewsData.reviews);
    setReviewStats(statsData);
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedSlot) {
      alert('Selecciona fecha y horario');
      return;
    }

    navigate('/checkout', {
      state: {
        serviceId,
        date: selectedDate.toISOString(),
        timeSlot: selectedSlot
      }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Service info */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h1 className="text-3xl font-bold mb-4">Nombre del servicio</h1>
              {/* ... más info del servicio ... */}
            </div>

            {/* Reviews */}
            <div className="space-y-6">
              {reviewStats && <ReviewStats stats={reviewStats} />}
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>

          {/* Sidebar - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <AvailabilityCalendar
                serviceId={serviceId!}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate || undefined}
              />

              {selectedDate && (
                <TimeSlotSelector
                  serviceId={serviceId!}
                  date={selectedDate}
                  onSlotSelect={setSelectedSlot}
                  selectedSlot={selectedSlot || undefined}
                />
              )}

              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedSlot}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold text-lg disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
              >
                Reservar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## Ejemplo 3: Flujo de checkout completo

```tsx
// src/presentation/pages/Checkout.tsx
import { useLocation } from 'react-router-dom';
import { MultiStepCheckout } from '@/components/checkout/MultiStepCheckout';

export const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const { serviceId, date, timeSlot } = location.state || {};

  if (!serviceId || !date || !timeSlot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Información de reserva incompleta
          </h2>
          <p className="text-neutral-600 mb-6">
            Por favor selecciona un servicio y fecha primero
          </p>
          <a
            href="/search"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Volver a búsqueda
          </a>
        </div>
      </div>
    );
  }

  return <MultiStepCheckout />;
};
```

## Ejemplo 4: Sistema de mensajería en tiempo real

```tsx
// src/presentation/pages/Messages.tsx
import { useState, useEffect } from 'react';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { messagesApi } from '@/infrastructure/services/messagesApi';
import { useAuthStore } from '@/stores/authStore';

export const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const data = await messagesApi.getConversations();
    setConversations(data.conversations);
    if (data.conversations.length > 0) {
      setSelectedConversation(data.conversations[0].id);
    }
  };

  return (
    <div className="h-screen bg-neutral-50 flex">
      {/* Sidebar - Lista de conversaciones */}
      <div className="w-80 bg-white border-r border-neutral-200 overflow-y-auto">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">Mensajes</h2>
        </div>
        <div className="divide-y divide-neutral-200">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`w-full p-4 text-left hover:bg-neutral-50 transition-colors ${
                selectedConversation === conv.id ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                  {conv.otherUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-neutral-900 truncate">
                    {conv.otherUser.name}
                  </div>
                  <div className="text-sm text-neutral-600 truncate">
                    {conv.lastMessage?.content}
                  </div>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {conv.unreadCount}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main - Chat window */}
      <div className="flex-1">
        {selectedConversation ? (
          <ChatWindow
            conversationId={selectedConversation}
            currentUserId={user!.id}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-neutral-500">Selecciona una conversación</p>
          </div>
        )}
      </div>
    </div>
  );
};
```

## Ejemplo 5: Hook personalizado para disponibilidad

```typescript
// src/presentation/hooks/useAvailability.ts
import { useState, useEffect } from 'react';
import { availabilityApi } from '@/infrastructure/services/availabilityApi';

export const useAvailability = (serviceId: string, month: number, year: number) => {
  const [availability, setAvailability] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailability();
  }, [serviceId, month, year]);

  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await availabilityApi.getMonthCalendar(serviceId, month, year);

      // Convertir array a objeto con fecha como key
      const availabilityMap: Record<string, any> = {};
      data.forEach((day: any) => {
        availabilityMap[day.date] = day;
      });

      setAvailability(availabilityMap);
    } catch (err: any) {
      setError(err.message || 'Error al cargar disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchAvailability();
  };

  return { availability, loading, error, refetch };
};
```

## Ejemplo 6: Manejo de errores con Toast notifications

```tsx
// src/utils/toast.ts
import { toast } from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff'
      }
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff'
      }
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right'
    });
  }
};

// Uso en componentes:
// import { showToast } from '@/utils/toast';
//
// try {
//   const data = await searchApi.search(params);
//   showToast.success('Búsqueda exitosa');
// } catch (error) {
//   showToast.error('Error en la búsqueda');
// }
```

## Ejemplo 7: Store de Zustand para autenticación

```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'tourist' | 'provider' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('token', data.data.token);
          set({
            user: data.data.user,
            token: data.data.token,
            isAuthenticated: true
          });
        } else {
          throw new Error(data.message);
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (user: User) => {
        set({ user });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);
```

---

# 📝 VARIABLES DE ENTORNO

Crea un archivo `.env` en la raíz del proyecto:

```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SIGNALR_HUB_URL=http://localhost:5000

# External Services
VITE_MERCADOPAGO_PUBLIC_KEY=your_public_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here

# Environment
VITE_ENV=development
```

---

**¡Éxito con el desarrollo del frontend de WildTour! 🎨🚀**
