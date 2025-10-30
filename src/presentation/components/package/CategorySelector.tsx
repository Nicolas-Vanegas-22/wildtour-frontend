import React from 'react';
import { motion } from 'framer-motion';
import {
  Hotel,
  UtensilsCrossed,
  Route,
  Stars,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ServiceCategory } from '../../../domain/models/CustomPackage';
import { CATEGORIES_INFO } from '../../../data/customPackageServices';

const ICON_MAP: Record<string, React.FC<any>> = {
  Hotel,
  UtensilsCrossed,
  Route,
  Stars,
  MapPin,
  Sparkles,
};

interface CategorySelectorProps {
  onSelectCategory: (category: ServiceCategory) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function CategorySelector({ onSelectCategory }: CategorySelectorProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto px-4"
      >
        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Crea tu experiencia perfecta</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 mb-2 sm:mb-3">
          Selecciona las categorías que te interesan
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-neutral-600">
          Navega libremente entre las categorías y selecciona solo lo que necesitas.
          <br className="hidden sm:block" />
          <span className="sm:inline block mt-1 sm:mt-0">Puedes añadir servicios de una o todas las categorías.</span>
        </p>
      </motion.div>

      {/* Grid de categorías */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {CATEGORIES_INFO.map((category) => {
          const IconComponent = ICON_MAP[category.icon] || MapPin;

          return (
            <motion.div key={category.category} variants={item}>
              <button
                onClick={() => onSelectCategory(category.category)}
                className="group w-full bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary-300"
              >
                {/* Header con icono y gradiente */}
                <div className="relative h-24 sm:h-32 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center overflow-hidden">
                  {/* Efecto de fondo animado */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)] group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  {/* Icono */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <IconComponent className="w-12 h-12 sm:w-16 sm:h-16 text-white relative z-10" strokeWidth={1.5} />
                  </motion.div>

                  {/* Badge de número de servicios */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 sm:px-3 py-1 rounded-full">
                    {category.subcategories.length} tipos
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4 sm:p-6 text-left">
                  <h4 className="text-lg sm:text-xl font-display font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {category.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-600 mb-3 sm:mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  {/* Lista de subcategorías */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.subcategories.slice(0, 3).map((sub) => (
                      <span
                        key={sub.type}
                        className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-md"
                      >
                        {sub.label}
                      </span>
                    ))}
                    {category.subcategories.length > 3 && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-md font-medium">
                        +{category.subcategories.length - 3} más
                      </span>
                    )}
                  </div>

                  {/* Call to action */}
                  <div className="flex items-center justify-between text-primary-600 group-hover:text-primary-700 font-medium">
                    <span className="text-sm">Explorar servicios</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Info adicional */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-primary-50 border border-primary-200 rounded-xl p-6 mt-8"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900 mb-2">
              ¿Cómo funciona el armado de paquetes?
            </h4>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-0.5">•</span>
                <span>Selecciona una categoría para ver los servicios disponibles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-0.5">•</span>
                <span>Añade los servicios que desees, especificando número de personas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-0.5">•</span>
                <span>El precio total se calcula automáticamente en el resumen lateral</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-0.5">•</span>
                <span>Puedes guardar tu paquete o proceder directamente al pago</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
