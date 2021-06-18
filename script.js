/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");
window.onload = () => {
  
  const videoElement = document.getElementById('video')
  const userHaveCamera = () => {
    try {
      console.info(navigator.)
    }
  }
  
//   access to user's camera
  
  
  
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
  
  
};
