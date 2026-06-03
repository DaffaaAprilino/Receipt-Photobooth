// src/components/FrameSelector.tsx
import { useEffect, useState } from 'react';
import { FrameCount } from '../types';
import { Camera, Sparkles } from 'lucide-react';

interface Props {
  onFrameSelect: (count: FrameCount) => void;
  defaultFrameCount: FrameCount;
}

export default function FrameSelector({ 
  onFrameSelect, 
  defaultFrameCount
}: Props) {
  const [selectedFrameCount, setSelectedFrameCount] = useState<FrameCount>(defaultFrameCount);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-brand-secondary bg-white p-6 sm:p-10 shadow-premium paper-texture overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
        
        {/* Left Column: Title, Frame selector */}
        <div className="md:col-span-7 space-y-6 flex flex-col justify-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-accent border border-brand-accent/20 w-fit">
              <Sparkles size={12} />
              Langkah 1 - Pilih Layout Struk
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-text">Receipt Photobooth</h2>
            <p className="text-sm sm:text-base text-brand-text/75">
              Tentukan berapa banyak foto yang ingin dicetak di struk belanjamu. Pilih dari 1 hingga 4 frame di bawah ini.
            </p>
          </div>

          {/* Grid selector untuk frame */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-text/65">
              Pilih Jumlah Frame Foto
            </p>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              {([1, 2, 3, 4] as const).map(num => {
                const isActive = selectedFrameCount === num;
                return (
                  <button
                    key={num}
                    onClick={() => setSelectedFrameCount(num)}
                    className={`h-20 w-full rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-[1.03]'
                        : 'border-brand-secondary bg-brand-secondary/35 text-brand-text/70 hover:border-brand-primary/45 hover:bg-brand-secondary/60'
                    }`}
                  >
                    <span className={`text-2xl font-heading font-bold ${isActive ? 'text-white' : 'text-brand-text'}`}>{num}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-75">
                      {num === 1 ? 'Frame' : 'Frames'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => onFrameSelect(selectedFrameCount)}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-primary px-10 py-4 text-base font-bold uppercase tracking-wider text-white shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all hover:scale-[1.03] active:scale-[0.97] duration-200 cursor-pointer font-heading w-full sm:w-auto self-start"
            >
              <Camera size={18} />
              Mulai Sesi Foto
            </button>
            <p className="text-xs text-brand-text/60">
              Kamera web/smartphone akan diaktifkan di langkah berikutnya.
            </p>
          </div>
        </div>

        {/* Right Column: Live Preview Struk */}
        <div className="md:col-span-5 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-brand-secondary/60 pt-8 md:pt-0 md:pl-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-text/50 mb-5 font-heading">
            Live Preview Struk
          </p>
          <div className="relative w-full max-w-[240px] font-['Courier_New',monospace] select-none text-brand-text">
            <div className="relative rounded-2xl border-[3px] border-brand-secondary bg-white px-5 py-6 shadow-receipt receipt-jagged-edge">
              <div className="text-center text-[16px] font-bold tracking-[0.3em]">RECEIPT</div>
              <p className="mt-1 text-center text-[9px] text-brand-text/65">
                {currentTime.toLocaleDateString('id-ID')} · {currentTime.toLocaleTimeString('id-ID')}
              </p>
              
              <div className="mt-4 border-t border-b border-dashed border-brand-secondary py-3 space-y-2.5">
                {Array.from({ length: selectedFrameCount }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center gap-1 rounded-lg border border-brand-secondary bg-brand-bg/40 text-[9px] font-semibold text-brand-text/50 transition-all duration-300"
                    style={{ aspectRatio: '4 / 3' }}
                  >
                    <Camera size={12} className="opacity-50 animate-pulse text-brand-primary" />
                    <span>FOTO {idx + 1}</span>
                  </div>
                ))}
              </div>

              {/* Barcode Mock */}
              <div className="mt-4 pt-2 flex flex-col items-center gap-1">
                <div className="h-5 w-full flex items-center justify-center opacity-75">
                  <div className="h-full flex gap-[1.5px] justify-center">
                    <div className="h-full w-[2px] bg-brand-text"></div>
                    <div className="h-full w-[1px] bg-brand-text"></div>
                    <div className="h-full w-[3px] bg-brand-text"></div>
                    <div className="h-full w-[1px] bg-brand-text"></div>
                    <div className="h-full w-[2px] bg-brand-text"></div>
                    <div className="h-full w-[4px] bg-brand-text"></div>
                    <div className="h-full w-[1px] bg-brand-text"></div>
                    <div className="h-full w-[2px] bg-brand-text"></div>
                    <div className="h-full w-[3px] bg-brand-text"></div>
                    <div className="h-full w-[1px] bg-brand-text"></div>
                    <div className="h-full w-[2px] bg-brand-text"></div>
                  </div>
                </div>
                <span className="text-[6px] text-brand-text/45 tracking-[0.2em] font-sans uppercase font-bold">#SMILE-FOR-MOMENTS</span>
              </div>
              
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}