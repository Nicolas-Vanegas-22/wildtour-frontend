import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { MainLayout } from '../presentation/layouts/MainLayout';
import { useAuthStore } from '../application/state/useAuthStore';
import LoadingSpinner from '../presentation/components/LoadingSpinner';

// Lazy loading de componentes para mejorar el rendimiento
const Home = React.lazy(() => import('../presentation/pages/Home'));
const Login = React.lazy(() => import('../presentation/pages/Login'));
const Register = React.lazy(() => import('../presentation/pages/Register'));
const ForgotPassword = React.lazy(() => import('../presentation/pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../presentation/pages/ResetPassword'));
const Profile = React.lazy(() => import('../presentation/pages/Profile'));
const BookingFlow = React.lazy(() => import('../presentation/pages/BookingFlow'));
const PaymentPage = React.lazy(() => import('../presentation/pages/PaymentPage'));
const BookingConfirmation = React.lazy(() => import('../presentation/pages/BookingConfirmation'));
const ProviderDashboard = React.lazy(() => import('../presentation/pages/ProviderDashboard'));
const AdminDashboard = React.lazy(() => import('../presentation/pages/AdminDashboard'));
const ReviewModeration = React.lazy(() => import('../presentation/pages/ReviewModeration'));
const ReportsAnalytics = React.lazy(() => import('../presentation/pages/ReportsAnalytics'));
const Notifications = React.lazy(() => import('../presentation/pages/Notifications'));
const NotificationSettings = React.lazy(() => import('../presentation/pages/NotificationSettings'));
const AccountSettings = React.lazy(() => import('../presentation/pages/AccountSettings'));
const Booking = React.lazy(() => import('../presentation/pages/Booking'));
const VillaviejaModule = React.lazy(() => import('../presentation/pages/VillaviejaModule'));
const PaymentReturn = React.lazy(() => import('../presentation/pages/PaymentReturn'));
const MyBookings = React.lazy(() => import('../presentation/pages/MyBookings'));
const UserSettings = React.lazy(() => import('../presentation/pages/UserSettings'));
const Favorites = React.lazy(() => import('../presentation/pages/Favorites'));
const Destinations = React.lazy(() => import('../presentation/pages/Destinations'));
const DestinationDetail = React.lazy(() => import('../presentation/pages/DestinationDetail'));
const Terms = React.lazy(() => import('../presentation/pages/Terms'));
const Privacy = React.lazy(() => import('../presentation/pages/Privacy'));
const DataRights = React.lazy(() => import('../presentation/pages/DataRights'));
const PrivacyCenter = React.lazy(() => import('../presentation/pages/PrivacyCenter'));
const CookiePolicy = React.lazy(() => import('../presentation/pages/CookiePolicy'));

function PrivateRoute({ children }: { children: JSX.Element }) {
  // During development or when VITE_BYPASS_AUTH is set to 'true' we allow bypassing auth
  const bypassAuth = Boolean((import.meta as any).env?.VITE_BYPASS_AUTH === 'true' || (import.meta as any).env?.DEV);
  if (bypassAuth) return children;

  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: JSX.Element }) {
  // Allow bypass in development or when explicitly enabled
  const bypassAuth = Boolean((import.meta as any).env?.VITE_BYPASS_AUTH === 'true' || (import.meta as any).env?.DEV);
  if (bypassAuth) return children;

  const { token, user } = useAuthStore((s) => ({ token: s.token, user: s.user }));
  return token && user?.role === 'admin' ? children : <Navigate to="/login" />;
}

function ProviderRoute({ children }: { children: JSX.Element }) {
  // Allow bypass in development or when explicitly enabled
  const bypassAuth = Boolean((import.meta as any).env?.VITE_BYPASS_AUTH === 'true' || (import.meta as any).env?.DEV);
  if (bypassAuth) return children;

  const { token, user } = useAuthStore((s) => ({ token: s.token, user: s.user }));
  return token && (user?.role === 'provider' || user?.role === 'admin') ? children : <Navigate to="/login" />;
}

export function AppRouter() {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/destinos" element={<Destinations />} />
          <Route path="/destinos/:id" element={<DestinationDetail />} />
          <Route path="/villavieja" element={<VillaviejaModule />} />
          <Route path="/payment/return" element={<PaymentReturn />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/data-rights" element={<DataRights />} />
          <Route path="/privacy-center" element={<PrivacyCenter />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Rutas privadas para usuarios autenticados */}
          <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/mis-reservas" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
          <Route path="/configuracion" element={<PrivateRoute><UserSettings /></PrivateRoute>} />
          <Route path="/favoritos" element={<PrivateRoute><Favorites /></PrivateRoute>} />
          <Route path="/configuracion-cuenta" element={<PrivateRoute><AccountSettings /></PrivateRoute>} />
          <Route path="/notificaciones" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/notificaciones/configuracion" element={<PrivateRoute><NotificationSettings /></PrivateRoute>} />

          {/* Rutas de reservas */}
          <Route path="/booking/:destinationId" element={<PrivateRoute><Booking /></PrivateRoute>} />
          <Route path="/reservar/:destinationId" element={<PrivateRoute><BookingFlow /></PrivateRoute>} />
          <Route path="/pago/:bookingId" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
          <Route path="/confirmacion/:bookingId" element={<PrivateRoute><BookingConfirmation /></PrivateRoute>} />

          {/* Rutas para proveedores */}
          <Route path="/panel-proveedor" element={<ProviderRoute><ProviderDashboard /></ProviderRoute>} />

          {/* Rutas para administradores */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/moderacion" element={<AdminRoute><ReviewModeration /></AdminRoute>} />
          <Route path="/admin/reportes" element={<AdminRoute><ReportsAnalytics /></AdminRoute>} />

          {/* Ruta 404 */}
          <Route path="*" element={<div className="flex items-center justify-center min-h-screen bg-neutral-100">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-primary-700">404</h1>
              <p className="text-xl text-neutral-600 mt-4">Página no encontrada</p>
              <a href="/" className="mt-6 inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors">
                Volver al inicio
              </a>
            </div>
          </div>} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}
