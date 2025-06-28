import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LiveMatchesTicker from "../LiveMatchesTicker/LiveMatchesTicker";
import FooterComp from "../FooterComp/FooterComp";
import { getAllNotices } from "../../redux/actions";

const HomePage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("A1");
  const [teamsState, setTeamsState] = useState({ A1: [], FEM: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Obtener noticias del estado de Redux
  const allNotices = useSelector((state) => state.allNotices);
  const featuredNews = allNotices.slice(0, 3);

  useEffect(() => {
    dispatch(getAllNotices(activeTab === "A1" ? "A1" : "FEM"));

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

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div
      id="general"
      className="text-white flex flex-col gap-4 justify-between min-h-screen"
    >
      <main className="flex flex-col gap-2">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="relative max-w-screen-2xl mx-auto px-4 ">
            <LiveMatchesTicker />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative max-w-screen-xl mx-auto px-4">
          {/* Featured Cards - Más compacto */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Feature Card */}
            <motion.div
              className="md:col-span-2 bg-zinc-900 rounded-xl p-6 shadow-md border border-white/10"
              variants={itemVariants}
            >
              <div className="flex items-center mb-4">
                <div className="bg-orange-500 p-2 rounded-lg shadow-sm">
                  <i className="bx bx-news text-2xl text-white"></i>
                </div>
                <h2 className="text-xl font-bold ml-3 text-white">
                  Últimas Noticias
                </h2>
              </div>

              <div className="space-y-4">
                {featuredNews.map((news) => (
                  <motion.div
                    key={news._id}
                    whileHover={{ x: 3 }}
                    className="border-b border-white/10 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex gap-2">
                      {news.images?.[0] && (
                        <img
                          src={news.images[0]}
                          alt="Miniatura noticia"
                          className="w-12 h-12 object-cover rounded-md shadow-sm"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium hover:text-orange-400 transition cursor-pointer line-clamp-2 text-white">
                          {news.title}
                        </h3>
                        <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                          {news.subtitle}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">
                            {new Date(news.date).toLocaleDateString("es-AR")}
                          </span>
                          <Link
                            to={`/noticias/${news._id}`}
                            className="text-xs text-gray-400 hover:underline hover:text-orange-400 flex items-center"
                          >
                            Leer más
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/noticias"
                className="mt-4 w-full  text-end justify-end inline-flex items-center text-sm text-white hover:text-orange-300 transition group"
              >
                Ver todas
                <i className="bx bx-chevron-right ml-1 group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </motion.div>

            {/* News Card - Más compacta */}
            <motion.div
              className="bg-zinc-900 rounded-xl p-5 shadow-md border border-white/10"
              variants={itemVariants}
            >
              <div className="flex items-center mb-4">
                <div className="bg-orange-500 p-2 rounded-lg shadow-sm">
                  <i className="bx bx-trophy text-2xl text-white"></i>
                </div>
                <h2 className="text-xl font-bold ml-3 text-white">
                  Torneo Apertura
                </h2>
              </div>

              <p className="text-sm text-zinc-300 mb-4">
                Sigue toda la acción del FSP Masculino y Femenino en SuelApp.
              </p>

              {/* Badges más pequeños */}
              <div className="flex space-x-3 mb-4">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  // onClick={() => setActiveTab("A1")}
                  className={`px-3 py-1.5 text-sm rounded-full font-medium cursor-pointer shadow-sm ${"bg-white/10 text-zinc-200 hover:bg-white/20"}`}
                >
                  FSP Masculino
                </motion.span>
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  // onClick={() => setActiveTab("FEM")}
                  className={`px-3 py-1.5 text-sm rounded-full font-medium cursor-pointer shadow-sm ${"bg-white/10 text-zinc-200 hover:bg-white/20"}`}
                >
                  FSP Femenino
                </motion.span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.a
                  whileHover={{ y: -3 }}
                  href="/fixture"
                  className="bg-white/5 hover:bg-orange-500/20 transition p-3 rounded-lg flex flex-col items-center border border-white/10"
                >
                  <div className="bg-orange-500/20 p-2 rounded-full mb-1">
                    <i className="bx bx-calendar text-xl text-orange-400"></i>
                  </div>
                  <span className="text-sm font-medium text-white">
                    Fixture
                  </span>
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href="/posiciones"
                  className="bg-white/5 hover:bg-orange-500/20 transition p-3 rounded-lg flex flex-col items-center border border-white/10"
                >
                  <div className="bg-orange-500/20 p-2 rounded-full mb-1">
                    <i className="bx bx-table text-xl text-orange-400"></i>
                  </div>
                  <span className="text-sm font-medium text-white">
                    Posiciones
                  </span>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          {/* Cupones Section - Más compacto */}
          <motion.div className="mb-4" variants={itemVariants}>
            <Link
              to="/cupones"
              className="block rounded-xl p-6 shadow-md border border-white/10 hover:border-orange-500/50 transition-all group bg-zinc-900"
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
          </motion.div>

          {/* Top Teams Section - Más compacto */}
          <motion.div
            className="rounded-xl p-6 shadow-md border border-white/10 bg-zinc-900"
            variants={itemVariants}
          >
            <div className="flex items-center mb-6">
              <div className="bg-orange-500 p-2 rounded-lg shadow-sm">
                <i className="bx bx-shield-alt-2 text-2xl text-white"></i>
              </div>
              <h2 className="text-xl font-bold ml-3 text-white">
                Equipos de la FSP
              </h2>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {topTeams.map((team) => (
                  <motion.div
                    key={team._id}
                    whileHover={{ y: -3 }}
                    className="group flex flex-col items-center"
                  >
                    <Link
                      to={`/equipos/A1/${team.name}`}
                      className="text-center bg-zinc-800 p-3 rounded-lg w-full hover:bg-zinc-700 transition"
                    >
                      <div className="relative mb-2">
                        <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center group-hover:bg-orange-500/20 transition overflow-hidden shadow-sm">
                          {team.logo ? (
                            <img
                              src={team.logo}
                              alt={team.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl">⚽</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-medium group-hover:text-orange-400 transition text-white line-clamp-1">
                        {team.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <Link
                to="/equipos"
                className="text-sm text-orange-400 hover:text-orange-300 transition group"
              >
                Ver todos los equipos
                <i className="bx bx-chevron-right ml-1 group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <FooterComp />
    </div>
  );
};

export default HomePage;
