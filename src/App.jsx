import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Noticias from "./components/Home/Noticias";
import NoticeDetail from "./components/Notice/NoticeDetail";
import ContactUs from "./components/ContactUs/ContactUs";
import Clubs from "./components/Clubs/Clubs";
import ClubDetail from "./components/Clubs/ClubDetail";
import Descuentos from "./components/Voucher/Descuentos";
import Home from "./components/Home/Home";
import Fixture from "./components/Fixture/Fixture";
import Posiciones from "./components/Fixture/Posiciones";
import "./App.css";
import AdminHome from "./components/Admin/AdminHome";
import MatchSelector from "./components/Editor/MatchSelector";
import LiveMatchEditor from "./components/Editor/LiveMatchEditor";
// import { messaging } from "./firebase-config";
import { getToken } from "firebase/messaging";

import { messaging } from "./firebase/firebase-config";
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js") // Ruta a tu Service Worker
    .then((registration) => {
      console.log("Service Worker registrado con éxito:", registration);
    })
    .catch((error) => {
      console.error("Fallo el registro del Service Worker:", error);
    });
}

function App() {
  const location = useLocation();

  // Solicitar permiso
  useEffect(() => {
    // Solicita permiso y obtiene el token
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, {
          // <-- Usa la instancia 'messaging' importada
          vapidKey:
            "BL6bX-LyPfKU-U6aIgBM2_WPfhJ87Tn1_XH4jSQQFeCm9xc7QGF8XSN9jHWor45_wbVO_bIY4m3bCtscv1DZlr8",
        })
          .then((currentToken) => {
            console.log(currentToken);
            if (currentToken) {
              // Envía el token al backend
              fetch(
                "http://localhost:3000/sc/auth/register-token?token=" +
                  currentToken
              )
                .then((res) => res.json())
                .then((data) => console.log("Token registrado:", data))
                .catch((err) => console.error("Error registrando token:", err));
            }
          })
          .catch((err) => {
            console.error("No se pudo obtener el token:", err);
          });
      }
    });
  }, []);
  return (
    <section id="general" className="">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/noticias/:id" element={<NoticeDetail />} />
        <Route path="/equipos" element={<Clubs />} />
        <Route path="/equipos/:category/:name" element={<ClubDetail />} />
        <Route path="/fixture" element={<Fixture />} />
        <Route path="/posiciones" element={<Posiciones />} />
        <Route path="/cupones" element={<Descuentos />} />
        <Route path="/contacto" element={<ContactUs />} />
        <Route path="/createnotice" element={<AdminHome />} />
        <Route path="/editor" element={<MatchSelector />} />
        <Route path="/editor/:id" element={<LiveMatchEditor />} />

        <Route path="*" element={<Home />} />
      </Routes>
    </section>
  );
}

export default App;
