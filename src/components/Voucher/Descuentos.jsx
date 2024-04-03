import Voucher from "./Voucher";
import Sidebar from "../NavBar/Sidebar";
import b1 from "../../assets/images/b1.png";
import b2 from "../../assets/images/b2.png";
import b3 from "../../assets/images/b3.png";
import b4 from "../../assets/images/b4.png";
import b5 from "../../assets/images/zonafutsal.png";

const Descuentos = () => {
  const sponsors = [
    {
      name: "Squadra",
      logo: b1,
      terminos: `Acercate al local Squadra ubicado en Montes de Oca 889 | Godoy Cruz- Mendoza  
        25% en calzas deportivas cortas - IDEALES PARA JUGAR`,
      descuento: "25",
      telefono: "2616 59-5240",
      ubi: "Montes de Oca 889",
    },
    {
      name: "Zona Futsal",
      logo: b5,
      terminos: `Tus próximo botines los encontrás acá! Seguilos por Instagram y enterate de todos los modelos y facilidades de pago.
    Descuento: 5% en un par de botines a elección!`,
      descuento: "5",
    },
    {
      name: "Hache Market",
      logo: b2,
      terminos: `Seguí a Hache Market en instagram y conseguí Items Básicos y Clásicos`,
      descuento: "15",
    },
  ];
  return (
    <>
      <Sidebar />
      <section className="w-full h-auto py-10 flex flex-col justify-center items-center lg:pb-20">
        {sponsors.map((sponsor, index) => (
          <Voucher key={index} sponsor={sponsor} />
        ))}
      </section>
    </>
  );
};
export default Descuentos;
