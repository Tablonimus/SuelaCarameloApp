// firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js" // <--- ¡Versión actualizada!
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js" // <--- ¡Versión actualizada!
);

firebase.initializeApp({
  apiKey: "AIzaSyC8Oz-tPNPEkKpMl30GGQOrY5GoUPlVvtQ",
  authDomain: "suelapp-837b5.firebaseapp.com",
  projectId: "suelapp-837b5",
  storageBucket: "suelapp-837b5.appspot.com",
  messagingSenderId: "573253536739",
  appId: "1:573253536739:web:7786063f04a0d7a233eed6",
  measurementId: "G-BQZ8HZXXVJ",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
