import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Shield, Bell, Globe, Palette, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LanguageSelector from '../components/LanguageSelector';

export default function Settings() {
  const { t } = useTranslation();

  const settingsSections = [
    {
      title: t('settings.general'),
      icon: User,
      items: [
        {
          label: t('user.profile'),
          description: 'Gestiona tu información personal',
          link: '/perfil',
          icon: User
        }
      ]
    },
    {
      title: t('settings.privacy'),
      icon: Shield,
      items: [
        {
          label: 'Centro de Privacidad',
          description: 'Controla tus datos y preferencias de privacidad',
          link: '/privacy-center',
          icon: Shield
        }
      ]
    },
    {
      title: t('settings.notifications'),
      icon: Bell,
      items: [
        {
          label: 'Preferencias de Notificaciones',
          description: 'Configura cómo y cuándo recibir notificaciones',
          link: '/notificaciones',
          icon: Bell
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              {t('settings.title')}
            </h1>
          </div>
          <p className="text-neutral-600">
            {t('settings.subtitle')}
          </p>
        </motion.div>

        {/* Selector de Idioma - Destacado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-6 mb-6"
        >
          <LanguageSelector variant="card" showLabel={true} />
        </motion.div>

        {/* Secciones de Configuración */}
        <div className="space-y-4">
          {settingsSections.map((section, sectionIndex) => {
            const SectionIcon = section.icon;

            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + sectionIndex * 0.1 }}
                className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 overflow-hidden"
              >
                {/* Section Header */}
                <div className="bg-gradient-to-r from-neutral-50 to-neutral-100/50 px-6 py-4 border-b border-neutral-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <SectionIcon className="w-4 h-4 text-primary-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-neutral-800">
                      {section.title}
                    </h2>
                  </div>
                </div>

                {/* Section Items */}
                <div className="divide-y divide-neutral-100">
                  {section.items.map((item) => {
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.label}
                        to={item.link}
                        className="flex items-center gap-4 p-6 hover:bg-primary-50/30 transition-all group"
                      >
                        <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                          <ItemIcon className="w-5 h-5 text-neutral-600 group-hover:text-primary-600 transition-colors" />
                        </div>

                        <div className="flex-1">
                          <p className="font-medium text-neutral-800 group-hover:text-primary-700 transition-colors">
                            {item.label}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {item.description}
                          </p>
                        </div>

                        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Información Adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-neutral-500">
            {t('app.title')} {t('app.subtitle')} • Versión 1.0.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}
