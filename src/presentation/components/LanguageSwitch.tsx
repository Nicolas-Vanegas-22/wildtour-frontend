import { useTranslation } from 'react-i18next';
export default function LanguageSwitch() {
  const { i18n } = useTranslation();
  return (
    <select className="border rounded px-2 py-1" value={i18n.language} onChange={(e)=>i18n.changeLanguage(e.target.value)} aria-label="Cambiar idioma">
      <option value="es">ES</option>
      <option value="en">EN</option>
    </select>
  );
}
