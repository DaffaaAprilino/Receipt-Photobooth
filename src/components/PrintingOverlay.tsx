interface Props {
  progress: number;
}

export default function PrintingOverlay({ progress }: Props) {
  return (
    // Overlay ini menutupi seluruh layar dengan latar kabur
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-3xl border border-brand-secondary bg-white p-8 text-center shadow-premium paper-texture overflow-hidden">
        
        {/* CONTAINER PRINTER VIRTUAL */}
        <div className="relative h-28 w-full flex flex-col justify-end items-center mb-6">
          {/* Gulungan kertas yang keluar dari printer */}
          <div 
            className="w-24 bg-white border-x-2 border-t-2 border-brand-secondary/80 rounded-t shadow-sm font-['Courier_New',monospace] text-[7px] font-bold text-brand-text/50 flex flex-col justify-start items-center pt-2 overflow-hidden transition-all duration-300 relative select-none"
            style={{ 
              height: `${24 + (progress * 0.5)}px`,
              opacity: 0.95
            }}
          >
            <div className="border-b border-dashed border-brand-secondary/80 w-4/5 pb-1 mb-1 text-[8px] text-brand-primary">
              PRINTING
            </div>
            <div className="w-4/5 h-[3px] bg-brand-secondary/60 rounded mb-1"></div>
            <div className="w-4/5 h-[3px] bg-brand-secondary/60 rounded mb-1"></div>
            <div className="w-3/5 h-[3px] bg-brand-secondary/60 rounded"></div>
            {/* Tekstur garis cetak halus di kertas */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-text/5 to-transparent pointer-events-none"></div>
          </div>

          {/* Badan Mesin Printer Mini */}
          <div className="w-36 h-12 bg-zinc-800 rounded-xl border-b-[6px] border-zinc-950 shadow-md flex items-end justify-center relative z-10">
            {/* Celah printer */}
            <div className="w-28 h-1 bg-black rounded-full mb-1"></div>
            {/* Lampu indikator status printer */}
            <div className="absolute top-3 left-4 h-2 w-2 rounded-full bg-green-500 animate-blink"></div>
          </div>
        </div>

        <h3 className="text-xl font-heading font-bold text-brand-text">Sedang Mencetak...</h3>
        <p className="mt-1.5 text-xs text-brand-text/75 leading-relaxed max-w-xs mx-auto">
          Menyiapkan berkas gambar HD beresolusi tinggi. Mohon tunggu sebentar.
        </p>

        {/* Progress Bar */}
        <div className="mt-6 w-full rounded-full bg-brand-secondary h-2.5 overflow-hidden p-[2px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-primary-hover transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2.5 text-xs font-bold text-brand-text/60 font-heading">
          {Math.round(progress)}% Selesai
        </p>
      </div>
    </div>
  );
}
