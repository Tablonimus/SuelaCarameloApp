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
  const navigate = useNavigate();
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
        <div className="h-[18rem] md:h-[36rem] w-full mb-1">
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
        <section className="mt-6 w-full flex flex-col justify-center items-center gap-4 ">
          <button className="hover:scale-110 hover:text-orange-500 py-3 px-4 w-2/3 lg:w-1/3 bg-zinc-900 rounded-full text-white text-md lg:text-2xl font-bold ">
            <Link to={"/noticias"} className="hover:text-orange-500">
              CUPONES Y DESCUENTOS
            </Link>
          </button>
          <button className="hover:scale-110 hover:text-orange-500 py-3 px-4 w-2/3 lg:w-1/3 bg-zinc-900 rounded-full text-white text-md lg:text-2xl font-bold ">
            <Link to={"/noticias"} className="hover:text-orange-500">
              ÚLTIMAS NOTICIAS
            </Link>
          </button>
          <button className="hover:scale-110 hover:text-orange-500 py-3 px-4 w-2/3 lg:w-1/3 bg-zinc-900 rounded-full text-white text-md lg:text-2xl font-bold ">
            <Link to={"/posiciones"} className="hover:text-orange-500">
              {" "}
              TABLA DE POSICIONES
            </Link>
          </button>
          <button className="hover:scale-110 hover:text-orange-500 py-3 px-4 w-2/3 lg:w-1/3 bg-zinc-900 rounded-full text-white text-md lg:text-2xl font-bold ">
            <Link to={"/fixture"} className="hover:text-orange-500">
              FIXTURE
            </Link>
          </button>
        </section>
      </main>
      <FooterComp />
    </div>
  );
};
export default Home;
