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
    console.info(await userCamera);
    if (await !userCamera) {
      errorElement.innerText = "カメラにアクセスできませんでした";
    } else {
      videoElement.srcObject = await userCamera;
      const updateCanvas = () => {
        console.info(ctx)
        ctx.drawImage(
          videoElement,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        setTimeOut(() => updateCanvas(), 1000)
      };
      window.requestAnimationFrame(updateCanvas);

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
    }
  }
  init();
};
