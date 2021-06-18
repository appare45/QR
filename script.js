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
        const updateCanvas = () => {
          ctx.drawImage(
            videoElement,
            0,
            0,
            canvasElement.width,
            canvasElement.height
          );
          // ctx.scale(-1, 1);
          barcodeDetector
            .detect(canvasElement)
            .then(barcodes => {
              barcodes.forEach(barcode => {
                console.log(barcode.rawValue);
                alert(barcode.rawValue);
              });
              setTimeout(
                () => updateCanvas(),
                1000 / videoTrack.getSettings().frameRate
              );
            })
            .catch(err => {
              console.log(err);
            });
        };

        window.requestAnimationFrame(updateCanvas);
      })
      .catch(e => {
        errorElement.innerText = e;
      });
  }
  init();
};
