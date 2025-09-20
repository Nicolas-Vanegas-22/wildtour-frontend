import React, { useState } from 'react';
import { Home, Search, Calendar, User, Menu, X, Bell } from 'lucide-react';
import { useIsMobile, useHapticFeedback } from '../../hooks/useMobile';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

interface MobileNavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  notificationCount?: number;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentPath,
  onNavigate,
  notificationCount = 0
}) => {
  const { isMobile } = useIsMobile();
  const { lightTap } = useHapticFeedback();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainNavItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Inicio',
      icon: <Home className="w-6 h-6" />,
      path: '/'
    },
    {
      id: 'search',
      label: 'Buscar',
      icon: <Search className="w-6 h-6" />,
      path: '/destinos'
    },
    {
      id: 'bookings',
      label: 'Reservas',
      icon: <Calendar className="w-6 h-6" />,
      path: '/mis-reservas'
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: <User className="w-6 h-6" />,
      path: '/perfil'
    }
  ];

  const menuItems: NavigationItem[] = [
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: <Bell className="w-6 h-6" />,
      path: '/notificaciones',
      badge: notificationCount
    },
    {
      id: 'favorites',
      label: 'Favoritos',
      icon: <Search className="w-6 h-6" />,
      path: '/favoritos'
    },
    {
      id: 'help',
      label: 'Ayuda',
      icon: <Menu className="w-6 h-6" />,
      path: '/ayuda'
    }
  ];

  const handleNavigation = (path: string) => {
    lightTap();
    onNavigate(path);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    lightTap();
    setIsMenuOpen(!isMenuOpen);
  };

  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-[60px] rounded-lg transition-colors ${
                currentPath === item.path
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 active:bg-gray-100'
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          ))}

          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            className={`flex flex-col items-center justify-center py-2 px-3 min-w-[60px] rounded-lg transition-colors ${
              isMenuOpen
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 active:bg-gray-100'
            }`}
            aria-label="Menú"
          >
            <div className="relative">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              {notificationCount > 0 && !isMenuOpen && (
                <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">Menú</span>
          </button>
        </div>
      </nav>

      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-white shadow-xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 safe-area-top">
              <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                aria-label="Cerrar menú"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="py-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 ${
                    currentPath === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="min-w-[24px] h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 safe-area-bottom">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">WildTour v1.0.0</p>
                <button
                  onClick={() => handleNavigation('/configuracion')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Configuración
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Safe area spacer for content */}
      <div className="h-20 safe-area-bottom" />
    </>
  );
};

export default MobileNavigation;