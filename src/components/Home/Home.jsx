import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import logoSC from "../../assets/images/banner2.png";
import SideHome from "../NavBar/SideHome";
import imgHome1 from "../../assets/images/home/img-home1.webp";
import imgHome2 from "../../assets/images/home/img-home2.webp";
import imgHome3 from "../../assets/images/home/img-home3.webp";

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
  ];

  return (
    <>
      <SideHome />
      <main className="w-full h-[90vh] flex flex-col justify-start items-center py-5 md:items-center overflow-hidden">
        <img className="w-44 mb-4 lg:w-52" src={logoSC} alt="" />

        <section className="w-[95vw] my-14 md:w-4/5 md:my-12">
          <ImageGallery
            items={images}
            showPlayButton={false}
            showFullscreenButton={false}
            showThumbnails={false}
            showBullets={true}
          />
        </section>
        <button className="w-40 h-9 bg-zinc-900 text-zinc-300 cursor-pointer hover:scale-105 hover:bg-slate-200 hover:text-slate-900 duration-500 font-semibold my-4 rounded-md lg:my-8 lg:w-52 lg:h-10 lg:text-lg">
          Descargar App
        </button>
      </main>
    </>
  );
};
export default Home;
