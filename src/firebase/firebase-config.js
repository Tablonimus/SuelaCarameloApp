import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC8Oz-tPNPEkKpMl30GGQOrY5GoUPlVvtQ",
  authDomain: "suelapp-837b5.firebaseapp.com",
  projectId: "suelapp-837b5",
  storageBucket: "suelapp-837b5.appspot.com",
  messagingSenderId: "573253536739",
  appId: "1:573253536739:web:7786063f04a0d7a233eed6",
  measurementId: "G-BQZ8HZXXVJ",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
