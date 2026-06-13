import Sidebar from "../NavBar/Sidebar";
import logoSuela from "../../assets/images/banner2.png";
import SEO from "../SEO/SEO";
import { useEffect, useState } from "react";
import FixturePagination from "./FixturePagination";
import FooterComp from "../FooterComp/FooterComp";

const CATEGORIES = [
  { value: "A1", label: "FSP Masculino", logo: "/botones/A1.png" },
  { value: "F1", label: "FSP Femenino",  logo: "/botones/F1.png" },
];

const TOURNEY_ORDER = ["Apertura", "Clausura", "Torneo Anual"];

const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";
// const BASE_URL = "http://localhost:3000/sc";

const Fixture = () => {
  const [allFixtures, setAllFixtures]     = useState([]);
  const [activeFixture, setActiveFixture] = useState(null);   // fixture con is_Active → para saltar a la fecha
  const [category, setCategory]           = useState("A1");
  const [loading, setLoading]             = useState(true);
  const [options, setOptions]             = useState([]);     // pills "Apertura 2025", etc.
  const [selectedKey, setSelectedKey]     = useState(null);   // pill seleccionada

  const fetchFixtures = async (cat) => {
    try {
      setLoading(true);

      // Fetch en paralelo: fixtures de la categoría + config del torneo activo
      const [fixtureRes, configRes] = await Promise.all([
        fetch(`${BASE_URL}/fixtures?category=${cat}`),
        fetch(`${BASE_URL}/configs/active-tournament`),
      ]);
      const fixtureData = await fixtureRes.json();
      const configData  = configRes.ok ? await configRes.json() : null;

      const all = fixtureData.fixtures ?? [];
      setAllFixtures(all);
      setActiveFixture(fixtureData.activeFixture);

      // Construir pills solo para combos que tienen fixtures reales
      const seasons     = (fixtureData.seasons ?? []).slice().sort().reverse();
      const tournaments = fixtureData.tournaments ?? [];
      const combined    = [];
      for (const s of seasons) {
        for (const t of TOURNEY_ORDER) {
          if (tournaments.includes(t) && all.some((f) => f.tournament === t && f.season === s)) {
            combined.push({ key: `${t}-${s}`, label: `${t} ${s}`, tournament: t, season: s });
          }
        }
      }
      setOptions(combined);

      // Default: torneo activo según configs collection
      const defaultKey = configData
        ? combined.find((o) => o.tournament === configData.tournament && o.season === configData.season)?.key
        : combined.find((o) => o.tournament === fixtureData.activeFixture?.tournament && o.season === fixtureData.activeFixture?.season)?.key;

      setSelectedKey(defaultKey ?? combined[0]?.key ?? null);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures(category);
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fixtures a mostrar en el paginador — solo los del combo seleccionado
  const selected        = options.find((o) => o.key === selectedKey);
  const displayFixtures = selected
    ? allFixtures.filter((f) => f.tournament === selected.tournament && f.season === selected.season)
    : allFixtures;

  const selectedCategory = CATEGORIES.find((c) => c.value === category);

  return (
    <div className="pl-[70px] flex flex-col min-h-screen bg-zinc-950">
      <SEO
        title="Fixture"
        description="Calendario y resultados de partidos de la liga Suela Caramelo. Fixture del FSP Masculino y FSP Femenino de Mendoza — Apertura, Clausura y Torneo Anual."
        url="/fixture"
      />
      <Sidebar active="fixture" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2.5">

          {/* Row 1: logo + título */}
          <div className="flex items-center gap-3 min-w-0">
            <img src={logoSuela} alt="" className="h-7 object-contain flex-shrink-0" />
            <span className="text-sm font-bold text-white tracking-widest uppercase hidden sm:block flex-shrink-0">
              Fixture
            </span>
            <span className="text-zinc-600 hidden sm:block flex-shrink-0">·</span>
            <span className="text-sm font-semibold text-orange-400 truncate hidden sm:block">
              {selectedCategory?.label}
              {selected && ` — ${selected.label}`}
            </span>
          </div>

          {/* Row 2: pills torneo+año + separador + categoría */}
          <div
            className="flex items-center gap-3 overflow-x-auto pb-0.5"
            style={{ scrollbarWidth: "none" }}
          >
            {/* Pills combinados */}
            {options.length > 0 && (
              <div className="flex gap-1.5 flex-shrink-0">
                {options.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSelectedKey(opt.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      selectedKey === opt.key
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                        : "bg-zinc-800 text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {options.length > 0 && <div className="w-px h-5 bg-white/10 flex-shrink-0" />}

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
            fixtures={displayFixtures}
            activeNumber={
              selected?.tournament === activeFixture?.tournament &&
              selected?.season     === activeFixture?.season
                ? activeFixture?.number
                : null
            }
          />
        )}
      </main>

      <FooterComp />
    </div>
  );
};

export default Fixture;
