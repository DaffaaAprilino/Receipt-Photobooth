// src/components/PhotoBooth.tsx
import { useRef, useState, useEffect } from 'react';
import { FrameCount, Photo, Step } from '../types';

import FrameSelector from './FrameSelector';
import CaptureScreen from './CaptureScreen';
import ResultScreen from './ResultScreen';
import PrintingOverlay from './PrintingOverlay';

export default function PhotoBooth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [frameCount, setFrameCount] = useState<FrameCount>(1);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [, setIsCameraActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [printProgress, setPrintProgress] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // REVISI: State baru untuk memunculkan popup konfirmasi
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    if (currentStep === 'capture' && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [currentStep, stream]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      performCapture();
    } else {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const startCamera = async (count: FrameCount) => {
    setFrameCount(count);
    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        video: { 
            facingMode: 'user',
            width: { ideal: 1280 }, 
            height: { ideal: 720 }
        },
      });
      setStream(streamData);
      setIsCameraActive(true);
      setCurrentStep('capture');
      setPhotos([]);
      setIsReviewing(false); // Reset state reviewing
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Tidak bisa mengakses kamera');
    }
  };

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
    setIsCountingDown(false);

    // REVISI: Jika foto sudah penuh, JANGAN pindah halaman dulu.
    // Tapi nyalakan mode "Reviewing" (Konfirmasi)
    if (newPhotos.length === frameCount) {
      setIsReviewing(true);
    }
  }

  const capturePhoto = async () => {
    if (isCountingDown) return;
    setIsCountingDown(true);
    setCountdown(3);
  };

  // REVISI: Fungsi ini dipanggil kalau user klik "Lanjut Cetak"
  const confirmFinish = () => {
    stopCamera();
    setCurrentStep('result');
    setIsReviewing(false);
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setStream(null);
  };

  const retakeSession = () => {
    setIsCountingDown(false);
    setCountdown(null);
    setIsReviewing(false); // Matikan modal konfirmasi kalau mau ngulang
    setPhotos((prevPhotos) => {
      if (prevPhotos.length === 0) return prevPhotos;
      return prevPhotos.slice(0, -1);
    });
  };

  const resetToHome = () => {
    stopCamera();
    setPhotos([]);
    setCurrentStep('select');
  };

  const downloadReceipt = () => {
    setCurrentStep('printing');
    setPrintProgress(0);

    const receiptCanvas = document.createElement('canvas');
    const ctx = receiptCanvas.getContext('2d');
    if (!ctx) return;

    const receiptWidth = 320; 
    const padding = 20;
    const photoWidth = 280; 
    const photoHeight = Math.round(photoWidth * 0.75); 
    
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
            const targetRatio = photoWidth / photoHeight;
            const imgRatio = tempImg.width / tempImg.height;

            let sx = 0, sy = 0, sWidth = tempImg.width, sHeight = tempImg.height;

            if (imgRatio > targetRatio) {
                sWidth = tempImg.height * targetRatio;
                sx = (tempImg.width - sWidth) / 2;
            } else {
                sHeight = tempImg.width / targetRatio;
                sy = (tempImg.height - sHeight) / 2;
            }

            tempCtx.filter = 'grayscale(100%) contrast(1.1)'; 
            tempCtx.drawImage(
                tempImg, 
                sx, sy, sWidth, sHeight,
                0, 0, photoWidth, photoHeight
            );

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
          onRetake={retakeSession}
          onConfirm={confirmFinish} // REVISI: Kirim fungsi konfirmasi ke UI
          isReviewing={isReviewing} // REVISI: Kirim status reviewing
          photos={photos} 
          totalFrames={frameCount}
          isCountingDown={isCountingDown}
          isFlashing={isFlashing}
          countdown={countdown}
        />
      )}

      {(currentStep === 'result' || currentStep === 'printing') && (
        <ResultScreen
          photos={photos}
          onDownload={downloadReceipt}
          onReset={resetToHome}
        />
      )}

      {currentStep === 'printing' && (
        <PrintingOverlay progress={printProgress} />
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}