import { useState, useCallback } from 'react';
import { Frame, PlayerElement, OpponentElement } from '../@types/elements';

interface UseExportImportReturn {
  uploadAnimation: (event: React.ChangeEvent<HTMLInputElement>) => Promise<Frame[] | null>;
  isImporting: boolean;
  importError: string | null;
}

export const useExportImport = (): UseExportImportReturn => {
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Funksjon for å laste inn animasjon fra fil
  const uploadAnimation = useCallback(async (event: React.ChangeEvent<HTMLInputElement>): Promise<Frame[] | null> => {
    const file = event.target.files?.[0];
    if (!file) {
      setImportError('Ingen fil valgt');
      return null;
    }
    
    console.log(`Starter opplasting av fil: ${file.name} (${file.size} bytes)`);
    
    // Sjekk filtype
    if (!file.name.toLowerCase().endsWith('.json')) {
      setImportError('Feil filformat. Kun JSON-filer støttes.');
      return null;
    }
    
    setIsImporting(true);
    setImportError(null);
    
    try {
      const content = await readFileAsText(file);
      
      // Sjekk om innholdet er gyldig JSON
      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (error) {
        throw new Error('Ugyldig JSON-format. Filen er korrupt eller har feil format.');
      }
      
      // Sjekk om det er det nye formatet med version, frames og timestamp
      // eller det gamle formatet som bare er et array av frames
      const parsedFrames = Array.isArray(parsedContent) 
        ? parsedContent as Frame[] 
        : parsedContent.frames as Frame[];
      
      if (!parsedFrames || !Array.isArray(parsedFrames)) {
        throw new Error('Ugyldig filformat. Kunne ikke finne frames-data.');
      }
      
      // Valider at frames har riktig struktur
      for (let i = 0; i < parsedFrames.length; i++) {
        const frame = parsedFrames[i];
        if (!frame.elements || !Array.isArray(frame.elements)) {
          throw new Error(`Ugyldig frame-struktur i frame ${i+1}. Mangler elements-array.`);
        }
        if (typeof frame.duration !== 'number') {
          console.warn(`Frame ${i+1} mangler duration. Setter til standardverdi 1.`);
          frame.duration = 1;
        }
      }
      
      // Debug: Sjekk om spillere har nummer etter innlasting
      console.log('Frames etter innlasting:', parsedFrames);
      const playerElements = parsedFrames.flatMap(frame => 
        frame.elements.filter(el => el.type === 'player' || el.type === 'opponent')
      ) as (PlayerElement | OpponentElement)[];
      console.log('Spillere etter innlasting:', playerElements);
      
      setIsImporting(false);
      return parsedFrames;
    } catch (error) {
      console.error('Feil ved innlasting av animasjon:', error);
      setImportError(error instanceof Error ? error.message : 'Kunne ikke laste inn animasjonen. Ukjent feil.');
      setIsImporting(false);
      return null;
    }
  }, []);

  // Hjelpefunksjon for å lese fil som tekst
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Kunne ikke lese filen'));
        }
      };
      reader.onerror = () => reject(new Error(`FileReader-feil: ${reader.error?.message || 'Ukjent feil'}`));
      reader.readAsText(file);
    });
  };

  return {
    uploadAnimation,
    isImporting,
    importError
  };
}; 