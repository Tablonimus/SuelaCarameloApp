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
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      {/* Barra de partidos en vivo con efecto dinámico */}
      <div className="w-full bg-gradient-to-r from-orange-600 to-orange-500 py-2 shadow-lg">
        <LiveMatchesTicker />
      </div>

      {/* Contenido principal */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Sección de noticias y torneo */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tarjeta de noticias principal */}
          <motion.div 
            className="lg:col-span-2 bg-zinc-900/80 rounded-xl p-6 shadow-xl border border-orange-500/20 backdrop-blur-sm"
            variants={itemVariants}
          >
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg shadow-md">
                <i className="bx bx-news text-2xl text-white"></i>
              </div>
              <h2 className="text-xl font-bold ml-3 text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-300">
                  Últimas Noticias
                </span>
              </h2>
            </div>

            <div className="space-y-4">
              {featuredNews.map((news) => (
                <motion.div
                  key={news._id}
                  whileHover={{ x: 5 }}
                  className="border-b border-orange-500/20 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex gap-3">
                    {news.images?.[0] && (
                      <div className="flex-shrink-0">
                        <img
                          src={news.images[0]}
                          alt="Miniatura noticia"
                          className="w-14 h-14 object-cover rounded-lg shadow-md border border-orange-500/30"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold hover:text-orange-400 transition cursor-pointer line-clamp-2 text-white">
                        {news.title}
                      </h3>
                      <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                        {news.subtitle}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-orange-400">
                          {new Date(news.date).toLocaleDateString("es-AR")}
                        </span>
                        <Link
                          to={`/noticias/${news._id}`}
                          className="text-xs text-orange-400 hover:underline flex items-center"
                        >
                          Leer más <i className="bx bx-chevron-right ml-1"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              to="/noticias"
              className="mt-4 inline-flex items-center text-sm text-orange-400 hover:text-orange-300 transition group justify-end w-full"
            >
              Ver todas las noticias
              <i className="bx bx-chevron-right ml-1 group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </motion.div>

          {/* Tarjeta de torneo */}
          <motion.div
            className="bg-zinc-900/80 rounded-xl p-6 shadow-xl border border-orange-500/20 backdrop-blur-sm"
            variants={itemVariants}
          >
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg shadow-md">
                <i className="bx bx-trophy text-2xl text-white"></i>
              </div>
              <h2 className="text-xl font-bold ml-3 text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-300">
                  Torneo Apertura
                </span>
              </h2>
            </div>

            <p className="text-sm text-zinc-300 mb-4">
              Sigue toda la acción del FSP en tiempo real con resultados, estadísticas y análisis exclusivos.
            </p>

            {/* Selector de categoría */}
            <div className="flex space-x-3 mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab("A1")}
                className={`px-3 py-1.5 text-sm rounded-full font-medium shadow-sm transition-all ${
                  activeTab === "A1"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/50"
                    : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                }`}
              >
                Masculino
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab("FEM")}
                className={`px-3 py-1.5 text-sm rounded-full font-medium shadow-sm transition-all ${
                  activeTab === "FEM"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/50"
                    : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                }`}
              >
                Femenino
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-zinc-800/50 hover:bg-orange-500/10 transition p-3 rounded-lg flex flex-col items-center border border-orange-500/20"
              >
                <Link to="/fixture" className="flex flex-col items-center w-full">
                  <div className="bg-orange-500/20 p-2 rounded-full mb-1">
                    <i className="bx bx-calendar text-xl text-orange-400"></i>
                  </div>
                  <span className="text-sm font-medium text-white">Fixture</span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-zinc-800/50 hover:bg-orange-500/10 transition p-3 rounded-lg flex flex-col items-center border border-orange-500/20"
              >
                <Link to="/posiciones" className="flex flex-col items-center w-full">
                  <div className="bg-orange-500/20 p-2 rounded-full mb-1">
                    <i className="bx bx-table text-xl text-orange-400"></i>
                  </div>
                  <span className="text-sm font-medium text-white">Posiciones</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Sección de cupones */}
        <motion.div 
          className="mb-6"
          variants={itemVariants}
        >
          <Link
            to="/cupones"
            className="block rounded-xl p-6 shadow-xl border border-orange-500/30 hover:border-orange-500/50 transition-all bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm group"
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-lg mr-4 group-hover:rotate-6 transition-transform shadow-md">
                <i className="bx bx-coupon text-2xl text-white"></i>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-300">
                    Cupones Exclusivos
                  </span>
                </h2>
                <p className="text-xs text-zinc-300 mt-1">
                  Descuentos especiales para socios y fanáticos
                </p>
              </div>
              <div className="text-orange-400 text-xl group-hover:translate-x-2 transition-transform">
                <i className="bx bx-chevron-right"></i>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Sección de equipos */}
        <motion.div
          className="rounded-xl p-6 shadow-xl border border-orange-500/20 bg-zinc-900/80 backdrop-blur-sm"
          variants={itemVariants}
        >
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg shadow-md">
              <i className="bx bx-shield-alt-2 text-2xl text-white"></i>
            </div>
            <h2 className="text-xl font-bold ml-3 text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-300">
                Nuestros Equipos
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {topTeams.map((team) => (
                <motion.div
                  key={team._id}
                  whileHover={{ y: -5 }}
                  className="group flex flex-col items-center"
                >
                  <Link
                    to={`/equipos/${activeTab}/${team.name}`}
                    className="text-center bg-zinc-800/50 hover:bg-orange-500/10 p-3 rounded-lg w-full transition border border-orange-500/20"
                  >
                    <div className="relative mb-2">
                      <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center group-hover:bg-orange-500/20 transition overflow-hidden shadow-md border border-orange-500/30">
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
                    <span className="text-xs font-bold group-hover:text-orange-400 transition text-white line-clamp-1">
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
              className="text-sm text-orange-400 hover:text-orange-300 transition group font-medium"
            >
              Ver todos los equipos
              <i className="bx bx-chevron-right ml-1 group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>
        </motion.div>
      </div>

      <FooterComp />
    </div>
  );
};

export default HomePage;