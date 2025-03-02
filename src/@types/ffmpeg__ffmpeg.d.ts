declare module '@ffmpeg/ffmpeg' {
  export class FFmpeg {
    constructor(options: { log: boolean });
    load(): Promise<void>;
    run(...args: string[]): Promise<void>;
    // Andre metoder kan legges til ved behov
  }
  export type FFFSType = FFmpeg;
} 