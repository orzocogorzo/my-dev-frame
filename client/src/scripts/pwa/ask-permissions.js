export function askPermission () {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notification");
    return;
  }
  
  if (Notification.permission === "granted" || Notification.permission === "denied") {
    return;
  }

  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function(permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error('[PWA] We weren\'t granted permission.');
    }
  });
}