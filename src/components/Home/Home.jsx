import logoSC from "../../assets/images/banner2.png";
import imgHome1 from "../../assets/images/heroSection/hero1.webp";
import imgHome2 from "../../assets/images/heroSection/hero2.webp";
import imgHome3 from "../../assets/images/heroSection/hero3.webp";
import imgHome4 from "../../assets/images/heroSection/hero4.webp";
import FooterComp from "../FooterComp/FooterComp";
import { Carousel } from "flowbite-react";
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

const Home = () => {
  const images = [imgHome1, imgHome2, imgHome3, imgHome4];
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("A1");
  const [teamsState, setTeamsState] = useState({ A1: [], FEM: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Obtener noticias del estado de Redux
  const allNotices = useSelector((state) => state.allNotices);
  const featuredNews = allNotices.slice(0, 3);

  useEffect(() => {
    dispatch(getAllNotices(""));

    async function getTeams() {
      try {
        setIsLoading(true);
        const teams = (
          await axios.get(
            "https://suela-caramelo-app-back-end.vercel.app/sc/teams"
          )
        ).data;

        const femTeams = teams.filter((team) => team.category === "FEM");
        const a1Teams = teams.filter((team) => team.category === "A1");

        setTeamsState({
          A1: a1Teams.slice(0, 4).map((team) => ({
            logo: team.logo,
            name: team.name,
            _id: team._id,
          })),
          FEM: femTeams.slice(0, 4).map((team) => ({
            logo: team.logo,
            name: team.name,
            _id: team._id,
          })),
        });
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getTeams();
  }, [dispatch, activeTab]);

  const topTeams = activeTab === "A1" ? teamsState.A1 : teamsState.FEM;
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div>
        <div className="flex items-center justify-center space-x-2 bg-zinc-900">
          <img
            src={logoSC}
            alt="Logo Suela Caramelo"
            className="h-10 lg:h-14 object-contain"
          />
        </div>
        {/* Barra en vivo */}
        <div className="w-full">
          <LiveMatchesTicker />
        </div>

        {/* Contenido principal */}
        {/* Carrusel */}
        <div className="w-full">
          <HeroCarousel />
        </div>
        <main className="flex flex-col items-center w-full lg:px-4 py-4 gap-4">
          <div className="md:col-span-2 bg-zinc-900 rounded-xl p-4 md:p-6 w-11/12 shadow-lg border border-orange-500/20">
            <div className="flex items-center mb-4 md:mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg shadow-md">
                <i className="bx bx-news text-xl md:text-2xl text-white"></i>
              </div>
              <h2 className="text-lg md:text-xl font-bold ml-3 text-white">
                <span className="text-white">Últimas Noticias</span>
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              {featuredNews.map((news) => (
                <Link
                  key={news._id}
                  to={`/noticias/${news._id}`}
                  className="group flex items-center gap-3 p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl border border-white/10 hover:border-orange-500/30 transition-all duration-200"
                >
                  {/* Imagen */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-700">
                    <img
                      src={news.images?.[0] || "/placeholder-news.jpg"}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Contenido */}
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

                  {/* Chevron */}
                  <i className="bx bx-chevron-right text-xl text-zinc-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>

            <Link
              to="/noticias"
              className="mt-4 md:mt-6 inline-flex items-center justify-end w-full text-sm text-orange-400 hover:text-orange-300 group"
            >
              Ver todas
              <i className="bx bx-chevron-right ml-1 group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>
          <Link
            to="/fixture"
            className="block w-11/12 rounded-xl p-6 shadow-md border border-white/10 hover:border-orange-500/50 transition-all group bg-zinc-900"
          >
            <div className="flex items-center">
              <div className="bg-orange-500 p-2 rounded-lg mr-3 group-hover:rotate-6 transition-transform shadow-sm">
                <i className="bx bx-calendar-alt text-2xl text-white"></i>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">
                  Fixture Completo
                </h2>
                <p className="text-xs text-zinc-300 mt-1">
                  Consulta todos los partidos programados
                </p>
              </div>
              <div className="text-orange-400 text-xl group-hover:translate-x-2 transition-transform">
                <i className="bx bx-chevron-right"></i>
              </div>
            </div>
          </Link>
          <Link
            to="/posiciones"
            className="block w-11/12 rounded-xl p-6 shadow-md border border-white/10 hover:border-orange-500/50 transition-all group bg-zinc-900"
          >
            <div className="flex items-center">
              <div className="bg-orange-500 p-2 rounded-lg mr-3 group-hover:rotate-6 transition-transform shadow-sm">
                <i className="bx bx-table text-2xl text-white"></i>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">
                  Tabla de Posiciones
                </h2>
                <p className="text-xs text-zinc-300 mt-1">
                  Revisa el ranking de los equipos
                </p>
              </div>
              <div className="text-orange-400 text-xl group-hover:translate-x-2 transition-transform">
                <i className="bx bx-chevron-right"></i>
              </div>
            </div>
          </Link>
          <Link
            to="/equipos"
            className="block w-11/12 rounded-xl p-6 shadow-md border border-white/10 hover:border-orange-500/50 transition-all group bg-zinc-900"
          >
            <div className="flex items-center">
              <div className="bg-orange-500 p-2 rounded-lg mr-3 group-hover:rotate-6 transition-transform shadow-sm">
                <i className="bx bx-group text-2xl text-white"></i>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">Equipos</h2>
                <p className="text-xs text-zinc-300 mt-1">
                  Conoce a los planteles del FSP
                </p>
              </div>
              <div className="text-orange-400 text-xl group-hover:translate-x-2 transition-transform">
                <i className="bx bx-chevron-right"></i>
              </div>
            </div>
          </Link>
          <Link
            to="/cupones"
            className="block w-11/12 rounded-xl p-6 shadow-md border border-white/10 hover:border-orange-500/50 transition-all group bg-zinc-900"
          >
            <div className="flex items-center">
              <div className="bg-orange-500 p-2 rounded-lg mr-3 group-hover:rotate-6 transition-transform shadow-sm">
                <i className="bx bx-wallet-alt text-2xl text-white"></i>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">
                  Cupones y Descuentos
                </h2>
                <p className="text-xs text-zinc-300 mt-1">
                  Descubre ofertas exclusivas para vos
                </p>
              </div>
              <div className="text-orange-400 text-xl group-hover:translate-x-2 transition-transform">
                <i className="bx bx-chevron-right"></i>
              </div>
            </div>
          </Link>
        </main>
      </div>
      <FooterComp />
    </div>
  );
};

export default Home;
