import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ConsentType =
  | 'essential'
  | 'functional'
  | 'analytics'
  | 'marketing'
  | 'social_media'
  | 'data_processing'
  | 'third_party_sharing';

export interface ConsentRecord {
  id: string;
  type: ConsentType;
  granted: boolean;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  version: string; // Versión de la política al momento del consentimiento
  source: 'banner' | 'form' | 'settings' | 'registration';
  expiry?: string; // Fecha de expiración del consentimiento
}

export interface ConsentPreferences {
  essential: boolean; // Siempre true, no se puede desactivar
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  social_media: boolean;
  data_processing: boolean;
  third_party_sharing: boolean;
}

interface ConsentState {
  // Estado de consentimientos
  preferences: ConsentPreferences;
  consentRecords: ConsentRecord[];
  hasShownBanner: boolean;
  lastUpdated: string | null;
  policyVersion: string;

  // Estado de UI
  showBanner: boolean;
  showModal: boolean;
  modalType: 'full' | 'preferences' | 'details';

  // Información del usuario para auditoría
  userContext: {
    ipAddress?: string;
    userAgent?: string;
    userId?: string;
  };
}

interface ConsentActions {
  // Gestión de consentimientos
  grantConsent: (type: ConsentType, source?: ConsentRecord['source']) => void;
  revokeConsent: (type: ConsentType, source?: ConsentRecord['source']) => void;
  updatePreferences: (preferences: Partial<ConsentPreferences>, source?: ConsentRecord['source']) => void;
  acceptAll: (source?: ConsentRecord['source']) => void;
  rejectNonEssential: (source?: ConsentRecord['source']) => void;

  // Control de UI
  showConsentBanner: () => void;
  hideConsentBanner: () => void;
  showConsentModal: (type?: ConsentState['modalType']) => void;
  hideConsentModal: () => void;

  // Gestión de registros
  getConsentHistory: (type?: ConsentType) => ConsentRecord[];
  hasValidConsent: (type: ConsentType) => boolean;
  isConsentExpired: (type: ConsentType) => boolean;

  // Utilidades
  setUserContext: (context: Partial<ConsentState['userContext']>) => void;
  updatePolicyVersion: (version: string) => void;
  clearAllConsents: () => void;
  exportConsentData: () => string;

  // Cumplimiento Ley 1581/2012
  getConsentProof: (type: ConsentType) => ConsentRecord | null;
  revokeAllConsents: () => void;
  scheduleConsentReview: (type: ConsentType, reviewDate: string) => void;
}

type ConsentStore = ConsentState & ConsentActions;

const CURRENT_POLICY_VERSION = '1.0.0';
const CONSENT_EXPIRY_MONTHS = 12; // Los consentimientos expiran en 12 meses

const defaultPreferences: ConsentPreferences = {
  essential: true, // Siempre activo por defecto
  functional: false,
  analytics: false,
  marketing: false,
  social_media: false,
  data_processing: false,
  third_party_sharing: false,
};

