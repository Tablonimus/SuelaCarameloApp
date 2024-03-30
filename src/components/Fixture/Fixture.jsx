import fixture1 from "../../assets/images/fixture-resultados/A1/fixture1.jpg";
import fixture2 from "../../assets/images/fixture-resultados/A1/fixture2.jpg";
import fixture3 from "../../assets/images/fixture-resultados/A1/fixture3.jpg";
import fixture4 from "../../assets/images/fixture-resultados/A1/fixture4.jpg";
import fixture5 from "../../assets/images/fixture-resultados/A1/fixture5.jpg";
import fixture6 from "../../assets/images/fixture-resultados/A1/fixture6.jpg";
import fixture7 from "../../assets/images/fixture-resultados/A1/fixture7.jpg";
import fixture8 from "../../assets/images/fixture-resultados/A1/fixture8.jpg";
import fixture9 from "../../assets/images/fixture-resultados/A1/fixture9.jpg";
import fixture10 from "../../assets/images/fixture-resultados/A1/fixture10.jpg";
import Sidebar from "../NavBar/Sidebar";
import logoSC from "../../assets/images/banner2.png";


const Fixture = () => {
  const fixtures = [
    fixture1,
    fixture2,
    fixture3,
    fixture4,
    fixture5,
    fixture6,
    fixture7,
    fixture8,
    fixture9,
    fixture10,
  ];

  return (
    <>
      <Sidebar />
      <ul className="flex justify-center pl-[70px] items-center gap-4 md:gap-10 text-zinc-200 font-semibold py-8 text-lg overflow-hidden">
        {fixtures.map((_, i) => (
          <li key={i} >
            <a href={`#${i + 1}`}>{i + 1}</a>
          </li>
        ))}
      </ul>
      <section className="w-full h-auto flex flex-col justify-center items-center overflow-hidden">
        {fixtures.map((fixture, i) => (
          <img
            id={i + 1}
            className="ml-[70px] w-4/5 max-w-2xl"
            src={fixture}
          />
        ))}
      </section>
    </>
  );
};
export default Fixture;
