/*
import escudo1 from "/Aleman.png";
import escudo2 from "/Cementista.png";
import escudo4 from "/COP.png";
import logo from "/logo.png";
import logo2 from "/logo2.png";
 */

// import Voucher from "./Voucher/Voucher"

import { useState } from "react";
import clubs from "../../utils/data/teamsMasc.json";
import clubsFem from "../../utils/data/teamsFem.json";

import { Link } from "react-router-dom";
export default function Clubs() {
  console.log(clubs);

  return (
    <>
      <section className="flex flex-col gap-4 p-4">
        <h1 className="text-center text-4xl text-white font-bold">Masculino</h1>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-8">
          {clubs.length
            ? clubs.map((club, index) => (
                <Link key={index} to={`/clubes/${club.name}`}>
                  <div
                    key={club.name}
                    className="flex text-center items-center justify-center overflow-hidden w-32 px-0 py-3 sm:w-80 lg:p-8 rounded-lg  bg-[#0a1b21]/80  "
                  >
                    <section>
                      <img
                        src={club.logo}
                        className="w-full h-24 lg:h-56 lg:w-56 object-contain rounded-lg"
                        alt=""
                      />
                    </section>

                    {/*  <section>
                    <p className="text-white text-center font-bold w-56 lg:w-full ">{club.name}</p>
                  </section> */}
                  </div>
                </Link>
              ))
            : null}
        </div>
      </section>
      <section className="flex flex-col gap-4 p-4">
        <h1 className="text-center text-4xl text-white font-bold">Femenino</h1>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-8">
          {clubsFem.length
            ? clubsFem.map((club, index) => (
                <Link key={index} to={`/clubes/${club.name}`}>
                  <div
                    key={club.name}
                    className="flex text-center items-center justify-center overflow-hidden w-32 px-0 py-3 sm:w-80 lg:p-8 rounded-lg  bg-[#0a1b21]/80  "
                  >
                    <section>
                      <img
                        src={club.logo}
                        className="w-full h-24 lg:h-56 lg:w-56 object-contain rounded-lg"
                        alt=""
                      />
                    </section>

                    {/*  <section>
                    <p className="text-white text-center font-bold w-56 lg:w-full ">{club.name}</p>
                  </section> */}
                  </div>
                </Link>
              ))
            : null}
        </div>
      </section>
    </>
  );
}
