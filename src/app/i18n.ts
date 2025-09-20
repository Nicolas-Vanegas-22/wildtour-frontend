import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: { translation: {
    app: { title: 'WildTour Colombia', search: 'Buscar', login: 'Iniciar sesión', logout: 'Cerrar sesión' },
    home: { hero: 'Explora experiencias únicas' },
    filters: { region: 'Región', type: 'Tipo', budget: 'Presupuesto', rating: 'Calificación' }
  }},
  en: { translation: {
    app: { title: 'WildTour Colombia', search: 'Search', login: 'Sign in', logout: 'Sign out' },
    home: { hero: 'Explore unique experiences' },
    filters: { region: 'Region', type: 'Type', budget: 'Budget', rating: 'Rating' }
  }},
};

i18n.use(initReactI18next).init({ resources, lng: 'es', fallbackLng: 'es', interpolation: { escapeValue: false } });
export default i18n;
