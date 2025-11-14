import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, TrendingUp, Star, Users, RefreshCw } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useProviderServiceStore } from '../../application/state/useProviderServiceStore';
import { useToast } from '../hooks/useToast';
import ServiceList from '../components/provider/ServiceList';
import ServiceFormModal from '../components/provider/ServiceFormModal';
import { ProviderService } from '../../domain/models/ProviderService';

export default function ProviderDashboard() {
  const { showToast } = useToast();
  const { services, isLoading, fetchServices, deleteService, toggleServiceStatus } =
    useProviderServiceStore();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ProviderService | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ProviderService | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreateNew = () => {
    setEditingService(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (service: ProviderService) => {
    setEditingService(service);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (service: ProviderService) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    setIsDeleting(true);
    try {
      await deleteService(serviceToDelete.id);
      showToast('Servicio eliminado exitosamente', 'success');
      setShowDeleteModal(false);
      setServiceToDelete(null);
    } catch (error) {
      showToast('Error al eliminar el servicio', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (service: ProviderService) => {
    try {
      await toggleServiceStatus(service.id, !service.isActive);
      showToast(
        `Servicio ${!service.isActive ? 'activado' : 'desactivado'} exitosamente`,
        'success'
      );
    } catch (error) {
      showToast('Error al actualizar el estado del servicio', 'error');
    }
  };

  const handleFormSuccess = () => {
    fetchServices();
  };

  // Calcular estadísticas
  const stats = {
    total: services.length,
    active: services.filter((s) => s.isActive).length,
    averageRating:
      services.reduce((acc, s) => acc + s.averageRating, 0) / services.length || 0,
    totalReviews: services.reduce((acc, s) => acc + s.reviewCount, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                Panel de Proveedor
              </h1>
              <p className="text-neutral-600">
                Gestiona tus servicios y revisa el desempeño de tu negocio
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => fetchServices()}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button onClick={handleCreateNew} className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nuevo Servicio
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">{stats.total}</div>
            <div className="text-sm text-neutral-600">Servicios Totales</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">{stats.active}</div>
            <div className="text-sm text-neutral-600">Servicios Activos</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-warning-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-neutral-600">Calificación Promedio</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">{stats.totalReviews}</div>
            <div className="text-sm text-neutral-600">Reseñas Totales</div>
          </motion.div>
        </div>

        {/* Lista de servicios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-neutral-900">Mis Servicios</h2>
            {services.length > 0 && (
              <span className="text-neutral-600">
                {services.length} {services.length === 1 ? 'servicio' : 'servicios'}
              </span>
            )}
          </div>

          {isLoading && services.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-neutral-600">Cargando servicios...</p>
            </div>
          ) : (
            <ServiceList
              services={services}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </motion.div>
      </div>

      {/* Modal de formulario */}
      <ServiceFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingService(null);
        }}
        onSuccess={handleFormSuccess}
        editingService={editingService}
      />

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && serviceToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-error-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Eliminar Servicio</h3>
              <p className="text-neutral-600">
                ¿Estás seguro de que deseas eliminar "{serviceToDelete.name}"? Esta acción no se
                puede deshacer.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setServiceToDelete(null);
                }}
                disabled={isDeleting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-error-600 hover:bg-error-700"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
