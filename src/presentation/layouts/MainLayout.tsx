import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mountain,
  User,
  Menu,
  X,
  MapPin,
  Calendar,
  Heart,
  Bell,
  Settings,
  LogOut,
  Home,
} from 'lucide-react';
import { useAuthStore } from '../../application/state/useAuthStore';
import { Button } from '../../shared/ui/Button';
import { cn } from '../../shared/utils/cn';
import ConsentBanner from '../../compliance/components/ConsentBanner';
import ConsentModal from '../../compliance/components/ConsentModal';
import { AuditProvider } from '../../compliance/components/AuditProvider';
import { SecurityMonitor } from '../../compliance/components/SecurityMonitor';
import LogoutModal from '../components/LogoutModal';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user, logout, showLogoutModal, setShowLogoutModal } = useAuthStore();
  const location = useLocation();

  // Navegación principal
  const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Villavieja', href: '/villavieja', icon: Mountain },
  ];

  // Detectar scroll para cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setIsMobileMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isHomePage = location.pathname === '/';

  return (
    <AuditProvider>
      <div className="min-h-screen">
        {/* Header/Navbar */}
        <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled || !isHomePage
            ? 'bg-neutral-100/95 backdrop-blur-lg shadow-soft border-b border-neutral-200'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Mountain className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full animate-pulse" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">
                    Wild Tour
                  </h1>
                  <p className={cn(
                    'text-xs font-medium -mt-1',
                    isScrolled || !isHomePage ? 'text-neutral-600' : 'text-white/80'
                  )}>
                    Colombia
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Navegación Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                      isActive
                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                        : isScrolled || !isHomePage
                        ? 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                        : 'text-white/90 hover:text-white hover:bg-neutral-100/10'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-primary-100 rounded-xl -z-10"
                        layoutId="activeTab"
                        initial={false}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Acciones de usuario */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* Botón de favoritos */}
                  <Link to="/favoritos">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'p-2 rounded-xl transition-colors',
                        isScrolled || !isHomePage
                          ? 'text-neutral-600 hover:text-secondary-500 hover:bg-secondary-50'
                          : 'text-white/80 hover:text-white hover:bg-neutral-100/10'
                      )}
                    >
                      <Heart className="w-5 h-5" />
                    </motion.button>
                  </Link>

                  {/* Botón de notificaciones */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'relative p-2 rounded-xl transition-colors',
                      isScrolled || !isHomePage
                        ? 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                        : 'text-white/80 hover:text-white hover:bg-neutral-100/10'
                    )}
                  >
                    <Bell className="w-5 h-5" />
                    <div className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full" />
                  </motion.button>

                  {/* Menú de usuario */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUserMenu(!showUserMenu);
                      }}
                      className="flex items-center space-x-2 p-2 rounded-xl transition-colors hover:bg-primary-50"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                          <img
                            src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5116${user.avatar}`}
                            alt={user?.username || 'Usuario'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className={cn(
                        'hidden sm:block text-sm font-medium',
                        isScrolled || !isHomePage ? 'text-neutral-700' : 'text-white'
                      )}>
                        {user?.username?.split(' ')[0] || user?.person?.firstName || 'Usuario'}
                      </span>
                    </motion.button>

                    {/* Dropdown del usuario */}
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-neutral-100 rounded-2xl shadow-strong border border-neutral-200 py-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-4 py-3 border-b border-neutral-200">
                          <p className="text-sm font-medium text-primary-700">{user?.username || user?.person?.firstName || 'Usuario'}</p>
                          <p className="text-xs text-neutral-600">{user?.email}</p>
                        </div>

                        <div className="py-2">
                          <Link
                            to="/perfil"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span>Mi Perfil</span>
                          </Link>
                          <Link
                            to="/mis-reservas"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Mis Reservas</span>
                          </Link>
                          <Link
                            to="/configuracion"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Configuración</span>
                          </Link>
                        </div>

                        <div className="border-t border-neutral-200 py-2">
                          <button
                            type="button"
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                            }}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-secondary-600 hover:bg-secondary-50 transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Cerrar Sesión</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className={cn(
                      isScrolled || !isHomePage
                        ? 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                        : 'text-white hover:bg-neutral-100/10'
                    )}
                  >
                    <Link to="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button
                    variant={isScrolled || !isHomePage ? "primary" : "secondary"}
                    size="sm"
                    asChild
                  >
                    <Link to="/registro">Registrarse</Link>
                  </Button>
                </div>
              )}

              {/* Botón de menú móvil */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className={cn(
                  'lg:hidden p-2 rounded-xl transition-colors',
                  isScrolled || !isHomePage
                    ? 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                    : 'text-white hover:bg-neutral-100/10'
                )}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-neutral-100 border-t border-neutral-200"
          >
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {!isAuthenticated && (
                <div className="pt-4 border-t border-neutral-200 space-y-2">
                  <Button variant="outline" fullWidth asChild>
                    <Link to="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button variant="primary" fullWidth asChild>
                    <Link to="/registro">Registrarse</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </header>

      {/* Contenido principal */}
      <main className={cn(isHomePage ? 'pt-0' : 'pt-16 lg:pt-20')}>
        {children}
      </main>

        {/* Banner de consentimientos */}
        <ConsentBanner />

        {/* Modal de consentimientos */}
        <ConsentModal />

        {/* Monitor de seguridad */}
        <SecurityMonitor />

        {/* Modal de cierre de sesión */}
        <LogoutModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
        />
      </div>
    </AuditProvider>
  );
}

