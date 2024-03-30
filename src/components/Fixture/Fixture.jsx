import fixture1 from "../../assets/images/fixture-resultados/fixture1.jpg";
import fixture2 from "../../assets/images/fixture-resultados/fixture2.jpg";
import fixture3 from "../../assets/images/fixture-resultados/fixture3.jpg";
import fixture4 from "../../assets/images/fixture-resultados/fixture4.jpg";
import fixture5 from "../../assets/images/fixture-resultados/fixture5.jpg";
import fixture6 from "../../assets/images/fixture-resultados/fixture6.jpg";
import fixture7 from "../../assets/images/fixture-resultados/fixture7.jpg";
import fixture8 from "../../assets/images/fixture-resultados/fixture8.jpg";
import fixture9 from "../../assets/images/fixture-resultados/fixture9.jpg";
import fixture10 from "../../assets/images/fixture-resultados/fixture10.jpg";

const Fixture = () =>{

const fixtures = [fixture1,fixture2,fixture3,fixture4,fixture5,fixture6,fixture7,fixture8,fixture9,fixture10]

    return(
        <section className="w-full h-auto flex flex-col justify-center items-center overflow-hidden">
            {
                fixtures.map((fixture,i) => (
                    <img className="ml-[70px] w-11/12 max-w-2xl" src={fixture} key={i} />
                ))
            }
        </section>
    )
}
export default Fixture;
