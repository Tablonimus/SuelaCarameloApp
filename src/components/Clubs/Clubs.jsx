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
    <h3 className="text-gray-500 font-semibold text-lg text-center self-center mt-24">CLUBES</h3>
      <section className="flex flex-wrap justify-center py-14 gap-2 sm:gap-4 lg:gap-5 lg:px-10">
        {clubs.length
          ? clubs.map((club, index) => (
              <Link key={index} to={`/clubes/${club.name}`}>
                <div
                  key={club.name}
                  className="flex text-center items-center justify-center overflow-hidden w-32 px-0 py-3 lg:w-52  lg:h-60 lg:p-4 rounded-lg  bg-[#0a1b21]/80  "
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
      </section>
    </>
  );
}
