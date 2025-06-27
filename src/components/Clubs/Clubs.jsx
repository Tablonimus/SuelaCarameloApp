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
      <section className="ml-[70px] px-4 py-6 min-h-screen ">
        <h1 className="text-center text-3xl font-semibold text-white mb-8">
          Equipos FSP Masculino
        </h1>

        <div className="flex flex-col items-center justify-center gap-6">
          {teamsState.A1.length > 0 ? (
            teamsState.A1.map((club, index) => (
              <Link
                to={`/equipos/A1/${club.name}`}
                className="group flex items-center gap-4 bg-zinc-800 rounded-xl p-4 w-full max-w-md hover:bg-black transition"
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
            ))
          ) : (
            <Spinner
              color="warning"
              aria-label="Cargando equipos..."
              size="xl"
            />
          )}
        </div>
      </section>

      <FooterComp />
    </>
  );
}
