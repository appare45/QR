/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
window.onload = () => {
  const videoElement = document.getElementById("video");
  const ctx = videoElement.getContext('2d');
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
      ctx.drawImage(userCamera, 0, 0, videoElement.width, videoElement.height)
      videoElement.srcObject = await userCamera;
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
