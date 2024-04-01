import resultado1F from "../../assets/images/fixture-resultados/FemA/resultado1.jpg"
import resultado2F from "../../assets/images/fixture-resultados/FemA/resultado2.jpg";
import A1resultado1 from "../../assets/images/fixture-resultados/A1/resultado1.jpg";
import A1resultado2 from "../../assets/images/fixture-resultados/A1/resultado2.jpg";
import A1resultado3 from "../../assets/images/fixture-resultados/A1/resultado3.jpg";
import A1resultado4 from "../../assets/images/fixture-resultados/A1/resultado4.jpg";
import posicionesA1 from "../../assets/images/fixture-resultados/A1/posiciones/posiciones1.jpg"
import posicionesFemA from "../../assets/images/fixture-resultados/FemA/posiciones/posiciones1.jpg"
import Sidebar from "../NavBar/Sidebar";
const Resultados = () => {
  return (
    <>
      <Sidebar />
      <section className="w-full h-auto flex flex-col justify-center items-center overflow-hidden">
        <h2 className="ml-[70px] text-xl py-6 lg:py-8 lg:text-3xl font-bold text-zinc-300">Posiciones</h2>
        <img className="ml-[70px] w-11/12 max-w-2xl" src={posicionesA1} alt="" />
        <img className="ml-[70px] w-11/12 max-w-2xl" src={posicionesFemA} alt="" />
      </section>
      <section className="w-full h-auto flex flex-col justify-center items-center overflow-hidden">
        <h2 className="ml-[70px] text-xl py-6 lg:py-8 lg:text-3xl font-bold text-zinc-300">FemAxSuela</h2>
        <img className="ml-[70px] w-11/12 max-w-2xl" src={resultado1F} alt="" />
        <img className="ml-[70px] w-11/12  max-w-2xl" src={resultado2F} alt="" />
        <h2 className="ml-[70px] text-xl py-6 lg:py-8 lg:text-3xl font-bold text-zinc-300">A1xSuela</h2>
        <img className="ml-[70px] w-11/12  max-w-2xl" src={A1resultado1} alt="" />
        <img className="ml-[70px] w-11/12  max-w-2xl" src={A1resultado2} alt="" />
        <img className="ml-[70px] w-11/12  max-w-2xl" src={A1resultado3} alt="" />
        <img className="ml-[70px] w-11/12  max-w-2xl" src={A1resultado4} alt="" />

      </section>
    </>
  );
};
export default Resultados;
