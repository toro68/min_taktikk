import { useState, useEffect } from 'react';
import { loadConfig, AppConfig, getConfig } from '../lib/config';

export const useAppConfig = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loadedConfig = await loadConfig();
        setConfig(loadedConfig);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load configuration');
        // Fallback to default config
        setConfig(getConfig());
      } finally {
        setIsLoading(false);
      }
    };

    loadConfiguration();
  }, []);

  return {
    config,
    isLoading,
    error,
    reload: async () => {
      const newConfig = await loadConfig();
      setConfig(newConfig);
    }
  };
};
