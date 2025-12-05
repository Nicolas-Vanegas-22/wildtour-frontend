import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, User, Mountain, Compass } from 'lucide-react';
import { useAuthStore } from '../../application/state/useAuthStore';
import { Button } from '../../shared/ui/Button';

export default function TouristDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const quickActions = [
    {
      icon: MapPin,
      title: 'Explorar Destinos',
      description: 'Descubre nuevos lugares',
      action: () => navigate('/destinos'),
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: Calendar,
      title: 'Mis Reservas',
      description: 'Ver mis viajes',
      action: () => navigate('/mis-reservas'),
      color: 'from-accent-500 to-accent-600',
    },
    {
      icon: Heart,
      title: 'Favoritos',
      description: 'Lugares guardados',
      action: () => navigate('/favoritos'),
      color: 'from-error-500 to-error-600',
    },
    {
      icon: User,
      title: 'Mi Perfil',
      description: 'Configuración de cuenta',
      action: () => navigate('/perfil'),
      color: 'from-neutral-500 to-neutral-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                ¡Bienvenido, {user?.person?.firstName || user?.username}!
              </h1>
              <p className="text-neutral-600 text-lg">
                Comienza tu próxima aventura en Colombia
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-soft border border-white/20 p-6">
            <div className="flex items-center gap-3 text-primary-700">
              <Mountain className="w-6 h-6" />
              <p className="text-lg">
                Explora los mejores destinos turísticos y crea experiencias inolvidables
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={action.action}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-soft border border-white/20 p-6 cursor-pointer hover:shadow-strong transition-all group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-neutral-800 mb-2">
                {action.title}
              </h3>
              <p className="text-neutral-600">{action.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Featured Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white/80 backdrop-blur-lg rounded-2xl shadow-soft border border-white/20 p-8"
        >
          <h2 className="text-2xl font-display font-bold text-neutral-800 mb-6">
            Destinos Destacados
          </h2>
          <div className="text-center py-8">
            <Mountain className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600 mb-6">
              Descubre los mejores destinos de Colombia
            </p>
            <Button onClick={() => navigate('/destinos')}>
              Ver Todos los Destinos
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
