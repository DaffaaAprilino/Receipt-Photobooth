// src/components/PrintingOverlay.tsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface Props {
  progress: number;
  receiptPreviewUrl?: string;
}

export default function PrintingOverlay({ progress, receiptPreviewUrl }: Props) {
  const rafRef = useRef<number | undefined>(undefined);

  const [animReady, setAnimReady] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isTearing, setIsTearing] = useState(false);
  const tearFiredRef = useRef(false);

  // Auto-scroll window to top & lock body scroll
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Double-rAF ensures browser paints initial frame (receipt hidden inside printer)
  useLayoutEffect(() => {
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        setAnimReady(true);
      });
    });
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (progress >= 90 && !tearFiredRef.current) {
      tearFiredRef.current = true;
      setIsTearing(true);
      setTimeout(() => setIsTearing(false), 380);
    }
    if (progress >= 100) setIsDone(true);
  }, [progress]);

  const statusText = isDone
    ? 'Selesai Dicetak!'
    : isTearing
    ? 'Memotong Kertas...'
    : 'Sedang Mencetak';

  return (
    /* ── Dark Frosted Backdrop ── */
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-brand-text/75 backdrop-blur-md select-none animate-fade-up">
      
      {/* ── Centered Modal Card ── */}
      <div className="relative w-full max-w-sm rounded-3xl border border-brand-secondary bg-[#F7F5F0] p-6 shadow-2xl flex flex-col items-center text-center overflow-hidden paper-texture">
        
        {/* Step Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 px-3 py-1 text-[11px] font-bold text-brand-accent uppercase tracking-wider mb-2">
          <span className="animate-pulse">🖨️</span> Thermal Printer
        </div>

        {/* Title */}
        <h3
          className="text-xl font-bold text-brand-text mb-1"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          {statusText}
          {!isDone && <span className="cursor-blink ml-1 text-brand-accent">_</span>}
        </h3>

        <p className="text-[11px] text-brand-text/50 mb-4 max-w-[240px]">
          {isDone ? 'File HD siap diunduh ke perangkamu!' : 'Menyiapkan berkas gambar HD...'}
        </p>

        {/* ── PRINTER + RECEIPT ASSEMBLY ── */}
        <div className="flex flex-col items-center my-1">
          
          {/* 1. Printer Machine Top */}
          <div
            className="relative overflow-hidden"
            style={{
              width: 176,
              height: 48,
              borderRadius: '12px 12px 0 0',
              background: 'linear-gradient(180deg, #2C2C2E 0%, #1A1A1C 100%)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
              zIndex: 30,
            }}
          >
            {/* Top highlight */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            
            {/* Brand text */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 7,
                fontWeight: 700,
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.2)',
                fontFamily: "'Courier New', monospace",
              }}
            >
              THERMAL · PRO
            </div>

            {/* LED */}
            <div style={{ position: 'absolute', top: 10, left: 12, width: 8, height: 8, borderRadius: '50%',
              background: isDone ? '#34D399' : '#FBBF24',
              boxShadow: isDone ? '0 0 8px rgba(52,211,153,0.9)' : '0 0 6px rgba(251,191,36,0.85)',
              animation: isDone ? 'none' : 'blink 1s ease-in-out infinite',
            }} />

            {/* Vent lines */}
            <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', gap: 2 }}>
              {[0,1,2,3].map(i => <div key={i} style={{ width: 1.5, height: 12, borderRadius: 1, background: 'rgba(255,255,255,0.08)' }} />)}
            </div>
          </div>

          {/* 2. Slot Slit */}
          <div
            style={{
              width: 148,
              height: 8,
              background: '#1A1A1C',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.9)',
              borderRadius: '0 0 3px 3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 30,
            }}
          >
            <div style={{ width: 100, height: 2.5, borderRadius: 1, background: 'rgba(0,0,0,0.95)' }} />
          </div>

          {/* 3. Receipt Exit Zone (Paper feeds DOWN out of slot) */}
          <div
            style={{
              width: 148,
              height: 180,
              overflow: 'hidden',
              position: 'relative',
              zIndex: 10,
            }}
          >
            <div
              className={isTearing ? 'animate-paper-tear' : ''}
              style={{
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                transform: animReady ? undefined : 'translateY(-100%)',
                animation: animReady
                  ? 'receipt-emerge-down 3.2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards'
                  : undefined,
                willChange: 'transform',
                transformOrigin: 'top center',
              }}
            >
              {/* Receipt Paper */}
              <div
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  fontFamily: "'Courier New', monospace",
                  borderLeft: '1px solid rgba(46,42,39,0.1)',
                  borderRight: '1px solid rgba(46,42,39,0.1)',
                  boxShadow: '0 6px 18px rgba(46,42,39,0.12)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Scan line */}
                {animReady && !isDone && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      height: 2,
                      zIndex: 20,
                      pointerEvents: 'none',
                      background: 'linear-gradient(90deg, transparent 0%, rgba(61,82,69,0.35) 50%, transparent 100%)',
                      animation: 'scan-line 1.4s linear infinite',
                    }}
                  />
                )}

                {/* Content */}
                <div style={{ padding: '8px 8px 4px', userSelect: 'none' }}>
                  <div style={{ textAlign: 'center', fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', color: '#2E2A27', borderBottom: '1px dashed rgba(46,42,39,0.2)', paddingBottom: 4, marginBottom: 3 }}>
                    RECEIPT
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 5.5, color: 'rgba(46,42,39,0.45)', marginBottom: 4 }}>
                    {new Date().toLocaleDateString('id-ID')} · {new Date().toLocaleTimeString('id-ID')}
                  </div>
                  <div style={{ width: '100%', aspectRatio: '4/3', background: 'rgba(232,229,221,0.4)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4, overflow: 'hidden' }}>
                    {receiptPreviewUrl
                      ? <img src={receiptPreviewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }} />
                      : <div style={{ width: 14, height: 14, border: '1px solid rgba(46,42,39,0.2)', borderRadius: 2, opacity: 0.5 }} />
                    }
                  </div>
                  <div style={{ borderTop: '1px dashed rgba(46,42,39,0.18)', paddingTop: 3, marginBottom: 3 }}>
                    {['SWEET SMILE', 'CUTE POSE', 'SHINY MOMENT'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 5, color: 'rgba(46,42,39,0.45)', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.5 }}>
                        <span>1x {item}</span><span>0.00</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingTop: 3, borderTop: '1px dashed rgba(46,42,39,0.18)' }}>
                    <div style={{ display: 'flex', gap: 1, height: 12 }}>
                      {[2,1,3,1,2,4,1,2,1,3,2,1,4,1,2].map((w, i) => (
                        <div key={i} style={{ width: w, height: '100%', background: 'rgba(46,42,39,0.65)' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 4.5, color: 'rgba(46,42,39,0.3)', letterSpacing: '0.18em', fontWeight: 700 }}>#THANK-YOU</span>
                  </div>
                </div>

                {/* Jagged bottom */}
                <div style={{
                  height: 7,
                  background: `linear-gradient(-45deg, transparent 75%, #EDE9E1 75%) 0 0/6px 6px repeat-x,
                               linear-gradient(45deg, transparent 75%, #EDE9E1 75%) 3px 0/6px 6px repeat-x`,
                  backgroundColor: '#EDE9E1',
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Progress Bar & Percent ── */}
        <div className="w-full flex flex-col items-center gap-1.5 mt-3">
          <div className="w-48 h-1.5 rounded-full bg-brand-secondary overflow-hidden p-[1px]">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #3D5245, #5A7A63)',
              }}
            />
          </div>
          <span
            className="text-[10px] font-bold text-brand-text/45 font-heading"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            {Math.round(progress)}% Selesai
          </span>
        </div>

      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes receipt-emerge-down {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(0px);   }
        }
      `}</style>
    </div>
  );
}
