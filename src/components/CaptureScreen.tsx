// src/components/CaptureScreen.tsx
import { LegacyRef } from 'react';
import { Camera, RotateCcw, Check, SwitchCamera, Zap, Sparkles, Upload } from 'lucide-react';
import { Photo, PhotoFilter } from '../types';

const getCssFilter = (filter: PhotoFilter) => {
  switch (filter) {
    case 'vintage':
      return 'sepia(0.4) contrast(1.05) brightness(1.02) saturate(1.05)';
    case 'bittersweet':
      return 'sepia(0.35) contrast(1.1) brightness(1.05) saturate(1.2) hover:hue-rotate(-10deg)';
    case 'ogVintage':
      return 'sepia(0.6) contrast(1.03) brightness(1.0) saturate(0.9) hue-rotate(8deg)';
    case 'blackwhite':
      return 'grayscale(100%) contrast(1.35) brightness(0.98)';
    case 'normal':
    default:
      return 'none';
  }
};

interface Props {
  videoRef: LegacyRef<HTMLVideoElement>;
  onCapture: () => void;
  onRetake: () => void;
  onConfirm: () => void;
  isReviewing: boolean;
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
  selectedFilter: PhotoFilter;
  onFilterChange: (value: PhotoFilter) => void;
  onPhotoUpload: (dataUrl: string) => void;
}

