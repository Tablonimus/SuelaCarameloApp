import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PlayerCard from "./PlayerCard";
import Sidebar from "../NavBar/Sidebar";
import FooterComp from "../FooterComp/FooterComp";
import axios from "axios";
import SEO from "../SEO/SEO";

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
  const [teamState, setTeamState] = useState(null);
  const [players, setPlayers]     = useState([]);
  const [loading, setLoading]     = useState(true);

  async function getPlayers(clubName) {
    const data = (
      await axios.get(
        `https://suela-caramelo-app-back-end.vercel.app/sc/players?name=${clubName}&category=${category}`
      )
    ).data;
    setPlayers(data.data || []);
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
    async function load() {
      setLoading(true);
      await Promise.all([getTeam(urlName), getPlayers(urlName)]);
      setLoading(false);
    }
    load();
  }, []);

  const teamJsonLd = teamState ? {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    "name": teamState.name,
    "sport": "Futsal",
    "memberOf": { "@id": "https://suelacaramelo.com.ar/#organization" },
    ...(teamState.img && { "image": teamState.img }),
    "url": `https://suelacaramelo.com.ar/equipos/${category}/${urlName}`,
  } : null;

  return (
    <>
      <SEO
        title={teamState?.name ?? urlName}
        description={`Plantel y jugadores de ${teamState?.name ?? urlName} en la liga Suela Caramelo, Mendoza.`}
        image={teamState?.img}
        url={`/equipos/${category}/${urlName}`}
        jsonLd={teamJsonLd}
      />
      <Sidebar active="club" />
      <div className="ml-[70px] min-h-screen flex flex-col bg-zinc-950">

        {/* ── Hero ── */}
        <div className="relative bg-zinc-900 border-b border-white/10 overflow-hidden">
          {/* Glow naranja detrás del escudo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          {/* Fade inferior hacia el fondo oscuro */}
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 py-12 flex flex-col items-center gap-5">

            {/* Botón volver */}
            <div className="absolute top-4 left-4">
              <Link
                to="/equipos"
                className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-sm group"
              >
                <i className="bx bx-left-arrow-alt text-xl group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline font-medium">Equipos</span>
              </Link>
            </div>

            {/* Logo del equipo */}
            {loading ? (
              <div className="w-32 h-32 rounded-full bg-zinc-800 animate-pulse" />
            ) : (
              <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center drop-shadow-2xl">
                <img
                  src={teamState?.logo}
                  alt={teamState?.name}
                  fetchpriority="high"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Nombre + contador */}
            <div className="text-center">
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] mb-1.5">
                Plantilla
              </p>
              <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-wide">
                {teamState?.name ?? urlName}
              </h1>
              {!loading && players.length > 0 && (
                <p className="text-xs text-zinc-500 mt-2">{players.length} jugadores</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Jugadores por posición ── */}
        <div className="flex-1 max-w-5xl w-full mx-auto px-2 sm:px-4 py-10">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
            </div>
          ) : (
            positions.map((position, index) =>
              players.find(
                (p) => p?.position.toLowerCase() === position.toLowerCase()
              ) ? (
                <section key={index} className="mb-16">
                  {/* Cabecera de posición */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                    <h3 className="flex items-center gap-2 text-xs font-black text-orange-400 uppercase tracking-[0.25em] px-2">
                      <span className="w-1 h-4 bg-orange-500 rounded-full inline-block" />
                      {position}
                      <span className="w-1 h-4 bg-orange-500 rounded-full inline-block" />
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                  </div>

                  {/* Cards de jugadores — sin modificar */}
                  <div class="gridC">
                    {players?.map((player, idx) =>
                      player?.position.toLowerCase() === position.toLowerCase() ? (
                        <PlayerCard player={player} key={idx} />
                      ) : null
                    )}
                  </div>
                </section>
              ) : null
            )
          )}
        </div>

        <FooterComp />
      </div>
    </>
  );
}
