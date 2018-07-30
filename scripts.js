const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error(`Oh no!!!`, err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    // Remove pixels from frame
    let pixels = ctx.getImageData(0, 0, width, height);
    // Manipulate pixels
    // pixels = redEffect(pixels);
    pixels = rgbSplit(pixels);
    ctx.globalAlpha = 0.1;
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // Plays snap sounds
  snap.currentTime = 0;
  snap.play();

  // Retrieve data from canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i] + 100; // R
    pixels.data[i + 1] = pixels.data[i + 1] + -50; // G
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //B
  }

  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i]; // R
    pixels.data[i + 500] = pixels.data[i + 1]; // G
    pixels.data[i - 500] = pixels.data[i + 2]; //B
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
