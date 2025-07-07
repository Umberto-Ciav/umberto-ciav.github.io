// Tone Generator using Web Audio API
let audioCtx;
let oscillator;
let isPlaying = false;
let currentWaveform = 'sine';

document.addEventListener('DOMContentLoaded', () => {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const freqSlider = document.getElementById('frequency-slider');
  const freqValue = document.getElementById('frequency-value');
  const playBtn = document.getElementById('play-toggle');
  const waveButtons = document.querySelectorAll('.waveform-button');

  // Initialize displayed frequency
  freqValue.textContent = freqSlider.value + ' Hz';

  // Update displayed frequency and live frequency
  freqSlider.addEventListener('input', () => {
    const value = freqSlider.value;
    freqValue.textContent = value + ' Hz';
    if (isPlaying && oscillator) {
      oscillator.frequency.setValueAtTime(value, audioCtx.currentTime);
    }
  });

  // Play/Stop with proper symbols
  playBtn.addEventListener('click', async () => {
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    if (isPlaying) {
      oscillator.stop();
      playBtn.innerHTML = '&#x25B6; Play';
    } else {
      oscillator = audioCtx.createOscillator();
      oscillator.type = currentWaveform;
      oscillator.frequency.setValueAtTime(freqSlider.value, audioCtx.currentTime);
      oscillator.connect(audioCtx.destination);
      oscillator.start();
      playBtn.innerHTML = '&#x23F9; Stop';
    }
    isPlaying = !isPlaying;
  });

  // Waveform selection with symbols
  waveButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      waveButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentWaveform = btn.dataset.waveform;
      if (isPlaying && oscillator) {
        oscillator.type = currentWaveform;
      }
    });
  });
});