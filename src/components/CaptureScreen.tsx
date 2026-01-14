// src/components/CaptureScreen.tsx
import { LegacyRef } from 'react';
import { Camera, RotateCcw, Check, ArrowLeft, SwitchCamera, Zap } from 'lucide-react'; // Tambah icon
import { Photo } from '../types';

interface Props {
  videoRef: LegacyRef<HTMLVideoElement>;
  onCapture: () => void;
  onRetake: () => void;
  onConfirm: () => void; // REVISI: Terima fungsi konfirmasi
  isReviewing: boolean;  // REVISI: Terima status reviewing
  photos: Photo[];
  totalFrames: number;
  isCountingDown: boolean;
  isFlashing: boolean;
  countdown: number | null;
  toggleCamera: () => void;
  onBackHome: () => void;
  isTorchOn: boolean;
  onToggleTorch: () => void;
  facingMode: 'user' | 'environment';
}

export default function CaptureScreen({
  videoRef,
  onCapture,
  onRetake,
  onConfirm, // Terima props
  isReviewing, // Terima props
  photos,
  totalFrames,
  isCountingDown,
  isFlashing,
  countdown,
  toggleCamera,
  onBackHome,
  isTorchOn,
  onToggleTorch,
  facingMode,
}: Props) {
  return (
    <div className="mx-auto w-full rounded-3xl border border-white/60 bg-white/95 shadow-[0_28px_90px_rgba(15,23,42,0.22)] overflow-hidden relative backdrop-blur-xl">
      
      {/* REVISI: MODAL KONFIRMASI (Overlay di atas semuanya jika isReviewing true) */}
      {isReviewing && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm p-6 text-center animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-2xl border border-brand-secondary shadow-xl max-w-sm w-full">
            <h3 className="text-2xl font-black text-brand-text mb-2">Selesai!</h3>
            <p className="text-brand-text/70 mb-8">
              Semua frame sudah terisi. Mau lanjut ke hasil atau ulang foto terakhir?
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={onConfirm}
                className="w-full rounded-xl bg-brand-primary py-4 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Lanjut Cetak
              </button>
              
              <button
                onClick={onRetake}
                className="w-full rounded-xl border-2 border-brand-secondary py-3 font-bold text-brand-text/70 hover:bg-brand-secondary/50 flex items-center justify-center gap-2"
              >
                <ArrowLeft size={20} />
                Ulang Foto Terakhir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER STEP */}
      <div className="flex items-center justify-between gap-3 border-b border-brand-secondary/70 bg-brand-bg/60 px-4 sm:px-6 py-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-primary/80">
            Langkah 2 dari 3
          </p>
          <p className="text-xs sm:text-sm text-brand-text/70">
            Ambil foto terbaikmu untuk dimasukkan ke dalam receipt.
          </p>
        </div>
        <div className="flex flex-col items-end text-[10px] sm:text-[11px] text-brand-text/60 flex-shrink-0">
          <span className="whitespace-nowrap">
            Frame {Math.min(photos.length + 1, totalFrames)} / {totalFrames}
          </span>
          <button
            type="button"
            onClick={onBackHome}
            className="mt-1 text-[10px] font-semibold text-brand-primary hover:underline"
          >
            Ganti layout
          </button>
        </div>
      </div>

      <div className="relative bg-black aspect-[4/3]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* LIVE FEED badge di kiri */}
        <div className="absolute top-4 left-4 bg-white/15 px-3 py-1 text-xs font-bold text-white tracking-[0.3em]">
          LIVE FEED
        </div>

        {/* Tombol kamera & flash di kanan */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleCamera}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
          >
            <SwitchCamera size={18} />
          </button>
          <button
            type="button"
            onClick={onToggleTorch}
            disabled={facingMode === 'user'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Zap size={18} className={isTorchOn ? 'text-yellow-300' : 'text-white'} />
          </button>
        </div>

        {isFlashing && (
          <div className="absolute inset-0 bg-white opacity-100 transition-opacity duration-100" />
        )}

        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black bg-opacity-30">
            <span
              key={countdown}
              className="text-white text-9xl font-extrabold drop-shadow-lg animate-pulse"
            >
              {countdown}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-6 p-6 sm:p-8 bg-gradient-to-b from-white via-brand-bg/40 to-white">
        
        {/* PREVIEW THUMBNAILS */}
        {totalFrames > 1 && (
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${totalFrames}, 1fr)` }}>
            {Array.from({ length: totalFrames }).map((_, idx) => {
              const photo = photos[idx];
              return (
                <div 
                  key={idx} 
                  className={`relative overflow-hidden rounded-lg border-2 aspect-[4/3] ${
                    photo ? 'border-brand-primary' : 'border-dashed border-gray-300 bg-gray-50'
                  }`}
                >
                  {photo ? (
                    <img 
                      src={photo.data} 
                      alt={`Preview ${idx}`} 
                      className="h-full w-full object-cover"
                      style={{ filter: 'grayscale(100%) contrast(1.1)' }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-300">
                      {idx + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <p className="mb-2 text-brand-text/70">
            Foto {Math.min(photos.length + 1, totalFrames)} dari {totalFrames}
          </p>
          <div className="h-2 w-full rounded-full bg-brand-secondary">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-primary-hover transition-all"
              style={{ width: `${((photos.length) / totalFrames) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={onCapture}
            // Button disable kalau lagi countdown ATAU sudah full (sedang reviewing)
            disabled={isCountingDown || photos.length === totalFrames}
            className="flex-1 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-primary-hover py-4 text-lg font-bold text-white shadow-[0_20px_40px_rgba(47,75,138,0.35)] transition-transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Camera size={20} />
            {isCountingDown ? '...' : 'Ambil Foto'}
          </button>
          
          <button
            onClick={onRetake}
            disabled={photos.length === 0 || isCountingDown}
            className="flex-1 rounded-2xl border-2 border-brand-primary bg-white py-4 font-bold text-brand-primary transition-colors hover:bg-brand-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw size={20} />
            Undo
          </button>
        </div>
      </div>
    </div>
  );
}