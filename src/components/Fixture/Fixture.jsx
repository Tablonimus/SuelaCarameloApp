import Sidebar from "../NavBar/Sidebar";
import logoA1 from "../../assets/images/botones/A1.png";
import logoF1 from "../../assets/images/botones/F1.png";
import { useEffect, useState } from "react";
import FixturePagination from "./FixturePagination";
import FooterComp from "../FooterComp/FooterComp";

const Fixture = () => {
  const [fixtures, setFixtures] = useState([]);
  const [activeFixture, setActiveFixture] = useState(null);
  const [category, setCategory] = useState("A1");
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tournamentFilter, setTournamentFilter] = useState("Apertura");

  const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";
  // const BASE_URL = "http://localhost:3000/sc";

  const fetchFixtures = async (cat) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/fixtures?category=${cat}&tournament=${tournamentFilter}`
      );
      const data = await response.json();
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

  const categories = [
    { value: "A1", label: "FSP Masculino", logo: logoA1 },
    { value: "F1", label: "FSP Femenino", logo: logoF1 },
  ];

  const selectedCategory = categories.find((cat) => cat.value === category);
  const currentPageTitle = activeFixture?.number || "1";

  return (
    <div className="pl-[70px] flex flex-col justify-between min-h-screen">
      <Sidebar active={"fixture"} />

      <main>
        <header className="w-full bg-zinc-900 py-6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white text-center md:text-left italic">
                  {`${
                    category === "F1" ? "FSP Femenino" : "FSP Masculino"
                  } - Fecha ${currentPageTitle}`}
                </h2>
                <div className="flex gap-2 mt-2">
                  <select
                    value={tournamentFilter}
                    onChange={(e) => setTournamentFilter(e.target.value)}
                    className="bg-zinc-800 text-white text-sm rounded px-2 py-1"
                  >
                    <option value="Apertura">Apertura</option>
                    <option value="Clausura">Clausura</option>
                    <option value="Torneo Anual">Torneo Anual</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-gray-400 text-sm mb-1 animate-pulse">
                  Selecciona una categoría ▼
                </p>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between px-4 py-2 bg-zinc-800 text-white rounded-md border border-zinc-700 hover:bg-zinc-700 transition-colors"
                    aria-label="Selector de categorías"
                  >
                    <div className="flex items-center">
                      <img
                        src={selectedCategory?.logo}
                        alt={selectedCategory?.label}
                        className="w-6 h-6 mr-2 rounded-full object-cover"
                      />
                      <span>{selectedCategory?.label}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 ml-2 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-md shadow-lg">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => {
                            setCategory(cat.value);
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-zinc-700 transition-colors"
                        >
                          <img
                            src={cat.logo}
                            alt={cat.label}
                            className="w-6 h-6 mr-2 rounded-full object-cover"
                          />
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="flex flex-col justify-center items-center h-full">
          {loading ? (
            <div className="w-full h-64 flex justify-center items-center bg-zinc-900 rounded-lg shadow-sm">
              <p className="text-white">Cargando fixtures...</p>
            </div>
          ) : (
            <FixturePagination
              fixtures={fixtures}
              activeNumber={activeFixture?.number}
            />
          )}
        </section>
      </main>

      <FooterComp />
    </div>
  );
};

export default Fixture;
