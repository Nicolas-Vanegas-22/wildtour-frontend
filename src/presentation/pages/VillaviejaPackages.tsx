import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mountain,
  Telescope,
  Calendar,
  Users,
  Star,
  MapPin,
  Clock,
  Thermometer,
  Package,
  Sparkles,
  ArrowRight,
  Hotel,
  UtensilsCrossed,
  Route,
  Stars,
} from 'lucide-react';
import { usePackageStore } from '../../application/state/usePackageStore';
import PackageBuilderModal from '../components/package/PackageBuilderModal';
import { Button } from '../../shared/ui/Button';

const VillaviejaPackages: React.FC = () => {
  const { openModal } = usePackageStore();

  const highlights = [
    {
      icon: <Mountain className="w-8 h-8" />,
      title: 'Desierto de la Tatacoa',
      description: 'El segundo desierto más grande de Colombia',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: <Telescope className="w-8 h-8" />,
      title: 'Observación Astronómica',
      description: 'Uno de los mejores cielos para ver estrellas',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Museo Paleontológico',
      description: 'Fósiles de hace 13 millones de años',
      color: 'from-amber-500 to-yellow-500',
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: 'Gastronomía Local',
      description: 'Sabores únicos del Huila',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const categories = [
    {
      icon: <Hotel className="w-12 h-12" />,
      title: 'Alojamiento',
      description: 'Hoteles, hostales, camping y glamping',
      count: '6 opciones',
    },
    {
      icon: <UtensilsCrossed className="w-12 h-12" />,
      title: 'Alimentación',
      description: 'Restaurantes y estaderos típicos',
      count: '4 opciones',
    },
    {
      icon: <Route className="w-12 h-12" />,
      title: 'Recorridos',
      description: 'Guías, caballos, bicicletas y más',
      count: '5 opciones',
    },
    {
      icon: <Stars className="w-12 h-12" />,
      title: 'Astronomía',
      description: 'Observatorios y astrofotografía',
      count: '2 opciones',
    },
    {
      icon: <MapPin className="w-12 h-12" />,
      title: 'Sitios de Interés',
      description: 'Piscinas naturales y museos',
      count: '3 opciones',
    },
  ];

  const quickInfo = [
    { icon: <Thermometer />, label: 'Temperatura', value: '38°C promedio' },
    { icon: <Clock />, label: 'Mejor época', value: 'Dic - Mar' },
    { icon: <Users />, label: 'Ideal para', value: 'Familias y aventureros' },
    { icon: <Calendar />, label: 'Duración recomendada', value: '2-3 días' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/hero/tatacoa-1.jpg)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/50 to-gray-900/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-6 py-3 rounded-full mb-8"
              >
                <MapPin className="w-5 h-5" />
                <span className="text-lg font-medium">Villavieja, Huila - Colombia</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold mb-4 sm:mb-6 leading-tight px-4"
              >
                Arma tu Aventura
                <br />
                <span className="bg-gradient-to-r from-accent-400 to-yellow-400 bg-clip-text text-transparent">
                  en la Tatacoa
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
              >
                Crea tu paquete personalizado combinando alojamiento, alimentación, recorridos y
                experiencias únicas en el desierto más fascinante de Colombia
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
              >
                <Button
                  onClick={openModal}
                  variant="primary"
                  className="group w-full sm:w-auto bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold rounded-2xl shadow-2xl hover:shadow-accent-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform" />
                  <span className="flex-1 sm:flex-none">Armar Mi Paquete Ahora</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>

                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-white border-2 border-white/50 hover:border-white rounded-2xl font-semibold backdrop-blur-sm hover:bg-white/10 transition-all">
                  Ver servicios disponibles
                </button>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto px-4"
              >
                {quickInfo.map((info, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4"
                  >
                    <div className="flex justify-center mb-2 text-accent-300">{info.icon}</div>
                    <p className="text-sm text-white/70 mb-1">{info.label}</p>
                    <p className="font-semibold text-white">{info.value}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white/70 text-center"
          >
            <p className="text-sm mb-2">Descubre más</p>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full mx-auto flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 bg-white/70 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Highlights Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Experiencias Únicas</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
              ¿Qué te espera en Villavieja?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Descubre paisajes surrealistas, cielos estrellados y la calidez de la cultura huilense
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white to-neutral-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-200 h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${highlight.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {highlight.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold text-neutral-900 mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-neutral-600">{highlight.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Preview */}
      <div className="py-24 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
              Categorías de Servicios
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Selecciona solo lo que necesitas y arma tu experiencia perfecta
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-300 cursor-pointer group"
                onClick={openModal}
              >
                <div className="text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-neutral-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-neutral-600 mb-3">{category.description}</p>
                <p className="text-sm text-primary-600 font-semibold">{category.count}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button
              onClick={openModal}
              variant="primary"
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-12 py-5 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              <Package className="w-6 h-6 mr-3" />
              Comenzar a Armar Mi Paquete
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-24 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Star className="w-16 h-16 mx-auto mb-6 text-accent-300" />
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              ¿Listo para tu aventura?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Crea tu paquete personalizado ahora y vive una experiencia inolvidable en el Desierto
              de la Tatacoa. Selecciona solo lo que necesitas, al precio que quieres.
            </p>
            <Button
              onClick={openModal}
              variant="primary"
              className="bg-white hover:bg-neutral-100 text-primary-700 px-12 py-5 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-white/20 transition-all transform hover:scale-105"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Crear Mi Paquete Personalizado
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Package Builder Modal */}
      <PackageBuilderModal />
    </div>
  );
};

export default VillaviejaPackages;
