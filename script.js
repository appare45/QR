/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
window.onload = () => {
  const videoElement = document.getElementById("video");
  const canvasElement = document.getElementById("canvas");
  const ctx = canvasElement.getContext("2d");
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
        const videoTrack = e.getVideoTracks()[0];
        canvasElement.width = videoTrack.getSettings().width;
        canvasElement.height = videoTrack.getSettings().height;
        // create new detector
        var barcodeDetector = new BarcodeDetector({
          formats: ["qr_code"]
        });

        // check compatibility
        if (barcodeDetector) {
          console.log("Barcode Detector supported!");
        } else {
          console.log("Barcode Detector is not supported by this browser.");
        }

        const detectCode = canvas => {
          barcodeDetector
            .detect(canvas)
            .then(barcodes => {
              barcodes.forEach(barcode => {
                ctx.lineWidth = 5;
                ctx.lineJoin = "round";
                ctx.strokeStyle = "blue";
                ctx.fillStyle = "#4287f591";
                ctx.beginPath();
                ctx.moveTo(
                  barcode.cornerPoints[0].x,
                  barcode.cornerPoints[0].y
                );

                ctx.lineTo(
                  barcode.cornerPoints[1].x,
                  barcode.cornerPoints[1].y
                );
                ctx.lineTo(
                  barcode.cornerPoints[2].x,
                  barcode.cornerPoints[2].y
                );
                ctx.lineTo(
                  barcode.cornerPoints[3].x,
                  barcode.cornerPoints[3].y
                );
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                alert(barcode.rawValue);
              });
              setTimeout(
                () => detectCode(),
                (1000 / videoTrack.getSettings().frameRate) * 10
              );
            })
            .catch(err => {
            
              console.log(err);
            });
        };
        const updateCanvas = () => {
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
        detectCode(videoElement);
      })
      .catch(e => {
        errorElement.innerText = e;
      });
  }
  init();
};
