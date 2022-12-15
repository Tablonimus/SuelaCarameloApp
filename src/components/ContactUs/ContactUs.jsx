import React from "react";
import FooterComp from "../FooterComp/FooterComp";
import NavBar from "../NavBar/NavBar";
import mail from "../../assets/images/mail.png";
import { Carousel } from "flowbite-react";
export default function ContactUs() {
  return (
    <div className="bg-[#F98958] h-screen flex flex-col justify-between items-center">
      <NavBar />
      <div className="lg:px-56 mt-20 my-10 p-10 h-full flex flex-col bg-gray-300 rounded-lg opacity-80 items-center justify-around">
        <h1 className="font-semibold text-3xl mb-5">¡CONTÁCTANOS!</h1>
        <p className="font-semibold mb-3 text-xl">
          <span className="font-bold text-xl">Clubes: </span> Cobertura especiales,
          filmaciones de partidos enteros y mucho más!!
        </p>
        <p className="font-semibold mb-3 text-xl">
        <span className="font-bold text-xl">Anunciantes: </span> ¿Querés ser parte?
          Sumate como sponsor, contáctanos para enterarte cómo! ¿Qué estás
          esperando?
        </p>
        <p className="font-bold text-xl">¿Qué estás esperando?</p>

        <section className="flex items-center mb-3">
          <img src={mail} alt="" />
          <span className="font-bold text-xl"> suelacaramelo@gmail.com</span>
        </section>
      </div>
      <FooterComp />
    </div>
  );
}
