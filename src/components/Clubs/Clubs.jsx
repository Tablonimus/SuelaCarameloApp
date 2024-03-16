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
   <article className="mt-10 px-2 flex flex-col justify-center items-center text-center md:my-12 ">
        <h1 className="text-4xl font-extrabold text-zinc-800 leading-9 md:text-6xl md:leading-12">
          Suela Caramelo
          <br />
          <span className="px-1 italic text-black">Clubes</span>
        </h1>
        <p className="text-md font-semibold text-zinc-900 mt-7 md:text-lg">
          Lorem, ipsum dolor sit amet consectetur adipisicing. 
          <br />
          Lorem ipsum dolor sit amet.
        </p>
        <button
          className="bg-zinc-900 w-56 text-gray-300 py-2 mb-6 rounded-md font-bold text-sm mt-4 hover:scale-105 hover:text-[#ED7020] duration-300 md:text-base md:mt-6"
        >
          Contact me
        </button> 
      </article>
      <section className="flex flex-col gap-4 p-4 md:pb-16">
        <h1 className="text-center text-4xl text-white font-bold mb-6">Masculino</h1>
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
      <section className="flex flex-col gap-4 p-4 md:pb-16">
        <h1 className="text-center text-4xl text-white font-bold mb-6">Femenino</h1>
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
