import Voucher from "./Voucher";
import Sidebar from "../NavBar/Sidebar";
import b2 from "../../assets/images/b2.png";
import b4 from "../../assets/images/b4.png";
import FooterComp from "../FooterComp/FooterComp";

const Descuentos = () => {
  const sponsors = [
    {
      name: "Calzas deportivas cortas",
      logo: b2,
      terminos: `25% en calzas deportivas cortas mostrando tu cupón - IDEALES PARA JUGAR`,
      descuento: "25",
      telefono: "2616 59-5240",
      ubi: "Montes de Oca 889, Godoy Cruz",
    },

    {
      name: "Hache Market",
      logo: b4,
      terminos: `Seguí a Hache Market en instagram y conseguí Items Básicos y Clásicos. Cupón válido ABONANDO EN EFECTIVO`,
      descuento: "15",
    },
  ];
  return (
    <div className="pl-[70px]  flex flex-col justify-between min-h-screen">
      <Sidebar active={"cupones"} />

      <header className="w-full flex flex-col justify-center items-center bg-zinc-900 gap-3 py-4 lg:py-6">
        <h2 className="text-xl border-b w-full  text-center pb-2 italic  lg:text-2xl  text-gray-200 font-bold">
          DESCUENTOS EXCLUSIVOS
        </h2>
      </header>
      <section
        id="inicio"
        className="w-full h-auto py-4 flex flex-col justify-center items-center "
      >
        {sponsors.map((sponsor, index) => (
          <Voucher key={index} sponsor={sponsor} />
        ))}
      </section>
      <FooterComp />
    </div>
  );
};
export default Descuentos;
