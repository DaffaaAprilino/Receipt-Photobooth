// src/components/PhotoBooth.tsx
import { useRef, useState } from 'react';
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
  
  // REVISI IMK: State untuk efek flash
  const [isFlashing, setIsFlashing] = useState(false);

  const startCamera = async (count: FrameCount) => {
    setFrameCount(count);
    try {
      // ... (kode startCamera sama)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setCurrentStep('capture');
        setPhotos([]);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Tidak bisa mengakses kamera');
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || isCountingDown) return;

    setIsCountingDown(true);

    for (let i = 3; i > 0; i--) {
      console.log(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // REVISI IMK: Tampilkan flash!
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

    // REVISI IMK: Sembunyikan flash setelah 100ms
    setTimeout(() => setIsFlashing(false), 100);

    const newPhotos = [...photos, { data: photoData, timestamp: new Date() }];
    setPhotos(newPhotos);
    setIsCountingDown(false);

    if (newPhotos.length === frameCount) {
      stopCamera();
      setCurrentStep('result');
    }
  };

  const stopCamera = () => {
    // ... (kode stopCamera sama)
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const downloadReceipt = () => {
    // ... (kode downloadReceipt sama persis, barcode dihapus)
    // PENTING: Fungsi ini TETAP menghasilkan B&W karena 'grayscale(100%)'
    // ...
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
            // INI KUNCINYA: HASIL AKHIR TETAP HITAM PUTIH
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

        // ... (sisanya sama)
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
    // ... (kode reset sama)
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
          isFlashing={isFlashing} // Kirim prop flash
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