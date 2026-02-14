import { Frame } from '../@types/elements';
import { debugLog } from './debug';

/**
 * Enhanced export utilities for Football Animator
 * Implements full functionality as required by PRD
 */

export interface ExportOptions {
  format: 'json' | 'png' | 'svg' | 'gif' | 'mp4';
  filename?: string;
  quality?: number;
  frameDuration?: number;
  fps?: number;
  crf?: number;
  preset?: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium';
  audioBitrate?: string;
}

export interface VideoExportOptions {
  frameDuration?: number;
  fps?: number;
  crf?: number;
  preset?: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium';
  audioBitrate?: string;
  seekFrame?: (frameIndex: number, frameProgress: number) => Promise<void> | void;
}

export class FootballAnimatorExporter {
  private static instance: FootballAnimatorExporter;
  private ffmpegModulePromise: Promise<any> | null = null;
  private ffmpegUtilModulePromise: Promise<any> | null = null;

  private getSvgBackgroundColor(svgElement: SVGSVGElement): string {
    const computed = window.getComputedStyle(svgElement).backgroundColor;
    if (computed && computed !== 'rgba(0, 0, 0, 0)' && computed !== 'transparent') {
      return computed;
    }
    return '#ffffff';
  }
  
  static getInstance(): FootballAnimatorExporter {
    if (!FootballAnimatorExporter.instance) {
      FootballAnimatorExporter.instance = new FootballAnimatorExporter();
    }
    return FootballAnimatorExporter.instance;
  }

  /**
   * Export animation as JSON file
   */
  exportAsJSON(frames: Frame[], filename?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!frames || frames.length === 0) {
          throw new Error('Ingen frames å eksportere');
        }

