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
    <>
      <section className="flex flex-wrap p-4 gap-6">
        {clubs.length
          ? clubs.map((club, index) => (
              <Link key={index} to={`/clubes/${club.name}`}>
                <div
                  key={club.name}
                  className=" bg-red-500 w-96 flex flex-col gap-2 items-center p-4 rounded-md bg-[#0a1b21]/50"
                >
                  <section>
                    <img
                      src={club.logo}
                      className="h-56 w-56 object-contain rounded-lg"
                      alt=""
                    />
                  </section>

                  <section>
                    <p className="text-white font-bold">{club.name}</p>
                  </section>
                </div>
              </Link>
            ))
          : null}
      </section>
    </>
  );
}
