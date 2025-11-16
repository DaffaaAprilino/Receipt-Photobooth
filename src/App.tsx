// src/App.tsx
import PhotoBooth from './components/PhotoBooth';

export default function App() {
  return (
    // PASTIKAN KELASNYA INI:
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 font-sans text-brand-text">
      <PhotoBooth />
    </div>
  );
}