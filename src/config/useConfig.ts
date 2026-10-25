import { useEffect, useState } from 'react';
import { loadConfig, type EditableConfig } from './store';

/** يقرأ الإعدادات من التخزين المحلي ويحدّثها عند أي تعديل في لوحة التحكم */
export function useConfig(): EditableConfig {
  const [config, setConfig] = useState<EditableConfig>(() => loadConfig());

  useEffect(() => {
    const sync = () => setConfig(loadConfig());
    window.addEventListener('rayak:config-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('rayak:config-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return config;
}
