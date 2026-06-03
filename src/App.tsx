// src/App.tsx
import PhotoBooth from './components/PhotoBooth';
import { Camera, Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-bg via-[#FAF8F5] to-brand-secondary px-4 py-8 sm:py-12 font-sans text-brand-text overflow-x-hidden">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 sm:gap-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-brand-secondary/60 pb-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-primary">
              <Sparkles size={12} className="animate-pulse" />
              Receipt Photobooth v2.0
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold leading-tight tracking-tight text-brand-text">
              Cetak momenmu dalam bentuk <span className="text-brand-accent underline decoration-brand-accent/30 decoration-4 underline-offset-4 font-bold">receipt</span> kece.
            </h1>
            <p className="max-w-xl text-sm sm:text-base text-brand-text/75 leading-relaxed">
              Tinggal pilih layout, foto beberapa kali, lalu dapatkan file struk bergaya photobooth yang siap kamu share atau print.
            </p>
          </div>
          <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-2 text-[11px] text-brand-text/60">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-bold shadow-sm border border-brand-secondary">
              <Camera size={12} className="text-brand-accent" />
              3 Langkah Cepat
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-bold shadow-sm border border-brand-secondary">
              ⚡ File HD Export
            </span>
          </div>
        </header>

        <main className="w-full flex justify-center">
          <PhotoBooth />
        </main>
      </div>
    </div>
  );
}
