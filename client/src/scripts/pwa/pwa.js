import { vapiDecoder } from './vapi-decoder.js';
import { HttpClient } from '../helpers/client/index.js';

const PWA = function () {
  var credential;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(this.initialiseState)
      .catch(err => console.error(err));
  } else {  
    console.warn('[PWA] Service workers aren\'t supported in this browser.');  
  }

  this.setCredential = function (trackingId) {
    if (!trackingId) return;
    credential = trackingId;
    return this;
  }

  // this.fireNotificationsLoop = function () {
  //   if (!credential) return;
  //   this.ajax.promise((res) => {
  //     console.log(res);
  //   }, (err) => {
  //     console.error(err);
  //   }).get(environment.apiURL + '/push-notifications.json?trackingId=' + credential);
  // }

  // Once the service worker is registered set the initial state  
  this.initialiseState = function () {
    console.log('[PWA] initialiseState');
    // Are Notifications supported in the service worker?  
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notification");
      return;
    }

    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {  
      console.warn('[PWA] Notifications aren\'t supported.');  
      return;  
    }

    // Check the current Notification permission.  
    // If its denied, it's a permanent block until the  
    // user changes the permission  
    if (Notification.permission === 'denied') {  
      console.warn('[PWA] The user has blocked notifications.');  
      return;  
    }

    // We need the service worker registration to check for a subscription  
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
      if (Notification.permission === "granted") {
        this.fireNotificationsLoop();
      } else {
        Notification.requestPermission()
          .then(res => {
            console.log(res);
            if (Notification.permission === "granted") {
              this.fireNotificationsLoop();
            } else {
              console.warn('[PWA] The user has blocked notifications.');
            }
          });
      }  
    });  
  }

  return this;
}

new HttpClient(PWA);

export default PWA;