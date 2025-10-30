import { FormEvent, useState, useEffect } from 'react';
import { useAuthStore } from '../../application/state/useAuthStore';
import { AuthRepo } from '../../infrastructure/repositories/AuthRepo';
import DeleteAccountModal from '../components/DeleteAccountModal';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  userType: 'tourist' | 'provider';
  profilePhoto?: string;
  phone?: string;
  preferences?: {
    travelStyle: string[];
    budget: 'low' | 'medium' | 'high';
    language: 'es' | 'en';
  };
}

export default function Profile() {
  const { user, setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    travelStyle: [] as string[],
    budget: 'medium' as 'low' | 'medium' | 'high',
    language: 'es' as 'es' | 'en'
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await AuthRepo.getProfile();
      setProfile(profileData);
      setFormData({
        name: profileData.name || '',
        phone: profileData.phone || '',
        travelStyle: profileData.preferences?.travelStyle || [],
        budget: profileData.preferences?.budget || 'medium',
        language: profileData.preferences?.language || 'es'
      });
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedProfile = await AuthRepo.updateProfile({
        ...formData,
        preferences: {
          travelStyle: formData.travelStyle,
          budget: formData.budget,
          language: formData.language
        }
      });

      setProfile(updatedProfile);
      setIsEditing(false);
      alert('Perfil actualizado exitosamente');
    } catch (err: any) {
      alert(err.message || 'Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTravelStyleChange = (style: string) => {
    setFormData(prev => ({
      ...prev,
      travelStyle: prev.travelStyle.includes(style)
        ? prev.travelStyle.filter(s => s !== style)
        : [...prev.travelStyle, style]
    }));
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const updatedProfile = await AuthRepo.uploadProfilePhoto(formData);
      setProfile(updatedProfile);
    } catch (err: any) {
      alert(err.message || 'Error al subir foto');
    }
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      await AuthRepo.deleteAccount();
      useAuthStore.getState().logout();
      setShowDeleteModal(false);
      navigate('/');
    } catch (err: any) {
      alert(err.message || 'Error al eliminar cuenta');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 px-4 sm:px-6 py-6 sm:py-8 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
            <div className="relative">
              <img
                src={profile.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=128`}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/20"
              />
              <label className="absolute bottom-0 right-0 bg-white text-green-600 rounded-full p-1.5 sm:p-2 cursor-pointer hover:bg-gray-100">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
                />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold">{profile.name}</h1>
              <p className="text-white/80 text-sm sm:text-base break-all sm:break-normal">{profile.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs sm:text-sm">
                {profile.userType === 'tourist' ? 'Turista' : 'Proveedor de servicios'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Información personal</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Teléfono:</span> {profile.phone || 'No especificado'}</p>
                    <p><span className="font-medium">Idioma:</span> {profile.preferences?.language === 'es' ? 'Español' : 'English'}</p>
                  </div>
                </div>

                {profile.userType === 'tourist' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Preferencias de viaje</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Presupuesto:</span>
                        {profile.preferences?.budget === 'low' ? 'Económico' :
                         profile.preferences?.budget === 'medium' ? 'Medio' : 'Alto'}
                      </p>
                      <div>
                        <span className="font-medium">Estilos de viaje:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {profile.preferences?.travelStyle?.map(style => (
                            <span key={style} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {style}
                            </span>
                          )) || <span className="text-gray-500">No especificado</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Editar perfil
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar cuenta
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value as 'es' | 'en'})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {profile.userType === 'tourist' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Presupuesto preferido</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value as 'low' | 'medium' | 'high'})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="low">Económico</option>
                      <option value="medium">Medio</option>
                      <option value="high">Alto</option>
                    </select>
                  </div>
                )}
              </div>

              {profile.userType === 'tourist' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estilos de viaje (selecciona los que te interesen)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Aventura', 'Cultura', 'Naturaleza', 'Gastronomía', 'Historia', 'Relax', 'Deportes', 'Fotografía'].map(style => (
                      <label key={style} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.travelStyle.includes(style)}
                          onChange={() => handleTravelStyleChange(style)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full sm:w-auto px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deleteAccount}
        isLoading={isDeleting}
      />
    </div>
  );
}