export const useConsentStore = create<ConsentStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      preferences: defaultPreferences,
      consentRecords: [],
      hasShownBanner: false,
      lastUpdated: null,
      policyVersion: CURRENT_POLICY_VERSION,
      showBanner: false,
      showModal: false,
      modalType: 'full',
      userContext: {},

      // Acciones de consentimiento
      grantConsent: (type: ConsentType, source = 'settings') => {
        const state = get();
        const now = new Date().toISOString();
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + CONSENT_EXPIRY_MONTHS);

        const consentRecord: ConsentRecord = {
          id: `${type}_${now}_${Math.random().toString(36).substr(2, 9)}`,
          type,
          granted: true,
          timestamp: now,
          ipAddress: state.userContext.ipAddress,
          userAgent: state.userContext.userAgent,
          version: state.policyVersion,
          source,
          expiry: expiryDate.toISOString(),
        };

        set({
          preferences: {
            ...state.preferences,
            [type]: true,
          },
          consentRecords: [...state.consentRecords, consentRecord],
          lastUpdated: now,
        });
      },

      revokeConsent: (type: ConsentType, source = 'settings') => {
        if (type === 'essential') {
          console.warn('No se puede revocar el consentimiento esencial');
          return;
        }

        const state = get();
        const now = new Date().toISOString();

        const revocationRecord: ConsentRecord = {
          id: `${type}_revoke_${now}_${Math.random().toString(36).substr(2, 9)}`,
          type,
          granted: false,
          timestamp: now,
          ipAddress: state.userContext.ipAddress,
          userAgent: state.userContext.userAgent,
          version: state.policyVersion,
          source,
        };

        set({
          preferences: {
            ...state.preferences,
            [type]: false,
          },
          consentRecords: [...state.consentRecords, revocationRecord],
          lastUpdated: now,
        });
      },

      updatePreferences: (newPreferences: Partial<ConsentPreferences>, source = 'settings') => {
        const state = get();
        const now = new Date().toISOString();

        // Crear registros para cada cambio
        const newRecords: ConsentRecord[] = [];

        Object.entries(newPreferences).forEach(([key, value]) => {
          if (key === 'essential') return; // No se puede cambiar

          const type = key as ConsentType;
          const currentValue = state.preferences[type];

          if (currentValue !== value) {
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + CONSENT_EXPIRY_MONTHS);

            newRecords.push({
              id: `${type}_${now}_${Math.random().toString(36).substr(2, 9)}`,
              type,
              granted: value,
              timestamp: now,
              ipAddress: state.userContext.ipAddress,
              userAgent: state.userContext.userAgent,
              version: state.policyVersion,
              source,
              expiry: value ? expiryDate.toISOString() : undefined,
            });
          }
        });

        set({
          preferences: {
            ...state.preferences,
            ...newPreferences,
            essential: true, // Siempre forzar esencial a true
          },
          consentRecords: [...state.consentRecords, ...newRecords],
          lastUpdated: now,
        });
      },

      acceptAll: (source = 'banner') => {
        const state = get();
        const allAccepted: ConsentPreferences = {
          essential: true,
          functional: true,
          analytics: true,
          marketing: true,
          social_media: true,
          data_processing: true,
          third_party_sharing: true,
        };

        state.updatePreferences(allAccepted, source);
        state.hideConsentBanner();
      },

      rejectNonEssential: (source = 'banner') => {
        const state = get();
        const onlyEssential: ConsentPreferences = {
          essential: true,
          functional: false,
          analytics: false,
          marketing: false,
          social_media: false,
          data_processing: false,
          third_party_sharing: false,
        };

        state.updatePreferences(onlyEssential, source);
        state.hideConsentBanner();
      },

      // Control de UI
      showConsentBanner: () => {
        set({ showBanner: true, hasShownBanner: true });
      },

      hideConsentBanner: () => {
        set({ showBanner: false });
      },

      showConsentModal: (type = 'full') => {
        set({ showModal: true, modalType: type });
      },

      hideConsentModal: () => {
        set({ showModal: false });
      },

      // Gestión de registros
      getConsentHistory: (type?: ConsentType) => {
        const state = get();
        if (type) {
          return state.consentRecords.filter(record => record.type === type);
        }
        return state.consentRecords;
      },

      hasValidConsent: (type: ConsentType) => {
        const state = get();
        if (type === 'essential') return true;

        const latestRecord = state.consentRecords
          .filter(record => record.type === type)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        if (!latestRecord || !latestRecord.granted) return false;

        // Verificar si no ha expirado
        if (latestRecord.expiry && new Date(latestRecord.expiry) < new Date()) {
          return false;
        }

        return true;
      },

      isConsentExpired: (type: ConsentType) => {
        const state = get();
        const latestRecord = state.consentRecords
          .filter(record => record.type === type && record.granted)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        if (!latestRecord || !latestRecord.expiry) return false;

        return new Date(latestRecord.expiry) < new Date();
      },

      // Utilidades
      setUserContext: (context: Partial<ConsentState['userContext']>) => {
        const state = get();
        set({
          userContext: {
            ...state.userContext,
            ...context,
          },
        });
      },

      updatePolicyVersion: (version: string) => {
        set({ policyVersion: version });
      },

      clearAllConsents: () => {
        set({
          preferences: defaultPreferences,
          consentRecords: [],
          lastUpdated: null,
          hasShownBanner: false,
        });
      },

      exportConsentData: () => {
        const state = get();
        const exportData = {
          preferences: state.preferences,
          consentRecords: state.consentRecords,
          lastUpdated: state.lastUpdated,
          policyVersion: state.policyVersion,
          exportDate: new Date().toISOString(),
        };

        return JSON.stringify(exportData, null, 2);
      },

      // Cumplimiento Ley 1581/2012
      getConsentProof: (type: ConsentType) => {
        const state = get();
        return state.consentRecords
          .filter(record => record.type === type && record.granted)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] || null;
      },

      revokeAllConsents: () => {
        const state = get();
        const now = new Date().toISOString();

        // Crear registros de revocación para todos los consentimientos excepto esencial
        const revocationRecords: ConsentRecord[] = [];

        Object.keys(state.preferences).forEach(key => {
          if (key !== 'essential') {
            const type = key as ConsentType;
            revocationRecords.push({
              id: `${type}_revoke_all_${now}_${Math.random().toString(36).substr(2, 9)}`,
              type,
              granted: false,
              timestamp: now,
              ipAddress: state.userContext.ipAddress,
              userAgent: state.userContext.userAgent,
              version: state.policyVersion,
              source: 'settings',
            });
          }
        });

        set({
          preferences: defaultPreferences,
          consentRecords: [...state.consentRecords, ...revocationRecords],
          lastUpdated: now,
        });
      },

      scheduleConsentReview: (type: ConsentType, reviewDate: string) => {
        // Esta función se puede usar para programar revisiones de consentimiento
        // Por ahora, solo registramos la fecha en localStorage
        localStorage.setItem(`wildtour_consent_review_${type}`, reviewDate);
      },
    }),
    {
      name: 'wildtour-consent',
      partialize: (state) => ({
        preferences: state.preferences,
        consentRecords: state.consentRecords,
        hasShownBanner: state.hasShownBanner,
        lastUpdated: state.lastUpdated,
        policyVersion: state.policyVersion,
        userContext: state.userContext,
      }),
    }
  )
);

// Hook para verificar si se necesita mostrar el banner
export const useShouldShowConsentBanner = () => {
  const { hasShownBanner, policyVersion, lastUpdated, showBanner } = useConsentStore();

  // Mostrar banner si:
  // 1. Nunca se ha mostrado
  // 2. La versión de la política ha cambiado
  // 3. No hay consentimientos válidos
  // 4. Ha pasado mucho tiempo desde la última actualización

  const shouldShow = !hasShownBanner ||
    policyVersion !== CURRENT_POLICY_VERSION ||
    !lastUpdated ||
    showBanner;

  return shouldShow;
};

// Hook para obtener consentimientos específicos
export const useConsentStatus = (type: ConsentType) => {
  const { preferences, hasValidConsent, isConsentExpired } = useConsentStore();

  return {
    granted: preferences[type],
    valid: hasValidConsent(type),
    expired: isConsentExpired(type),
  };
};