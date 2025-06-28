import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PlayerCard from "./PlayerCard";
import Sidebar from "../NavBar/Sidebar";
import FooterComp from "../FooterComp/FooterComp";
import axios from "axios";

const positions = [
  "Arquero",
  "Poste",
  "Ala",
  "Pivote",
  "-",
  "Director Técnico",
  "Preparador Físico",
];

export default function ClubDetail() {
  const { name: urlName, category } = useParams();

  const [teamState, setTeamState] = useState({});
  const [players, setPlayers] = useState([]);

  async function getPlayers(clubName) {
    const data = (
      await axios.get(
        `https://suela-caramelo-app-back-end.vercel.app/sc/players?name=${clubName}&category=${category}`
      )
    ).data;
    setPlayers(data);
  }

  async function getTeam(clubName) {
    const data = (
      await axios.get(
        `https://suela-caramelo-app-back-end.vercel.app/sc/teams?name=${clubName}&category=${category}`
      )
    ).data;

    setTeamState(data[0]);
  }

  useEffect(() => {
    getTeam(urlName);
    getPlayers(urlName);
  }, []);

  return (
    <>
      <Sidebar active={"club"} />
      <main className="ml-[70px] min-h-screen px-2 flex flex-col items-center pt-16 lg:pt-28">
        {/* Flecha atrás */}
        <Link to={"/equipos"}>
          <button className="btn-back ml-[60px]">
            <i className="bx bx-left-arrow-circle"></i>
          </button>
        </Link>

        {/* Plantilla del Club */}
        <section className="flex flex-col bg-black/50 rounded-xl px-2 w-full max-w-6xl text-white">
          <div className="flex flex-col gap-2 text-center py-4">
            <h1 className="text-2xl font-bold underline">PLANTILLA</h1>
            <picture className="w-full flex items-center justify-center">
              <img
                src={teamState?.logo}
                alt=""
                className="w-1/2 lg:w-1/6 object-contain"
              />
            </picture>
          </div>

          <section className="flex flex-col mt-10 w-full justify-center items-center gap-4">
            {positions?.map(
              (position, index) =>
                players.find(
                  (player) =>
                    player?.position.toLowerCase() === position.toLowerCase()
                ) && (
                  <section
                    key={index}
                    className="w-full border-t py-6 mb-6 px-2 sm:px-4"
                  >
                    <h3 className="text-center font-bold  text-lg md:text-xl lg:text-2xl mb-4">
                      {position.toUpperCase()}
                    </h3>
                    <div class="gridC">
                      {players?.map((player, index) =>
                        player?.position.toLowerCase() ===
                        position.toLowerCase() ? (
                          <PlayerCard player={player} key={index} />
                        ) : null
                      )}
                    </div>
                  </section>
                )
            )}
          </section>
        </section>
      </main>

      <FooterComp />
    </>
  );
}
