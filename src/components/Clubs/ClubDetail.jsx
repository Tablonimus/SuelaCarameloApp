import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./card.css";
import "./club.css";
import { Button, Tooltip } from "flowbite-react";
import PlayerCard from "./PlayerCard";
import clubs from "../../utils/data/teamsMasc.json";
import clubsFem from "../../utils/data/teamsFem.json";
const positions = [
  "Arquero",
  "Poste",
  "Ala",
  "Pivote",
  "Director Técnico",
  "Preparador Físico",
];

export default function ClubDetail() {
  const { name, category } = useParams();
  const [club, setClub] = useState(null);
  const [teamSelected, setTeamSelected] = useState(null);

  const onSelectTeam = (e) => {
    console.dir(e.target.textContent);
    let clubState = club.teams.find(
      (team) => team.name === e.target.textContent
    );
    setTeamSelected(clubState);
  };

  useEffect(() => {
    setClub(clubs.find((club) => club.name === name));
    if (club) {
      setTeamSelected(club.teams[0]);
    }
  }, [club]);

  return (
    <>
      <main className="teams-wrapper pt-16">
        {/* Flecha atrás */}
        <Link to={"/clubes"}>
          <button className="btn-back">
            {" "}
            <i className="bx bx-left-arrow-circle"></i>
          </button>
        </Link>
        {/* Club */}
        <section className="team-box">
          <div className="team-name">
            <h2>{club?.name}</h2>
          </div>
          <picture className="img-escudo">
            <img src={club?.logo} alt="" />
          </picture>
          {/* Datos del club */}
          <article className="team-info">
            <h4>DATOS DEL CLUB</h4>
            <ul className="club-details">
              <li>
                <i className="bx bx-copyright"></i>Nombre Completo: {club?.name}
              </li>
              <li>
                <i className="bx bx-tag-alt"></i>Fecha de Fundación:
                {club?.foundation}
              </li>
              <li>
                <i className="bx bx-football"></i>Estadio: Bautista Gargantini
              </li>
              <li>
                <i className="bx bx-current-location"></i>Dirección:{" "}
                {club?.address}
              </li>
            </ul>
            {/* <button className="btn-team" onClick={handleClick}>
              Plantilla
            </button> */}
          </article>
        </section>
        {/* Equipos: Grupo de botones */}
      </main>
      {/* EQUIPOS */}
      <section className="mt-24 w-full">
        <section className="team-box">
          <div className="team-name">
            <h2>Plantel</h2>
            <Button.Group className="flex flex-col  sm:flex-row">
              {club?.teams?.length ? (
                club?.teams?.map((team, index) => (
                  <Tooltip key={index} content="Ver equipo">
                    <Button
                      onClick={(e) => onSelectTeam(e)}
                      key={index}
                      value={team.name}
                      color=""
                      className={
                        teamSelected?.name === team?.name
                          ? " text-white   w-72 h-20 rounded-lg font-bold"
                          : " text-[#0A1B21] h-20 w-52  rounded-lg font-bold"
                      }
                    >
                      <span className="text-3xl">{team.name}</span>
                    </Button>
                  </Tooltip>
                ))
              ) : (
                <></>
              )}
            </Button.Group>
          </div>
          <section className="flex flex-col mt-10 w-full justify-center items-center gap-4">
            {/* <Button.Group className="flex flex-col  sm:flex-row">
              {club?.teams?.length ? (
                club?.teams?.map((team, index) => (
                  <Tooltip key={index} content="Ver equipo">
                    <Button
                      onClick={(e) => onSelectTeam(e)}
                      key={index}
                      value={team.name}
                      color=""
                      className={
                        teamSelected?.name === team?.name
                          ? " border bg-white text-[#0A1B21]  w-72 h-20 rounded-lg font-bold"
                          : " border bg-[#0A1B21] text-white   h-20 w-52  rounded-lg font-bold"
                      }
                    >
                      <span className="text-3xl">{team.name}</span>
                    </Button>
                  </Tooltip>
                ))
              ) : (
                <></>
              )}
            </Button.Group> */}

            {positions?.map((position, index) => (
              <section key={index} className="w-full">
                <h3 className="text-center font-bold text-white text-4xl">
                  {position.toUpperCase()}
                </h3>
                <div class="gridC">
                  {teamSelected?.players?.map((player, index) =>
                    player?.position === position ? (
                      <PlayerCard player={player} key={index} />
                    ) : (
                      false
                    )
                  )}
                </div>
              </section>
            ))}
          </section>
        </section>
      </section>
    </>
  );
}
