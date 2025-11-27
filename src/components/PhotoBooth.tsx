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
      // Minta resolusi Full HD biar sumber gambarnya tajam
      const streamData = await navigator.mediaDevices.getUserMedia({
        video: { 
            facingMode: 'user',
            width: { ideal: 1920 }, // Naikkan ke Full HD
            height: { ideal: 1080 } 
        },
      });
      setStream(streamData);
      setIsCameraActive(true);
      setCurrentStep('capture');
      setPhotos([]);
      setIsReviewing(false);
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
    
    // Simpan gambar dalam kualitas tinggi (High Quality)
    const photoData = canvas.toDataURL('image/jpeg', 1.0); // Gunakan JPEG quality 1.0

    setTimeout(() => setIsFlashing(false), 100);

    const newPhotos = [...photos, { data: photoData, timestamp: new Date() }];
    setPhotos(newPhotos);
    setIsCountingDown(false);

    if (newPhotos.length === frameCount) {
      setIsReviewing(true);
    }
  }

  const capturePhoto = async () => {
    if (isCountingDown) return;
    setIsCountingDown(true);
    setCountdown(3);
  };

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
    setIsReviewing(false);
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

    // --- REVISI HD: SKALA RESOLUSI ---
    const scale = 4; // Kita kalikan ukurannya 4x lipat biar HD (320 * 4 = 1280px)

    const receiptWidth = 320 * scale; 
    const padding = 20 * scale;
    const photoWidth = 280 * scale; 
    const photoHeight = Math.round(photoWidth * 0.75); // Rasio 4:3
    const spacing = 10 * scale;
    
    // Perhitungan tinggi total
    const totalHeight = padding + (60 * scale) + spacing + (photoHeight * frameCount) + (spacing * (frameCount - 1)) + (30 * scale) + padding;

    // Set ukuran canvas yang BESAR
    receiptCanvas.width = receiptWidth;
    receiptCanvas.height = totalHeight;

    // Aktifkan anti-aliasing biar font halus
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Background Putih
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, receiptWidth, totalHeight);
    
    // Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2 * scale; // Border juga dipertebal
    ctx.strokeRect(2 * scale, 2 * scale, receiptWidth - (4 * scale), totalHeight - (4 * scale));

    let yOffset = padding;

    // Header Fonts (Ukurannya dikali scale)
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${20 * scale}px "Courier New", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('RECEIPT', receiptWidth / 2, yOffset + (22 * scale));
    
    yOffset += (35 * scale);
    ctx.font = `${11 * scale}px "Courier New", monospace`;
    ctx.fillText(new Date().toLocaleDateString('id-ID'), receiptWidth / 2, yOffset);
    
    yOffset += (5 * scale);
    ctx.font = `${10 * scale}px "Courier New", monospace`;
    ctx.fillText(new Date().toLocaleTimeString('id-ID'), receiptWidth / 2, yOffset + (10 * scale));
    
    yOffset += spacing + (10 * scale);

    // Garis Pemisah
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1 * scale;
    ctx.setLineDash([]); 
    ctx.beginPath();
    ctx.moveTo(padding, yOffset);
    ctx.lineTo(receiptWidth - padding, yOffset);
    ctx.stroke();
    
    yOffset += spacing + (5 * scale);

    const photoPromises = photos.map((photo, index) => {
      return new Promise<void>((resolve) => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = photoWidth;
        tempCanvas.height = photoHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          // Setting kualitas tinggi untuk crop
          tempCtx.imageSmoothingEnabled = true;
          tempCtx.imageSmoothingQuality = 'high';

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
        yOffset += (12 * scale); 

        // Footer Font
        ctx.font = `bold ${12 * scale}px "Courier New", monospace`;
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
                    // Gunakan kualitas tertinggi saat export
                    link.href = receiptCanvas.toDataURL('image/png', 1.0);
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
          onConfirm={confirmFinish}
          isReviewing={isReviewing}
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