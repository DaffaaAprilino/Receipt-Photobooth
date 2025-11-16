// src/components/CaptureScreen.tsx
import { LegacyRef } from 'react';
import { Camera } from 'lucide-react';

interface Props {
  videoRef: LegacyRef<HTMLVideoElement>;
  onCapture: () => void;
  onReset: () => void;
  photosTaken: number;
  totalFrames: number;
  isCountingDown: boolean;
  isFlashing: boolean;
  countdown: number | null; // <-- Prop baru untuk countdown
}

export default function CaptureScreen({
  videoRef,
  onCapture,
  onReset,
  photosTaken,
  totalFrames,
  isCountingDown,
  isFlashing,
  countdown, // <-- Terima prop countdown
}: Props) {
  return (
    <div className="bg-brand-surface rounded-2xl shadow-xl overflow-hidden">
      <div className="relative bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full"
          style={{ transform: 'scaleX(-1)' }}
        />
        <div className="absolute top-4 right-4 bg-brand-primary text-white px-3 py-1 rounded text-sm font-bold">
          LIVE
        </div>
        
        {isFlashing && (
          <div className="absolute inset-0 bg-white opacity-100 transition-opacity duration-100" />
        )}

        {/* REVISI: Tampilkan Angka Countdown di sini */}
        {countdown !== null && countdown > 0 && (
          // Overlay gelap agar angka terlihat jelas
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black bg-opacity-30">
            {/* Angkanya dibuat besar, putih, dan 'animate-pulse' 
              agar terlihat 'muter' (beranimasi) dan kena psikologinya
            */}
            <span 
              key={countdown} // 'key' ini penting agar React me-reset animasi di tiap angka
              className="text-white text-9xl font-extrabold drop-shadow-lg animate-pulse"
            >
              {countdown}
            </span>
          </div>
        )}
      </div>

      <div className="p-8">
        <div className="mb-6 text-center">
          <p className="text-brand-text/70 mb-2">
            Foto {photosTaken + 1} dari {totalFrames}
          </p>
          <div className="w-full bg-brand-secondary rounded-full h-2">
            <div
              className="bg-brand-primary h-2 rounded-full transition-all"
              style={{ width: `${((photosTaken + 1) / totalFrames) * 100}%` }}
            />
          </div>
        </div>

        {/* Kita sembunyikan tulisan "Bersiaplah..." karena sudah diganti angka */}
        {/* {isCountingDown && ( ... )} */}

        <div className="flex gap-4">
          <button
            onClick={onCapture}
            disabled={isCountingDown} // Tombol akan nonaktif selama 3 detik
            className="flex-1 bg-brand-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-brand-primary-hover disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Camera size={20} />
            {/* Ubah teks tombol jika sedang countdown */}
            {isCountingDown ? '...' : 'Ambil Foto'}
          </button>
          <button
            onClick={onReset}
            className="flex-1 bg-brand-secondary text-brand-primary/80 py-3 rounded-lg font-bold hover:bg-brand-secondary/80"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}