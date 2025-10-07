import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Building,
  BarChart3,
  Settings,
  Database,
  AlertTriangle,
  UserCog,
  Lock,
  Eye,
  Trash2,
  Plus,
  Edit,
  Search,
  Filter,
  Download,
  Upload,
  Activity,
  Globe,
  Key,
  Zap
} from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useAuthStore } from '../../application/state/useAuthStore';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'supreme_admin';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
}

interface SystemMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
}

export default function SupremeAdminDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const systemMetrics: SystemMetric[] = [
    {
      label: 'Total de Usuarios',
      value: '15,429',
      change: '+12%',
      trend: 'up',
      icon: Users
    },
    {
      label: 'Prestadores Activos',
      value: '1,237',
      change: '+8%',
      trend: 'up',
      icon: Building
    },
    {
      label: 'Transacciones Hoy',
      value: '892',
      change: '+15%',
      trend: 'up',
      icon: Activity
    },
    {
      label: 'Uptime del Sistema',
      value: '99.9%',
      change: '0%',
      trend: 'stable',
      icon: Zap
    }
  ];

  const adminUsers: AdminUser[] = [
    {
      id: '1',
      username: 'admin_principal',
      email: 'admin@wildtour.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2023-12-15 10:30',
      permissions: ['users_read', 'users_write', 'bookings_read']
    },
    {
      id: '2',
      username: 'admin_soporte',
      email: 'soporte@wildtour.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2023-12-15 09:15',
      permissions: ['users_read', 'support_tickets']
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Resumen General', icon: BarChart3 },
    { id: 'admins', label: 'Administradores', icon: UserCog },
    { id: 'system', label: 'Sistema', icon: Settings },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'database', label: 'Base de Datos', icon: Database },
    { id: 'logs', label: 'Logs del Sistema', icon: Eye }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">{metric.label}</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{metric.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' :
                    metric.trend === 'down' ? 'text-red-600' : 'text-neutral-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <metric.icon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alertas del sistema */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-red-50 border border-red-200 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">Alertas del Sistema</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div>
              <p className="font-medium text-neutral-900">Alto uso de CPU en servidor principal</p>
              <p className="text-sm text-neutral-600">Usar 85% en las últimas 2 horas</p>
            </div>
            <Button size="sm" variant="outline">Ver detalles</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div>
              <p className="font-medium text-neutral-900">Intentos de acceso sospechosos detectados</p>
              <p className="text-sm text-neutral-600">12 intentos fallidos desde IP: 192.168.1.100</p>
            </div>
            <Button size="sm" variant="outline">Investigar</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderAdmins = () => (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Gestión de Administradores</h2>
          <p className="text-neutral-600">Administra los usuarios con permisos administrativos</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Admin
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar administradores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      {/* Tabla de administradores */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left p-4 font-medium text-neutral-900">Usuario</th>
                <th className="text-left p-4 font-medium text-neutral-900">Rol</th>
                <th className="text-left p-4 font-medium text-neutral-900">Estado</th>
                <th className="text-left p-4 font-medium text-neutral-900">Último Acceso</th>
                <th className="text-left p-4 font-medium text-neutral-900">Permisos</th>
                <th className="text-left p-4 font-medium text-neutral-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {adminUsers.map((admin) => (
                <tr key={admin.id} className="hover:bg-neutral-50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-neutral-900">{admin.username}</p>
                      <p className="text-sm text-neutral-600">{admin.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      admin.role === 'supreme_admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {admin.role === 'supreme_admin' ? 'Super Admin' : 'Administrador'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      admin.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : admin.status === 'suspended'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {admin.status === 'active' ? 'Activo' :
                       admin.status === 'suspended' ? 'Suspendido' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-neutral-600">{admin.lastLogin}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions.slice(0, 2).map((perm) => (
                        <span key={perm} className="inline-flex px-2 py-1 rounded text-xs bg-neutral-100 text-neutral-600">
                          {perm}
                        </span>
                      ))}
                      {admin.permissions.length > 2 && (
                        <span className="inline-flex px-2 py-1 rounded text-xs bg-neutral-100 text-neutral-600">
                          +{admin.permissions.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Lock className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'admins':
        return renderAdmins();
      case 'system':
        return <div className="text-center py-12 text-neutral-600">Configuración del sistema en desarrollo</div>;
      case 'security':
        return <div className="text-center py-12 text-neutral-600">Panel de seguridad en desarrollo</div>;
      case 'database':
        return <div className="text-center py-12 text-neutral-600">Gestión de base de datos en desarrollo</div>;
      case 'logs':
        return <div className="text-center py-12 text-neutral-600">Logs del sistema en desarrollo</div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Panel Supremo</h1>
                <p className="text-sm text-neutral-600">Bienvenido, {user?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Ver sitio
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                API Keys
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <span>{<tab.icon className="w-4 h-4" />}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}