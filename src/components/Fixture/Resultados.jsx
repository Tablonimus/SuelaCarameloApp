import resultado1F from "../../assets/images/fixture-resultados/FemA/resultado1.jpg";
import resultado2F from "../../assets/images/fixture-resultados/FemA/resultado2.jpg";
import A1resultado1 from "../../assets/images/fixture-resultados/A1/resultado1.jpg";
import A1resultado2 from "../../assets/images/fixture-resultados/A1/resultado2.jpg";
import A1resultado3 from "../../assets/images/fixture-resultados/A1/resultado3.jpg";
import A1resultado4 from "../../assets/images/fixture-resultados/A1/resultado4.jpg";
import A1resultado5 from "../../assets/images/fixture-resultados/A1/resultado5.jpg";
import Sidebar from "../NavBar/Sidebar";
const Resultados = () => {
  return (
    <>
      <Sidebar />
      <h2 className="ml-[70px] text-xl text-center py-6 lg:py-8 lg:text-3xl font-bold text-zinc-300">
        FemAxSuela
      </h2>
      <section className="w-full h-auto flex flex-wrap justify-center items-center overflow-hidden ">
        <img className="ml-[70px] w-4/5 max-w-xl" src={resultado1F} alt="" />
        <img className="ml-[70px] w-4/5  max-w-xl" src={resultado2F} alt="" />
      </section>
      
      <h2 className="ml-[70px] text-xl text-center py-6 lg:py-8 lg:text-3xl font-bold text-zinc-300">
        A1xSuela
      </h2>
      <section className="w-full h-auto flex flex-wrap justify-center items-center overflow-hidden ">
        <img
          className="ml-[70px] w-4/5  max-w-xl"
          src={A1resultado3}
          alt=""
        />
         <img
          className="ml-[70px] w-4/5  max-w-xl"
          src={A1resultado5}
          alt=""
        />
        <img
          className="ml-[70px] w-4/5  max-w-xl"
          src={A1resultado1}
          alt=""
        />
        <img
          className="ml-[70px] w-4/5  max-w-xl"
          src={A1resultado2}
          alt=""
        />
        <img
          className="ml-[70px] w-4/5  max-w-xl"
          src={A1resultado4}
          alt=""
        />
      </section>
    </>
  );
};
export default Resultados;
