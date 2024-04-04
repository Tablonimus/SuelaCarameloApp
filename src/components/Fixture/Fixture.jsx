import fixture1 from "../../assets/images/fixture-resultados/A1/fixture1.webp";
import fixture2 from "../../assets/images/fixture-resultados/A1/fixture2.webp";
import fixture3 from "../../assets/images/fixture-resultados/A1/fixture3.webp";
import fixture4 from "../../assets/images/fixture-resultados/A1/fixture4.webp";
import fixture6 from "../../assets/images/fixture-resultados/A1/fixture6.webp";
import fixture7 from "../../assets/images/fixture-resultados/A1/fixture7.webp";
import fixture8 from "../../assets/images/fixture-resultados/A1/fixture8.webp";
import fixture9 from "../../assets/images/fixture-resultados/A1/fixture9.webp";
import fixture10 from "../../assets/images/fixture-resultados/A1/fixture10.webp";
import fixture11 from "../../assets/images/fixture-resultados/A1/fixture11.webp";
import fixture12 from "../../assets/images/fixture-resultados/A1/fixture12.webp";
import fixture13 from "../../assets/images/fixture-resultados/A1/fixture13.webp";
import fixture14 from "../../assets/images/fixture-resultados/A1/fixture14.webp";

import Sidebar from "../NavBar/Sidebar";

const Fixture = () => {
  const fixtures = [
    fixture2,
    fixture4,   
    fixture3,
    fixture6,
    fixture1,
    fixture7,
    fixture8,
    fixture9,
    fixture10,
    fixture11,
    fixture12,
    fixture13,
    fixture14,

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
      <section className="w-full h-auto flex flex-wrap justify-center items-center overflow-hidden ">
        {fixtures.map((fixture, i) => (
          <img
            id={i + 1}
            className="ml-[70px] w-4/5 max-w-xl"
            src={fixture}
          />
        ))}
      </section>
    </>
  );
};
export default Fixture;
