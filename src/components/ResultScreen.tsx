// src/components/ResultScreen.tsx
import { Download, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Photo, PhotoFilter } from '../types';

interface Props {
  photos: Photo[];
  onDownload: () => void;
  onReset: () => void;
  receiptTitle: string;
  selectedFilter: PhotoFilter;
}

const getCssFilter = (filter: PhotoFilter) => {
  switch (filter) {
    case 'vintage':
      return 'sepia(0.4) contrast(1.05) brightness(1.02) saturate(1.05)';
    case 'bittersweet':
      return 'sepia(0.35) contrast(1.1) brightness(1.05) saturate(1.2) hue-rotate(-10deg)';
    case 'ogVintage':
      return 'sepia(0.6) contrast(1.03) brightness(1.0) saturate(0.9) hue-rotate(8deg)';
    case 'blackwhite':
      return 'grayscale(100%) contrast(1.35) brightness(0.98)';
    case 'normal':
    default:
      return 'none';
  }
};

export default function ResultScreen({
  photos,
  onDownload,
  onReset,
  receiptTitle,
  selectedFilter
}: Props) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Bikin transaction ID acak sekali saat komponen diload
    const randomNum = Math.floor(Math.random() * 900000 + 100000);
    setTransactionId(`#PB-${randomNum}`);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto w-full rounded-3xl border border-brand-secondary bg-white/80 backdrop-blur-sm p-6 sm:p-10 shadow-premium paper-texture overflow-hidden animate-fade-up">
      
      {/* HEADER LANGKAH */}
      <div className="text-center space-y-3 mb-10 pb-6 border-b border-brand-secondary/60">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/12 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-accent border border-brand-accent/20">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          Langkah 3  Simpan &amp; Cetak Hasil
        </div>
        <h2 className="text-3xl font-heading font-bold text-brand-text">Receipt Kamu Siap!</h2>
        <p className="text-sm text-brand-text/60 max-w-md mx-auto">
          Lihat pratinjau struk thermal kamu di kolom kiri dan unduh hasilnya langsung ke perangkatmu.
        </p>
      </div>

      {/* GRID LAYOUT UTAMA: 2 Kolom (Desktop), 1 Kolom (Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
        
        {/* KOLOM KIRI: MOCKUP STRUK THERMAL (45% lebar) */}
        <div className="md:col-span-5 flex justify-center w-full">
          <div className="w-full max-w-[280px] font-['Courier_New',monospace] select-none text-brand-text animate-fade-up animate-delay-100">
            {/* Tape scrapbook decoration */}
            <div className="flex justify-center mb-1">
              <div
                className="w-12 h-4 rounded-sm"
                style={{ background: 'rgba(200,122,83,0.22)', transform: 'rotate(-1.5deg)' }}
              />
            </div>
            <div
              id="receipt-preview"
              className="rounded-2xl border-[3px] border-brand-secondary bg-white px-6 py-8 shadow-receipt receipt-jagged-edge relative overflow-hidden"
            >
              {/* Judul Struk */}
              <div className="text-center text-[18px] font-bold tracking-[0.3em] uppercase break-words">
                {receiptTitle || 'RECEIPT'}
              </div>
              <p className="mt-2 text-center text-[10px] text-brand-text/65 leading-tight">
                {currentTime.toLocaleDateString('id-ID')} · {currentTime.toLocaleTimeString('id-ID')}
              </p>

              {/* Garis Dashed */}
              <div className="mt-4 border-t border-dashed border-brand-secondary"></div>

              {/* Area Foto-foto */}
              <div className="py-4 space-y-4">
                {photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="border border-brand-secondary bg-brand-bg/30 overflow-hidden rounded-lg aspect-[4/3]"
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

              {/* Garis Dashed */}
              <div className="border-t border-dashed border-brand-secondary"></div>

              {/* Daftar Barang Belanjaan Lucu */}
              <div className="py-2.5 text-[8px] space-y-1 font-bold uppercase tracking-wider pl-1 pr-1">
                <div className="text-[9px] text-brand-text/50 mb-1">ITEMS:</div>
                {Array.from({ length: photos.length }).map((_, idx) => {
                  const itemNames = ["SWEET SMILE", "CUTE POSE", "SHINY MOMENT", "HAPPY VIBES"];
                  return (
                    <div key={idx} className="flex justify-between pl-1">
                      <span>1x {itemNames[idx % itemNames.length]}</span>
                      <span>0.00</span>
                    </div>
                  );
                })}
                <div className="border-t border-dashed border-brand-secondary my-1.5"></div>
                <div className="flex justify-between text-[9px] font-extrabold">
                  <span>TOTAL AMOUNT:</span>
                  <span>0.00</span>
                </div>
              </div>

              {/* Garis Dashed */}
              <div className="border-t border-dashed border-brand-secondary"></div>

              {/* Metadata Struk */}
              <div className="py-3 text-[9px] space-y-1 text-brand-text/80 font-bold uppercase tracking-wider">
                <div className="flex justify-between">
                  <span>QTY:</span>
                  <span>{photos.length} PHOTO(S)</span>
                </div>
                <div className="flex justify-between">
                  <span>TRANS ID:</span>
                  <span>{transactionId}</span>
                </div>
                <div className="flex justify-between flex-wrap gap-x-1">
                  <span>PAYMENT:</span>
                  <span>SMILE &amp; LOVE</span>
                </div>
                <div className="flex justify-between">
                  <span>TAX:</span>
                  <span>0.00%</span>
                </div>
              </div>

              {/* Garis Dashed */}
              <div className="border-t border-dashed border-brand-secondary"></div>

              {/* Barcode Mock - CENTERED */}
              <div className="mt-4 pt-1 flex flex-col items-center gap-1.5">
                <div className="h-7 w-full flex items-center justify-center opacity-75">
                  <div className="h-full flex gap-[1.5px] justify-center">
                    <div className="h-full w-[2px] bg-brand-text"></div>
                    <div className="h-full w-[1px] bg-brand-text"></div>
                    <div className="h-full w-[3px] bg-brand-text"></div>
                    <div className="h-full w-[1px] bg-brand-text"></div>
                    <div className="h-full w-[1px] bg-brand-text"></div>
                    <div className="h-full w-[2px] bg-brand-text"></div>
                    <div className="h-full w-[4px] bg-brand-text"></div>
                    <div className="h-full w-[1px] bg-brand-text"></div>
                    <div className="h-full w-[2px] bg-brand-text"></div>
                    <div className="h-full w-[1px] bg-brand-text"></div>
                    <div className="h-full w-[3px] bg-brand-text"></div>
                    <div className="h-full w-[1px] bg-brand-text"></div>
                    <div className="h-full w-[2px] bg-brand-text"></div>
                    <div className="h-full w-[2px] bg-brand-text"></div>
                    <div className="h-full w-[4px] bg-brand-text"></div>
                    <div className="h-full w-[1px] bg-brand-text"></div>
                  </div>
                </div>
                <span className="text-[7px] text-brand-text/50 tracking-[0.25em] font-sans font-bold">#THANK-YOU</span>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: RINCIAN CETAK STRUK & AKSI (55% lebar) */}
        <div className="md:col-span-7 space-y-6 animate-fade-up animate-delay-200">
          <div className="rounded-2xl border border-brand-secondary bg-white/60 backdrop-blur-sm p-5 sm:p-6 space-y-5">
            <h3 className="text-lg font-heading font-bold text-brand-text flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent">
                <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
              </svg>
              Rincian Cetak Struk
            </h3>
            
            {/* List of Details with Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider text-brand-text/75">
              <div className="p-3.5 bg-white border border-brand-secondary rounded-2xl flex flex-col gap-1 shadow-sm">
                <span className="text-[10px] opacity-50">Tipe Layout</span>
                <span className="text-sm font-bold font-heading text-brand-primary">{photos.length} Frame(s)</span>
              </div>
              
              <div className="p-3.5 bg-white border border-brand-secondary rounded-2xl flex flex-col gap-1 shadow-sm">
                <span className="text-[10px] opacity-50">Resolusi Ekspor</span>
                <span className="text-sm font-bold font-heading text-emerald-600">⚡ Ultra HD (1280px)</span>
              </div>

              <div className="p-3.5 bg-white border border-brand-secondary rounded-2xl flex flex-col gap-1 shadow-sm">
                <span className="text-[10px] opacity-50">Filter Kamera</span>
                <span className="text-sm font-bold font-heading text-brand-primary capitalize font-sans">
                  {selectedFilter === 'blackwhite' 
                    ? 'B&W Thermal' 
                    : selectedFilter === 'normal' 
                      ? 'Original' 
                      : selectedFilter.replace(/([A-Z])/g, ' $1')}
                </span>
              </div>
            </div>

            {/* Hint Box */}
            <div className="flex gap-2.5 items-start p-4 bg-brand-primary/5 border border-brand-primary/15 rounded-2xl text-xs text-brand-text/65 leading-relaxed">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
              </svg>
              <span>
                Tekan <strong>Cetak &amp; Download</strong> untuk memicu printer virtual. Animasi cetak thermal akan muncul, lalu file HD otomatis tersimpan ke perangkatmu.
              </span>
            </div>
          </div>

          {/* TOMBOL AKSI UTAMA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onDownload}
              className="btn-shine flex-1 rounded-full bg-brand-primary hover:bg-brand-primary-hover py-4 text-base font-bold text-white shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer font-heading uppercase tracking-wider"
            >
              <Download size={18} />
              Cetak &amp; Download Struk
            </button>
            
            <button
              onClick={onReset}
              className="rounded-full border-2 border-brand-secondary bg-white hover:bg-brand-bg px-6 py-4 text-sm font-bold text-brand-text/70 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider font-heading"
            >
              <RotateCcw size={16} />
              Mulai Ulang
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
