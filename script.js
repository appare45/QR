/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");
window.onload = () => {
  
  // create new detector
var barcodeDetector = new BarcodeDetector({formats: ['code_39', 'codabar', 'ean_13']});

// check compatibility
if (barcodeDetector) {
  console.log('Barcode Detector supported!');
} else {
  console.log('Barcode Detector is not supported by this browser.');
}
  
  if (window.BarcodeDetector == undefined) {
    console.log("No navigator.bluetooth found.");
  } else {
    const barcodeDetactor = new window.BarcodeDetector()
    console.info("Bluetooth check: OK");
  }
  navigator.permissions
  .query({ name: "bluetooth" })
  .then(result => console.log(result));
};