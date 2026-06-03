// src/components/PhotoBooth.tsx
import { useRef, useState, useEffect } from 'react';
import { FrameCount, Photo, Step, PhotoFilter } from '../types';
import { playCountdownBeep, playShutterSound, startPrintSound, stopPrintSound, playPaperTearSound } from '../utils/sound';

import FrameSelector from './FrameSelector';
import CaptureScreen from './CaptureScreen';
import ResultScreen from './ResultScreen';
import PrintingOverlay from './PrintingOverlay';

// Filter yang dipakai saat ekspor ke canvas (hasil download)
const getCanvasFilter = (filter: PhotoFilter) => {
  switch (filter) {
    case 'vintage':
      return 'sepia(0.4) contrast(1.05) brightness(1.02) saturate(1.05)';
    case 'bittersweet':
      return 'sepia(0.35) contrast(1.1) brightness(1.05) saturate(1.2) hue-rotate(-10deg)';
    case 'ogVintage':
      return 'sepia(0.6) contrast(1.03) brightness(1.0) saturate(0.9) hue-rotate(8deg)';
    case 'blackwhite':
      return 'grayscale(100%) contrast(1.35) brightness(0.98)';
    case 'normal':
    default:
      return 'none';
  }
};

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
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [receiptTitle] = useState('RECEIPT');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter>('normal');

  // Bersihkan printer sound ketika komponen unmount
  useEffect(() => {
    return () => {
      stopPrintSound();
    };
  }, []);

  useEffect(() => {
    if (currentStep === 'capture' && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [currentStep, stream]);

  // Efek hitung mundur dengan bip suara
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      performCapture();
    } else {
      // Mainkan suara hitung mundur bip
      playCountdownBeep();
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const applyTorch = (activeStream: MediaStream, mode: 'user' | 'environment', torch: boolean) => {
    const track = activeStream.getVideoTracks()[0];
    const anyTrack: any = track;
    if (!track || !anyTrack.getCapabilities || !anyTrack.applyConstraints) return;
    const caps = anyTrack.getCapabilities();
    if (!caps || !('torch' in caps) || mode !== 'environment') return;
    try {
      anyTrack.applyConstraints({ advanced: [{ torch }] });
    } catch (e) {
      console.warn('Torch not supported:', e);
    }
  };

  const startCamera = async (
    count: FrameCount,
    mode?: 'user' | 'environment',
    options?: { resetPhotos?: boolean }
  ) => {
    const desiredFacingMode = mode ?? facingMode;
    const { resetPhotos = false } = options ?? {};

    setFrameCount(count);

    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: desiredFacingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      setStream(streamData);
      applyTorch(streamData, desiredFacingMode, isTorchOn);
      setIsCameraActive(true);
      setCurrentStep('capture');

      if (resetPhotos) {
        setPhotos([]);
        setIsReviewing(false);
      }

      setFacingMode(desiredFacingMode);
    } catch (error) {
      console.error('Error accessing kamera:', error);
      alert('Tidak bisa mengakses kamera');
    }
  };

  const performCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    // Mainkan suara shutter kamera!
    playShutterSound();
    
    setIsFlashing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      ctx.drawImage(videoRef.current, 0, 0);
    }
    
    const photoData = canvas.toDataURL('image/jpeg', 1.0);

    setTimeout(() => setIsFlashing(false), 100);

    const newPhotos = [...photos, { data: photoData, timestamp: new Date() }];
    setPhotos(newPhotos);
    setIsCountingDown(false);

    if (newPhotos.length === frameCount) {
      setIsReviewing(true);
    }
  };

  const handlePhotoUpload = (dataUrl: string) => {
    const newPhotos = [...photos, { data: dataUrl, timestamp: new Date() }];
    setPhotos(newPhotos);
    if (newPhotos.length === frameCount) {
      setIsReviewing(true);
    }
  };

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

  const toggleCamera = async () => {
    const newMode: 'user' | 'environment' = facingMode === 'user' ? 'environment' : 'user';
    stopCamera();
    await startCamera(frameCount, newMode, { resetPhotos: false });
  };

  const toggleTorch = () => {
    const next = !isTorchOn;
    setIsTorchOn(next);
    if (stream) {
      applyTorch(stream, facingMode, next);
    }
  };

  const downloadReceipt = () => {
    setCurrentStep('printing');
    setPrintProgress(0);

    // Mulai mainkan suara motor printer thermal!
    startPrintSound();

    const headerText = (receiptTitle || 'RECEIPT').slice(0, 15);

    const receiptCanvas = document.createElement('canvas');
    const ctx = receiptCanvas.getContext('2d');
    if (!ctx) return;

    const scale = 4; // Ukuran HD (320 * 4 = 1280px)

    const receiptWidth = 320 * scale; 
    const padding = 20 * scale;
    const photoWidth = 280 * scale; 
    const photoHeight = Math.round(photoWidth * 0.75); // Rasio 4:3
    const spacing = 10 * scale;
    
    const dividerHeight = 10 * scale;
    const metadataHeight = 45 * scale;
    const barcodeHeight = 40 * scale;
    
    const photosTotalHeight = (photoHeight * frameCount) + (spacing * (frameCount - 1));
    
    // Hitung tinggi ekstra untuk daftar barang belanjaan lucu
    const itemsHeight = (47 * scale) + (frameCount * 12 * scale);

    // Tinggi total presisi sesuai akumulasi offset
    const totalHeight = padding + (55 * scale) + dividerHeight + photosTotalHeight + dividerHeight + itemsHeight + metadataHeight + dividerHeight + barcodeHeight + padding;

    receiptCanvas.width = receiptWidth;
    receiptCanvas.height = totalHeight;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Background Putih
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, receiptWidth, totalHeight);

    let yOffset = padding;

    // 1. Gambar Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#2E2A27';
    const spacedHeader = headerText.split('').join(' ');
    ctx.font = `bold ${22 * scale}px "Courier New", monospace`;
    ctx.fillText(spacedHeader, receiptWidth / 2, yOffset + (22 * scale));
    
    yOffset += (32 * scale);

    // Tanggal + jam
    ctx.fillStyle = '#6B6661';
    ctx.font = `${10 * scale}px "Courier New", monospace`;
    const dateText = new Date().toLocaleDateString('id-ID');
    const timeText = new Date().toLocaleTimeString('id-ID');
    const dateTimeText = `${dateText} · ${timeText}`;
    ctx.fillText(dateTimeText, receiptWidth / 2, yOffset + (10 * scale));
    
    yOffset += (23 * scale);

    // Garis pembagi dashed
    const drawDashedDivider = (yPos: number) => {
      if (!ctx) return;
      ctx.strokeStyle = '#D9DDE6';
      ctx.lineWidth = 1 * scale;
      ctx.setLineDash([4 * scale, 3 * scale]); 
      ctx.beginPath();
      ctx.moveTo(padding, yPos);
      ctx.lineTo(receiptWidth - padding, yPos);
      ctx.stroke();
    };

    drawDashedDivider(yOffset);
    yOffset += dividerHeight;

    const photosStartOffset = yOffset;

    const photoPromises = photos.map((photo, index) => {
      return new Promise<void>((resolve) => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = photoWidth;
        tempCanvas.height = photoHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          tempCtx.imageSmoothingEnabled = true;
          tempCtx.imageSmoothingQuality = 'high';
          tempCtx.filter = getCanvasFilter(selectedFilter);

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

            tempCtx.drawImage(
              tempImg, 
              sx, sy, sWidth, sHeight,
              0, 0, photoWidth, photoHeight
            );

            ctx.drawImage(tempCanvas, padding, photosStartOffset + (index * (photoHeight + spacing)), photoWidth, photoHeight);
            resolve();
          };
          tempImg.src = photo.data;
        } else {
          resolve();
        }
      });
    });

    Promise.all(photoPromises).then(() => {
        yOffset += photosTotalHeight;

        drawDashedDivider(yOffset);
        yOffset += dividerHeight;

        // --- DAFTAR BARANG BELANJAAN LAINNYA ---
        ctx.textAlign = 'left';
        ctx.fillStyle = '#2E2A27';
        ctx.font = `bold ${9 * scale}px "Courier New", monospace`;
        ctx.fillText("ITEMS:", padding + (5 * scale), yOffset + (10 * scale));
        yOffset += (12 * scale);

        const itemNames = [
          "SWEET SMILE",
          "CUTE POSE",
          "SHINY MOMENT",
          "HAPPY VIBES"
        ];

        for (let i = 0; i < frameCount; i++) {
          ctx.textAlign = 'left';
          ctx.font = `bold ${8 * scale}px "Courier New", monospace`;
          ctx.fillText(`1x ${itemNames[i % itemNames.length]}`, padding + (10 * scale), yOffset + (10 * scale));
          ctx.textAlign = 'right';
          ctx.fillText("0.00", receiptWidth - padding - (5 * scale), yOffset + (10 * scale));
          yOffset += (12 * scale);
        }

        drawDashedDivider(yOffset);
        yOffset += dividerHeight;
        
        ctx.textAlign = 'left';
        ctx.font = `bold ${10 * scale}px "Courier New", monospace`;
        ctx.fillText("TOTAL AMOUNT:", padding + (5 * scale), yOffset + (10 * scale));
        ctx.textAlign = 'right';
        ctx.fillText("0.00", receiptWidth - padding - (5 * scale), yOffset + (10 * scale));
        yOffset += (15 * scale);

        drawDashedDivider(yOffset);
        yOffset += dividerHeight;

        // 2. Gambar Metadata
        ctx.textAlign = 'left';
        ctx.fillStyle = '#2E2A27';
        ctx.font = `bold ${9 * scale}px "Courier New", monospace`;
        
        ctx.fillText("QTY:", padding + (5 * scale), yOffset + (10 * scale));
        ctx.fillText("TRANS ID:", padding + (5 * scale), yOffset + (20 * scale));
        ctx.fillText("PAYMENT:", padding + (5 * scale), yOffset + (30 * scale));
        ctx.fillText("TAX:", padding + (5 * scale), yOffset + (40 * scale));
        
        ctx.textAlign = 'right';
        const rightAlignX = receiptWidth - padding - (5 * scale);
        ctx.fillText(`${photos.length} PHOTO(S)`, rightAlignX, yOffset + (10 * scale));
        
        const randomNum = Math.floor(Math.random() * 900000 + 100000);
        ctx.fillText(`#PB-${randomNum}`, rightAlignX, yOffset + (20 * scale));
        ctx.fillText("SMILE & LOVE", rightAlignX, yOffset + (30 * scale));
        ctx.fillText("0.00%", rightAlignX, yOffset + (40 * scale));

        yOffset += metadataHeight;

        drawDashedDivider(yOffset);
        yOffset += dividerHeight;

        // 3. Gambar Barcode (Diposisikan di tengah secara geometris)
        const barcodeHeightVal = 20 * scale;
        const barcodeStartY = yOffset + (5 * scale);
        
        ctx.fillStyle = '#2E2A27';
        const lineWeights = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 1, 2, 2, 4, 1, 2, 1, 3, 1, 1, 2, 4, 1];
        
        // Hitung total lebar barcode (bar + sela)
        const totalBarsWidth = lineWeights.reduce((a, b) => a + b, 0) * 1.5 * scale;
        const totalGapsWidth = (lineWeights.length - 1) * 1 * scale;
        const actualBarcodeWidth = totalBarsWidth + totalGapsWidth;
        
        let startBarcodeX = (receiptWidth - actualBarcodeWidth) / 2;
        
        lineWeights.forEach((weight, index) => {
          const w = weight * 1.5 * scale;
          ctx.fillRect(startBarcodeX, barcodeStartY, w, barcodeHeightVal);
          startBarcodeX += w;
          if (index < lineWeights.length - 1) {
            startBarcodeX += 1 * scale;
          }
        });
        
        ctx.textAlign = 'center';
        ctx.font = `bold ${7 * scale}px "Courier New", monospace`;
        ctx.fillText("#THANK-YOU", receiptWidth / 2, barcodeStartY + barcodeHeightVal + (10 * scale));

        let progress = 0;
        const printInterval = setInterval(() => {
            progress += Math.random() * 25;
            if (progress >= 100) {
                progress = 100;
                clearInterval(printInterval);
                setPrintProgress(100);
                
                // Hentikan suara printer thermal!
                stopPrintSound();
                // Mainkan suara sobek kertas!
                playPaperTearSound();

                setTimeout(() => {
                    const link = document.createElement('a');
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
    <div className="w-full max-w-5xl">
      {currentStep === 'select' && (
        <FrameSelector
          onFrameSelect={(count) => startCamera(count, undefined, { resetPhotos: true })}
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
          toggleCamera={toggleCamera}
          onBackHome={resetToHome}
          isTorchOn={isTorchOn}
          onToggleTorch={toggleTorch}
          facingMode={facingMode}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          onPhotoUpload={handlePhotoUpload}
        />
      )}

      {(currentStep === 'result' || currentStep === 'printing') && (
        <ResultScreen
          photos={photos}
          onDownload={downloadReceipt}
          onReset={resetToHome}
          receiptTitle={receiptTitle}
          selectedFilter={selectedFilter}
        />
      )}

      {currentStep === 'printing' && (
        <PrintingOverlay progress={printProgress} />
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}