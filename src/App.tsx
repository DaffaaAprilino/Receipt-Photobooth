// src/App.tsx
import PhotoBooth from './components/PhotoBooth';

export default function App() {
  return (
    // BG-GRAY-100 INI KUNCINYA
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 font-sans text-gray-900 overflow-x-hidden">
      <PhotoBooth />
    </div>
  );
}