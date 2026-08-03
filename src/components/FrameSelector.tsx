// src/components/FrameSelector.tsx
import { useEffect, useState } from 'react';
import { FrameCount } from '../types';
import { Camera } from 'lucide-react';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const frameDescriptions: Record<number, string> = {
    1: 'Solo shot',
    2: 'Pasangan',
    3: 'Trio pose',
    4: 'Full strip',
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto rounded-3xl border border-brand-secondary bg-white/80 backdrop-blur-sm p-6 sm:p-10 shadow-premium paper-texture overflow-hidden transition-all duration-500 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">

        {/* Left Column */}
        <div className="md:col-span-7 space-y-6 flex flex-col justify-center">
          <div className="space-y-3">
            {/* Step badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/12 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-accent border border-brand-accent/20 w-fit animate-fade-up">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              Langkah 1  Pilih Layout Struk
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-text animate-fade-up animate-delay-100">
              Receipt Photobooth
            </h2>
            <p className="text-sm sm:text-base text-brand-text/65 leading-relaxed animate-fade-up animate-delay-200">
              Tentukan berapa banyak foto yang ingin dicetak di struk belanjamu. Pilih dari 1 hingga 4 frame di bawah ini.
            </p>
          </div>

          {/* Frame count grid */}
          <div className="space-y-2 animate-fade-up animate-delay-200">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-text/50">
              Pilih Jumlah Frame Foto
            </p>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              {([1, 2, 3, 4] as const).map((num, i) => {
                const isActive = selectedFrameCount === num;
                return (
                  <button
                    key={num}
                    onClick={() => setSelectedFrameCount(num)}
                    className={`group relative h-24 w-full rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden ${
                      isActive
                        ? 'border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/25 scale-[1.04]'
                        : 'border-brand-secondary bg-white/60 text-brand-text/70 hover:border-brand-primary/40 hover:bg-white hover:scale-[1.02] hover:shadow-md'
                    }`}
                    style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                  >
                    {/* Active glow */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    )}

                    <span className={`text-2xl font-heading font-bold leading-none ${isActive ? 'text-white' : 'text-brand-text'}`}>
                      {num}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isActive ? 'text-white/80' : 'text-brand-text/45'}`}>
                      {num === 1 ? 'Frame' : 'Frames'}
                    </span>
                    <span className={`text-[9px] mt-0.5 ${isActive ? 'text-white/60' : 'text-brand-text/35'}`}>
                      {frameDescriptions[num]}
                    </span>

                    {/* Bottom receipt jagged hint */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1.5"
                        style={{
                          background: 'linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.2) 75%) 0 0/6px 6px repeat-x, linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.2) 75%) 3px 0/6px 6px repeat-x',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2 flex flex-col gap-3 animate-fade-up animate-delay-300">
            <button
              onClick={() => onFrameSelect(selectedFrameCount)}
              className="btn-shine inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-primary px-10 py-4 text-base font-bold uppercase tracking-wider text-white shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 hover:bg-brand-primary-hover transition-all hover:scale-[1.03] active:scale-[0.97] duration-200 cursor-pointer font-heading w-full sm:w-auto self-start"
            >
              <Camera size={18} />
              Mulai Sesi Foto
            </button>
            <p className="text-xs text-brand-text/45">
              Kamera web/smartphone akan diaktifkan di langkah berikutnya.
            </p>
          </div>
        </div>

        {/* Right Column: Receipt Live Preview */}
        <div className="md:col-span-5 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-brand-secondary/50 pt-8 md:pt-0 md:pl-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-text/40 mb-5 font-heading">
            Live Preview Struk
          </p>

          {/* Scrapbook-style frame wrapper */}
          <div className="relative">
            {/* Tape decoration top */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-12 h-4 rounded-sm rotate-[-1deg]"
              style={{ background: 'rgba(200,122,83,0.22)', backdropFilter: 'blur(2px)' }}
            />

            <div className="relative w-full max-w-[220px] font-['Courier_New',monospace] select-none text-brand-text">
              <div
                className="relative rounded-2xl border-[3px] border-brand-secondary bg-white px-5 py-6 shadow-receipt receipt-jagged-edge transition-all duration-300"
              >
                {/* Header */}
                <div className="text-center text-[16px] font-bold tracking-[0.3em]">RECEIPT</div>
                <p className="mt-1 text-center text-[9px] text-brand-text/50">
                  {currentTime.toLocaleDateString('id-ID')} · {currentTime.toLocaleTimeString('id-ID')}
                </p>

                {/* Dashed divider */}
                <div className="mt-4 border-t border-b border-dashed border-brand-secondary py-3 space-y-2.5 transition-all duration-300">
                  {Array.from({ length: selectedFrameCount }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center gap-1 rounded-lg border border-brand-secondary bg-brand-bg/40 text-[9px] font-semibold text-brand-text/45 transition-all duration-300"
                      style={{ aspectRatio: '4 / 3' }}
                    >
                      <Camera size={11} className="opacity-40 text-brand-primary" />
                      <span>FOTO {idx + 1}</span>
                    </div>
                  ))}
                </div>

                {/* Barcode mock */}
                <div className="mt-4 pt-1 flex flex-col items-center gap-1">
                  <div className="h-5 w-full flex items-center justify-center opacity-60">
                    <div className="h-full flex gap-[1.5px] justify-center">
                      {[2,1,3,1,2,4,1,2,3,1,2,2,4,1,2].map((w, i) => (
                        <div key={i} className="h-full bg-brand-text" style={{ width: `${w}px` }} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[6px] text-brand-text/35 tracking-[0.2em] font-bold uppercase">#SMILE-FOR-MOMENTS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Frame count hint */}
          <p className="mt-4 text-[11px] text-brand-text/40 text-center">
            {selectedFrameCount} foto · receipt vertikal
          </p>
        </div>

      </div>
    </div>
  );
}