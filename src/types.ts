export type FrameCount = 1 | 2 | 3 | 4;
export type Step = 'select' | 'capture' | 'result' | 'printing';

// Filter foto yang tersedia
export type PhotoFilter = 'normal' | 'vintage' | 'bittersweet' | 'ogVintage' | 'blackwhite';

export interface Photo {
  data: string;
  timestamp: Date;
}


