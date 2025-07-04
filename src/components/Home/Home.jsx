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

            {/* Mobile: Columnas alargadas */}
            <div className="flex flex-col items-center gap-3 ">
              {featuredNews.map((news) => (
                <div
                  key={news._id}
                  whileHover={{ y: -2 }}
                  className="bg-zinc-800/50 hover:bg-zinc-700/70 lg:w-[50vw] lg:max-w-[50vw] transition-all rounded-lg border border-white/10"
                >
                  <Link
                    to={`/noticias/${news._id}`}
                    className="flex items-start p-3 gap-3 h-28"
                  >
                    {/* Imagen */}
                    <div className="w-1/3 h-full min-w-[100px]">
                      <img
                        src={news.images?.[0] || "/placeholder-news.jpg"}
                        alt="Miniatura noticia"
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 flex flex-col h-full justify-between gap-1">
                      <div>
                        <span className="text-[9px] font-semibold text-orange-400">
                          {news.category == "A1"
                            ? "FSP Masculino"
                            : "FSP Femenino"}
                        </span>
                        <h3 className="text-[11px] font-bold text-white line-clamp-2 mt-1">
                          {news.title}
                        </h3>
                        <h4 className="text-[10px] font-bold text-white/70 line-clamp-2 mt-1 ">
                          {news.subtitle}
                        </h4>
                      </div>
                      <span className="text-xs text-end text-zinc-400 ">
                        {new Date(news.date).toLocaleDateString("es-AR", {
                          // day: "numeric",
                          // month: "short",
                        })}
                      </span>
                    </div>
                  </Link>
                </div>
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
                  Conoce a los planteles del FSP.
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
