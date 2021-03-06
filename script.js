/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");
window.onload = () => {
  if (navigator.bluetooth == undefined) {
    console.log("No navigator.bluetooth found.");
  } else {
    console.info("Bluetooth check: OK");
  }
  navigator.permissions
  .query({ name: "bluetooth" })
  .then(result => console.log(result));
};