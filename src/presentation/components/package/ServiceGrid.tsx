import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ServiceCategory } from '../../../domain/models/CustomPackage';
import { getServicesByCategory, CATEGORIES_INFO } from '../../../data/customPackageServices';
import ServiceCard from './ServiceCard';

interface ServiceGridProps {
  category: ServiceCategory;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

export default function ServiceGrid({ category }: ServiceGridProps) {
  const services = getServicesByCategory(category);
  const categoryInfo = CATEGORIES_INFO.find((c) => c.category === category);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  // Filtrar servicios por subcategoría si hay una seleccionada
  const filteredServices = selectedSubcategory
    ? services.filter((s) => s.subcategory === selectedSubcategory)
    : services;

  return (
    <div className="space-y-6">
      {/* Header de categoría */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
      >
        <h3 className="text-2xl font-display font-bold text-neutral-900 mb-2">
          {categoryInfo?.title}
        </h3>
        <p className="text-neutral-600 mb-4">{categoryInfo?.description}</p>

        {/* Filtros por subcategoría */}
        {categoryInfo && categoryInfo.subcategories.length > 1 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubcategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSubcategory === null
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Todos ({services.length})
            </button>
            {categoryInfo.subcategories.map((sub) => {
              const count = services.filter((s) => s.subcategory === sub.type).length;
              return (
                <button
                  key={sub.type}
                  onClick={() => setSelectedSubcategory(sub.type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedSubcategory === sub.type
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {sub.label} ({count})
                </button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Grid de servicios */}
      <motion.div
        key={selectedSubcategory || 'all'}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredServices.length === 0 ? (
          <motion.div variants={item} className="col-span-full">
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-neutral-200">
              <p className="text-neutral-500 text-lg">
                No hay servicios disponibles en esta subcategoría
              </p>
            </div>
          </motion.div>
        ) : (
          filteredServices.map((service) => (
            <motion.div key={service.id} variants={item}>
              <ServiceCard service={service} />
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
