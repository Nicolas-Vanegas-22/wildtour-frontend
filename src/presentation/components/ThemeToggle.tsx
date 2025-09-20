import { useHighContrast } from '../../shared/hooks/useHighContrast';
export default function ThemeToggle() {
  const { enabled, toggle } = useHighContrast();
  return (
    <button className="border rounded px-2 py-1" onClick={toggle} aria-pressed={enabled} aria-label="Alto contraste">
      {enabled ? 'Normal' : 'Alto contraste'}
    </button>
  );
}
