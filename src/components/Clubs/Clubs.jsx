import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../NavBar/Sidebar";
import FooterComp from "../FooterComp/FooterComp";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Spinner } from "flowbite-react";
import logoA1 from "../../assets/images/botones/A1.png";
import logoF1 from "../../assets/images/botones/F1.png";

export default function Clubs() {
  const dispatch = useDispatch();
  const [teamsState, setTeamsState] = useState({ FEM: [], A1: [] });
  const [category, setCategory] = useState("A1");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Categorías disponibles (actualmente solo A1 pero preparado para expansión)
  const categories = [
    { value: "A1", label: "FSP Masculino", logo: logoA1 },
    // { value: "FEM", label: "FSP Femenino", logo: logoF1 }, // Descomentar cuando haya equipos femeninos
  ];

  useEffect(() => {
    async function getTeams() {
      const teams = (
        await axios.get(
          "https://suela-caramelo-app-back-end.vercel.app/sc/teams"
        )
      ).data;

      const femTeams = teams.filter((team) => team.category === "FEM");
      const a1Teams = teams.filter((team) => team.category === "A1");

      setTeamsState({ A1: a1Teams, FEM: femTeams });
    }

    getTeams();
  }, []);

  const handleCategoryChange = (categoryValue) => {
    setCategory(categoryValue);
    setIsDropdownOpen(false);
  };

  const selectedCategory =
    categories.find((cat) => cat.value === category) || categories[0];

  return (
    <>
      <Sidebar active="equipos" />
      <div className="ml-[70px] flex flex-col justify-between min-h-screen">
        <div>
          {/* Header con selector */}
          <header className="w-full bg-zinc-900 py-6">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-white text-center md:text-left uppercase">
                  EQUIPOS
                </h1>

                {/* Selector de categoría */}
                <div className="relative w-full md:w-64">
                  <p className="text-gray-400 text-sm mb-1 text-center animate-pulse">
                    Selecciona una categoría ▼
                  </p>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors"
                    aria-label="Seleccionar categoría"
                  >
                    <div className="flex items-center">
                      {selectedCategory.logo && (
                        <img
                          src={selectedCategory.logo}
                          alt={selectedCategory.label}
                          className="w-6 h-6 mr-3 rounded-full object-cover"
                        />
                      )}
                      <span className="truncate">{selectedCategory.label}</span>
                    </div>
                    <svg
                      className={`w-5 h-5 ml-2 transition-transform ${
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
                    <div className="absolute z-20 mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => handleCategoryChange(cat.value)}
                          className="flex items-center w-full px-4 py-3 text-left text-white hover:bg-zinc-700 transition-colors border-b border-zinc-700 last:border-b-0"
                        >
                          {cat.logo && (
                            <img
                              src={cat.logo}
                              alt={cat.label}
                              className="w-6 h-6 mr-3 rounded-full object-cover"
                            />
                          )}
                          <span>{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Listado de equipos */}
          <section className="flex-grow px-4 py-6 max-h-[65vh] overflow-y-auto">
            <div className="w-full max-w-6xl mx-auto">
              {teamsState[category].length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-2">
                  {teamsState[category].map((club, index) => (
                    <Link
                      key={index}
                      to={`/equipos/${category}/${club.name}`}
                      className="group flex items-center gap-4 bg-zinc-800 rounded-xl p-4 w-full hover:bg-black transition"
                    >
                      <img
                        src={club.logo}
                        alt={club.name}
                        className="h-16 w-16 object-contain"
                      />
                      <p className="text-base font-medium text-white group-hover:text-orange-400">
                        {club.address ? club.address : club.name}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <Spinner
                    color="warning"
                    aria-label="Cargando equipos..."
                    size="xl"
                  />
                </div>
              )}
            </div>
          </section>
        </div>
        <FooterComp />
      </div>
    </>
  );
}
