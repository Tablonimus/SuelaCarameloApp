import logoSC from "../../assets/images/banner2.png";
import imgHome1 from "../../assets/images/heroSection/hero1.webp";
import imgHome2 from "../../assets/images/heroSection/hero2.webp";
import imgHome3 from "../../assets/images/heroSection/hero3.webp";
import imgHome4 from "../../assets/images/heroSection/hero4.webp";
import FooterComp from "../FooterComp/FooterComp";
import { Carousel } from "flowbite-react";
import { Link } from "react-router-dom";
import "./home.css";
import LiveMatchesTicker from "../LiveMatchesTicker.jsx/LiveMatchesTicker";

const Home = () => {
  const images = [imgHome1, imgHome2, imgHome3, imgHome4];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Barra en vivo */}
      <div className="w-full">
        <LiveMatchesTicker />
      </div>

      {/* Contenido principal */}
      <main className="flex flex-col items-center w-full px-4">
        {/* Logo */}
        <img
          className="w-32 md:w-44 my-6"
          src={logoSC}
          alt="Logo Suela Caramelo"
        />

        {/* Carrusel */}
        <div className="w-full h-64 sm:h-80 md:h-[28rem] mb-6">
          <Carousel
            leftControl={<></>}
            rightControl={<></>}
            draggable
            slide
            slideInterval={3000}
          >
            {images.map((image, i) => (
              <img
                key={i}
                src={image}
                alt={`Imagen ${i + 1}`}
                className="w-full h-full object-cover"
              />
            ))}
          </Carousel>
        </div>

        {/* Botones */}
        <section className="flex flex-col items-center gap-4 w-full max-w-lg mb-12">
          {[
            { to: "/cupones/#inicio", label: "Cupones y Descuentos" },
            { to: "/noticias", label: "Noticias" },
            { to: "/fixture", label: "Fixture" },
            { to: "/posiciones", label: "Posiciones" },
            { to: "/equipos", label: "Equipos" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="w-full text-center bg-zinc-900 text-white text-base md:text-lg font-medium rounded-xl py-3 transition hover:bg-black hover:text-white"
            >
              {label}
            </Link>
          ))}
        </section>
      </main>

      {/* Footer */}
      <FooterComp />
    </div>
  );
};

export default Home;
