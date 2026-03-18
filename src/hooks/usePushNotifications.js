import { useEffect } from "react";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase/firebase-config";

const usePushNotifications = () => {
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // Deshabilitar en iOS por problemas de compatibilidad
    if (isIOS) {
      console.log("Push notifications are disabled on iOS devices.");
      return;
    }

    // Verificar si el navegador soporta service workers y notificaciones
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const registerServiceWorkerAndGetToken = async () => {
        try {
          await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          console.log("Service Worker registrado con éxito.");

          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            console.log("Permiso de notificación concedido.");
            const currentToken = await getToken(messaging, {
              vapidKey:
                "BL6bX-LyPfKU-U6aIgBM2_WPfhJ87Tn1_XH4jSQQFeCm9xc7QGF8XSN9jHWor45_wbVO_bIY4m3bCtscv1DZlr8",
            });

            if (currentToken) {
              console.log("FCM Token:", currentToken);
              // Aquí puedes enviar el token a tu backend si es necesario
              // fetch(
              //   `http://localhost:3000/sc/auth/register-token?token=${currentToken}`
              // )
              // .then((res) => res.json())
              // .then((data) => console.log("Token registrado:", data))
              // .catch((err) => console.error("Error registrando token:", err));
            } else {
              console.log(
                "No registration token available. Request permission to generate one."
              );
            }
          } else {
            console.log("No se pudo obtener el permiso para notificaciones.");
          }
        } catch (error) {
          console.error("Ocurrió un error durante la configuración de las notificaciones push:", error);
        }
      };

      registerServiceWorkerAndGetToken();
    }
  }, []);
};

export default usePushNotifications;