import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import logoSC from "../../assets/images/banner2.png";
import SideHome from "../NavBar/SideHome";
 import imgHome1 from "../../assets/images/home/home-img1.webp" 
 import imgHome2 from "../../assets/images/home/home-img2.webp" 
 import imgHome3 from "../../assets/images/home/home-img3.webp"


const Home = () => {
  const images = [
    {
      original:imgHome1,
      thumbnail:imgHome1,
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
      <main className="w-full h-auto flex flex-col justify-start items-center py-5 md:items-center overflow-hidden">
        <img className="w-44 mb-4 lg:w-52" src={logoSC} alt="" />
    
        <section className="w-[95vw] my-8 md:w-4/5 md:my-12">
          <ImageGallery
            items={images}
            showPlayButton={false}
            showFullscreenButton={false}
            showThumbnails={false}
            showBullets={true}
          />
        </section>
      </main>
    </>
  );
};
export default Home;
