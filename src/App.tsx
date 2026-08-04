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
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('daffaaprilino7@gmail.com').then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  };

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

        {/* ── GET IN TOUCH SECTION ── */}
        <section className="w-full animate-fade-up animate-delay-500">
          <div className="mx-auto" style={{ maxWidth: 640 }}>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 px-3 py-1 text-[11px] font-bold text-brand-accent uppercase tracking-wider mb-3">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Hubungi Kami
              </div>
              <h2 className="text-2xl font-heading font-bold text-brand-text">Hubungi Saya</h2>
              <p className="mt-1 text-sm text-brand-text/50 max-w-sm mx-auto">
                Ada pertanyaan, feedback, atau kolaborasi? Jangan ragu untuk menghubungi!
              </p>
            </div>

            {/* 3-column card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              {/* Instagram */}
              <a
                href="https://www.instagram.com/daffaaprilino_/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center text-center rounded-2xl border border-brand-secondary bg-white/80 backdrop-blur-sm px-5 py-6 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                {/* Gradient bg on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(245,133,41,0.06) 0%, rgba(221,42,123,0.06) 50%, rgba(129,52,175,0.06) 100%)' }}
                />
                {/* Icon */}
                <div
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-md transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)' }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
                {/* Label */}
                <span
                  className="relative text-[10px] font-bold uppercase tracking-widest text-brand-text/35 mb-1"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >Instagram</span>
                {/* Value */}
                <span className="relative text-sm font-bold text-brand-text group-hover:text-[#DD2A7B] transition-colors duration-300">
                  @daffaaprilino_
                </span>
                {/* Hover arrow */}
                <div className="relative mt-3 flex items-center gap-1 text-[10px] font-bold text-brand-text/25 group-hover:text-[#DD2A7B] transition-all duration-300 group-hover:gap-1.5">
                  <span>Lihat Profil</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </div>
              </a>

              {/* Email — copy to clipboard */}
              <button
                onClick={copyEmail}
                className="group relative flex flex-col items-center text-center rounded-2xl border border-brand-secondary bg-white/80 backdrop-blur-sm px-5 py-6 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl w-full cursor-pointer"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(61,82,69,0.06) 0%, rgba(90,122,99,0.06) 100%)' }}
                />
                {/* Toast notif */}
                <div
                  className="absolute top-2.5 right-2.5 transition-all duration-300"
                  style={{ opacity: emailCopied ? 1 : 0, transform: emailCopied ? 'translateY(0)' : 'translateY(-4px)' }}
                >
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-accent text-white px-2 py-0.5 text-[9px] font-bold">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <polyline points="1.5,5.5 4,8 8.5,2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Tersalin!
                  </span>
                </div>
                <div
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-md transition-transform duration-300 group-hover:scale-110"
                  style={{ background: emailCopied ? 'linear-gradient(135deg, #10B981, #34D399)' : 'linear-gradient(135deg, #3D5245 0%, #5A7A63 100%)', transition: 'background 0.4s' }}
                >
                  {emailCopied
                    ? <svg width="20" height="20" viewBox="0 0 10 10" fill="none">
                        <polyline points="1.5,5.5 4,8 8.5,2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                  }
                </div>
                <span
                  className="relative text-[10px] font-bold uppercase tracking-widest text-brand-text/35 mb-1"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >Email</span>
                <span
                  className="relative text-xs font-bold transition-colors duration-300 break-all leading-snug"
                  style={{ color: emailCopied ? '#10B981' : 'var(--color-brand-text)' }}
                >
                  daffaaprilino7@gmail.com
                </span>
                <div
                  className="relative mt-3 flex items-center gap-1 text-[10px] font-bold transition-all duration-300"
                  style={{ color: emailCopied ? '#10B981' : 'rgba(46,42,39,0.25)' }}
                >
                  <span>{emailCopied ? 'Email disalin!' : 'Salin Email'}</span>
                  {!emailCopied && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="14" height="14" x="8" y="8" rx="2"/>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </svg>
                  )}
                </div>
              </button>

              {/* GitHub */}
              <a
                href="https://github.com/DaffaaAprilino"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center text-center rounded-2xl border border-brand-secondary bg-white/80 backdrop-blur-sm px-5 py-6 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(36,41,46,0.05) 0%, rgba(74,85,104,0.05) 100%)' }}
                />
                <div
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-md transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #24292e 0%, #4a5568 100%)' }}
                >
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </div>
                <span
                  className="relative text-[10px] font-bold uppercase tracking-widest text-brand-text/35 mb-1"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >GitHub</span>
                <span className="relative text-sm font-bold text-brand-text group-hover:text-gray-700 transition-colors duration-300">
                  DaffaaAprilino
                </span>
                <div className="relative mt-3 flex items-center gap-1 text-[10px] font-bold text-brand-text/25 group-hover:text-gray-600 transition-all duration-300 group-hover:gap-1.5">
                  <span>Lihat Repo</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </div>
              </a>

            </div>


          </div>
        </section>
      
      </div>
    </div>
  );
}
