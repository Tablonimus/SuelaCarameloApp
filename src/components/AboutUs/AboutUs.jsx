import React from "react";
import FooterComp from "../FooterComp/FooterComp";
import NavBar from "../NavBar/NavBar";
import suela from "../../assets/images/suela.png";
import { Carousel } from "flowbite-react";
export default function AboutUs() {
  return (
    <div className="bg-[#F98958]  flex flex-col justify-between items-center">
      <NavBar />
      <div className="mt-20 flex flex-col   opacity-80 items-center justify-center w-1/2  h-full">
        <p className="font-semibold text-center z-20 mb-2">
          Somos un grupo periodistas de Mendoza que comenzaron a difundir el
          Futsal de Mendoza en 2016. A su vez, somos el primer medio audiovisual
          de todo el país, que se encargó de la cobertura de AMF (Asociación
          Mundial de Futsal) dentro de la CAFS (Confederación Argentina de
          Futbol de Salón).
        </p>
        <p className="font-semibold text-center z-20 mb-2">
          Los invitamos a sumarse para ayudarnos a crecer y abarcar nuevas
          categorías para cubrir en Mendoza y Argentina.
        </p>
        <p className="font-semibold text-center z-20 mb-2">
          No te olvides de suscribirte a nuestro canal de YouTube, y a seguirnos
          en nuestras cuentas de Facebook, Twitter, Instagram y TikTok
        </p>
        <img
          src={suela}
          alt=""
          className=" w-96 z-10 rounded-full  object-cover"
        />
      </div>
      <FooterComp />
    </div>
  );
}
