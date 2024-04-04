import Sidebar from "../NavBar/Sidebar";
import posicionesA1 from "../../assets/images/fixture-resultados/A1/posiciones/posiciones1.jpg";
import posicionesFemA from "../../assets/images/fixture-resultados/FemA/posiciones/posiciones1.jpg";

const Posiciones = () => {
  return (
    <>
      <Sidebar />
      <section className="py-6 w-full h-auto flex flex-col justify-center items-center overflow-hidden lg:flex-row lg:py-12 ">
        <img
          className="ml-[70px] w-4/5 max-w-xl lg:rounded-xl"
          src={posicionesA1}
          alt=""
        />
        <img
          className="ml-[70px] w-4/5 max-w-xl lg:rounded-xl"
          src={posicionesFemA}
          alt=""
        />
      </section>
    </>
  );
};

export default Posiciones;
