import logoSC from "../../assets/images/banner2.png";
import imgHome1 from "../../assets/images/heroSection/hero1.webp";
import imgHome2 from "../../assets/images/heroSection/hero2.webp";
import imgHome3 from "../../assets/images/heroSection/hero3.webp";
import imgHome4 from "../../assets/images/heroSection/hero4.webp";
import FooterComp from "../FooterComp/FooterComp";
import { Link } from "react-router-dom";
import "./home.css";
import LiveMatchesTicker from "../LiveMatchesTicker/LiveMatchesTicker";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllNotices } from "../../redux/actions";
import axios from "axios";
import HeroCarousel from "./HeroCarousel";

const CATEGORY_LABELS = {
  A1: "FSP Masculino",
  F1: "FSP Femenino",
  DH: "División de Honor",
  CM: "Copa Mendoza",
  TN: "Torneos Nacionales",
  TI: "Torneos Internacionales",
};

const NAV_LINKS = [
  { to: "/fixture",    icon: "bx-calendar-alt",  label: "Fixture Completo",       desc: "Consultá todos los partidos programados" },
  { to: "/posiciones", icon: "bx-table",          label: "Tabla de Posiciones",    desc: "Revisá el ranking de los equipos" },
  { to: "/equipos",    icon: "bx-group",          label: "Equipos",                desc: "Conocé los planteles del FSP" },
  { to: "/cupones",    icon: "bx-wallet-alt",     label: "Cupones y Descuentos",   desc: "Descubrí ofertas exclusivas para vos" },
];

const Home = () => {
  const images = [imgHome1, imgHome2, imgHome3, imgHome4];
  const dispatch = useDispatch();
  const [activeTab, setActiveTab]     = useState("A1");
  const [teamsState, setTeamsState]   = useState({ A1: [], FEM: [] });
  const [isLoading, setIsLoading]     = useState(true);

  const allNotices  = useSelector((state) => state.allNotices);
  const featuredNews = allNotices.slice(0, 3);

  useEffect(() => {
    dispatch(getAllNotices(""));

    async function getTeams() {
      try {
        setIsLoading(true);
        const teams = (
          await axios.get("https://suela-caramelo-app-back-end.vercel.app/sc/teams")
        ).data;
        setTeamsState({
          A1:  teams.filter((t) => t.category === "A1").slice(0, 4).map(({ logo, name, _id }) => ({ logo, name, _id })),
          FEM: teams.filter((t) => t.category === "FEM").slice(0, 4).map(({ logo, name, _id }) => ({ logo, name, _id })),
        });
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getTeams();
  }, [dispatch, activeTab]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">

      {/* Logo bar */}
      <div className="flex items-center justify-center py-2 bg-zinc-900 border-b border-white/10">
        <img src={logoSC} alt="Logo Suela Caramelo" className="h-9 lg:h-12 object-contain" />
      </div>

      {/* Ticker de partidos */}
      <div className="w-full">
        <LiveMatchesTicker />
      </div>

      {/* Hero carousel */}
      <div className="w-full">
        <HeroCarousel />
      </div>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center w-full px-4 py-6 gap-4 max-w-2xl mx-auto w-full">

        {/* Últimas noticias */}
        <section className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 md:p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg shadow-md">
              <i className="bx bx-news text-lg text-white" />
            </div>
            <h2 className="text-base font-bold text-white">Últimas Noticias</h2>
          </div>

          <div className="flex flex-col gap-2">
            {featuredNews.map((news) => (
              <Link
                key={news._id}
                to={`/noticias/${news._id}`}
                className="group flex items-center gap-3 p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl border border-white/10 hover:border-orange-500/30 transition-all duration-200"
              >
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-700">
                  <img
                    src={news.images?.[0] || "/placeholder-news.jpg"}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  {news.category && (
                    <span className="inline-flex w-fit items-center bg-orange-500/15 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {CATEGORY_LABELS[news.category] ?? news.category}
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                    {news.title}
                  </h3>
                  <span className="text-xs text-zinc-500">
                    {new Date(news.date).toLocaleDateString("es-AR")}
                  </span>
                </div>
                <i className="bx bx-chevron-right text-xl text-zinc-600 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>

          <Link
            to="/noticias"
            className="mt-4 inline-flex items-center justify-end w-full text-sm text-orange-400 hover:text-orange-300 group"
          >
            Ver todas
            <i className="bx bx-chevron-right ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </section>

        {/* Accesos rápidos */}
        <section className="w-full flex flex-col gap-2">
          {NAV_LINKS.map(({ to, icon, label, desc }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-4 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3.5 hover:border-orange-500/40 hover:bg-zinc-800 transition-all duration-200"
            >
              <div className="bg-orange-500 p-2.5 rounded-lg flex-shrink-0 shadow-sm group-hover:rotate-6 transition-transform">
                <i className={`bx ${icon} text-xl text-white`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
              </div>
              <i className="bx bx-chevron-right text-xl text-zinc-600 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          ))}
        </section>

      </main>

      <FooterComp />
    </div>
  );
};

export default Home;
