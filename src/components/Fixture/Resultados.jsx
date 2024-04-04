
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
  
   
      
      
      <section className="w-full h-auto flex flex-wrap justify-center items-center overflow-hidden ">
        <img
          className="ml-[70px] w-4/5  max-w-xl"
          src={A1resultado3}
          alt=""
        />
        
      </section>
    </>
  );
};
export default Resultados;
