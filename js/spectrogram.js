// Live 7‑band spectrogram from microphone
(async function() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();

    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.7;  // smooth out rapid jumps
    source.connect(analyser);

    const bars = Array.from(document.querySelectorAll('.bar'));
    const bandCount = bars.length;
    const freqData = new Uint8Array(analyser.frequencyBinCount);

    // Seven distinct rainbow colors
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

      const binSize = Math.floor(freqData.length / bandCount);
      bars.forEach((bar, i) => {
        let sum = 0;
        const start = Math.floor(i * binSize);
        const end = Math.floor((i + 1) * binSize);
        for (let j = start; j < end; j++) sum += freqData[j];
        const avg = sum / (end - start);

        // amplify mid/high bands: scale avg so all bars can move
        let percent = avg / 255;
        percent = Math.min(1, percent * 1.8);     // boost by 1.8×, clamp at 1
        const height = Math.max(4, percent * 350); // match container height

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
