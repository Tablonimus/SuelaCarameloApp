import img1 from "/Aleman.png";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import logoSC from "../../assets/images/banner2.png"
const Home = () => {
  const images = [
    {
      original: "https://picsum.photos/id/1018/1000/600/",
      thumbnail: "https://picsum.photos/id/1018/250/150/",
    },
    {
      original: "https://picsum.photos/id/1015/1000/600/",
      thumbnail: "https://picsum.photos/id/1015/250/150/",
    },
    {
      original: "https://picsum.photos/id/1019/1000/600/",
      thumbnail: "https://picsum.photos/id/1019/250/150/",
    },
  ];
 
  return (
    <main className="w-full h-auto flex flex-col justify-start items-center py-5 pr-1 md:items-center overflow-hidden">
      <img className="w-44 ml-[70px] mb-4" src={logoSC} alt="" />
      <section className="w-11/12 mb-6 ml-[70px] bg-zinc-900 h-40 md:h-60">
      </section>
      <section className="w-4/5 my-4 ml-[70px] md:w-3/5">
        <ImageGallery
          items={images}
          showPlayButton={false}
          showFullscreenButton={false}
          showThumbnails={false}
          showBullets={true}
        />
      </section>
    </main>
  );
};
export default Home;
