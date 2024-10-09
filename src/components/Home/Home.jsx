import "react-image-gallery/styles/css/image-gallery.css";
import logoSC from "../../assets/images/banner2.png";
// import SideHome from "../NavBar/SideHome";
import imgHome1 from "../../assets/images/heroSection/hero1.webp";
import imgHome2 from "../../assets/images/heroSection/hero2.webp";
import imgHome3 from "../../assets/images/heroSection/hero3.webp";
import imgHome4 from "../../assets/images/heroSection/hero4.webp";
import FooterComp from "../FooterComp/FooterComp";
import { Carousel } from "flowbite-react";
import { Link } from "react-router-dom";
import "./home.css";
import Sidebar from "../NavBar/Sidebar";

const Home = () => {
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
    {
      original: imgHome4,
      thumbnail: imgHome4,
    },
  ];

  return (
    <div className="flex flex-col justify-start  ">
      <Sidebar active="home" />
      <main className="w-full flex flex-col justify-start items-center py-5 md:items-center overflow-hidden lg:h-auto">
        <img className="w-44 mb-4 lg:w-52" src={logoSC} alt="" />
        {/* CARRUSEL */}
        <div className="h-[18rem] md:h-[36rem] w-full mb-1">
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
                src={image.thumbnail}
                alt="suela caramelo"
                className=" h-full w-full object-cover"
              />
            ))}
          </Carousel>
        </div>
        <section className="mt-6 w-full flex flex-col justify-center items-center gap-4 lg:my-10 lg:gap-6">
          <Link
            to={"/cupones/#inicio"}
            className="hover:scale-110 hover:text-orange-500 text-center py-3 px-4 w-2/3 lg:w-1/4 bg-zinc-900 rounded-full text-white text-md lg:text-2xl font-bold duration-300"
          >
            <button className="hover:text-orange-500 text-center duration-300">
              CUPONES Y DESCUENTOS
            </button>
          </Link>

          <Link
            to={"/noticias"}
            className="hover:scale-110 text-center hover:text-orange-500 py-3 px-4 w-2/3 lg:w-1/4  bg-zinc-900 rounded-full text-white text-md lg:text-2xl font-bold duration-300 "
          >
            <button className="hover:text-orange-500 text-center">
              NOTICIAS
            </button>
          </Link>
          <Link
            to={"/fixture"}
            className="hover:scale-110 text-center hover:text-orange-500 py-3 px-4 w-2/3 lg:w-1/4  bg-zinc-900 rounded-full text-white text-md lg:text-2xl font-bold duration-300"
          >
            <button className="hover:text-orange-500">FIXTURE</button>
          </Link>
          <Link
            to={"/posiciones"}
            className="hover:scale-110 text-center hover:text-orange-500 py-3 px-4 w-2/3 lg:w-1/4  bg-zinc-900 rounded-full text-white text-md lg:text-2xl font-bold duration-300"
          >
            <button className="hover:text-orange-500"> POSICIONES</button>
          </Link>
        </section>
      </main>
      <FooterComp />
    </div>
  );
};
export default Home;
