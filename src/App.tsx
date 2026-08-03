// src/App.tsx
import { useEffect, useRef, useState } from 'react';
import PhotoBooth from './components/PhotoBooth';
import { Camera } from 'lucide-react';

// Typewriter hook
function useTypewriter(text: string, speed = 55, startDelay = 400) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setDone(false);
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// Floating scrapbook photo decoration
function ScrapPhoto({
  style,
  rotate,
  delay = 0,
  children,
}: {
  style?: React.CSSProperties;
  rotate: number;
  delay?: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="absolute hidden lg:block photo-card-scrapbook select-none pointer-events-none"
      style={{
        transform: `rotate(${rotate}deg)`,
        animationDelay: `${delay}s`,
        animationName: 'float-gentle',
        animationDuration: `${5 + Math.abs(rotate) * 0.3}s`,
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        ['--float-rotate' as string]: `${rotate}deg`,
        ...style,
      }}
    >
      {children ?? (
        <div className="w-full h-full bg-brand-secondary/30 rounded-sm flex items-end justify-center pb-1">
          <span
            className="text-[7px] text-brand-text/30 font-bold tracking-wider uppercase"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            photo
          </span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const { displayed: tagline, done: taglineDone } = useTypewriter(
    'Cetak momenmu dalam bentuk receipt kece.',
    45,
    600
  );
  const badgeRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden font-sans text-brand-text relative"
      style={{ background: 'linear-gradient(160deg, #F7F5F0 0%, #EDE9E1 40%, #F0EBE0 100%)' }}
    >
      {/* ── Background noise texture ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Floating scrapbook decorations (desktop only) ── */}
      {/* Left side photos */}
      <ScrapPhoto style={{ top: '12%', left: '-18px', width: '100px', height: '130px' }} rotate={-8} delay={0}>
        <div className="w-full h-full bg-gradient-to-br from-brand-secondary/50 to-brand-secondary/20 rounded-sm" />
      </ScrapPhoto>
      <ScrapPhoto style={{ top: '38%', left: '24px', width: '80px', height: '100px' }} rotate={5} delay={1.2}>
        <div className="w-full h-full bg-brand-accent/10 rounded-sm" />
      </ScrapPhoto>
      <ScrapPhoto style={{ bottom: '20%', left: '-10px', width: '90px', height: '115px' }} rotate={-4} delay={0.8}>
        <div className="w-full h-full bg-brand-primary/8 rounded-sm" />
      </ScrapPhoto>

      {/* Right side photos */}
      <ScrapPhoto style={{ top: '8%', right: '-12px', width: '108px', height: '140px' }} rotate={9} delay={0.4}>
        <div className="w-full h-full bg-brand-secondary/40 rounded-sm" />
      </ScrapPhoto>
      <ScrapPhoto style={{ top: '42%', right: '20px', width: '75px', height: '95px' }} rotate={-6} delay={1.6}>
        <div className="w-full h-full bg-brand-accent/8 rounded-sm" />
      </ScrapPhoto>
      <ScrapPhoto style={{ bottom: '15%', right: '8px', width: '95px', height: '120px' }} rotate={4} delay={0.6}>
        <div className="w-full h-full bg-brand-primary/6 rounded-sm" />
      </ScrapPhoto>

      {/* ── Main content ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 sm:gap-10 px-4 py-8 sm:py-12">

        {/* ── HEADER / NAVBAR ── */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-up">
          {/* Logo area */}
          <div className="flex items-center gap-3">
            {/* Mini printer icon */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #3D5245, #2D3F34)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-heading font-bold text-brand-text leading-none">Receipt Photobooth</div>
              <div className="text-[10px] text-brand-text/45 leading-none mt-0.5 tracking-wider uppercase" style={{ fontFamily: "'Courier New', monospace" }}>
                v2.0 · thermal printer
              </div>
            </div>
          </div>

          {/* Badges */}
          <div
            ref={badgeRef}
            className="flex flex-wrap gap-2 animate-fade-up animate-delay-200"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-bold shadow-sm border border-brand-secondary text-brand-text/65 backdrop-blur-sm">
              <Camera size={11} className="text-brand-text/50" />
              3 Langkah Cepat
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-bold shadow-sm border border-brand-secondary text-brand-text/65 backdrop-blur-sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-brand-text/50">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              File HD Export
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-bold shadow-sm border border-brand-secondary text-brand-text/65 backdrop-blur-sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-brand-text/50">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
              </svg>
              Gratis &amp; Instant
            </span>
          </div>
        </header>

        {/* ── HERO TAGLINE ── */}
        <div className="text-center space-y-4 animate-fade-up animate-delay-100 -mt-2">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold leading-tight text-brand-text min-h-[1.3em]"
          >
            {tagline}
            {!taglineDone && (
              <span className="cursor-blink inline-block ml-1 text-brand-accent" style={{ fontFamily: 'monospace' }}>|</span>
            )}
          </h1>
          <p className="max-w-lg mx-auto text-sm sm:text-base text-brand-text/65 leading-relaxed animate-fade-up animate-delay-300">
            Pilih layout, foto beberapa kali, lalu dapatkan struk bergaya photobooth yang siap kamu share atau print, lengkap dengan animasi cetak thermal yang nyata!
          </p>
        </div>

        {/* ── MAIN APP ── */}
        <main className="w-full flex justify-center animate-fade-up animate-delay-400">
          <PhotoBooth />
        </main>

        {/* ── FOOTER ── */}
        <footer className="text-center text-[11px] text-brand-text/35 pb-2 animate-fade-up animate-delay-600">
          <span style={{ fontFamily: "'Courier New', monospace" }}>
            Made with ♥ · Receipt Photobooth v2.0
          </span>
        </footer>
      </div>
    </div>
  );
}
