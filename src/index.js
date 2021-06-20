/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console

import jsQR from "jsqr";

window.onload = () => {
  const videoElement = document.getElementById("video");
  const canvasElement = document.getElementById("canvas");

  const errorElement = document.getElementById("error");
  const userCamera = new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(e => {
        if (!e) {
          resolve(false);
        } else {
          resolve(e);
        }
      })
      .catch(e => {
        reject(e);
      });
  });

  const drawBoxToOverLay = points => {
    const canvas = document
      .getElementById("canvas_overlay")
    const ctx = canvas
      .getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#ff756b";
    ctx.fillStyle = "#ff756b91";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  };

  const updateCanvas = (fps) => {
    const ctx = canvasElement.getContext("2d");
    ctx.drawImage(
      videoElement,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    setTimeout(
      () => updateCanvas(),
      1000 / fps
    );
  };
  async function init() {
    userCamera
      .then(e => {
        videoElement.srcObject = e;
        const videoTracks = e.getVideoTracks();
        const videoTrack = videoTracks[0];
        canvasElement.width = videoTrack.getSettings().width;
        canvasElement.height = videoTrack.getSettings().height;
        updateCanvas(videoTrack.getSettings().frameRate);
        document.getElementById("canvas_overlay").width = canvas.width;
        document.getElementById("canvas_overlay").height = canvas.height;
        if (!('BarcodeDetector' in window)) {
          const ctx = document
            .getElementById("canvas")
            .getContext("2d");
          const detectCode = () => {
            const image = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height)
            const code = jsQR(image.data, image.width, image.height)
            console.info(code)
            if (code) {
              drawBoxToOverLay([code.location.topLeftCorner, code.location.topRightCorner, code.location.bottomRightCorner, code.location.bottomLeftCorner])
              errorElement.innerText = code.data;
            } else {
              document
                .getElementById("canvas_overlay").getContext('2d').clearRect(0, 0, canvasElement.width, canvasElement.height)
            }
            setTimeout(
              () => detectCode(canvas),
              1000 / videoTrack.getSettings().frameRate
            );
          }
          detectCode()
        } else {
          // create new detector
          var barcodeDetector = new BarcodeDetector();
          const detectCode = canvas => {
            barcodeDetector
              .detect(canvas)
              .then(barcodes => {
                barcodes.forEach(barcode => {
                  drawBoxToOverLay(barcode.cornerPoints);
                  errorElement.innerText = barcode.rawValue;
                });
                setTimeout(
                  () => detectCode(canvas),
                  1000 / videoTrack.getSettings().frameRate
                );
              })
              .catch(err => {
                console.log(err);
              });
          };
          detectCode(canvasElement);
        }
      })
      .catch(e => {
        if (!e.toString().indexOf("NotAllowedError")) {
          errorElement.innerText = "カメラへのアクセスが拒否されました";
        } else {
          console.error(e)
          errorElement.innerText = e;
        }
      });
  }
  init();
};
