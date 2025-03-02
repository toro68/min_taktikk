import { useCallback, useRef } from 'react';
import { Canvg } from 'canvg';

interface UseSvgExportReturn {
  inlineAllStyles: (svg: SVGSVGElement) => SVGSVGElement;
  downloadSvg: (svgElement: SVGSVGElement, filename?: string) => void;
  downloadFilm: (
    svgElement: SVGSVGElement, 
    renderFrame: (frameIndex: number) => void | Promise<void>, 
    frameCount: number, 
    frameDurations: number[]
  ) => void;
}

export const useSvgExport = (): UseSvgExportReturn => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hjelpefunksjon som kloner SVG-en og inliner alle beregnede stiler
  const inlineAllStyles = useCallback((svg: SVGSVGElement): SVGSVGElement => {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    
    // Sikre at SVG har riktige dimensjoner
    const svgRect = svg.getBoundingClientRect();
    if (svgRect.width > 0 && svgRect.height > 0) {
      clone.setAttribute('width', `${svgRect.width}`);
      clone.setAttribute('height', `${svgRect.height}`);
    } else {
      // Sett standardverdier hvis dimensjonene er 0
      clone.setAttribute('width', '680');
      clone.setAttribute('height', '525');
    }
    
    // Sikre at viewBox er satt
    if (!clone.getAttribute('viewBox')) {
      clone.setAttribute('viewBox', '0 0 680 525');
    }
    
    const elements = clone.querySelectorAll("*");
    
    // Sikre at alle tekstelementer er synlige og har riktig innhold
    const textElements = clone.querySelectorAll("text");
    textElements.forEach(textEl => {
      // Sikre at teksten er synlig
      textEl.setAttribute("visibility", "visible");
      
      // Sikre at font-egenskaper er eksplisitt satt
      textEl.setAttribute("font-family", "Arial");
      textEl.setAttribute("font-weight", "bold");
      textEl.setAttribute("font-size", textEl.getAttribute("fontSize") || "16");
      
      // Sikre at teksten er sentrert
      textEl.setAttribute("text-anchor", "middle");
      
      // Sikre at fill-fargen er riktig
      if (textEl.parentElement?.querySelector("circle[fill='black']")) {
        textEl.setAttribute("fill", "white");
      } else {
        textEl.setAttribute("fill", "black");
      }
    });
    
    // Inline alle stiler
    for (const el of Array.from(elements)) {
      try {
        const computedStyle = window.getComputedStyle(el);
        let styleDeclaration = "";
        for (let i = 0; i < computedStyle.length; i++) {
          const property = computedStyle[i];
          const value = computedStyle.getPropertyValue(property);
          styleDeclaration += `${property}:${value};`;
        }
        el.setAttribute("style", styleDeclaration);
      } catch (error) {
        console.warn('Kunne ikke inline stiler for element:', el, error);
      }
    }
    
    return clone;
  }, []);

  // Funksjon for å laste ned SVG som en fil
  const downloadSvg = useCallback((svgElement: SVGSVGElement, filename: string = 'taktikk.svg') => {
    const clone = inlineAllStyles(svgElement);
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [inlineAllStyles]);

  // Funksjon for å laste ned animasjon som en film
  const downloadFilm = useCallback((
    svgElement: SVGSVGElement, 
    renderFrame: (frameIndex: number) => void | Promise<void>, 
    frameCount: number, 
    frameDurations: number[]
  ) => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Kunne ikke få canvas-kontekst');
      alert('Kunne ikke starte videoeksport: Canvas-kontekst er ikke tilgjengelig');
      return;
    }
    
    // Sett canvas-størrelse basert på SVG
    // Hent SVG-dimensjoner fra viewBox hvis width/height ikke er satt
    const svgRect = svgElement.getBoundingClientRect();
    const viewBox = svgElement.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 680, 525];
    const svgWidth = viewBox[2] || svgRect.width || 680; // Bruk viewBox-bredde først
    const svgHeight = viewBox[3] || svgRect.height || 525; // Bruk viewBox-høyde først
    
    console.log(`SVG dimensjoner: ${svgWidth}x${svgHeight}`);
    
    // Sikre at canvas har en gyldig størrelse
    canvas.width = Math.max(svgWidth, 1);
    canvas.height = Math.max(svgHeight, 1);
    
    // Legg til canvas i DOM for bedre kompatibilitet
    document.body.appendChild(canvas);
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.opacity = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "-1000";
    
    // Forbered for animasjon
    let currentFrame = 0;
    const frames: HTMLCanvasElement[] = [];
    
    // Funksjon for å rendere en ramme
    const renderNextFrame = async () => {
      if (currentFrame >= frameCount) {
        // Fjern canvas fra DOM
        if (document.body.contains(canvas)) {
          document.body.removeChild(canvas);
        }
        
        // Alle rammer er rendert, lag video
        console.log(`Alle ${frames.length} rammer er rendret, lager video...`);
        if (frames.length === 0) {
          alert('Kunne ikke generere video: Ingen rammer ble rendret');
          return;
        }
        createAndDownloadGif(frames, frameDurations);
        return;
      }
      
      console.log(`Rendrer ramme ${currentFrame + 1} av ${frameCount}`);
      
      try {
        // Render denne rammen
        const renderResult = renderFrame(currentFrame);
        
        // Hvis renderFrame returnerer et Promise, vent på det
        if (renderResult instanceof Promise) {
          await renderResult;
        } else {
          // Ellers, vent litt for å sikre at rammen er ferdig rendert
          await new Promise(resolve => setTimeout(resolve, 300)); // Økt fra 200ms til 300ms
        }
        
        // Konverter SVG til canvas
        const clone = inlineAllStyles(svgElement);
        
        // Sikre at SVG har riktige dimensjoner
        clone.setAttribute('width', `${canvas.width}`);
        clone.setAttribute('height', `${canvas.height}`);
        
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(clone);
        
        console.log(`SVG for ramme ${currentFrame + 1} generert, lengde: ${svgString.length} tegn`);
        
        // Bruk Canvg for å rendere SVG til canvas
        const v = await Canvg.from(ctx, svgString, {
          ignoreDimensions: true,
          ignoreClear: true
        });
        
        // Sett dimensjoner og render
        v.resize(canvas.width, canvas.height, 'xMidYMid meet');
        await v.render();
        
        // Lagre denne rammen
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = canvas.width;
        frameCanvas.height = canvas.height;
        const frameCtx = frameCanvas.getContext('2d');
        
        if (frameCtx && canvas.width > 0 && canvas.height > 0) {
          frameCtx.fillStyle = 'white';
          frameCtx.fillRect(0, 0, canvas.width, canvas.height);
          frameCtx.drawImage(canvas, 0, 0);
          frames.push(frameCanvas);
          console.log(`Ramme ${currentFrame + 1} lagret (${frameCanvas.width}x${frameCanvas.height})`);
        } else {
          console.error('Ugyldig canvas-kontekst eller dimensjoner', {
            width: canvas.width,
            height: canvas.height
          });
        }
      } catch (error) {
        console.error(`Feil ved rendering av ramme ${currentFrame + 1}:`, error);
      }
      
      // Gå til neste ramme
      currentFrame++;
      setTimeout(renderNextFrame, 150); // Økt fra 100ms til 150ms for å gi mer tid til rendering
    };
    
    // Start renderprosessen
    renderNextFrame();
  }, [inlineAllStyles]);

  // Hjelpefunksjon for å lage og laste ned WebM-video
  const createAndDownloadGif = (frames: HTMLCanvasElement[], durations: number[]) => {
    try {
      console.log(`Starter generering av video med ${frames.length} rammer`);
      
      if (frames.length === 0) {
        console.error('Ingen rammer å vise');
        alert('Videoeksport feilet: Ingen rammer å vise');
        return;
      }
      
      // Opprett et videoCanvas som vil bli brukt til å vise hver ramme
      const videoCanvas = document.createElement('canvas');
      document.body.appendChild(videoCanvas);
      
      // Sett størrelse basert på første ramme
      const firstFrame = frames[0];
      videoCanvas.width = firstFrame.width;
      videoCanvas.height = firstFrame.height;
      
      // Posisjonering av canvas
      videoCanvas.style.position = 'fixed';
      videoCanvas.style.top = '0';
      videoCanvas.style.left = '0';
      videoCanvas.style.zIndex = '9999';
      videoCanvas.style.backgroundColor = 'white';
      videoCanvas.style.display = 'block';
      
      const videoCtx = videoCanvas.getContext('2d');
      if (!videoCtx) {
        console.error('Kunne ikke få canvas-kontekst for video');
        document.body.removeChild(videoCanvas);
        alert('Videoeksport støttes ikke i denne nettleseren: Kunne ikke få canvas-kontekst');
        return;
      }
      
      // Opprett en MediaStream fra canvas
      if (!videoCanvas.captureStream) {
        console.error('captureStream er ikke støttet i denne nettleseren');
        document.body.removeChild(videoCanvas);
        alert('Videoeksport støttes ikke i denne nettleseren: captureStream er ikke tilgjengelig');
        return;
      }
      
      const stream = videoCanvas.captureStream(30); // 30 FPS
      
      console.log('Stream opprettet:', stream);
      console.log('Video-spor:', stream.getVideoTracks());
      
      if (stream.getVideoTracks().length === 0) {
        console.error('Ingen video-spor i stream');
        document.body.removeChild(videoCanvas);
        alert('Videoeksport støttes ikke i denne nettleseren. Prøv en annen nettleser som Chrome eller Edge.');
        return;
      }
      
      // Sjekk om MediaRecorder er tilgjengelig
      if (!window.MediaRecorder) {
        console.error('MediaRecorder er ikke støttet i denne nettleseren');
        document.body.removeChild(videoCanvas);
        alert('Videoeksport støttes ikke i denne nettleseren: MediaRecorder er ikke tilgjengelig');
        return;
      }
      
      // Sjekk hvilke MIME-typer som støttes
      let mimeType = '';
      const mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm'
      ];
      
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          console.log(`Bruker video-format: ${type}`);
          break;
        }
      }
      
      if (!mimeType) {
        console.error('Ingen støttede video-formater funnet');
        document.body.removeChild(videoCanvas);
        alert('Videoeksport støttes ikke i denne nettleseren: Ingen støttede video-formater');
        return;
      }
      
      let options: MediaRecorderOptions = {
        mimeType,
        videoBitsPerSecond: 5000000 // 5 Mbps
      };
      
      console.log('Sjekker støttede MIME-typer:');
      console.log('video/webm;codecs=vp9 støttet:', MediaRecorder.isTypeSupported('video/webm;codecs=vp9'));
      console.log('video/webm støttet:', MediaRecorder.isTypeSupported('video/webm'));
      console.log('video/mp4 støttet:', MediaRecorder.isTypeSupported('video/mp4'));
      
      // Opprett MediaRecorder med feilhåndtering
      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, options);
        console.log('MediaRecorder opprettet:', mediaRecorder);
      } catch (error) {
        console.error('Feil ved oppretting av MediaRecorder:', error);
        // Prøv med standard innstillinger
        try {
          mediaRecorder = new MediaRecorder(stream);
          console.log('MediaRecorder opprettet med standard innstillinger');
        } catch (fallbackError) {
          console.error('Kunne ikke opprette MediaRecorder selv med standard innstillinger:', fallbackError);
          document.body.removeChild(videoCanvas);
          alert('Videoeksport støttes ikke i denne nettleseren. Prøv en annen nettleser som Chrome eller Edge.');
          return;
        }
      }
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        console.log('Data tilgjengelig:', e.data.size, 'bytes');
        if (e.data.size > 0) {
          chunks.push(e.data);
          console.log('Chunks så langt:', chunks.length);
        }
      };
      
      mediaRecorder.onstop = () => {
        console.log('MediaRecorder stoppet. Kombinerer', chunks.length, 'chunks');
        
        // Fjern canvas fra DOM
        if (document.body.contains(videoCanvas)) {
          document.body.removeChild(videoCanvas);
        }
        
        if (chunks.length === 0) {
          console.error('Ingen data ble samlet inn under opptak');
          alert('Ingen videodata ble generert. Prøv igjen eller bruk en annen nettleser.');
          return;
        }
        
        // Kombiner alle chunks til en blob
        const blob = new Blob(chunks, { type: 'video/webm' });
        console.log('Blob opprettet:', blob.size, 'bytes');
        
        if (blob.size < 100) {
          console.error('Videofilen er for liten, sannsynligvis tom');
          alert('Videofilen er tom. Prøv igjen eller bruk en annen nettleser.');
          return;
        }
        
        const url = URL.createObjectURL(blob);
        
        // Last ned videoen
        const link = document.createElement('a');
        link.href = url;
        link.download = 'taktikk_animasjon.webm';
        document.body.appendChild(link);
        
        // Bruk setTimeout for å sikre at nettleseren har tid til å behandle blob-en
        setTimeout(() => {
          console.log('Klikker på nedlastingslenke...');
          link.click();
          
          // Rydd opp
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log('Opprydding fullført');
            alert('Animasjon eksportert som WebM-video.');
          }, 1000);
        }, 500);
        
        console.log('Animasjon eksportert som WebM-video');
      };
      
      // Legg til flere hendelseslyttere for feilsøking
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder feil:', event);
        
        // Fjern canvas fra DOM ved feil
        if (document.body.contains(videoCanvas)) {
          document.body.removeChild(videoCanvas);
        }
        
        alert('Det oppstod en feil under opptak av video. Prøv igjen eller bruk en annen nettleser.');
      };
      
      mediaRecorder.onstart = () => {
        console.log('MediaRecorder startet');
      };
      
      // Start opptaket med timeslice for å sikre jevn datastrøm
      mediaRecorder.start(100); // Samle data hvert 100ms
      
      // Beregn varighet for hver ramme basert på frameDurations
      const frameTimings: number[] = [];
      let totalAnimationDuration = 0;
      
      // Hastighetsfaktor - høyere verdi gir langsommere animasjon
      const speedFactor = 1.5; // Redusert fra 2.0 til 1.5 for litt raskere animasjon
      
      // Minimum varighet per ramme i millisekunder
      const minFrameDuration = 150; // Redusert fra 200ms til 150ms
      
      console.log(`Bruker hastighetsfaktor: ${speedFactor} og minimum rammevarighet: ${minFrameDuration}ms`);
      
      if (durations.length === frames.length) {
        // Hvis vi har en varighet for hver ramme, bruk disse direkte men juster med hastighetsfaktoren
        for (let i = 0; i < frames.length; i++) {
          const durationMs = Math.max(durations[i] * 1000 * speedFactor, minFrameDuration);
          frameTimings.push(durationMs);
          totalAnimationDuration += durationMs;
        }
      } else {
        // Ellers, fordel varigheten jevnt og juster med hastighetsfaktoren
        const avgDuration = durations.reduce((sum, duration) => sum + duration, 0) * 1000 / frames.length;
        const frameDurationMs = Math.max(avgDuration * speedFactor, minFrameDuration);
        for (let i = 0; i < frames.length; i++) {
          frameTimings.push(frameDurationMs);
          totalAnimationDuration += frameDurationMs;
        }
      }
      
      console.log(`Total animasjonsvarighet: ${totalAnimationDuration}ms for ${frames.length} rammer`);
      console.log('Rammevarigheter:', frameTimings);
      
      // Vis hver ramme i sekvens med riktig timing
      let currentFrameIndex = 0;
      
      const drawNextFrame = () => {
        if (currentFrameIndex >= frames.length) {
          // Alle rammer er vist, stopp opptaket
          console.log('Alle rammer er vist, stopper opptak');
          setTimeout(() => {
            mediaRecorder.stop();
          }, 500); // Vent litt før vi stopper for å sikre at alt innhold blir tatt opp
          return;
        }
        
        // Tegn gjeldende ramme
        videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
        videoCtx.fillStyle = 'white';
        videoCtx.fillRect(0, 0, videoCanvas.width, videoCanvas.height);
        videoCtx.drawImage(frames[currentFrameIndex], 0, 0);
        
        console.log(`Viser ramme ${currentFrameIndex + 1} av ${frames.length}, varighet: ${frameTimings[currentFrameIndex]}ms`);
        
        // Gå til neste ramme etter riktig forsinkelse
        const currentIndex = currentFrameIndex; // Lagre gjeldende indeks før økning
        currentFrameIndex++;
        
        // Bruk riktig timing for denne rammen, eller standard 100ms hvis ikke tilgjengelig
        const delay = frameTimings[currentIndex] || 100;
        setTimeout(drawNextFrame, delay);
      };
      
      // Start animasjonen
      drawNextFrame();
      
    } catch (error) {
      console.error('Feil ved generering av animasjon:', error);
      alert('Det oppstod en feil ved generering av animasjonen. Sjekk konsollen for detaljer.');
      
      // Fallback: Last ned første ramme som PNG hvis video-eksport feiler
      if (frames.length > 0) {
        const link = document.createElement('a');
        link.href = frames[0].toDataURL('image/png');
        link.download = 'taktikk_animasjon.png';
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          alert('Videoeksport feilet, men første ramme er lagret som PNG-bilde.');
        }, 1000);
        
        console.log('Falt tilbake til PNG-eksport av første ramme');
      }
    }
  };

  return {
    inlineAllStyles,
    downloadSvg,
    downloadFilm
  };
}; 