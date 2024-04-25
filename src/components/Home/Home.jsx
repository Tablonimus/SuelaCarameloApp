import "react-image-gallery/styles/css/image-gallery.css";
import logoSC from "../../assets/images/banner2.png";
import SideHome from "../NavBar/SideHome";
import imgHome1 from "../../assets/images/home/img-home1.webp";
import imgHome2 from "../../assets/images/home/img-home2.webp";
import imgHome3 from "../../assets/images/home/img-home3.webp";
import resultsImg from "../../assets/images/suela1.jpeg";
import noticesImg from "../../assets/images/suela2.jpeg";
import FooterComp from "../FooterComp/FooterComp";
import { Carousel } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";

const Home = () => {
  const navigate = useNavigate()
  const images = [
    {
      original: imgHome1,
      thumbnail: imgHome1,
    },
    {
      original: imgHome2,
      thumbnail: imgHome2,
    },
    {
      original: imgHome3,
      thumbnail: imgHome3,
    },
  ];

  return (
    <div className=" flex flex-col justify-between">
      <SideHome />
      <main className="w-full flex flex-col justify-start items-center py-5 md:items-center overflow-hidden lg:h-auto">
        <img className="w-44 mb-4 lg:w-52" src={logoSC} alt="" />
        {/* CARRUSEL */}
        <div className="h-[18rem] w-full mb-1">
          <Carousel slideInterval={5000}>
            {images.map((image, i) => (
              <img
                key={i}
                src={image.thumbnail}
                alt="suela caramelo"
                className="h-full w-full object-cover"
              />
            ))}
          </Carousel>
        </div>
        {/* CUADROS */}

        <div className="flex w-full h-[35rem] gap-1">
          {/* Descuentos */}
          <div
            id="couponCard"
            className="h-full w-1/2 flex items-end rounded-xl"
          >
            <div className="bg-black/50 flex flex-col justify-end w-full rounded-xl p-2">
              <h5 className="text-2xl font-bold tracking-tight text-white">
                Descuentos
              </h5>
              <p className="font-normal text-gray-300">
                Aprovechá los descuentos que tenemos para vos.
              </p>
              <Link to={"/cupones"} className="w-full flex justify-end mt-2">
                <button className="self-end w-40 h-9 bg-zinc-900 text-zinc-300 cursor-pointer hover:scale-105 hover:bg-slate-200 hover:text-slate-900 duration-500 font-semibold  rounded-md lg:my-8 lg:w-52 lg:h-10 lg:text-lg">
                  Ver cupones ▶
                </button>
              </Link>
            </div>
          </div>
          <div className=" flex flex-col gap-1 w-1/2">
            {/* Resultados */}
            <div
              id="couponCard"
              className="w-full h-1/2  flex items-end rounded-xl"
            >
              <div className="bg-black/50 flex flex-col w-full rounded-xl p-2">
                <h5 className="text-2xl font-bold tracking-tight text-white">
                  Resultados
                </h5>
                <p className="font-normal text-gray-300">
                  Enterate de los últimos resultados.
                </p>
                <Link to={"/fixture"} className="w-full flex justify-end mt-2">
                  <button className="self-end w-40 h-9 bg-zinc-900 text-zinc-300 cursor-pointer hover:scale-105 hover:bg-slate-200 hover:text-slate-900 duration-500 font-semibold  rounded-md lg:my-8 lg:w-52 lg:h-10 lg:text-lg">
                    Ver fixture ▶
                  </button>
                </Link>
              </div>
            </div>
            {/* Noticias */}
            <div
              id="couponCard"
              className="bg-yellow-300 w-full h-1/2 flex items-end rounded-xl"
            >
              <div className="bg-black/50 flex   flex-col w-full rounded-xl p-2">
                <h5 className="text-2xl font-bold tracking-tight text-white">
                  Noticias
                </h5>
                <p className="font-normal text-gray-300">
                  Conoce las últimas novedades.
                </p>
                <Link to={"/noticias"} className="w-full flex justify-end mt-2">
                  <button className="self-end w-40 h-9 bg-zinc-900 text-zinc-300 cursor-pointer hover:scale-105 hover:bg-slate-200 hover:text-slate-900 duration-500 font-semibold  rounded-md lg:my-8 lg:w-52 lg:h-10 lg:text-lg">
                    Ver noticias ▶
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Posiciones */}
        <div
          id="couponCard"
          className="h-full w-full flex items-end rounded-xl mt-1"
        >
          <div className="bg-black/50 flex flex-col justify-end w-full rounded-xl p-2">
            <h5 className="text-2xl font-bold tracking-tight text-white">
              Posiciones
            </h5>
            <p className="font-normal text-gray-300">
             Tabla de posiciones del fútbol de salón femenino y masculino.
            </p>
            {/* <Link to={"/posiciones"} className="w-full flex justify-end mt-2"> */}
              <button onClick={()=>navigate("/posiciones")} className="self-end w-40 h-9 bg-zinc-900 text-zinc-300 cursor-pointer hover:scale-105 hover:bg-slate-200 hover:text-slate-900 duration-500 font-semibold  rounded-md lg:my-8 lg:w-52 lg:h-10 lg:text-lg">
                Ver posiciones ▶
              </button>
            {/* </Link> */}
          </div>
        </div>
      </main>
      <FooterComp />
    </div>
  );
};
export default Home;
