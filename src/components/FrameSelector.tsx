// src/components/FrameSelector.tsx
import { useState } from 'react';
import { FrameCount } from '../types';

interface Props {
  onFrameSelect: (count: FrameCount) => void;
  defaultFrameCount: FrameCount;
}

export default function FrameSelector({ onFrameSelect, defaultFrameCount }: Props) {
  const [selectedFrameCount, setSelectedFrameCount] = useState<FrameCount>(defaultFrameCount);
  const [previewFrameCount, setPreviewFrameCount] = useState<FrameCount>(defaultFrameCount);

  return (
    // Ganti style card utama
    <div className="bg-brand-surface rounded-2xl shadow-xl p-8 max-w-lg mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-2 text-brand-primary">Receipt Photobooth</h1>
      <p className="text-center text-brand-text/70 mb-8">Pilih berapa frame foto yang ingin Anda ambil</p>

      {/* Ganti style tombol pilihan frame */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {([1, 2, 3, 4] as const).map(num => (
          <button
            key={num}
            onMouseEnter={() => setPreviewFrameCount(num)}
            onClick={() => setSelectedFrameCount(num)}
            className={`p-6 rounded-xl font-bold text-2xl transition-all ${
                selectedFrameCount === num
                ? 'bg-brand-primary text-white scale-105 shadow-md'
                : 'bg-brand-secondary text-brand-primary/70 hover:bg-brand-secondary/80'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Ganti style preview receipt */}
      <div className="mt-12 mb-8">
        <p className="text-center text-brand-text/70 mb-4 font-semibold">Preview Layout:</p>
        <div className="mx-auto" style={{ maxWidth: '320px', fontFamily: '"Courier New", monospace' }}>
          {/* Ganti border hitam jadi lebih soft */}
          <div className="border-4 border-gray-200 bg-white p-5">
            <p className="text-center font-bold mb-1" style={{ fontSize: '18px' }}>RECEIPT</p>
            <p className="text-center text-xs mb-2">
              {new Date().toLocaleDateString('id-ID')}
            </p>
            <p className="text-center text-xs mb-3">
              {new Date().toLocaleTimeString('id-ID')}
            </p>
            <div className="border-t-2 border-b-2 border-gray-300 py-3 space-y-2">
              {Array.from({ length: previewFrameCount }).map((_, idx) => (
                <div key={idx} className="w-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center" style={{ aspectRatio: '4/3' }}>
                  <span className="text-gray-500 text-sm font-semibold">Photo {idx + 1}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-xs font-bold mt-3">Thank You!</p>
          </div>
        </div>
      </div>

      {/* Ganti style tombol Mulai */}
      <div className="mt-8 text-center">
        <button
          onClick={() => onFrameSelect(selectedFrameCount)}
          // Ganti style tombol outline-mu
          className="bg-brand-surface text-brand-primary font-bold text-xl py-3 px-12 rounded-full border-2 border-brand-primary hover:bg-brand-secondary transition-colors"
        >
          Mulai
        </button>
      </div>

      <p className="text-center text-sm text-brand-text/60 mt-4">
        Pilih jumlah frame dan tekan tombol Mulai
      </p>
    </div>
  );
}