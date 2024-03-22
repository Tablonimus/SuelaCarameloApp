import imgResultados1 from "../../assets/images/resultados1.jpg";
import imgResultados2 from "../../assets/images/resultados2.jpg";
import Sidebar from "../NavBar/Sidebar";
const Resultados = () => {
  return (
    <>
      <Sidebar />
      <section className="w-full h-auto flex flex-col justify-center items-center overflow-hidden">
        <img className="ml-[70px] w-11/12 max-w-2xl" src={imgResultados1} alt="" />
        <img className="ml-[70px] w-11/12  max-w-2xl" src={imgResultados2} alt="" />
      </section>
    </>
  );
};
export default Resultados;
