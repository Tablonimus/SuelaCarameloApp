import React from "react";
import mail from "../../assets/images/mail.png";
import logoSC from "../../assets/images/banner2.png";
import { Link } from "react-router-dom";
import Sidebar from "../NavBar/Sidebar";
import FooterComp from "../FooterComp/FooterComp";
export default function ContactUs() {
  return (
    <>
      <Sidebar active={"contacto"} />

      <header className="w-full flex flex-col justify-center items-center bg-zinc-900 gap-3 py-4 lg:py-6">
        <h2 className="text-xl border-b w-full  text-center pb-2 italic lg:mb-4 lg:text-2xl  text-gray-200 font-bold">
          SUELA CARAMELO - CONTACTO
        </h2>
      </header>
      <main className="flex flex-col justify-start gap-6 items-center  pl-[70px] pb-10  overflow-hidden">
        <img className=" mt-8 w-44 mb-4 lg:w-52" src={logoSC} alt="" />
        <h4 className="  max-w-56 font-semibold text-center leading-6 text-zinc-800 text-2xl lg:text-4xl lg:max-w-96 lg:mt-4 lg:font-bold ">
          Ponte en contacto con nosotros
        </h4>

        <article className=" px-1 font-medium text-base text-center text-gray-100 lg:max-w-[33rem] lg:mt-6 lg:text-xl">
          Informando y celebrando el futsal en Mendoza. Somos un medio
          apasionado por este deporte, con coberturas, contenido audiovisual y
          una visión de influencia global. Además, somos Suela Producciones, una
          productora audiovisual y fotográfica enfocada en deportes. Si quieres
          sumarte a nuestra comunidad o tienes alguna consulta, ¡contáctanos!
          Estamos ansiosos por leerte y compartir juntos esta pasión.
        </article>
        <ul className="flex justify-center items-center text-4xl gap-6 mt-4 lg:text-5xl lg:gap-10 lg:mt-10">
          <Link to={"https://www.facebook.com/SuelaCarameloOk"}>
            <li>
              <i className="bx bxl-facebook text-zinc-900"></i>
            </li>
          </Link>
          <Link to={"https://www.instagram.com/suelacaramelo/"}>
            <li>
              <i className="bx bxl-instagram text-zinc-900"></i>
            </li>
          </Link>
          <Link to={"mailto:suelacaramelo@gmail.com"}>
            <li>
              <i className="bx bxl-gmail text-zinc-900 -mt-2 text-6xl lg:text-7xl"></i>
            </li>
          </Link>
          <Link to={"https://www.youtube.com/@suelacaramelo"}>
            <li>
              <i className="bx bxl-youtube text-zinc-900"></i>
            </li>
          </Link>
          <Link to={"https://www.tiktok.com/@suelacaramelo"}>
            <li>
              <i className="bx bxl-tiktok text-zinc-900"></i>
            </li>
          </Link>
        </ul>
      </main>
      <FooterComp />
    </>
  );
}
