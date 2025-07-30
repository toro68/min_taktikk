import { useState, useCallback } from 'react';
import { Frame } from '../@types/elements';
import { exporter } from '../lib/exportUtils';
import { useToast } from '../providers/ToastProvider';

export const useEnhancedExportImport = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  // JSON Export
  const handleDownloadAnimation = useCallback(async (frames: Frame[]) => {
    if (!frames || frames.length === 0) {
      const errorMsg = 'Ingen frames å eksportere';
      setError(errorMsg);
      showToast({ type: 'error', title: 'Eksportfeil', message: errorMsg });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await exporter.exportAsJSON(frames);
      showToast({ 
        type: 'success', 
        title: 'Animasjon eksportert', 
        message: 'JSON-filen er lastet ned' 
      });
    } catch (error) {
      const errorMsg = 'Feil ved eksportering av animasjon';
      setError(errorMsg);
      showToast({ type: 'error', title: 'Eksportfeil', message: errorMsg });
    } finally {
      setIsProcessing(false);
    }
  }, [showToast]);

  // PNG Export
  const handleDownloadPng = useCallback(async (svgElement?: SVGSVGElement) => {
    if (!svgElement) {
      // Try to find the SVG element in the DOM
      const svg = document.querySelector('svg.pitch-svg') as SVGSVGElement;
      if (!svg) {
        const errorMsg = 'Fant ikke SVG-element å eksportere';
        setError(errorMsg);
        showToast({ type: 'error', title: 'Eksportfeil', message: errorMsg });
        return;
      }
      svgElement = svg;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await exporter.exportAsPNG(svgElement);
      showToast({ 
        type: 'success', 
        title: 'PNG eksportert', 
        message: 'Bildet er lastet ned' 
      });
    } catch (error) {
      const errorMsg = 'Feil ved PNG eksport';
      setError(errorMsg);
      showToast({ type: 'error', title: 'Eksportfeil', message: errorMsg });
    } finally {
      setIsProcessing(false);
    }
  }, [showToast]);

  // GIF Export
  const handleDownloadGif = useCallback(async (frames: Frame[], svgElement?: SVGSVGElement) => {
    if (!frames || frames.length < 2) {
      const errorMsg = 'Trenger minst 2 frames for å lage GIF';
      setError(errorMsg);
      showToast({ type: 'warning', title: 'GIF eksport', message: errorMsg });
      return;
    }

    if (!svgElement) {
      const svg = document.querySelector('svg.pitch-svg') as SVGSVGElement;
      if (!svg) {
        const errorMsg = 'Fant ikke SVG-element å eksportere';
        setError(errorMsg);
        showToast({ type: 'error', title: 'Eksportfeil', message: errorMsg });
        return;
      }
      svgElement = svg;
    }

    setIsProcessing(true);
    setError(null);

    try {
      showToast({ 
        type: 'info', 
        title: 'GIF eksport startet', 
        message: 'Dette kan ta noen sekunder...' 
      });
      
      await exporter.exportAsGIF(frames, svgElement);
      
      showToast({ 
        type: 'success', 
        title: 'GIF eksportert', 
        message: 'Animasjonen er lastet ned' 
      });
    } catch (error) {
      const errorMsg = 'Feil ved GIF eksport';
      setError(errorMsg);
      showToast({ type: 'error', title: 'Eksportfeil', message: errorMsg });
    } finally {
      setIsProcessing(false);
    }
  }, [showToast]);

  // Video Export (placeholder)
  const handleDownloadFilm = useCallback(async (frames: Frame[], svgElement?: SVGSVGElement) => {
    setIsProcessing(true);
    
    try {
      if (!svgElement) {
        const svg = document.querySelector('svg.pitch-svg') as SVGSVGElement;
        if (svg) {
          svgElement = svg;
        }
      }
      
      await exporter.exportAsVideo(frames || [], svgElement!);
    } catch (error) {
      showToast({ 
        type: 'info', 
        title: 'Video eksport', 
        message: 'Video eksport kommer snart! Bruk GIF eksport som alternativ.' 
      });
    } finally {
      setIsProcessing(false);
    }
  }, [showToast]);

  // JSON Import
  const handleLoadAnimation = useCallback((): Promise<Frame[] | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        setIsProcessing(true);
        setError(null);

        try {
          const result = await exporter.importFromJSON(file);
          showToast({ 
            type: 'success', 
            title: 'Animasjon lastet', 
            message: `${result.length} frames importert` 
          });
          resolve(result);
        } catch (error) {
          const errorMsg = (error as Error).message;
          setError(errorMsg);
          showToast({ type: 'error', title: 'Importfeil', message: errorMsg });
          resolve(null);
        } finally {
          setIsProcessing(false);
        }
      };
      input.click();
    });
  }, [showToast]);

  // Load Example Animation
  const handleLoadExampleAnimation = useCallback(async (): Promise<Frame[] | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await exporter.loadExampleAnimation();
      showToast({ 
        type: 'success', 
        title: 'Eksempel lastet', 
        message: 'Pasningsmonster-animasjon er lastet' 
      });
      return result;
    } catch (error) {
      const errorMsg = 'Kunne ikke laste eksempelanimasjon';
      setError(errorMsg);
      showToast({ type: 'warning', title: 'Eksempel', message: errorMsg });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [showToast]);

  return {
    isProcessing,
    error,
    handleDownloadAnimation,
    handleDownloadPng,
    handleDownloadGif,
    handleDownloadFilm,
    handleLoadAnimation,
    handleLoadExampleAnimation
  };
};

export type UseEnhancedExportImportReturn = ReturnType<typeof useEnhancedExportImport>;
