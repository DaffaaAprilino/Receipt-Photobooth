// src/components/ResultScreen.tsx
import { Download, RotateCcw } from 'lucide-react';
import { Photo } from '../types';

interface Props {
  photos: Photo[];
  onDownload: () => void;
  onReset: () => void;
}

export default function ResultScreen({ photos, onDownload, onReset }: Props) {
  return (
    // Ganti style card
    <div className="bg-brand-surface rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-brand-primary">RECEIPT</h2>

      {/* Receipt Preview */}
      <div className="mx-auto mb-8" style={{ maxWidth: '320px', fontFamily: '"Courier New", monospace' }}>
        {/* Ganti style border */}
        <div className="border-4 border-gray-200 bg-white p-5">
          <p className="text-center font-bold text-lg mb-1" style={{ fontSize: '18px' }}>RECEIPT</p>
          <p className="text-center text-xs mb-2">
            {photos.length > 0 ? photos[0].timestamp.toLocaleDateString('id-ID') : new Date().toLocaleDateString('id-ID')}
          </p>
          <p className="text-center text-xs mb-3">
            {photos.length > 0 ? photos[0].timestamp.toLocaleTimeString('id-ID') : new Date().toLocaleTimeString('id-ID')}
          </p>
          {/* Ganti style garis */}
          <div className="border-t-2 border-b-2 border-gray-300 py-3 space-y-2">
            {photos.map((photo, idx) => (
              <div key={idx} className="w-full">
                <img
                  src={photo.data}
                  alt={`Photo ${idx + 1}`}
                  style={{
                    filter: 'grayscale(100%) contrast(1.1)', // Ini tetap B&W
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ))}
          </div>
          <p className="text-center text-xs font-bold mt-3">Thank You!</p>
        </div>
      </div>

      {/* Ganti style tombol */}
      <div className="flex gap-4">
        <button
          onClick={onDownload}
          className="flex-1 bg-brand-primary text-white py-3 rounded-lg font-bold hover:bg-brand-primary-hover flex items-center justify-center gap-2"
        >
          <Download size={20} />
          Download Receipt
        </button>
        <button
          onClick={onReset}
          className="flex-1 bg-brand-surface text-brand-primary py-3 rounded-lg font-bold border-2 border-brand-primary hover:bg-brand-secondary flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          Ulangi
        </button>
      </div>
    </div>
  );
}