import React from "react";

import { Link } from "react-router-dom";
import PWAPrompt from "react-ios-pwa-prompt";
import { usePWAInstall } from "react-use-pwa-install";
import Push from "push.js";
import "./Download.css";
import NavBar from "../NavBar/NavBar";
import FooterComp from "../FooterComp/FooterComp";

export default function Download() {
  const install = usePWAInstall();

  async function handlerNotification(e) {
    e.preventDefault();

    // Push.create("Dale prendelo, no te conozco uno 🚬", {
    //   body: "Puto el que lee",
    //   icon: "./copa.png",
    //   timeout: 4000,
    //   onClick: function () {
    //     window.focus();
    //     this.close();
    //   },
    // });
  }

  return (
    <div className="flex flex-col justify-between h-screen w-screen items-centerfixed top-80 ">
      <NavBar />
      <PWAPrompt
        promptOnVisit={1}
        timesToShow={3}
        copyShareButtonLabel="1) Presiona el botón compartir en la esquina superior derecha ↑."
        copyAddHomeButtonLabel="2) Presiona para descargar."
        copyClosePrompt="Mas Tarde"
        copyTitle="Descargar APP"
        copyBody="Agrega SuelaCaramelo al menú principal."
        permanentlyHideOnDismiss={false}
      />

      <div className=" mt-20 justify-between rounded-lg flex flex-col items-center">
        <div className="flex flex-col items-center rounded-lg bg-gray-300 w-96 h-56 m-5 p-5 border justify-center opacity-90 shadow-lg">
          {install ? (
            <button
              className="p-5 font-bold bg-green-500 rounded-lg shadow-lg"
              onClick={install}
            >
              Descargar Aplicación
            </button>
          ) : (
       <div className="flex flex-col items-center justify-center ">
          <p className="font-semibold text-md text-center">  La aplicación ya está descargada en este dispositivo.</p>
            <Link to="/" className="m-5">
              <button
                className="p-5 font-bold bg-amber-600 text-white rounded-lg shadow-lg"
                onClick={install}
              >
                Ir al inicio
              </button>
            </Link>
          <p className="font-semibold text-md text-center">  Si tienes iPhone descarga siguiendo las instrucciones.</p>
       </div>
          )}
        </div>
      </div>
      <FooterComp />
    </div>
  );
}
