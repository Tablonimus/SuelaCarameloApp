import React from "react";
import mail from "../../assets/images/mail.png";

export default function ContactUs() {
  return (
    <div className=" h-screen flex flex-col justify-between items-center">
      <div className="w-11/12 lg:w-1/2 mt-32 my-10 p-10  flex flex-col bg-black rounded-lg bg-opacity-80 items-center justify-center gap-5 text-white">
        <h1 className="font-semibold text-3xl">¡CONTÁCTANOS!</h1>
        <p className="font-semibold  text-xl">
          <span className="font-bold text-xl">Clubes: </span> Cobertura
          especiales, filmaciones de partidos enteros y mucho más!!
        </p>
        <p className="font-semibold text-xl">
          <span className="font-bold text-xl">Anunciantes: </span> ¿Querés ser
          parte? Sumate como sponsor, contáctanos para enterarte cómo! ¿Qué
          estás esperando?
        </p>
        <p className="font-bold text-xl">¿Qué estás esperando?</p>

        <section className="flex items-center ">
          <img src={mail} alt="" />
          <span className="font-bold text-xl"> suelacaramelo@gmail.com</span>
        </section>
      </div>
    </div>
  );
}
