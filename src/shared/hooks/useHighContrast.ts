import { useEffect, useState } from 'react';
export function useHighContrast() {
  const [enabled, setEnabled] = useState(false);
  useEffect(()=>{
    const el = document.documentElement;
    if (enabled) el.classList.add('high-contrast'); else el.classList.remove('high-contrast');
  }, [enabled]);
  return { enabled, toggle: ()=>setEnabled(v=>!v) };
}
