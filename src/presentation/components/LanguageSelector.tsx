import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Globe, Check } from 'lucide-react';

const languages = [
  {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    nativeName: 'Español'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English'
  }
];

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'card';
  showLabel?: boolean;
}

export default function LanguageSelector({ variant = 'card', showLabel = true }: LanguageSelectorProps) {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('wildtour-language', langCode);
  };

  if (variant === 'dropdown') {
    return (
      <div className="relative inline-block">
        <select
          value={currentLanguage}
          onChange={(e) => changeLanguage(e.target.value)}
          className="appearance-none bg-white border border-neutral-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-neutral-700 hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.nativeName}
            </option>
          ))}
        </select>
        <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showLabel && (
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-neutral-800">
            {t('settings.language')}
          </h3>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {languages.map((lang) => {
          const isActive = currentLanguage === lang.code;

          return (
            <motion.button
              key={lang.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => changeLanguage(lang.code)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isActive
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-neutral-200 bg-white hover:border-primary-200 hover:bg-primary-50/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-neutral-800">{lang.nativeName}</p>
                  <p className="text-xs text-neutral-500">{lang.name}</p>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="text-xs text-neutral-500 mt-2">
        {currentLanguage === 'es'
          ? 'El idioma se aplicará en toda la aplicación'
          : 'Language will be applied throughout the application'}
      </p>
    </div>
  );
}
