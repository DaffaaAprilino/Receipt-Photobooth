// src/components/PrintingOverlay.tsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface Props {
  progress: number;
  receiptPreviewUrl?: string;
}

export default function PrintingOverlay({ progress, receiptPreviewUrl }: Props) {
  const rafRef = useRef<number | undefined>(undefined);

  const [animReady, setAnimReady] = useState(false);
  const [isDone, setIsDone]       = useState(false);
  const [isTearing, setIsTearing] = useState(false);
  const tearFiredRef              = useRef(false);


  // Double-rAF: pastikan frame pertama sudah dirender sebelum animasi jalan
  useLayoutEffect(() => {
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => setAnimReady(true));
    });
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
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

  const PW = 152; // printer body width
  const SW = 126; // slot width
  const RH = 185; // receipt zone height

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/72 backdrop-blur-sm animate-fade-up"
        aria-hidden="true"
      />

      {/* Modal — selalu di tengah viewport */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 select-none"
      >
        <div
          className="relative w-full rounded-2xl border border-white/10 bg-[#F7F5F0] shadow-2xl paper-texture animate-fade-up overflow-hidden"
          style={{
            maxWidth: 460,
            boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >

          {/* HEADER BADGE */}
          <div className="flex items-center justify-center px-5 pt-4 pb-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 px-3 py-1 text-[11px] font-bold text-brand-accent uppercase tracking-wider">
              <span style={{
                display: 'inline-block',
                animation: isDone ? 'none' : 'printer-pulse 0.55s ease-in-out infinite alternate',
              }}>🖨️</span>
              &nbsp;Thermal Printer
            </div>
          </div>

          {/* BODY — 2 kolom */}
          <div className="flex flex-row items-start gap-4 px-4 pb-5">

            {/* KOLOM KIRI: Printer + Receipt */}
            <div className="flex-shrink-0 flex flex-col items-center">

              {/* Printer body */}
              <div style={{
                width: PW, height: 48,
                borderRadius: '12px 12px 0 0',
                background: 'linear-gradient(180deg, #3A3A3C 0%, #1C1C1E 100%)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: '12px 12px 0 0' }} />
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  fontSize: 7, fontWeight: 800, letterSpacing: '0.3em',
                  color: 'rgba(255,255,255,0.15)',
                  fontFamily: "'Courier New', monospace", whiteSpace: 'nowrap',
                }}>THERMAL · PRO</div>
                <div style={{
                  position: 'absolute', top: 10, left: 12,
                  width: 8, height: 8, borderRadius: '50%',
                  background: isDone ? '#34D399' : '#FBBF24',
                  boxShadow: isDone
                    ? '0 0 0 3px rgba(52,211,153,0.25), 0 0 10px rgba(52,211,153,0.9)'
                    : '0 0 0 3px rgba(251,191,36,0.22), 0 0 8px rgba(251,191,36,0.85)',
                  animation: isDone ? 'none' : 'blink 0.9s ease-in-out infinite',
                  transition: 'background 0.4s, box-shadow 0.4s',
                }} />
                <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', gap: 2 }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{ width: 2, height: 12, borderRadius: 1, background: 'rgba(255,255,255,0.06)' }} />
                  ))}
                </div>
              </div>

              {/* Paper slot */}
              <div style={{
                width: SW, height: 9,
                background: 'linear-gradient(180deg,#111 0%,#0a0a0a 100%)',
                boxShadow: 'inset 0 3px 10px rgba(0,0,0,1)',
                borderRadius: '0 0 4px 4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', zIndex: 30,
              }}>
                <div style={{ width: 82, height: 2.5, borderRadius: 2, background: 'rgba(0,0,0,0.98)' }} />
                {animReady && !isDone && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 10, right: 10, height: 1,
                    background: 'rgba(255,255,255,0.1)',
                    animation: 'slot-glow 1.1s ease-in-out infinite alternate',
                  }} />
                )}
              </div>

              {/* Receipt exit zone */}
              <div style={{
                width: SW, height: RH,
                overflow: 'hidden', position: 'relative', zIndex: 10,
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 16,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 100%)',
                  zIndex: 20, pointerEvents: 'none',
                }} />
                <div
                  className={isTearing ? 'animate-paper-tear' : ''}
                  style={{
                    width: '100%',
                    position: 'absolute', top: 0, left: 0, right: 0,
                    transform: animReady ? undefined : 'translateY(-100%)',
                    animation: animReady
                      ? 'receipt-emerge-stepped 4s cubic-bezier(0.25,0.46,0.45,0.94) forwards'
                      : undefined,
                    willChange: 'transform',
                    transformOrigin: 'top center',
                  }}
                >
                  <div style={{
                    width: '100%', background: '#FFFFFF',
                    fontFamily: "'Courier New', monospace",
                    borderLeft: '1px solid rgba(46,42,39,0.07)',
                    borderRight: '1px solid rgba(46,42,39,0.07)',
                    boxShadow: '2px 8px 20px rgba(46,42,39,0.16)',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {animReady && !isDone && (
                      <div style={{
                        position: 'absolute', left: 0, right: 0, height: 3, zIndex: 20,
                        pointerEvents: 'none',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(61,130,80,0.55) 30%, rgba(100,200,120,0.8) 50%, rgba(61,130,80,0.55) 70%, transparent 100%)',
                        boxShadow: '0 0 8px rgba(61,130,80,0.45)',
                        animation: 'scan-line 1.0s linear infinite',
                      }} />
                    )}
                    <div style={{ padding: '8px 8px 4px', userSelect: 'none' }}>
                      <div style={{ textAlign: 'center', fontSize: 8, fontWeight: 800, letterSpacing: '0.22em', color: '#2E2A27', borderBottom: '1px dashed rgba(46,42,39,0.2)', paddingBottom: 4, marginBottom: 3 }}>
                        RECEIPT
                      </div>
                      <div style={{ textAlign: 'center', fontSize: 5.5, color: 'rgba(46,42,39,0.38)', marginBottom: 4 }}>
                        {new Date().toLocaleDateString('id-ID')} · {new Date().toLocaleTimeString('id-ID')}
                      </div>
                      <div style={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(135deg,rgba(232,229,221,0.6),rgba(210,205,195,0.4))', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4, overflow: 'hidden', border: '1px solid rgba(46,42,39,0.05)' }}>
                        {receiptPreviewUrl
                          ? <img src={receiptPreviewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                          : <div style={{ opacity: 0.22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                              <div style={{ width: 14, height: 14, border: '1.5px solid rgba(46,42,39,0.5)', borderRadius: 2 }} />
                              <span style={{ fontSize: 4, letterSpacing: '0.1em', fontWeight: 700 }}>FOTO</span>
                            </div>
                        }
                      </div>
                      <div style={{ borderTop: '1px dashed rgba(46,42,39,0.18)', paddingTop: 3, marginBottom: 3 }}>
                        {['SWEET SMILE', 'CUTE POSE', 'SHINY MOMENT'].map((item, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 5, color: 'rgba(46,42,39,0.45)', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.6 }}>
                            <span>1x {item}</span><span>0.00</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingTop: 3, borderTop: '1px dashed rgba(46,42,39,0.18)' }}>
                        <div style={{ display: 'flex', gap: 1, height: 11 }}>
                          {[2,1,3,1,2,4,1,2,1,3,2,1,4,1,2,3,1].map((w, i) => (
                            <div key={i} style={{ width: w, height: '100%', background: 'rgba(46,42,39,0.68)' }} />
                          ))}
                        </div>
                        <span style={{ fontSize: 4, color: 'rgba(46,42,39,0.28)', letterSpacing: '0.16em', fontWeight: 700 }}>#THANK-YOU</span>
                      </div>
                    </div>
                    <div style={{
                      height: 7,
                      background: 'linear-gradient(-45deg,transparent 75%,#EDE9E1 75%) 0 0/6px 6px repeat-x, linear-gradient(45deg,transparent 75%,#EDE9E1 75%) 3px 0/6px 6px repeat-x',
                      backgroundColor: '#EDE9E1',
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN: Status + Steps + Progress */}
            <div
              className="flex-1 flex flex-col justify-between"
              style={{ minHeight: 48 + 9 + RH }}
            >
              {/* Title */}
              <div>
                <h3
                  className="text-base font-bold text-brand-text leading-tight"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  {statusText}
                  {!isDone && <span className="cursor-blink ml-1 text-brand-accent">_</span>}
                </h3>
                <p className="mt-1 text-[10px] leading-relaxed text-brand-text/45">
                  {isDone
                    ? '✅ File HD siap diunduh!'
                    : 'Menyiapkan berkas gambar...'}
                </p>
              </div>

              {/* Divider */}
              <div className="my-3 border-t border-dashed border-brand-secondary/50" />

              {/* Step indicators */}
              <div className="space-y-2 mb-3 flex-1">
                {[
                  { label: 'Memproses foto',       done: progress > 15  },
                  { label: 'Render teks & layout', done: progress > 40  },
                  { label: 'Kompresi HD',          done: progress > 70  },
                  { label: 'Mencetak struk',       done: progress >= 100 },
                ].map(({ label, done }, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div style={{
                      width: 13, height: 13, borderRadius: '50%', flexShrink: 0,
                      border: `1.5px solid ${done ? '#10B981' : 'rgba(46,42,39,0.2)'}`,
                      background: done ? '#10B981' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s ease',
                    }}>
                      {done && (
                        <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                          <polyline points="1.5,5.5 4,8 8.5,2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span style={{
                      fontSize: 10,
                      fontWeight: done ? 700 : 400,
                      color: done ? '#10B981' : 'rgba(46,42,39,0.4)',
                      fontFamily: "'Courier New', monospace",
                      transition: 'color 0.3s',
                    }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="w-full h-1.5 rounded-full bg-brand-secondary/50 overflow-hidden">
                  <div
                    style={{
                      height: '100%', borderRadius: 999,
                      width: `${progress}%`,
                      background: isDone
                        ? 'linear-gradient(90deg, #34D399, #10B981)'
                        : 'linear-gradient(90deg, #3D5245, #5A7A63, #7BAD88)',
                      boxShadow: isDone ? '0 0 6px rgba(52,211,153,0.6)' : '0 0 4px rgba(90,122,99,0.4)',
                      transition: 'width 0.25s ease-out, background 0.5s',
                    }}
                  />
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 700, display: 'block',
                  fontFamily: "'Courier New', monospace",
                  color: isDone ? '#10B981' : 'rgba(46,42,39,0.38)',
                  transition: 'color 0.4s',
                }}>
                  {Math.round(progress)}% Selesai
                </span>
              </div>

            </div>
          </div>{/* end body */}

        </div>
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes receipt-emerge-stepped {
          0%   { transform: translateY(-100%); }
          4%   { transform: translateY(-92%); }
          8%   { transform: translateY(-92%); }
          14%  { transform: translateY(-78%); }
          19%  { transform: translateY(-78%); }
          26%  { transform: translateY(-60%); }
          31%  { transform: translateY(-60%); }
          38%  { transform: translateY(-44%); }
          43%  { transform: translateY(-44%); }
          52%  { transform: translateY(-26%); }
          57%  { transform: translateY(-26%); }
          65%  { transform: translateY(-14%); }
          70%  { transform: translateY(-14%); }
          78%  { transform: translateY(-4%); }
          84%  { transform: translateY(-4%); }
          92%  { transform: translateY(0%); }
          100% { transform: translateY(0%); }
        }
        @keyframes printer-pulse {
          0%   { transform: scale(1) rotate(-3deg); }
          100% { transform: scale(1.15) rotate(3deg); }
        }
        @keyframes slot-glow {
          0%   { opacity: 0.15; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </>
  );
}
