import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../NavBar/Sidebar";
import FooterComp from "../FooterComp/FooterComp";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Spinner } from "flowbite-react";

export default function Clubs() {
  const dispatch = useDispatch();
  const [teamsState, setTeamsState] = useState({ FEM: [], A1: [] });

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

  return (
    <>
      <Sidebar active="equipos" />
      <div className="ml-[70px] flex flex-col justify-between min-h-screen">
        <div>
          <header className="w-full flex flex-col justify-center items-center bg-zinc-900 gap-3 py-4 lg:py-6">
            <h2 className="text-xl border-b w-full  text-center pb-2 italic lg:mb-4 lg:text-2xl  text-gray-200 font-bold uppercase">
              EQUIPOS
            </h2>
          </header>
          <header className="w-full flex flex-col justify-center items-center bg-zinc-900 gap-3 ">
            <h3 className="text-xl w-full  text-center pb-2 italic lg:mb-4 lg:text-2xl  text-gray-200 font-bold">
              FSP Masculino
            </h3>
          </header>
          <section className="flex-grow px-4 py-6 max-h-[60vh] overflow-y-auto">
            <div className="w-full max-w-6xl mx-auto">
              {teamsState.A1.length > 0 ? (
                <div className="grid grid-cols-1  lg:grid-cols-3 gap-4  px-2">
                  {teamsState.A1.map((club, index) => (
                    <Link
                      key={index}
                      to={`/equipos/A1/${club.name}`}
                      className="group flex items-center gap-4 bg-zinc-800 rounded-xl p-4 w-full hover:bg-black transition"
                    >
                      <img
                        src={club.logo}
                        alt={club.name}
                        className="h-16 w-16 object-contain"
                      />
                      <p className="text-base font-medium text-white group-hover:text-orange-400">
                        {club.name}
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
