import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import clubs from "../../utils/data/teams.json";
import silueta from "../../assets/images/silueta.jpg";
import "./card.css";
import "./club.css";
// import "./honey.css";
import { Button } from "flowbite-react";
export default function ClubDetail() {
  const { name } = useParams();

  const [plantilla, setPlantilla] = useState(false);
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
        <section className="flex flex-col justify-center items-center gap-4">
          <h4 className="text-white font-bold text-4xl">EQUIPOS</h4>
          <Button.Group>
            {club?.teams?.length ? (
              club?.teams?.map((team, index) => (
                <Button
                  onClick={(e) => onSelectTeam(e)}
                  key={index}
                  value={team.name}
                  color=""
                  className={
                    teamSelected?.name === team?.name
                      ? "border bg-white text-orange-500"
                      : "border bg-[#0A1B21] text-whitebg-black text-white"
                  }
                >
                  {team.name}
                </Button>
              ))
            ) : (
              <></>
            )}
          </Button.Group>
        </section>
      </main>

      <div class="grid">
        {teamSelected?.players?.length
          ? teamSelected?.players?.map(
              ({ image, name, position, number }, index) => (
                <figure key={index} class="effect-marley">
                  {/* o honey */}
                  <img src={image} alt="img11" className="w-96 h-96 object-cover" />
                  <figcaption>
                    <h2 className="">
                      {name.split(" ")[0]} <span> {name.split(" ")[1]}</span>{" "}
                      {/* <i> {number}</i> */}
                    </h2>

                    <p className="flex flex-col">
                      <span>Número: {number}</span>
                      <span>Posición: {position}</span>
            
                    </p>
                    <a>View more</a>
                  </figcaption>
                </figure>
              )
            )
          : "no hay nada"}
      </div>
    </>
  );
}
