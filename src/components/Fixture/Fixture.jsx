import Sidebar from "../NavBar/Sidebar";
import logoA1 from "../../assets/images/botones/A1.png";
import logoF1 from "../../assets/images/botones/F1.png";
import logoSuela from "../../assets/images/banner2.png";
import { useEffect, useState } from "react";
import FixturePagination from "./FixturePagination";
import FooterComp from "../FooterComp/FooterComp";

const CATEGORIES = [
  { value: "A1", label: "FSP Masculino", logo: logoA1 },
  { value: "F1", label: "FSP Femenino",  logo: logoF1 },
];

const TOURNAMENTS = ["Apertura", "Clausura", "Torneo Anual"];

const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";
// const BASE_URL = "http://localhost:3000/sc";

const Fixture = () => {
  const [fixtures, setFixtures]           = useState([]);
  const [activeFixture, setActiveFixture] = useState(null);
  const [category, setCategory]           = useState("A1");
  const [loading, setLoading]             = useState(true);
  const [tournamentFilter, setTournamentFilter] = useState("Apertura");

  const fetchFixtures = async (cat) => {
    try {
      setLoading(true);
      const res  = await fetch(`${BASE_URL}/fixtures?category=${cat}&tournament=${tournamentFilter}`);
      const data = await res.json();
      setFixtures(data.fixtures);
      setActiveFixture(data.activeFixture);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures(category);
  }, [category, tournamentFilter]);

  const selectedCategory  = CATEGORIES.find((c) => c.value === category);
  const currentPageTitle  = activeFixture?.number || "1";

  return (
    <div className="pl-[70px] flex flex-col min-h-screen bg-zinc-950">
      <Sidebar active="fixture" />

      {/* Header — mismo patrón que Noticias / Clubs */}
      <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2.5">

          {/* Row 1: logo + título + fecha activa */}
          <div className="flex items-center gap-3 min-w-0">
            <img src={logoSuela} alt="" className="h-7 object-contain flex-shrink-0" />
            <span className="text-sm font-bold text-white tracking-widest uppercase hidden sm:block flex-shrink-0">
              Fixture
            </span>
            <span className="text-zinc-600 hidden sm:block flex-shrink-0">·</span>
            <span className="text-sm font-semibold text-orange-400 truncate hidden sm:block">
              {selectedCategory?.label} — Fecha {currentPageTitle}
            </span>
          </div>

          {/* Row 2: torneo pills + separador + categoría pills */}
          <div
            className="flex items-center gap-3 overflow-x-auto pb-0.5"
            style={{ scrollbarWidth: "none" }}
          >
            {/* Torneo */}
            <div className="flex gap-1.5 flex-shrink-0">
              {TOURNAMENTS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTournamentFilter(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    tournamentFilter === t
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                      : "bg-zinc-800 text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-white/10 flex-shrink-0" />

            {/* Categoría */}
            <div className="flex gap-1.5 flex-shrink-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    category === cat.value
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                      : "bg-zinc-800 text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <img src={cat.logo} alt="" className="w-4 h-4 object-contain" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
            <p className="text-zinc-500 text-sm">Cargando fixture...</p>
          </div>
        ) : (
          <FixturePagination
            fixtures={fixtures}
            activeNumber={activeFixture?.number}
          />
        )}
      </main>

      <FooterComp />
    </div>
  );
};

export default Fixture;
