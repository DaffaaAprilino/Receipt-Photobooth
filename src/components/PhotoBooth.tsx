// src/components/PhotoBooth.tsx
import { useRef, useState, useEffect } from 'react'; // <-- Tambah useEffect
import { FrameCount, Photo, Step } from '../types';

import FrameSelector from './FrameSelector';
import CaptureScreen from './CaptureScreen';
import ResultScreen from './ResultScreen';
import PrintingOverlay from './PrintingOverlay';

export default function PhotoBooth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameCount, setFrameCount] = useState<FrameCount>(4);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [, setIsCameraActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [printProgress, setPrintProgress] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // REVISI: Tambah state untuk hitungan mundur
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (currentStep === 'capture' && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [currentStep, stream]);

  // REVISI: Tambah useEffect untuk MENJALANKAN hitungan mundur
  useEffect(() => {
    // Jika countdown tidak berjalan, jangan lakukan apa-apa
    if (countdown === null) return;

    // Jika countdown sampai 0...
    if (countdown === 0) {
      setCountdown(null); // Matikan angka
      performCapture();   // Ambil fotonya!
    } else {
      // Jika masih di atas 0, kurangi 1 setiap detik
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000); // 1 detik

      // Bersihkan timer jika komponennya di-unmount
      return () => clearTimeout(timer);
    }
  }, [countdown]); // Efek ini akan berjalan setiap kali nilai 'countdown' berubah

  const startCamera = async (count: FrameCount) => {
    setFrameCount(count);
    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      setStream(streamData);
      setIsCameraActive(true);
      setCurrentStep('capture');
      setPhotos([]);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Tidak bisa mengakses kamera');
    }
  };

  // REVISI: Ini fungsi baru untuk MENGAMBIL FOTO
  // (Logika dari capturePhoto dipindah ke sini)
  const performCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsFlashing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const photoData = canvas.toDataURL('image/png');

    setTimeout(() => setIsFlashing(false), 100);

    const newPhotos = [...photos, { data: photoData, timestamp: new Date() }];
    setPhotos(newPhotos);
    setIsCountingDown(false); // Selesai countdown

    if (newPhotos.length === frameCount) {
      stopCamera();
      setCurrentStep('result');
    }
  }

  // REVISI: capturePhoto sekarang HANYA MEMULAI hitungan
  const capturePhoto = async () => {
    // Jangan lakukan apa-apa jika sedang countdown
    if (isCountingDown) return;

    setIsCountingDown(true); // Mulai countdown
    setCountdown(3); // Set angka ke 3 (ini akan memicu useEffect)
    // Loop 'for' 3 detik dihapus dari sini
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setStream(null);
  };

  const downloadReceipt = () => {
    // ... (FUNGSI INI SAMA, TIDAK BERUBAH) ...
    setCurrentStep('printing');
    setPrintProgress(0);
    const receiptCanvas = document.createElement('canvas');
    const ctx = receiptCanvas.getContext('2d');
    if (!ctx) return;
    const receiptWidth = 320;
    const photoWidth = 280;
    const padding = 20;
    const photoHeight = Math.round((photoWidth * 3) / 4);
    const spacing = 10;
    const totalHeight = padding + 60 + spacing + (photoHeight * frameCount) + (spacing * (frameCount - 1)) + 30 + padding;
    receiptCanvas.width = receiptWidth;
    receiptCanvas.height = totalHeight;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, receiptWidth, totalHeight);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, receiptWidth - 4, totalHeight - 4);
    let yOffset = padding;
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('RECEIPT', receiptWidth / 2, yOffset + 22);
    yOffset += 35;
    ctx.font = '11px "Courier New", monospace';
    ctx.fillText(new Date().toLocaleDateString('id-ID'), receiptWidth / 2, yOffset);
    yOffset += 5;
    ctx.font = '10px "Courier New", monospace';
    ctx.fillText(new Date().toLocaleTimeString('id-ID'), receiptWidth / 2, yOffset + 10);
    yOffset += spacing + 10;
    ctx.strokeStyle = '#000000';
    ctx.setLineDash([]); 
    ctx.beginPath();
    ctx.moveTo(padding, yOffset);
    ctx.lineTo(receiptWidth - padding, yOffset);
    ctx.stroke();
    yOffset += spacing + 5;
    const photoPromises = photos.map((photo, index) => {
      return new Promise<void>((resolve) => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = photoWidth;
        tempCanvas.height = photoHeight;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          const tempImg = new Image();
          tempImg.onload = () => {
            tempCtx.filter = 'grayscale(100%) contrast(1.1)'; 
            tempCtx.drawImage(tempImg, 0, 0, photoWidth, photoHeight);
            ctx.drawImage(tempCanvas, padding, yOffset + (index * (photoHeight + spacing)), photoWidth, photoHeight);
            resolve();
          };
          tempImg.src = photo.data;
        } else {
          resolve();
        }
      });
    });
    Promise.all(photoPromises).then(() => {
        yOffset += (photoHeight * frameCount) + (spacing * (frameCount - 1));
        yOffset += spacing;
        yOffset += 12; 
        ctx.font = 'bold 12px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Thank You!', receiptWidth / 2, yOffset);
        let progress = 0;
        const printInterval = setInterval(() => {
            progress += Math.random() * 25;
            if (progress >= 100) {
                progress = 100;
                clearInterval(printInterval);
                setPrintProgress(100);
                setTimeout(() => {
                    const link = document.createElement('a');
                    link.href = receiptCanvas.toDataURL('image/png');
                    link.download = `photobooth-${Date.now()}.png`;
                    link.click();
                    setTimeout(() => {
                        setCurrentStep('result');
                    }, 500);
                }, 500);
            } else {
                setPrintProgress(progress);
            }
        }, 150);
    });
  };

  const reset = () => {
    stopCamera();
    setPhotos([]);
    setCurrentStep('select');
  };

  // --- RENDER LOGIC ---
  return (
    <div className="w-full max-w-2xl">
      {currentStep === 'select' && (
        <FrameSelector
          onFrameSelect={startCamera}
          defaultFrameCount={frameCount}
        />
      )}

      {currentStep === 'capture' && (
        <CaptureScreen
          videoRef={videoRef}
          onCapture={capturePhoto}
          onReset={reset}
          photosTaken={photos.length}
          totalFrames={frameCount}
          isCountingDown={isCountingDown}
          isFlashing={isFlashing}
          countdown={countdown} // <-- Kirim prop countdown
        />
      )}

      {(currentStep === 'result' || currentStep === 'printing') && (
        <ResultScreen
          photos={photos}
          onDownload={downloadReceipt}
          onReset={reset}
        />
      )}

      {currentStep === 'printing' && (
        <PrintingOverlay progress={printProgress} />
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}