export default function() {
  const audioCtx = new AudioContext();
  const analyzer = audioCtx.createAnalyser();
  const audio = document.querySelector("audio");
  const source = audioCtx.createMediaElementSource(audio);
  source.connect(analyzer);
  analyzer.connect(audioCtx.destination);


  const canvas = document.getElementById("visualizer")
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  // ...then set the internal size to match
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const canvasCtx = canvas.getContext("2d");

  analyzer.fftSize = 2048
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // Canvas code
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  let drawVisual
  function draw() {
    drawVisual = requestAnimationFrame(draw)

    // Clear canvas and return if paused
    canvasCtx.fillStyle = "rgb(255, 255, 255)";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    if (audio.paused) return

    waveForm()

    // barGraph()

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }

  function barGraph() {
    analyzer.getByteFrequencyData(dataArray);
    canvasCtx.fillStyle = "rgb(255, 255, 255)";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i]/2;

      canvasCtx.fillStyle = `rgb(255, ${barHeight}, 200)`;
      canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

      x += barWidth + 1;
    } 
  };

  function waveForm() {
    analyzer.getByteTimeDomainData(dataArray);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeSTyle = "rgb(0, 0, 0)";
    canvasCtx.beginPath();

    var sliceWidth = (WIDTH * 1.0) / bufferLength;
    var x = 0;

    for (let i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = (v * HEIGHT) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }
  }
  
  draw()

  return true
}
