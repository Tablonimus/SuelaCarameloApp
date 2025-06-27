/*
import escudo1 from "/Aleman.png";
import escudo2 from "/Cementista.png";
import escudo4 from "/COP.png";
import logo from "/logo.png";
import logo2 from "/logo2.png";
 */

// import Voucher from "./Voucher/Voucher"

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

  async function getTeams() {
    const teams = (
      await axios.get("https://suela-caramelo-app-back-end.vercel.app/sc/teams")
    ).data;

    const femTeams = teams.filter((team) => team.category === "FEM");
    const a1Teams = teams.filter((team) => team.category === "A1");

    setTeamsState({ ...teamsState, A1: a1Teams, FEM: femTeams });
  }

  useEffect(() => {
    getTeams();
  }, []);

  return (
    <>
      <Sidebar active={"equipos"} />
      <section className="ml-[70px] flex flex-col gap-4 py-4 md:pb-16 min-h-screen">
        <h1 className="text-center text-3xl italic text-white font-bold mb-4 lg:mt-8">
          FSP Masculino
        </h1>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-8">
          {teamsState?.A1?.length ? (
            teamsState?.A1?.map((club, index) => (
              <Link key={index} to={`/equipos/A1/${club.name}`}>
                <div
                  key={index}
                  className="flex text-center items-center justify-center overflow-hidden w-32 px-0 py-3 sm:w-64 lg:p-6 rounded-lg bg-gradient-to-t from-zinc-900 via-zinc-600 to-gray-900 hover:scale-105 text-white font-bold duration-300  "
                >
                  <section>
                    <img
                      src={club.logo}
                      className="w-full h-24 lg:h-56 lg:w-56 object-contain rounded-lg"
                      alt=""
                    />
                    {club.name}
                  </section>

                  {/*  <section>
                  <p className="text-white text-center font-bold w-56 lg:w-full ">{club.name}</p>
                </section> */}
                </div>
              </Link>
            ))
          ) : (
            <Spinner color="warning" aria-label="Suelapp" size="xl" />
          )}
        </div>
      </section>
      <section className="ml-[70px] flex flex-col gap-4 pt-4 pb-6 md:pb-16">
        <h1 className="text-center text-3xl italic text-white font-bold mb-4">
          FSP Femenino
        </h1>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-8">
          {teamsState?.FEM?.length ? (
            teamsState?.FEM?.map((club, index) => (
              <Link key={index} to={`/equipos/FEM/${club.name}`}>
                <div
                  key={index}
                  className="flex text-center items-center justify-center overflow-hidden w-32 px-0 py-3 sm:w-64 lg:p-6 rounded-lg bg-gradient-to-t from-zinc-900 via-zinc-600 to-gray-900 hover:scale-105 text-white font-bold duration-300  "
                >
                  <section>
                    <img
                      src={club.logo}
                      className="w-full h-24 lg:h-56 lg:w-56 object-contain rounded-lg"
                      alt=""
                    />
                    {club.name}
                  </section>

                  {/*  <section>
                  <p className="text-white text-center font-bold w-56 lg:w-full ">{club.name}</p>
                </section> */}
                </div>
              </Link>
            ))
          ) : (
            <Spinner color="warning" aria-label="Suelapp" size="xl" />
          )}
        </div>
      </section>
      <FooterComp />
    </>
  );
}
