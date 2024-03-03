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
      <section className="flex flex-wrap justify-center py-2 gap-6">
        {clubs.length
          ? clubs.map((club, index) => (
              <Link key={index} to={`/clubes/${club.name}`}>
                <div
                  key={club.name}
                  className="lg:w-96 flex flex-col gap-4 items-center p-8 rounded-lg  bg-[#0a1b21]/80  "
                >
                  <section>
                    <img
                      src={club.logo}
                      className="w-24 h-24 lg:h-56 lg:w-56 object-contain rounded-lg"
                      alt=""
                    />
                  </section>

                  <section>
                    <p className="text-white text-center font-bold w-56 lg:w-full ">{club.name}</p>
                  </section>
                </div>
              </Link>
            ))
          : null}
      </section>
    </>
  );
}
