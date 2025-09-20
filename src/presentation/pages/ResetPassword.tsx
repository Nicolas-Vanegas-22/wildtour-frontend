import { FormEvent, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { AuthRepo } from '../../infrastructure/repositories/AuthRepo';

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [params] = useSearchParams();
  const nav = useNavigate();
  const token = params.get('token') || '';

  useEffect(() => {
    if (!token) {
      nav('/login');
    }
  }, [token, nav]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await AuthRepo.resetPassword(token, formData.password);
      alert('Contraseña restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.');
      nav('/login');
    } catch (err: any) {
      alert(err.message || 'Error al restablecer contraseña. El enlace puede haber expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 mb-2">Nueva contraseña</h1>
        <p className="text-gray-600">Ingresa tu nueva contraseña para restablecer tu cuenta</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Nueva contraseña
          </label>
          <input
            id="password"
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Mínimo 8 caracteres"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            disabled={isLoading}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar nueva contraseña
          </label>
          <input
            id="confirmPassword"
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Confirma tu nueva contraseña"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            disabled={isLoading}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Guardando...' : 'Guardar nueva contraseña'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
