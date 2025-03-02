import { Frame } from '../@types/elements';

const STORAGE_KEY_PREFIX = 'football-animator-';
const DEFAULT_ANIMATION_NAME = 'default';

/**
 * Lagrer en animasjon til localStorage
 * @param frames Rammene som skal lagres
 * @param name Valgfritt navn på animasjonen (standard er 'default')
 */
export const saveAnimation = (frames: Frame[], name: string = DEFAULT_ANIMATION_NAME): void => {
  try {
    const key = `${STORAGE_KEY_PREFIX}${name}`;
    const data = JSON.stringify(frames);
    localStorage.setItem(key, data);
    console.log(`Animasjon lagret som "${name}"`);
  } catch (error) {
    console.error('Feil ved lagring av animasjon:', error);
  }
};

/**
 * Laster en animasjon fra localStorage
 * @param name Valgfritt navn på animasjonen (standard er 'default')
 * @returns Array med rammer eller null hvis animasjonen ikke finnes
 */
export const loadAnimation = (name: string = DEFAULT_ANIMATION_NAME): Frame[] | null => {
  try {
    const key = `${STORAGE_KEY_PREFIX}${name}`;
    const data = localStorage.getItem(key);
    
    if (!data) {
      console.log(`Ingen animasjon funnet med navn "${name}"`);
      return null;
    }
    
    const frames = JSON.parse(data) as Frame[];
    console.log(`Animasjon "${name}" lastet`);
    return frames;
  } catch (error) {
    console.error('Feil ved lasting av animasjon:', error);
    return null;
  }
};

/**
 * Henter en liste over alle lagrede animasjoner
 * @returns Array med navn på lagrede animasjoner
 */
export const getStoredAnimationNames = (): string[] => {
  try {
    const names: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const name = key.substring(STORAGE_KEY_PREFIX.length);
        names.push(name);
      }
    }
    
    return names;
  } catch (error) {
    console.error('Feil ved henting av animasjonsnavn:', error);
    return [];
  }
};

/**
 * Sletter en lagret animasjon
 * @param name Navnet på animasjonen som skal slettes
 * @returns true hvis vellykket, false hvis feil
 */
export const deleteAnimation = (name: string): boolean => {
  try {
    const key = `${STORAGE_KEY_PREFIX}${name}`;
    localStorage.removeItem(key);
    console.log(`Animasjon "${name}" slettet`);
    return true;
  } catch (error) {
    console.error('Feil ved sletting av animasjon:', error);
    return false;
  }
};

/**
 * Eksporterer animasjon som JSON-fil
 */
export const exportAnimation = (frames: Frame[], filename: string = 'animation.json'): void => {
  try {
    const dataStr = JSON.stringify(frames, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Feil ved eksport av animasjon:', error);
  }
};

/**
 * Importerer animasjon fra JSON-fil
 */
export const importAnimation = (file: File): Promise<Frame[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          reject(new Error('Kunne ikke lese filen'));
          return;
        }
        
        const frames = JSON.parse(event.target.result as string) as Frame[];
        resolve(frames);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Feil ved lesing av fil'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Eksporterer animasjon som SVG
 */
export const exportSVG = (svgElement: SVGSVGElement, filename: string = 'animation.svg'): void => {
  try {
    // Lag en kopi av SVG-elementet
    const svgCopy = svgElement.cloneNode(true) as SVGSVGElement;
    
    // Fjern eventuelle usynlige elementer
    const hiddenElements = svgCopy.querySelectorAll('[visibility="hidden"]');
    hiddenElements.forEach((el) => el.remove());
    
    // Konverter SVG til string
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgCopy);
    
    // Legg til XML-deklarasjon
    svgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + svgString;
    
    // Lag en data URI
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // Last ned filen
    const link = document.createElement('a');
    link.href = svgUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Frigjør URL-objektet
    URL.revokeObjectURL(svgUrl);
  } catch (error) {
    console.error('Feil ved eksport av SVG:', error);
  }
};

/**
 * Eksporterer animasjon som PNG
 */
export const exportPNG = (svgElement: SVGSVGElement, filename: string = 'animation.png'): void => {
  try {
    // Lag en kopi av SVG-elementet
    const svgCopy = svgElement.cloneNode(true) as SVGSVGElement;
    
    // Fjern eventuelle usynlige elementer
    const hiddenElements = svgCopy.querySelectorAll('[visibility="hidden"]');
    hiddenElements.forEach((el) => el.remove());
    
    // Konverter SVG til string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgCopy);
    
    // Lag en data URI
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // Opprett et canvas-element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Kunne ikke opprette canvas-kontekst');
    }
    
    // Sett canvas-størrelse
    const svgWidth = svgElement.width.baseVal.value;
    const svgHeight = svgElement.height.baseVal.value;
    canvas.width = svgWidth;
    canvas.height = svgHeight;
    
    // Opprett et bilde-element
    const img = new Image();
    
    img.onload = () => {
      // Tegn SVG på canvas
      ctx.drawImage(img, 0, 0);
      
      // Konverter canvas til PNG
      const pngUrl = canvas.toDataURL('image/png');
      
      // Last ned filen
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Frigjør URL-objektet
      URL.revokeObjectURL(svgUrl);
    };
    
    img.src = svgUrl;
  } catch (error) {
    console.error('Feil ved eksport av PNG:', error);
  }
}; 