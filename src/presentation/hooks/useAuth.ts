import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../application/state/useAuthStore';
import authRepository, {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest
} from '../../infrastructure/repositories/AuthRepository';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    setAuth,
    logout: logoutStore,
    updateUser,
    setLoading,
    setFromStorage
  } = useAuthStore();

  // Verificar token al cargar la app
  const { data: verifiedUser, isLoading: isVerifying } = useQuery({
    queryKey: ['auth', 'verify'],
    queryFn: authRepository.verifyToken,
    enabled: !!token && !user,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authRepository.login,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success(`¡Bienvenido, ${data.user.person?.firstName || data.user.username}!`);

      // Redirigir según el rol
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else if (data.user.role === 'provider') {
        navigate('/panel-proveedor');
      } else {
        navigate('/');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al iniciar sesión');
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authRepository.register,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success(data.message || '¡Registro exitoso!');
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al registrar usuario');
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authRepository.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      toast.success('Sesión cerrada correctamente');
      navigate('/');
    },
    onError: () => {
      // Realizar logout local aunque falle el servidor
      logoutStore();
      queryClient.clear();
      navigate('/');
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: authRepository.forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Correo de recuperación enviado');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al enviar correo de recuperación');
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: authRepository.resetPassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Contraseña restablecida correctamente');
      navigate('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al restablecer contraseña');
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: authRepository.changePassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Contraseña cambiada correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al cambiar contraseña');
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authRepository.updateProfile,
    onSuccess: (data) => {
      updateUser(data);
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      toast.success('Perfil actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar perfil');
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: authRepository.verifyEmail,
    onSuccess: (data) => {
      if (user) {
        updateUser({ isVerified: true });
      }
      toast.success(data.message || 'Email verificado correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al verificar email');
    },
  });

  // Resend verification mutation
  const resendVerificationMutation = useMutation({
    mutationFn: authRepository.resendVerificationEmail,
    onSuccess: (data) => {
      toast.success(data.message || 'Correo de verificación reenviado');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al reenviar verificación');
    },
  });

  // Funciones de conveniencia
  const login = (credentials: LoginRequest) => {
    loginMutation.mutate(credentials);
  };

  const register = (userData: RegisterRequest) => {
    registerMutation.mutate(userData);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const forgotPassword = (request: ForgotPasswordRequest) => {
    forgotPasswordMutation.mutate(request);
  };

  const resetPassword = (request: ResetPasswordRequest) => {
    resetPasswordMutation.mutate(request);
  };

  const changePassword = (request: ChangePasswordRequest) => {
    changePasswordMutation.mutate(request);
  };

  const updateProfile = (request: UpdateProfileRequest) => {
    updateProfileMutation.mutate(request);
  };

  const verifyEmail = (token: string) => {
    verifyEmailMutation.mutate(token);
  };

  const resendVerification = () => {
    resendVerificationMutation.mutate();
  };

  // Inicializar desde storage si es necesario
  const initializeAuth = () => {
    if (!isAuthenticated && !token) {
      setFromStorage();
    }
  };

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || isVerifying,

    // Funciones
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    verifyEmail,
    resendVerification,
    initializeAuth,

    // Estados de loading individuales
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
    isChangePasswordLoading: changePasswordMutation.isPending,
    isUpdateProfileLoading: updateProfileMutation.isPending,
    isVerifyEmailLoading: verifyEmailMutation.isPending,
    isResendVerificationLoading: resendVerificationMutation.isPending,

    // Errores
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    changePasswordError: changePasswordMutation.error,
    updateProfileError: updateProfileMutation.error,
    verifyEmailError: verifyEmailMutation.error,
    resendVerificationError: resendVerificationMutation.error,
  };
};