// src/App.tsx
import PhotoBooth from './components/PhotoBooth';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-bg via-white to-brand-secondary px-4 py-8 font-sans text-brand-text overflow-x-hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-primary">
              Receipt Photobooth
            </p>
            <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black leading-tight">
              Cetak momenmu dalam bentuk <span className="text-brand-primary">receipt</span> kece.
            </h1>
            <p className="mt-2 max-w-xl text-sm sm:text-base text-brand-text/70">
              Tinggal pilih layout, foto beberapa kali, lalu dapatkan file struk bergaya photobooth yang siap kamu share atau print.
            </p>
            <p className="mt-3 inline-flex rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold text-brand-text/70 sm:hidden">
              3 langkah cepat · 1 file HD
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-2 text-right text-[11px] text-brand-text/60">
            <span className="rounded-full bg-white/60 px-3 py-1 font-semibold">
              3 langkah cepat · 1 file HD
            </span>
          </div>
        </header>

        <main className="flex justify-center">
          <PhotoBooth />
        </main>
      </div>
    </div>
  );
}
