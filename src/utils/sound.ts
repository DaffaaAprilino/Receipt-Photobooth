// src/utils/sound.ts

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

// Suara countdown (beep pendek berfrekuensi tinggi)
export function playCountdownBeep() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    console.warn('Audio play failed:', e);
  }
}

// Suara shutter kamera (noise burst pendek + klik tirai mekanis)
export function playShutterSound() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    // 1. Noise burst untuk simulasi tirai shutter
    const bufferSize = ctx.sampleRate * 0.08; // 80ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1200;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
    
    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    
    // 2. Klik nada tinggi untuk tirai mekanik
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
    
    oscGain.gain.setValueAtTime(0.08, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    
    noiseNode.start(ctx.currentTime);
    osc.start(ctx.currentTime);
    
    noiseNode.stop(ctx.currentTime + 0.08);
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.warn('Audio play failed:', e);
  }
}

// Loop/pulsating sound untuk whirring printer thermal
let printerInterval: number | null = null;
let printerOsc: OscillatorNode | null = null;
let printerGain: GainNode | null = null;

export function startPrintSound() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    if (printerOsc) return; // Sudah aktif
    
    printerOsc = ctx.createOscillator();
    printerGain = ctx.createGain();
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300; // Muted tone biar tidak bising
    
    printerOsc.connect(filter);
    filter.connect(printerGain);
    printerGain.connect(ctx.destination);
    
    // Nada suara whirring printer (gabungan gelombang sawtooth frekuensi rendah)
    printerOsc.type = 'sawtooth';
    printerOsc.frequency.setValueAtTime(80, ctx.currentTime); // 80 Hz hum
    
    printerGain.gain.setValueAtTime(0.012, ctx.currentTime);
    
    printerOsc.start(ctx.currentTime);
    
    // Efek stepper motor berdenyut dengan interval random kecil
    printerInterval = window.setInterval(() => {
      if (printerOsc && printerGain && ctx) {
        const now = ctx.currentTime;
        // Sedikit goyangkan frekuensi dan volume untuk suara motor stepper cetak yang realistis
        printerOsc.frequency.setValueAtTime(75 + Math.random() * 12, now);
        printerGain.gain.setValueAtTime(0.008 + Math.random() * 0.006, now);
      }
    }, 70);
    
  } catch (e) {
    console.warn('Audio play failed:', e);
  }
}

export function stopPrintSound() {
  try {
    if (printerInterval) {
      clearInterval(printerInterval);
      printerInterval = null;
    }
    if (printerOsc) {
      printerOsc.stop();
      printerOsc.disconnect();
      printerOsc = null;
    }
    if (printerGain) {
      printerGain.disconnect();
      printerGain = null;
    }
  } catch (e) {
    console.warn('Audio stop failed:', e);
  }
}

// Suara sobek kertas (noise burst dengan volume fade out cepat & modulasi filter)
export function playPaperTearSound() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const bufferSize = ctx.sampleRate * 0.25; // 250ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Buat noise dengan amplifikasi frekuensi tinggi untuk efek kertas sobek
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      data[i] = (Math.random() * 2 - 1) * (1.0 - t) * (0.8 + 0.2 * Math.sin(t * 40));
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3500, ctx.currentTime + 0.15);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseNode.start(ctx.currentTime);
    noiseNode.stop(ctx.currentTime + 0.25);
  } catch (e) {
    console.warn('Audio play failed:', e);
  }
}

