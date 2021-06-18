/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
window.onload = () => {
  const videoElement = document.getElementById("video");
  const errorElement = document.getElementById("error");
  const userHaveCamera = new Promise((resolve, reject) => {    
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(e => {
        console.info(e);
        if (!e) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
      .catch((e) => {
        reject(e);
      });
  })

  async function init() {
    if (await !userHaveCamera) {
      errorElement.innerText = "カメラにアクセスできませんでした";
    } else {
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
  init()
};