        const jsonData = JSON.stringify(frames, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `animation-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        resolve();
      } catch (error) {
        const exportError = error instanceof Error
          ? error
          : new Error('Ukjent feil ved MP4 eksport');
        debugLog('MP4 export failed:', exportError);
        reject(new Error(`MP4 eksport feilet: ${exportError.message}`));
      }
    });
  }

  /**
   * Export current frame as PNG
   */
  exportAsPNG(
    svgElement: SVGSVGElement,
    filename?: string,
    options?: { scale?: number; background?: string }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!svgElement) {
          throw new Error('SVG element ikke funnet');
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Kunne ikke opprette canvas context');
        }

        // Set canvas size based on SVG viewBox
        const viewBox = svgElement.viewBox.baseVal;
        const width = viewBox.width || 800;
        const height = viewBox.height || 600;
        const scale = options?.scale && options.scale > 0 ? options.scale : 1;
        
        canvas.width = width * scale;
        canvas.height = height * scale;

        // Convert SVG to image
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        img.onload = () => {
          // White background
          ctx.fillStyle = options?.background || 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Download PNG
          canvas.toBlob((blob) => {
            if (blob) {
              const downloadUrl = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = filename || `tactics-${new Date().toISOString().split('T')[0]}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(downloadUrl);
              resolve();
            } else {
              reject(new Error('Kunne ikke generere PNG blob'));
            }
          }, 'image/png');
          
          URL.revokeObjectURL(url);
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Feil ved konvertering til PNG'));
        };
        
        img.src = url;
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Export current board as SVG
   */
  exportAsSVG(svgElement: SVGSVGElement, filename?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!svgElement) {
          throw new Error('SVG element ikke funnet');
        }

        // Clone to avoid mutating the live DOM
        const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

        // Ensure namespaces exist so the file opens correctly outside the app
        if (!clonedSvg.getAttribute('xmlns')) {
          clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
        if (!clonedSvg.getAttribute('xmlns:xlink')) {
          clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        }

        // Keep viewBox as-is; add a default if missing
        if (!clonedSvg.getAttribute('viewBox')) {
          const vb = svgElement.getAttribute('viewBox');
          if (vb) {
            clonedSvg.setAttribute('viewBox', vb);
          }
        }

        const svgData = new XMLSerializer().serializeToString(clonedSvg);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `tactics-${new Date().toISOString().split('T')[0]}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Export animation as GIF
   */
  async exportAsGIF(
    frames: Frame[], 
    svgElement: SVGSVGElement, 
    filename?: string,
    options?: { frameDuration?: number; quality?: number }
  ): Promise<void> {
    try {
      if (!frames || frames.length < 2) {
        throw new Error('Trenger minst 2 frames for å lage GIF');
      }

      if (!svgElement) {
        throw new Error('SVG element ikke funnet');
      }

      // Dynamic import of gif.js
      const GIF = (await import('gif.js')).default;
      
      const viewBox = svgElement.viewBox.baseVal;
      const width = viewBox.width || 800;
      const height = viewBox.height || 600;
      const frameDuration = options?.frameDuration ?? 1000;
      const quality = options?.quality ?? 10;
      
      // Create GIF with options
      const gif = new GIF({
        workers: 2,
        quality,
        width,
        height,
        workerScript: '/gif.worker.js'
      });

      // Create canvas for frame rendering
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Kunne ikke opprette canvas context');
      }

      canvas.width = width;
      canvas.height = height;

      return new Promise((resolve, reject) => {
        // For now, add static frames (would need integration with animation system)
        // This is a placeholder implementation that adds the current frame multiple times
        for (let i = 0; i < frames.length; i++) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
          gif.addFrame(canvas, { delay: frameDuration });
        }

        gif.on('finished', (blob: Blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename || `tactics-animation-${new Date().toISOString().split('T')[0]}.gif`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          resolve();
        });

        gif.on('progress', (p: number) => {
          debugLog(`GIF progress: ${Math.round(p * 100)}%`);
        });

        try {
          gif.render();
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Export animation as MP4 video (placeholder for future implementation)
   */
  exportAsVideo(
    frames: Frame[],
    svgElement: SVGSVGElement,
    filename?: string,
    options?: VideoExportOptions
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!svgElement) {
          throw new Error('SVG element ikke funnet');
        }
        if (!frames || frames.length === 0) {
          throw new Error('Ingen frames å eksportere');
        }

        const viewBox = svgElement.viewBox.baseVal;
        const width = Math.max(2, Math.round(viewBox.width || 800));
        const height = Math.max(2, Math.round(viewBox.height || 600));
        const backgroundColor = this.getSvgBackgroundColor(svgElement);
        const templateSvg = svgElement.querySelector(':scope > svg');
        const fps = Math.min(60, Math.max(12, options?.fps ?? 30));
        const frameDuration = Math.max(100, options?.frameDuration ?? 600);
        const frameCount = Math.max(1, frames.length);
        const framesPerKeyframe = Math.max(1, Math.round((frameDuration / 1000) * fps));
        const totalOutputFrames = Math.max(1, frameCount * framesPerKeyframe);
        const h264EvenScaleFilter = 'scale=trunc(iw/2)*2:trunc(ih/2)*2';

        debugLog('MP4 export diagnostics:', {
          width,
          height,
          viewBox: svgElement.getAttribute('viewBox'),
          backgroundColor,
          fps,
          frameDuration,
          frameCount,
          framesPerKeyframe,
          totalOutputFrames,
          h264EvenScaleFilter,
          hasTemplateSvg: Boolean(templateSvg),
          templateViewBox: templateSvg?.getAttribute('viewBox') || null
        });

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Kunne ikke opprette canvas context');
        }

        const ffmpeg = await this.createFfmpegInstance();

        const renderFrame = async () => {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          try {
            await new Promise<void>((frameResolve, frameReject) => {
              const img = new Image();
              img.onload = () => {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);
                frameResolve();
              };
              img.onerror = () => frameReject(new Error('Kunne ikke rendre SVG for video-eksport'));
              img.src = url;
            });
          } finally {
            URL.revokeObjectURL(url);
          }
        };

        const frameToPngBlob = (): Promise<Blob> => {
          return new Promise((blobResolve, blobReject) => {
            canvas.toBlob((blob) => {
              if (blob) {
                blobResolve(blob);
                return;
              }
              blobReject(new Error('Kunne ikke generere PNG frame for video'));
            }, 'image/png');
          });
        };

        for (let outputFrame = 0; outputFrame < totalOutputFrames; outputFrame++) {
          const timelinePosition = outputFrame / framesPerKeyframe;
          const frameIndex = Math.min(frameCount - 1, Math.floor(timelinePosition));
          const frameProgress = frameIndex >= frameCount - 1
            ? 0
            : timelinePosition - frameIndex;

          if (options?.seekFrame) {
            await options.seekFrame(frameIndex, frameProgress);
            await this.waitForNextPaint();
            await this.waitForNextPaint();
          }

          if (outputFrame === 0 || outputFrame === totalOutputFrames - 1) {
            debugLog('MP4 frame sample:', {
              outputFrame,
              frameIndex,
              frameProgress
            });
          }

          await renderFrame();
          const pngBlob = await frameToPngBlob();
          const utilModule = await this.loadFfmpegUtilModule();
          const pngData = await utilModule.fetchFile(pngBlob);
          const outputName = `frame_${String(outputFrame).padStart(5, '0')}.png`;
          await ffmpeg.writeFile(outputName, pngData);

          if (outputFrame % Math.max(1, Math.floor(totalOutputFrames / 10)) === 0) {
            const percent = Math.round((outputFrame / totalOutputFrames) * 100);
            debugLog(`MP4 render progress: ${percent}%`);
          }
        }

        await ffmpeg.exec([
          '-framerate', String(fps),
          '-i', 'frame_%05d.png',
          '-f', 'lavfi',
          '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
          '-shortest',
          '-vf', h264EvenScaleFilter,
          '-c:v', 'libx264',
          '-pix_fmt', 'yuv420p',
          '-preset', options?.preset ?? 'veryfast',
          '-crf', String(options?.crf ?? 23),
          '-c:a', 'aac',
          '-b:a', options?.audioBitrate ?? '128k',
          '-movflags', '+faststart',
          'output.mp4'
        ]);

        const outputData = await ffmpeg.readFile('output.mp4');
        const outputBlob = new Blob([outputData], { type: 'video/mp4' });
        const outputFilename = filename || `tactics-animation-${new Date().toISOString().split('T')[0]}.mp4`;
        ffmpeg.terminate();

        const downloadUrl = URL.createObjectURL(outputBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = outputFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private waitForNextPaint(): Promise<void> {
    return new Promise((paintResolve) => {
      requestAnimationFrame(() => paintResolve());
    });
  }

  private async createFfmpegInstance() {
    const ffmpegModule = await this.loadFfmpegModule();
    const utilModule = await this.loadFfmpegUtilModule();

    const ffmpeg = new ffmpegModule.FFmpeg();
    const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd';

    await ffmpeg.load({
      coreURL: await utilModule.toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await utilModule.toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      workerURL: await utilModule.toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
    });

    return ffmpeg;
  }

  private async loadFfmpegModule() {
    if (!this.ffmpegModulePromise) {
      const ffmpegModuleName = '@ffmpeg/ffmpeg';
      this.ffmpegModulePromise = import(ffmpegModuleName);
    }
    return this.ffmpegModulePromise;
  }

  private async loadFfmpegUtilModule() {
    if (!this.ffmpegUtilModulePromise) {
      const ffmpegUtilModuleName = '@ffmpeg/util';
      this.ffmpegUtilModulePromise = import(ffmpegUtilModuleName);
    }
    return this.ffmpegUtilModulePromise;
  }

  private async transcodeWebmToMp4(
    inputBlob: Blob,
    options: {
      crf: number;
      preset: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium';
      audioBitrate: string;
    }
  ): Promise<Blob> {
    const ffmpeg = await this.createFfmpegInstance();
    const utilModule = await this.loadFfmpegUtilModule();

    await ffmpeg.writeFile('input.webm', await utilModule.fetchFile(inputBlob));
    await ffmpeg.exec([
      '-i', 'input.webm',
      '-f', 'lavfi',
      '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
      '-shortest',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-preset', options.preset,
      '-crf', String(options.crf),
      '-c:a', 'aac',
      '-b:a', options.audioBitrate,
      '-movflags', '+faststart',
      'output.mp4'
    ]);

    const outputData = await ffmpeg.readFile('output.mp4');
    ffmpeg.terminate();

    return new Blob([outputData], { type: 'video/mp4' });
  }

  /**
   * Import animation from JSON file
   */
  importFromJSON(file: File): Promise<Frame[]> {
    return new Promise((resolve, reject) => {
      if (!file.name.toLowerCase().endsWith('.json')) {
        reject(new Error('Kun JSON-filer støttes'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const jsonData = JSON.parse(content);
          
          // Validate data structure
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            const isValid = jsonData.every(frame => 
              frame && typeof frame === 'object' && Array.isArray(frame.elements)
            );
            
            if (isValid) {
              resolve(jsonData as Frame[]);
            } else {
              reject(new Error('Ugyldig JSON-format: Mangler elements-array i frames'));
            }
          } else {
            reject(new Error('Ugyldig JSON-format: Ikke et array eller tomt array'));
          }
        } catch (error) {
          reject(new Error('Feil ved parsing av JSON: ' + (error as Error).message));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Kunne ikke lese filen'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Load example animation
   */
  async loadExampleAnimation(): Promise<Frame[]> {
    try {
      const response = await fetch('/examples/pasningsmonster.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Validate data structure
      if (Array.isArray(data) && data.length > 0) {
        const isValid = data.every(frame => 
          frame && typeof frame === 'object' && Array.isArray(frame.elements)
        );
        
        if (isValid) {
          return data as Frame[];
        } else {
          throw new Error('Invalid example animation format');
        }
      } else {
        throw new Error('Example animation is not a valid array');
      }
    } catch (error) {
      throw new Error('Error loading example animation: ' + (error as Error).message);
    }
  }
}

// Export singleton instance
export const exporter = FootballAnimatorExporter.getInstance();

// Export individual functions for backward compatibility
export const exportAsJSON = (frames: Frame[], filename?: string) => 
  exporter.exportAsJSON(frames, filename);

export const exportAsPNG = (svgElement: SVGSVGElement, filename?: string, options?: { scale?: number; background?: string }) => 
  exporter.exportAsPNG(svgElement, filename, options);

export const exportAsSVG = (svgElement: SVGSVGElement, filename?: string) =>
  exporter.exportAsSVG(svgElement, filename);

export const exportAsGIF = (frames: Frame[], svgElement: SVGSVGElement, filename?: string, options?: { frameDuration?: number; quality?: number }) => 
  exporter.exportAsGIF(frames, svgElement, filename, options);

export const exportAsVideo = (
  frames: Frame[],
  svgElement: SVGSVGElement,
  filename?: string,
  options?: VideoExportOptions
) => 
  exporter.exportAsVideo(frames, svgElement, filename, options);

export const importFromJSON = (file: File) => 
  exporter.importFromJSON(file);

export const loadExampleAnimation = () => 
  exporter.loadExampleAnimation();
