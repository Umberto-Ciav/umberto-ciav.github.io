// Live 7‑band spectrogram from microphone
(async function() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    const bars = Array.from(document.querySelectorAll('.bar'));
    const bandCount = bars.length;
    const freqData = new Uint8Array(analyser.frequencyBinCount);

    // rainbow colors from red to violet
    const colors = [
      '#E53935', // red
      '#FB8C00', // orange
      '#FDD835', // yellow
      '#43A047', // green
      '#1E88E5', // blue
      '#8E24AA', // indigo
      '#8E24AA'  // violet (reuse indigo or adjust)
    ];

    bars.forEach((bar, i) => {
      bar.style.background = colors[i];
    });

    function update() {
      analyser.getByteFrequencyData(freqData);
      const binSize = freqData.length / bandCount;

      bars.forEach((bar, i) => {
        let sum = 0;
        const start = Math.floor(i * binSize);
        const end = Math.floor((i + 1) * binSize);
        for (let j = start; j < end; j++) sum += freqData[j];
        const avg = sum / (end - start);
        const percent = avg / 255;              // 0..1
        const height = Math.max(4, percent * 300); // min 4px
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
