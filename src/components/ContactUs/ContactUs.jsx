import React from "react";
import mail from "../../assets/images/mail.png";
import logoSC from "../../assets/images/banner2.png"
import { Link } from "react-router-dom";
import Sidebar from "../NavBar/Sidebar";
export default function ContactUs() {
  return (<>
  <Sidebar></Sidebar>
    <main className="w-full overflow-hidden py-12 pl-[70px] flex flex-col justify-center items-center md:flex-row md:gap-20 lg:pb-24">
     <img className=" absolute top-0 mt-8 w-44 mb-4 lg:w-52" src={logoSC} alt="" />
      <h4 className="absolute top-0 mt-28 max-w-56 font-semibold text-center leading-6 text-zinc-800 text-2xl lg:text-3xl lg:font-bold lg:max-w-64">Ponte en contacto con nosotros</h4>
   
    <section className="max-w-[300px] w-full mt-32 py-5 pt-7 bg-zinc-900 rounded-lg shadow-md p-4 md:mt-40 md:max-w-[400px] md:pt-8">
    <form className="flex flex-col gap-6">
      <div className="mb-4">
        <input
          placeholder="Nombre"
          className="w-full p-2 text-semibold text-gray-300 border-b-2 rounded-md border-orange-500 bg-transparent outline-none focus:border-b-2 focus:border-orange-500"
          type="text"
        />
      </div>
      <div className="mb-4">
        <input
          placeholder="Email"
          className="w-full p-2 text-semibold text-gray-300 border-b-2 rounded-md border-orange-500 bg-transparent outline-none focus:border-b-2 focus:border-orange-500"
          name="email"
          id="email"
          type="email"
        />
      </div>
      <div className="mb-4">    
        <textarea
          placeholder="Mensaje"
          class="w-full p-2 text-semibold text-gray-300 border-b-2 rounded-md border-orange-500 bg-transparent outline-none focus:border-b-2 focus:border-orange-500"
          rows="4"
          name="message"
          id="message"
        ></textarea>
      </div>
      <div class="mb-4">
        <button
          class="w-full bg-zinc-700 text-gray-300 font-semibold p-2 rounded transition-all hover:bg-gray-300 hover:text-zinc-900 -mt-3"
          type="submit"
        >
          Enviar
        </button>
      </div>
    </form>
  </section>

  <section className="w-full flex flex-col justify-end items-center pr-1 mt-10 md:w-auto">
            <ul className="w-4/5 flex justify-center items-center text-4xl gap-6 md:flex-col md:gap-4 md:mt-28">            
            <Link to={"https://www.facebook.com/SuelaCarameloOk"}>
              <li><i className='bx bxl-facebook text-gray-200'></i></li>
              </Link>
              <Link to={"https://www.instagram.com/suelacaramelo/"}>
              <li><i className='bx bxl-instagram text-gray-200' ></i></li>
              </Link>
              <Link to={"https://www.youtube.com/@suelacaramelo"}>
              <li><i className='bx bxl-youtube text-gray-200' ></i></li>
              </Link>
            <Link to={"https://www.tiktok.com/@suelacaramelo"}>
              <li><i className='bx bxl-tiktok text-gray-200' ></i></li>
            </Link>
            <Link to={"https://www.tiktok.com/@suelacaramelo"}>
              <li><i className='bx bxl-gmail text-gray-200' ></i></li>
            </Link>
            </ul>
        </section>
        
        <article className="font-medium text-base text-center text-zinc-900 mt-8 max-w-72 md:text-lg md:mt-24">
       Informando y celebrando el futsal en Mendoza. Somos un medio apasionado por este deporte, con coberturas, contenido audiovisual y una visión de influencia global. Además, somos Suela Producciones, una productora audiovisual y fotográfica enfocada en deportes. Si quieres sumarte a nuestra comunidad o tienes alguna consulta, ¡contáctanos! Estamos ansiosos por leerte y compartir juntos esta pasión.
        </article>
  </main>
  </>
  );
}
