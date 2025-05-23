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
    <>
      <Sidebar active={"cupones"} />

      <section
        id="inicio"
        className="w-full h-auto py-4 lg:py-14 flex flex-col justify-center items-center lg:pb-20 "
      >
        <h2 className="pl-[70px] text-2xl text-center text-gray-100 font-bold">
          CUPONES DE DESCUENTOS EXCLUSIVOS
        </h2>
        {sponsors.map((sponsor, index) => (
          <Voucher key={index} sponsor={sponsor} />
        ))}
      </section>
      <FooterComp />
    </>
  );
};
export default Descuentos;
