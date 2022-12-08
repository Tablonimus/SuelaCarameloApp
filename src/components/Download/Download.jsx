import React from "react";

import { Link } from "react-router-dom";
import PWAPrompt from "react-ios-pwa-prompt";
import { usePWAInstall } from "react-use-pwa-install";
import Push from "push.js";
import "./Download.css";

export default function Download() {
  const install = usePWAInstall();

  async function handlerNotification(e) {
    e.preventDefault();

    Push.create("Dale prendelo, no te conozco uno 🚬", {
      body: "Puto el que lee",
      icon: "./copa.png",
      timeout: 4000,
      onClick: function () {
        window.focus();
        this.close();
      },
    });
  }

  return (
    <div className="flex flex-col justify-between h-screen w-full items-center fixed top-80 ">
      <PWAPrompt
        promptOnVisit={1}
        timesToShow={3}
        copyShareButtonLabel="1) Presiona el botón compartir en la esquina superior derecha ↑."
        copyAddHomeButtonLabel="2) Presiona para descargar."
        copyClosePrompt="Mas Tarde"
        copyTitle="Descargar APP"
        copyBody="Agrega el album al menú principal."
        permanentlyHideOnDismiss={false}
      />

      <div className=" justify-between rounded-lg flex flex-col items-center">
        <button
          className=" p-5 font-bold bg-[#F6D50E] m-5 rounded-lg shadow-lg"
          onClick={(e) => handlerNotification(e)}
        >
          🔔MENSAJE ESPECIAL🔔
        </button>
        <div className="flex flex-col items-center rounded-lg bg-gray-300 w-96 h-56 m-5 p-5 border justify-center opacity-90 shadow-lg">
          <button
            className="p-5 font-bold bg-green-400 rounded-lg shadow-lg"
            onClick={install}
          >
            Instalar Aplicación si tenes android
          </button>
          <Link to="/" className="mt-5">
            <button
              className="p-5 font-bold bg-blue-400 rounded-lg shadow-lg"
              onClick={install}
            >
              Para los chetos que tienen iPhone
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
