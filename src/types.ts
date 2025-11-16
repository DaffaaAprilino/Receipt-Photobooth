export type FrameCount = 1 | 2 | 3 | 4;
export type Step = 'select' | 'capture' | 'result' | 'printing';

export interface Photo {
  data: string;
  timestamp: Date;
}