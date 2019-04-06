const CACHE_NAME = self.location.hostname;
var credential;
const urlsToCache = [
  '',
  '/index.html'
].map((url) => self.location.origin + url);

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('[ServiceWorker] Opened '+ CACHE_NAME + ' cache');
        return cache.addAll(urlsToCache);
      })
  );
  console.log('[ServiceWorker] installed');
});

self.addEventListener('fetch', function (event) {
  event.respondWith((() => {
    if (event.request.url.indexOf('push-notification') >= 0) {
      return fireNotificationsLoop(event.request);
    } else {
      return caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (navigator.onLine) {
          // IMPORTANT: Clone the request. A request is a stream and
          // can only be consumed once. Since we are consuming this
          // once by cache and once by the browser for fetch, we need
          // to clone the response.
          var fetchRequest = event.request.clone();

          return fetch(fetchRequest).then(
            function (res) {
              // Check if we received a valid response
              if (!res || res.status !== 200 || res.type !== 'basic') {
                return res;
              }

              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              var responseToCache = res.clone();

              caches.open(CACHE_NAME)
                .then(function (cache) {
                  event.request === "GET" && cache.put(event.request, responseToCache);
                }).catch(err => {
                  console.error(err);
                });

              return res;
            }
          ).catch(err => {
            console.log('[ServiceWorker] Request catched resource from ', err)
            if (response) {
              return response;
            }
          });
        } else if (response) {
          console.log('[ServiceWorker] Return catched response');
          return response;
        }
      });
    }
  })());
});

self.addEventListener('activate', function(event) {
  console.log('[ServiceWorker] activated');
  var cacheWhitelist = [
    'localhost'
  ];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      ).then(_ => {
        console.log('[ServiceWorker] cleaned caches after new activation');
      });
    })
  );
});

self.addEventListener('notificationclick', function (event) {  
  console.log('On notification click: ', event.notification.tag);  
  // Android doesn't close the notification when you click on it  
  event.notification.close();

  // This looks to see if the current is already open and focuses if it is  
  event.waitUntil(
    clients.matchAll({  
      type: "window"  
    }).then(function (clientList) {  
      for (var i = 0; i < clientList.length; i++) {  
        var client = clientList[i];  
        if (client.url == '/' && 'focus' in client)  
          return client.focus();  
      }  
      if (clients.openWindow) {
        return clients.openWindow('/');  
      }
    })
  );
});

self.showNotification = function (status) {
  console.log('[ServiceWorker] Show notification');
  self.registration.showNotification('notification title', {  
    body: 'notification message',
    icon: 'url to the icon',
    tag: 'notification tag'
  });
}