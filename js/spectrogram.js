// Live 7‑band spectrogram mapped to 40–3520 Hz (double‑bass → violin)
(async function() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();

    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.85;  // heavier smoothing
    source.connect(analyser);

    const bars = Array.from(document.querySelectorAll('.bar'));
    const bandCount = bars.length;
    const freqData = new Uint8Array(analyser.frequencyBinCount);
    const sampleRate = audioCtx.sampleRate; // e.g. 44100
    const binCount = analyser.frequencyBinCount; // fftSize/2

    // Define 7 bands from 40 Hz up to 3520 Hz
    const fMin = 40;
    const fMax = 3520;
    const bandWidth = (fMax - fMin) / bandCount;
    const bandRanges = bars.map((_, i) => {
      const low = fMin + i * bandWidth;
      const high = fMin + (i + 1) * bandWidth;
      // convert freq to bin indices:
      const startBin = Math.floor(low / sampleRate * binCount);
      const endBin = Math.min(binCount, Math.ceil(high / sampleRate * binCount));
      return { startBin, endBin };
    });

    // Rainbow colors (distinct)
    const colors = [
      '#E53935', // red
      '#FB8C00', // orange
      '#FDD835', // yellow
      '#43A047', // green
      '#1E88E5', // blue
      '#3949AB', // indigo
      '#8E24AA'  // violet
    ];
    bars.forEach((bar, i) => bar.style.background = colors[i]);

    function update() {
      analyser.getByteFrequencyData(freqData);

      bars.forEach((bar, i) => {
        const { startBin, endBin } = bandRanges[i];
        let sum = 0;
        for (let j = startBin; j < endBin; j++) {
          sum += freqData[j];
        }
        const avg = sum / Math.max(1, endBin - startBin);
        const percent = avg / 255;              // 0..1, no extra boost
        const height = Math.max(4, percent * 350); // same container height

        bar.style.height = `${height}px`;
      });

      requestAnimationFrame(update);
    }
    update();
  } catch (err) {
    console.error('Microphone access denied or error:', err);
    alert('Cannot access microphone. Please allow access and reload.');
  }
})();
