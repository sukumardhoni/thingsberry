'use strict';
console.log("IN SW.js");

/*Notification.onclick = function (event) {
  console.log("NOTIFICATION : ", event)
}*/

self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.');
  var data = event.data.json();
  console.log(data);
  console.log(event.data.text());
  var d = event.data.text();

  var title = data.title;
  var options = {
    body: data.message,
    icon: data.icon,
    url: data.url,
    data: {
      url: data.url
    }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  // Close notification.
  console.log("$$$$$$$$$$$ : ", event)
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
