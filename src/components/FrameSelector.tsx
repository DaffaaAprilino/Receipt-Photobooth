// src/components/FrameSelector.tsx
import { useState } from 'react';
import { FrameCount } from '../types';

interface Props {
  onFrameSelect: (count: FrameCount) => void;
  defaultFrameCount: FrameCount;
}

export default function FrameSelector({ onFrameSelect, defaultFrameCount }: Props) {
  const [selectedFrameCount, setSelectedFrameCount] = useState<FrameCount>(defaultFrameCount);

  return (
    <div className="w-full max-w-lg mx-auto rounded-2xl border border-white/70 bg-white/90 p-8 text-center shadow-[0_25px_80px_rgba(47,75,138,0.15)]">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-brand-text">Receipt Photobooth</h1>
        <p className="text-base text-brand-text/70">
          Pilih jumlah frame yang mau kamu foto hari ini.
        </p>
      </div>

      <div className="mt-10 grid gap-4 grid-cols-4 place-items-center">
        {([1, 2, 3, 4] as const).map(num => {
          const isActive = selectedFrameCount === num;
          return (
            <button
              key={num}
              onClick={() => setSelectedFrameCount(num)}
              // REVISI: Ubah shadow jadi abu-abu (gray-400/50)
              className={`h-24 w-full rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'border-brand-primary bg-brand-primary text-white shadow-[0_10px_20px_rgba(156,163,175,0.5)] scale-105'
                  : 'border-brand-secondary bg-brand-secondary text-brand-primary/70 hover:border-brand-primary/50 hover:bg-brand-secondary/80'
              }`}
            >
              <span className="text-3xl font-black">{num}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                Frame
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-12 mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-brand-text/60 mb-6">
          Preview Receipt
        </p>
        <div className="flex justify-center">
          <div className="relative w-full max-w-[280px] font-['Courier_New',monospace]">
            <div className="relative rounded-xl border-[3px] border-[#D9DDE6] bg-gradient-to-b from-white to-[#F5F7FB] p-6 shadow-sm receipt-jagged-edge">
              <div className="text-center text-[18px] font-black tracking-[0.3em]">RECEIPT</div>
              <p className="mt-1 text-center text-[11px] text-brand-text/70">
                {new Date().toLocaleDateString('id-ID')} · {new Date().toLocaleTimeString('id-ID')}
              </p>
              
              <div className="mt-4 border-t border-b border-dashed border-[#D9DDE6] py-4 space-y-3">
                {Array.from({ length: selectedFrameCount }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-center border border-[#D9DDE6] bg-[#EEF1F8] text-xs font-semibold text-brand-text/60"
                    style={{ aspectRatio: '4 / 3' }}
                  >
                    Photo {idx + 1}
                  </div>
                ))}
              </div>
              
              {/* Titik di bawah angka sebelum THANK YOU */}
              <p className="mt-3 text-center text-[10px] tracking-[0.4em] text-brand-text/40">
                • • • • • • • •
              </p>

              <p className="mt-2 text-center text-xs font-bold tracking-[0.4em] text-brand-text/70">
                THANK YOU
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        <button
          onClick={() => onFrameSelect(selectedFrameCount)}
          // REVISI: Ubah shadow jadi abu-abu (gray-400/50)
          className="inline-flex items-center gap-3 rounded-full bg-brand-primary px-12 py-4 text-xl font-bold uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(156,163,175,0.5)] transition-transform hover:scale-105 active:scale-95"
        >
          Mulai
        </button>

        <p className="text-sm text-brand-text/60">
          Tekan tombol di atas untuk memulai foto.
        </p>
      </div>
    </div>
  );
}