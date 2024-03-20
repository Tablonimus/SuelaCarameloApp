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
  return (
    <>
      <section className="ml-[70px] flex flex-col gap-4 py-4 md:pb-16">
        <h1 className="text-center text-3xl italic text-white font-bold mb-4 lg:mt-8">Masculino</h1>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-8">
          {clubs.length
            ? clubs.map((club, index) => (
                <Link key={index} to={`/clubes/${club.name}`}>
                  <div
                    key={club.name}
                    className="flex text-center items-center justify-center overflow-hidden w-32 px-0 py-3 sm:w-64 lg:p-6 rounded-lg  bg-[#0a1b21]/80 hover:scale-105 duration-300"
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
      <section className="ml-[70px] flex flex-col gap-4 pt-4 pb-6 md:pb-16">
        <h1 className="text-center text-3xl italic text-white font-bold mb-4">Femenino</h1>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-8">
          {clubsFem.length
            ? clubsFem.map((club, index) => (
                <Link key={index} to={`/clubes/${club.name}`}>
                  <div
                    key={club.name}
                    className="flex text-center items-center justify-center overflow-hidden w-32 px-0 py-3 sm:w-64 lg:p-6 rounded-lg bg-[#0a1b21]/80 hover:scale-105 hover:text-[#ED7020] duration-300  "
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
