import React from "react";
import "./card.css";
import "./club.css";

export default function PlayerCard({ player }) {
  return (
    <figure class="effect-marley">
      {/* o honey */}
      <img src={player.image} alt="img11" className="max-w-xs h-96 object-cover" />
      <figcaption>
        <h2 className="">
          {player.name.split(" ")[0]} <span> {player.name.split(" ")[1]}</span>
          {/* <i> {number}</i> */}
        </h2>

        <p className="flex flex-col gap-1">
          {player.number && (
            <span className="text-white text-[6rem] mb-4">{player.number}</span>
          )}
          {player.nickname && (
            <span className="text-white">Apodo: {player.nickname}</span>
          )}

          {/* <span className="text-white">Posición: {player.position}</span> */}
          {player.birth && (
            <span className="text-white">Nacimiento: {player.birth}</span>
          )}

          {player.arrival && (
            <span className="text-white">Llegada: {player.arrival}</span>
          )} 
        </p>

        <a>View more</a>
      </figcaption>
    </figure>
  );
}
