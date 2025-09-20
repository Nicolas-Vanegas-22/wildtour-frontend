import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: number;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  keyboardNavigationHelp: boolean;
  focusIndicator: boolean;
  autoAnnouncements: boolean;
}

interface AccessibilityStore {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  fontSize: 100,
  soundEnabled: true,
  animationsEnabled: true,
  keyboardNavigationHelp: false,
  focusIndicator: true,
  autoAnnouncements: true,
};

export const useAccessibilityStore = create<AccessibilityStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSetting: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            [key]: value,
          },
        })),
      resetSettings: () =>
        set({
          settings: defaultSettings,
        }),
    }),
    {
      name: 'wildtour-accessibility-settings',
    }
  )
);