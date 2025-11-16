interface Props {
  progress: number;
}

export default function PrintingOverlay({ progress }: Props) {
  return (
    // Overlay ini menutupi seluruh layar
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h3 className="text-xl font-bold mb-4">Mencetak Receipt...</h3>
        <p className="text-gray-600 mb-4">Mohon tunggu sebentar.</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-black h-4 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-semibold">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}