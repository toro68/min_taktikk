import { useState, useEffect } from 'react';
import { loadConfig, AppConfig, getConfig, getConfigValidationWarnings } from '../lib/config';

export const useAppConfig = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loadedConfig = await loadConfig();
        setConfig(loadedConfig);
        setValidationWarnings(getConfigValidationWarnings());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load configuration');
        // Fallback to default config
        setConfig(getConfig());
        setValidationWarnings(getConfigValidationWarnings());
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
    validationWarnings,
    reload: async () => {
      const newConfig = await loadConfig();
      setConfig(newConfig);
      setValidationWarnings(getConfigValidationWarnings());
    }
  };
};
