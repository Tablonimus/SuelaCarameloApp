import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../NavBar/Sidebar";
import FooterComp from "../FooterComp/FooterComp";
import axios from "axios";
import logoSuela from "../../assets/images/banner2.png";
import SEO from "../SEO/SEO";

const categories = [
  { value: "A1",  label: "FSP Masculino", logo: "/botones/A1.png" },
  // { value: "FEM", label: "FSP Femenino",  logo: "/botones/F1.png" },
];

export default function Clubs() {
  const [teamsState, setTeamsState] = useState({ FEM: [], A1: [] });
  const [category, setCategory] = useState("A1");
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    async function getTeams() {
      try {
        setLoading(true);
        const teams = (
          await axios.get("https://suela-caramelo-app-back-end.vercel.app/sc/teams")
        ).data;
        setTeamsState({
          A1:  teams.filter((t) => t.category === "A1"),
          FEM: teams.filter((t) => t.category === "FEM"),
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    getTeams();
  }, []);

  const selectedCategory = categories.find((c) => c.value === category) ?? categories[0];
  const currentTeams = teamsState[category] ?? [];

  return (
    <>
      <SEO
        title="Equipos"
        description="Todos los equipos participantes de la liga Suela Caramelo, Mendoza. Planteles completos, jugadores y cuerpo técnico del FSP Masculino y FSP Femenino."
        url="/equipos"
      />
      <Sidebar active="equipos" />
      <div className="ml-[70px] flex flex-col min-h-screen bg-zinc-950">

        {/* Header — mismo estilo que Noticias */}
        <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <img src={logoSuela} alt="" className="h-7 object-contain flex-shrink-0" />
              <span className="text-sm font-bold text-white tracking-widest uppercase hidden sm:block">
                Equipos
              </span>
            </div>

            {/* Pills de categoría — visibles solo si hay más de una */}
            {categories.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {categories.map((cat) => {
                  const isActive = category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                        isActive
                          ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                          : "bg-zinc-800 text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <img src={cat.logo} alt="" className="w-4 h-4 object-contain" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </header>

        {/* Título de sección */}
        <div className="max-w-6xl mx-auto w-full px-4 pt-6 pb-3 flex items-center gap-3">
          <img src={selectedCategory.logo} alt="" className="w-7 h-7 object-contain" />
          <h2 className="text-base font-bold text-white">{selectedCategory.label}</h2>
          {!loading && (
            <span className="text-xs text-zinc-500">{currentTeams.length} equipos</span>
          )}
        </div>

        {/* Grid de clubs */}
        <section className="flex-1 max-w-6xl mx-auto w-full px-4 pb-10">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-zinc-800/50 rounded-xl animate-pulse aspect-square" />
              ))}
            </div>
          ) : currentTeams.length === 0 ? (
            <p className="text-zinc-500 text-center py-16">No hay equipos en esta categoría.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentTeams.map((club, index) => (
                <Link
                  key={index}
                  to={`/equipos/${category}/${club.name}`}
                  title={club.address ? club.address : club.name}
                  className="group flex flex-col items-center justify-between gap-3 bg-zinc-900 border border-white/10 rounded-xl p-5 sm:p-6 hover:border-orange-500/40 hover:bg-zinc-800 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-200 h-full"
                >
                  {/* Logo */}
                  <div className="flex-1 flex items-center justify-center w-20 sm:w-24">
                    <img
                      src={club.logo}
                      alt={club.name}
                      className="w-full h-full max-h-24 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
                    />
                  </div>
                  {/* Nombre — bloque fijo de 2 líneas para que todas las cards sean iguales */}
                  <p className="w-full text-xs sm:text-sm font-bold text-white text-center group-hover:text-orange-400 transition-colors uppercase tracking-wide leading-tight overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {club.address ? club.address : club.name}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <FooterComp />
      </div>
    </>
  );
}
