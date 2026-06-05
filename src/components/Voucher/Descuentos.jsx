import Voucher from "./Voucher";
import Sidebar from "../NavBar/Sidebar";
import FooterComp from "../FooterComp/FooterComp";
import logoSuela from "../../assets/images/banner2.png";
import b2 from "../../assets/images/b2.png";
import b4 from "../../assets/images/b4.png";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoupons } from "../../redux/actions/index";

const Descuentos = () => {
  const dispatch = useDispatch();
  const { coupons } = useSelector((state) => state);

  useEffect(() => {
    dispatch(getAllCoupons());
  }, [dispatch]);

  const defaultCoupons = [
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

  const displayCoupons = coupons && coupons.length > 0 ? coupons : defaultCoupons;

  return (
    <div className="pl-[70px] flex flex-col min-h-screen bg-zinc-950">
      <Sidebar active="cupones" />

      {/* Header — mismo patrón que el resto de la app */}
      <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <img src={logoSuela} alt="" className="h-7 object-contain flex-shrink-0" />
          <span className="text-sm font-bold text-white tracking-widest uppercase hidden sm:block flex-shrink-0">
            Descuentos
          </span>
          <span className="text-zinc-600 hidden sm:block flex-shrink-0">·</span>
          <span className="text-sm font-semibold text-orange-400 hidden sm:block">
            {displayCoupons.length} {displayCoupons.length === 1 ? "cupón exclusivo" : "cupones exclusivos"}
          </span>
        </div>
      </header>

      {/* Cupones */}
      <main className="flex-1 flex flex-col items-center py-8 px-4">
        {displayCoupons.map((sponsor, index) => (
          <Voucher key={index} sponsor={sponsor} />
        ))}
      </main>

      <FooterComp />
    </div>
  );
};

export default Descuentos;
