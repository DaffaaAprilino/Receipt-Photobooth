// src/components/ResultScreen.tsx
import { Download, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Photo, PhotoFilter } from '../types';

interface Props {
  photos: Photo[];
  onDownload: () => void;
  onReset: () => void;
  receiptTitle: string;
  setReceiptTitle: (value: string) => void;
  selectedFilter: PhotoFilter;
}

const getCssFilter = (filter: PhotoFilter) => {
  switch (filter) {
    case 'vintage':
      // Nuansa jadul / nokia: sedikit sepia + kontras
      return 'sepia(0.4) contrast(1.05) brightness(1.02) saturate(1.05)';
    case 'bittersweet':
      // Warm reddish ala preset "bittersweet"
      return 'sepia(0.35) contrast(1.1) brightness(1.05) saturate(1.2) hue-rotate(-10deg)';
    case 'ogVintage':
      // OG vintage lebih pudar
      return 'sepia(0.6) contrast(1.03) brightness(1.0) saturate(0.9) hue-rotate(8deg)';
    case 'blackwhite':
      // Black & white kontras tinggi
      return 'grayscale(100%) contrast(1.35) brightness(0.98)';
    case 'normal':
    default:
      // Normal / tanpa filter
      return 'none';
  }
};

export default function ResultScreen({ photos, onDownload, onReset, receiptTitle, setReceiptTitle, selectedFilter }: Props) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto w-full rounded-3xl border border-white/60 bg-white/95 p-6 text-center shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:p-10 backdrop-blur-xl">
      <div className="space-y-2">
        <p className="inline-flex items-center rounded-full bg-brand-secondary/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-primary/90">
          Langkah 3 - Simpan hasil
        </p>
        <h2 className="text-3xl font-black text-brand-text">Receipt kamu siap!</h2>
        <p className="text-sm sm:text-base text-brand-text/70">Cek dulu preview-nya di bawah, lalu download kalau sudah pas.</p>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-sm font-['Courier_New',monospace]">
          <div
            id="receipt-preview"
            className="rounded-xl border-[3px] border-[#D9DDE6] bg-gradient-to-b from-white to-[#F5F7FB] px-7 py-8 shadow-[0_25px_45px_rgba(0,0,0,0.08)] receipt-jagged-edge"
          >
            <div className="text-center">
              <input
                type="text"
                value={receiptTitle}
                onChange={(e) => setReceiptTitle(e.target.value.slice(0, 15))}
                maxLength={15}
                className="w-full bg-transparent text-center text-[20px] font-black tracking-[0.4em] outline-none border-none placeholder:text-brand-text/30"
                aria-label="Judul struk"
                placeholder="RECEIPT (bisa diubah)"
              />
            </div>
            <p className="mt-2 text-center text-[12px] text-brand-text/70">
              {currentTime.toLocaleDateString('id-ID')} · {currentTime.toLocaleTimeString('id-ID')}
            </p>

            <div className="mt-5 border-y border-dashed border-[#D9DDE6] py-5 space-y-4">
              {photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="border border-[#D9DDE6] bg-[#EEF1F8] overflow-hidden"
                  // REVISI: Aspek Rasio Landscape 4/3
                  style={{ aspectRatio: '4 / 3' }}
                >
                  <img
                    src={photo.data}
                    alt={`Photo ${idx + 1}`}
                    className="h-full w-full object-cover"
                    style={{ filter: getCssFilter(selectedFilter) }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs sm:text-sm text-brand-text/60">
        Judul receipt bisa kamu ganti sendiri (maks. 15 karakter) di kolom di atas.
      </p>


      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <button
          onClick={onDownload}
          className="flex-1 rounded-full bg-brand-primary px-8 py-4 text-lg font-bold text-white shadow-[0_18px_40px_rgba(47,75,138,0.35)] transition-transform hover:scale-[1.02]"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Download size={20} />
            Download Receipt
          </span>
        </button>
        <button
          onClick={onReset}
          className="flex-1 rounded-full border-2 border-brand-primary px-8 py-4 text-lg font-bold text-brand-primary transition-colors hover:bg-brand-secondary"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <RotateCcw size={20} />
            Kembali ke awal
          </span>
        </button>
      </div>
    </div>
  );
}
