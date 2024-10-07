import React from "react";
import defaultImg from "../../assets/images/silueta.jpg";
import "./card.css";
import "./club.css";

export default function PlayerCard({ player }) {
  return (
    <figure class="effect-marley">
      {/* o honey */}
      <img
        src={player.image === "-" ? defaultImg : player.image}
        alt="img11"
        className="max-w-sm h-96 object-cover"
      />
      <figcaption>
        <h2 className="">
          {player.name.split(" ")[0]} <span> {player.name.split(" ")[1]}</span>{" "}
          {player.name.split(" ")[2]}
          {/* <i> {number}</i> */}
        </h2>

        <p className="flex flex-col gap-1">
          {player.number && (
            <span className="text-white text-[6rem] mb-4">{player.number}</span>
          )}
          {player.alias && player.alias !== "-" ? (
            <span className="text-white">{player.alias}</span>
          ) : (
            <span className="text-white flex items-center justify-end gap-1">
              <i className="pt-1 bx bx-book"></i>
              {player.name.split(" ")[0]}
            </span>
          )}

          {/* <span className="text-white">Posición: {player.position}</span> */}
          {player.birthdate && player.birthdate !== "-" && (
            <span className="text-white flex items-center justify-end gap-1">
              <i className="pt-1 bx bx-cake"></i> {player.birthdate}
            </span>
          )}

          {player.club_arrival && (
            <span className="text-white flex items-center justify-end gap-1">
              <i className="pt-1 bx bx-pen"></i>
              {player.club_arrival}
            </span>
          )}
        </p>
      </figcaption>
    </figure>
  );
}
