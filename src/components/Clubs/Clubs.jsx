/*
import escudo1 from "/Aleman.png";
import escudo2 from "/Cementista.png";
import escudo4 from "/COP.png";
import logo from "/logo.png";
import logo2 from "/logo2.png";
 */

// import Voucher from "./Voucher/Voucher"

import { useState } from "react";
import clubs from "../../utils/data/teams.json";

import { Link } from "react-router-dom";
export default function Clubs() {
  console.log(clubs);

  return (
    <div className="h-screen flex justify-center items-center">
      <ul>
        {clubs?.length
          ? clubs.map((club) => (
              <Link to={`/clubes/${club.name}`}>
                <li className="text-white text-xl underline p-4">
                  <div className="flex gap-4 items-center">
                    <img
                      src={club.logo}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />{" "}
                    - {club.name}
                  </div>
                </li>
              </Link>
            ))
          : "no hay clubes"}
      </ul>
    </div>
  );
}
