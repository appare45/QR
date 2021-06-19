/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console

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

  async function init() {
    userCamera
      .then(e => {
        videoElement.srcObject = e;
        const videoTracks = e.getVideoTracks();
        const videoTrack = videoTracks[0];
        canvasElement.width = videoTrack.getSettings().width;
        canvasElement.height = videoTrack.getSettings().height;
        // create new detector
        var barcodeDetector = new BarcodeDetector();

        // check compatibility
        if (barcodeDetector) {
          console.log("Barcode Detector supported!");
        } else {
          console.log("Barcode Detector is not supported by this browser.");
        }

        const drawBoxToOverLay = points => {
          const ctx = document
            .getElementById("canvas_overlay")
            .getContext("2d");
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

        const detectCode = canvas => {
          barcodeDetector
            .detect(canvas)
            .then(barcodes => {
              document.getElementById("canvas_overlay").width = canvas.width;
              document.getElementById("canvas_overlay").height = canvas.height;
              const ctx = document
                .getElementById("canvas_overlay")
                .getContext("2d");
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
        const updateCanvas = () => {
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
            1000 / videoTrack.getSettings().frameRate
          );
        };

        updateCanvas();
        detectCode(canvasElement);
      })
      .catch(e => {
        console.info(e);
        if (e.toString().indexOf("NotAllowedError")) {
          errorElement.innerText = "アクセスが拒否されました";
        } else {
          errorElement.innerText = e;
        }
      });
  }
  init();
};
