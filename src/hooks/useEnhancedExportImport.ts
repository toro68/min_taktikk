import { useState, useCallback } from 'react';
import { Frame } from '../@types/elements';
import { exporter } from '../lib/exportUtils';
import { useToast } from '../providers/ToastProvider';
import { getExportPresets } from '../lib/config';

export const useEnhancedExportImport = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [mp4Progress, setMp4Progress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const exportPresets = getExportPresets();

  // JSON Export
  const handleDownloadAnimation = useCallback(async (frames: Frame[]) => {
    if (!frames || frames.length === 0) {
      const errorMsg = 'Ingen frames å eksportere';
      setError(errorMsg);
      showToast({ type: 'error', title: 'Eksportfeil', message: errorMsg });
      return;
    }

    setIsProcessing(true);
    setActiveOperation('downloadAnimation');
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
      setActiveOperation(null);
      setIsProcessing(false);
    }
  }, [showToast, exportPresets]);

  // SVG Export
  const handleDownloadSvg = useCallback(async (svgElement?: SVGSVGElement) => {
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
    setActiveOperation('downloadSvg');
    setError(null);

    try {
      await exporter.exportAsSVG(svgElement);
      showToast({
        type: 'success',
        title: 'SVG eksportert',
        message: 'SVG-filen er lastet ned'
      });
    } catch (error) {
      const errorMsg = 'Feil ved SVG eksport';
      setError(errorMsg);
      showToast({ type: 'error', title: 'Eksportfeil', message: errorMsg });
    } finally {
      setActiveOperation(null);
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
    setActiveOperation('downloadPng');
    setError(null);

    try {
      await exporter.exportAsPNG(svgElement, undefined, {
        scale: exportPresets?.png?.scale,
        background: exportPresets?.png?.background
      });
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
      setActiveOperation(null);
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
    setActiveOperation('downloadGif');
    setError(null);

    try {
      showToast({ 
        type: 'info', 
        title: 'GIF eksport startet', 
        message: 'Dette kan ta noen sekunder...' 
      });
      
      await exporter.exportAsGIF(frames, svgElement, undefined, {
        frameDuration: exportPresets?.gif?.frameDuration,
        quality: exportPresets?.gif?.quality
      });
      
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
      setActiveOperation(null);
      setIsProcessing(false);
    }
  }, [showToast]);

  // Video Export (placeholder)
  const handleDownloadFilm = useCallback(async (
    frames: Frame[],
    svgElement?: SVGSVGElement,
    options?: {
      seekFrame?: (frameIndex: number, frameProgress: number) => Promise<void> | void;
      restoreFrame?: () => void;
    }
  ) => {
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
    setActiveOperation('downloadFilm');
    setMp4Progress(0);
    setError(null);
    
    try {
      showToast({ 
        type: 'info', 
        title: 'MP4 eksport startet', 
        message: 'Encoder video (H.264/AAC). Dette kan ta litt tid...' 
      });
      
      await exporter.exportAsVideo(frames || [], svgElement!, undefined, {
        frameDuration: exportPresets?.mp4?.frameDuration,
        fps: exportPresets?.mp4?.fps,
        crf: exportPresets?.mp4?.crf,
        preset: exportPresets?.mp4?.preset,
        audioBitrate: exportPresets?.mp4?.audioBitrate,
        seekFrame: options?.seekFrame,
        onProgress: (progressPercent: number) => {
          setMp4Progress(progressPercent);
        }
      });

      showToast({
        type: 'success',
        title: 'MP4 eksportert',
        message: 'Video er lastet ned'
      });
    } catch (error) {
      const errorMsg = (error as Error)?.message || 'Feil ved MP4 eksport';
      const diagnosticDetails = typeof window !== 'undefined'
        ? (window as any).__lastMp4ExportError?.details
        : undefined;
      setError(errorMsg);

      let fallbackSucceeded = false;
      if (frames && frames.length >= 2 && svgElement) {
        try {
          showToast({
            type: 'warning',
            title: 'MP4 feilet - prøver GIF',
            message: 'Bytter til GIF-eksport automatisk...'
          });

          await exporter.exportAsGIF(frames, svgElement, undefined, {
            frameDuration: exportPresets?.gif?.frameDuration,
            quality: exportPresets?.gif?.quality
          });

          fallbackSucceeded = true;
          showToast({
            type: 'success',
            title: 'GIF eksportert',
            message: 'MP4 feilet, men GIF ble eksportert.'
          });
        } catch (gifFallbackError) {
          const gifFallbackMessage = (gifFallbackError as Error)?.message || 'Ukjent feil ved GIF fallback';
          showToast({
            type: 'error',
            title: 'GIF fallback feilet',
            message: gifFallbackMessage,
            duration: 12000
          });
        }
      }

      if (!fallbackSucceeded) {
        showToast({ 
          type: 'error', 
          title: 'MP4 eksportfeil', 
          message: `${errorMsg}. Sjekk window.__lastMp4ExportError i Console for detaljer.`,
          details: typeof diagnosticDetails === 'string' ? diagnosticDetails : undefined,
          duration: 20000
        });
      }
    } finally {
      options?.restoreFrame?.();
      setActiveOperation(null);
      setMp4Progress(null);
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
        setActiveOperation('loadAnimation');
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
          setActiveOperation(null);
          setIsProcessing(false);
        }
      };
      input.click();
    });
  }, [showToast]);

  // Load Example Animation
  const handleLoadExampleAnimation = useCallback(async (): Promise<Frame[] | null> => {
    setIsProcessing(true);
    setActiveOperation('loadExampleAnimation');
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
      setActiveOperation(null);
      setIsProcessing(false);
    }
  }, [showToast]);

  return {
    isProcessing,
    activeOperation,
    mp4Progress,
    error,
    handleDownloadAnimation,
    handleDownloadPng,
    handleDownloadSvg,
    handleDownloadGif,
    handleDownloadFilm,
    handleLoadAnimation,
    handleLoadExampleAnimation
  };
};

export type UseEnhancedExportImportReturn = ReturnType<typeof useEnhancedExportImport>;
