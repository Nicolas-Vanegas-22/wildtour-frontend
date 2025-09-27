import React, { useState, useEffect, useRef } from 'react';
import { Shield, Smartphone, Mail, Key, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useSecureAuth } from '../hooks/useSecurity';

interface TwoFactorAuthProps {
  isOpen: boolean;
  onSuccess: (token: string) => void;
  onCancel: () => void;
  userEmail?: string;
  method?: 'sms' | 'email' | 'app';
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  userEmail = '',
  method = 'email'
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutos
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { checkSessionValidity } = useSecureAuth();

  useEffect(() => {
    if (isOpen) {
      // Enfocar primer input
      inputRefs.current[0]?.focus();
      // Iniciar temporizador
      startTimer();
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const startTimer = () => {
    setTimeRemaining(300);
    setCanResend(false);
  };

  const handleCodeChange = (index: number, value: string) => {
    // Solo permitir números
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Mover al siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verificar cuando se complete el código
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      verifyCode(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Mover al input anterior si el actual está vacío
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);

    if (digits.length === 6) {
      const newCode = digits.split('');
      setCode(newCode);
      verifyCode(digits);
    }
  };

  const verifyCode = async (codeToVerify: string) => {
    setIsVerifying(true);
    setError('');

    try {
      // Verificar validez de la sesión
      if (!checkSessionValidity()) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }

      // Simular verificación con el backend
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('wildtour-token')}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          code: codeToVerify,
          email: userEmail,
          method
        }),
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error('Código de verificación inválido');
      }

      const data = await response.json();

      // Generar token de sesión completa
      const sessionToken = data.sessionToken || generateSessionToken();

      onSuccess(sessionToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de verificación');
      // Limpiar código en caso de error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const generateSessionToken = (): string => {
    // En un entorno real, esto vendría del servidor
    const payload = {
      email: userEmail,
      verified: true,
      timestamp: Date.now(),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
    };

    return btoa(JSON.stringify(payload));
  };

  const resendCode = async () => {
    if (!canResend) return;

    try {
      await fetch('/api/auth/resend-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('wildtour-token')}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          email: userEmail,
          method
        }),
        credentials: 'same-origin'
      });

      startTimer();
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError('Error al reenviar el código');
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getMethodIcon = () => {
    switch (method) {
      case 'sms':
        return <Smartphone className="w-6 h-6 text-primary-600" />;
      case 'email':
        return <Mail className="w-6 h-6 text-primary-600" />;
      case 'app':
        return <Key className="w-6 h-6 text-primary-600" />;
      default:
        return <Shield className="w-6 h-6 text-primary-600" />;
    }
  };

  const getMethodDescription = () => {
    switch (method) {
      case 'sms':
        return `Hemos enviado un código de 6 dígitos a tu número de teléfono registrado.`;
      case 'email':
        return `Hemos enviado un código de 6 dígitos a ${userEmail}.`;
      case 'app':
        return 'Ingresa el código de 6 dígitos de tu aplicación autenticadora.';
      default:
        return 'Ingresa el código de verificación de 6 dígitos.';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="2fa-title"
    >
      <div className="bg-neutral-100 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            {getMethodIcon()}
            <h2 id="2fa-title" className="text-xl font-semibold text-primary-700">
              Verificación en Dos Pasos
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            aria-label="Cerrar verificación"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Descripción */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-neutral-600 text-sm">
              {getMethodDescription()}
            </p>
          </div>

          {/* Campos de código */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-3 text-center">
              Código de Verificación
            </label>
            <div className="flex justify-center space-x-3" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleCodeChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-secondary-500' : 'border-neutral-300'
                  } ${digit ? 'bg-blue-50 border-blue-500' : ''}`}
                  disabled={isVerifying}
                  aria-label={`Dígito ${index + 1} del código de verificación`}
                />
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-secondary-500 mr-2 flex-shrink-0" />
              <span className="text-secondary-700 text-sm">{error}</span>
            </div>
          )}

          {/* Estado de verificación */}
          {isVerifying && (
            <div className="mb-4 p-3 bg-blue-50 border border-primary-200 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-blue-500 mr-2 animate-spin" />
              <span className="text-primary-700 text-sm">Verificando código...</span>
            </div>
          )}

          {/* Temporizador y reenvío */}
          <div className="text-center">
            {timeRemaining > 0 ? (
              <p className="text-sm text-neutral-600">
                El código expira en <span className="font-semibold">{formatTime(timeRemaining)}</span>
              </p>
            ) : (
              <div>
                <p className="text-sm text-secondary-600 mb-2">El código ha expirado</p>
                {canResend && (
                  <button
                    onClick={resendCode}
                    className="text-primary-600 hover:text-blue-800 text-sm font-medium focus:outline-none focus:underline"
                  >
                    Reenviar código
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-center text-sm text-neutral-500">
            <Shield className="w-4 h-4 mr-2" />
            <span>Tu cuenta está protegida con verificación en dos pasos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;