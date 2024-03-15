// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8Oz-tPNPEkKpMl30GGQOrY5GoUPlVvtQ",
  authDomain: "suelapp-837b5.firebaseapp.com",
  projectId: "suelapp-837b5",
  storageBucket: "suelapp-837b5.appspot.com",
  messagingSenderId: "573253536739",
  appId: "1:573253536739:web:7786063f04a0d7a233eed6",
  measurementId: "G-BQZ8HZXXVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);