export default function CaptureScreen({
  videoRef,
  onCapture,
  onRetake,
  onConfirm,
  isReviewing,
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
  selectedFilter,
  onFilterChange,
  onPhotoUpload,
}: Props) {

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onPhotoUpload(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset value
  };

  return (
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-brand-secondary bg-white shadow-premium overflow-hidden relative paper-texture">
      
      {/* OVERLAY MODAL REVIEW KONFIRMASI */}
      {isReviewing && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F5]/90 backdrop-blur-md p-6 text-center animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl border border-brand-secondary shadow-premium max-w-sm w-full space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand-accent/15 flex items-center justify-center text-brand-accent">
              <Sparkles size={30} className="animate-bounce" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold text-brand-text">Sesi Foto Selesai!</h3>
              <p className="text-sm text-brand-text/75 mt-2">
                Semua frame sudah terisi. Mau lanjut cetak atau ingin mengulang foto terakhir?
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={onConfirm}
                className="w-full rounded-full bg-brand-accent hover:bg-brand-accent-hover py-4 font-bold text-white shadow-lg shadow-brand-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer font-heading uppercase tracking-wider text-sm"
              >
                <Check size={18} />
                Lanjut Cetak Struk
              </button>
              
              <button
                onClick={onRetake}
                className="w-full rounded-full border-2 border-brand-secondary py-3.5 font-bold text-brand-text/70 hover:bg-brand-bg transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-xs font-semibold"
              >
                <RotateCcw size={14} />
                Ulang Foto Terakhir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER LANGKAH */}
      <div className="flex items-center justify-between gap-3 border-b border-brand-secondary bg-brand-bg/40 px-5 py-4">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1 rounded-full bg-brand-accent/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-accent border border-brand-accent/15">
            Langkah 2 dari 3
          </div>
          <p className="mt-1.5 text-xs text-brand-text/75">
            Ambil foto terbaikmu untuk struk belanja.
          </p>
        </div>
        <div className="flex flex-col items-end text-[11px] text-brand-text/60 flex-shrink-0">
          <span className="font-bold bg-brand-secondary px-2.5 py-1 rounded-full text-[10px]">
            Frame {Math.min(photos.length + 1, totalFrames)} / {totalFrames}
          </span>
          <button
            type="button"
            onClick={onBackHome}
            className="mt-1.5 text-[10px] font-bold text-brand-primary hover:text-brand-accent hover:underline cursor-pointer"
          >
            Ubah layout
          </button>
        </div>
      </div>

      {/* Grid: 2 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-5 sm:p-6 bg-white">
        
        {/* Left Column: Camera Live Feed (7/12 width) */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="relative overflow-hidden rounded-2xl border-[3px] border-brand-secondary bg-black aspect-[4/3] shadow-inner w-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{
                transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                filter: getCssFilter(selectedFilter),
              }}
            />

            {/* LIVE RECORDING BADGE */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white tracking-wider flex items-center gap-1.5 border border-white/10 select-none">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-blink"></span>
              LIVE FEED
            </div>

            {/* KAMERA CONTROLS */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleCamera}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md hover:bg-black/75 transition-colors cursor-pointer"
                title="Balik Kamera"
              >
                <SwitchCamera size={16} />
              </button>
              <button
                type="button"
                onClick={onToggleTorch}
                disabled={facingMode === 'user'}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md hover:bg-black/75 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Senter (Kamera Belakang)"
              >
                <Zap size={16} className={isTorchOn ? 'text-yellow-400 fill-yellow-400' : 'text-white'} />
              </button>
            </div>

            {/* FLASHING EFFECT */}
            {isFlashing && (
              <div className="absolute inset-0 bg-white opacity-100 transition-opacity duration-100" />
            )}

            {/* COUNTDOWN NUMBER */}
            {countdown !== null && countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black bg-opacity-30">
                <span
                  key={countdown}
                  className="text-white text-8xl font-heading font-bold drop-shadow-md animate-ping"
                >
                  {countdown}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Previews, Filters, Controls (5/12 width) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-6">
          
          {/* PILIHAN FILTER */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-text/50 font-heading">
              Filter Kamera
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {([
                { id: 'normal', name: 'Original' },
                { id: 'vintage', name: 'Warm Film' },
                { id: 'bittersweet', name: 'Rose Tint' },
                { id: 'ogVintage', name: 'Dusty Retro' },
                { id: 'blackwhite', name: 'B&W Thermal' },
              ] as const).map(filter => {
                const isSelected = selectedFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => onFilterChange(filter.id)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/10'
                        : 'bg-white text-brand-text/75 border border-brand-secondary hover:bg-brand-bg'
                    }`}
                  >
                    {filter.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* THUMBNAILS POLAROID MINI */}
          {totalFrames > 1 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-text/50 font-heading">
                Hasil Jepretan ({photos.length}/{totalFrames})
              </p>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${totalFrames}, 1fr)` }}>
                {Array.from({ length: totalFrames }).map((_, idx) => {
                  const photo = photos[idx];
                  return (
                    <div 
                      key={idx} 
                      className={`relative overflow-hidden rounded-xl border border-brand-secondary bg-white p-1 pb-3 shadow-sm transition-all duration-300 aspect-[3.5/4] flex flex-col justify-between ${
                        photo ? 'scale-[1.02] border-brand-accent/40 bg-white shadow-md' : 'border-dashed border-brand-secondary bg-brand-bg/30'
                      }`}
                    >
                      {photo ? (
                        <div className="w-full aspect-[4/3] overflow-hidden rounded-lg">
                          <img 
                            src={photo.data} 
                            alt={`Preview ${idx}`} 
                            className="h-full w-full object-cover"
                            style={{ filter: getCssFilter(selectedFilter) }}
                          />
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-[10px] font-bold text-brand-text/30">
                          {idx + 1}
                        </div>
                      )}
                      <div className="h-1.5 flex items-center justify-center">
                        {photo && <span className="h-1.5 w-1.5 rounded-full bg-brand-accent"></span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PROGRESS BAR */}
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-brand-secondary overflow-hidden p-[2px]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-accent/80 transition-all duration-500"
                style={{ width: `${((photos.length) / totalFrames) * 100}%` }}
              />
            </div>
          </div>

          {/* TOMBOL KONTROL UTAMA */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={onCapture}
              disabled={isCountingDown || photos.length === totalFrames}
              className="w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer font-heading uppercase tracking-wider"
            >
              <Camera size={18} />
              {isCountingDown ? 'Siap-siap...' : 'Ambil Foto'}
            </button>
            
            <input 
              type="file" 
              accept="image/*" 
              id="gallery-upload" 
              className="hidden" 
              onChange={handleFileUpload} 
              disabled={photos.length === totalFrames || isCountingDown}
            />
            
            <button
              type="button"
              onClick={() => document.getElementById('gallery-upload')?.click()}
              disabled={photos.length === totalFrames || isCountingDown}
              className="w-full rounded-full border-2 border-dashed border-brand-accent/50 bg-white py-3 text-xs font-bold text-brand-accent transition-all hover:bg-brand-bg/40 flex items-center justify-center gap-2 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider font-heading"
            >
              <Upload size={14} />
              Unggah Foto Galeri
            </button>

            <button
              onClick={onRetake}
              disabled={photos.length === 0 || isCountingDown}
              className="w-full rounded-full border-2 border-brand-primary bg-white py-3 text-xs font-bold text-brand-primary transition-all hover:bg-brand-secondary/40 flex items-center justify-center gap-2 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider font-heading"
            >
              <RotateCcw size={14} />
              Undo Foto Terakhir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}