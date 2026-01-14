interface Props {
  progress: number;
}

export default function PrintingOverlay({ progress }: Props) {
  return (
    // Overlay ini menutupi seluruh layar
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-3xl border border-white/30 bg-gradient-to-b from-white/95 to-brand-bg/95 p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="mx-auto mb-5 h-14 w-24 rounded-t-xl border-[3px] border-dashed border-brand-secondary bg-white flex items-center justify-center font-['Courier_New',monospace] text-[11px] text-brand-text/70">
          RECEIPT
        </div>
        <h3 className="text-xl font-bold text-brand-text">Mencetak receipt...</h3>
        <p className="mt-1 text-sm text-brand-text/70">Sedang menyiapkan file HD kamu, jangan tutup halaman ini.</p>
        <div className="mt-6 w-full rounded-full bg-brand-secondary h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-brand-primary to-brand-primary-hover transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-xs font-semibold text-brand-text/70">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}
