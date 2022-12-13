import React from "react";
import suela from "../../assets/images/suela.png";
import aleman from "../../assets/images/aleman.png";
import godoy from "../../assets/images/godoy.png";
import gye from "../../assets/images/gye.png";
import calendario from "../../assets/images/calendario.png";
import { Navbar } from "flowbite-react";
import CategoryHome from "../Buttons/CategoryHome";
import { useSelector } from "react-redux";
import NavResults from "./NavResults";
import { image } from "@cloudinary/transformation-builder-sdk/qualifiers/source";
import { Link } from "react-router-dom";

export default function NavTwo() {
  const category = useSelector((state) => state.category);
  const teams = useSelector((state) => state.allTeams);

  return (
    <div className="bg-black w-full flex flex-col items-center mt-14 m-2">
      {category === "A1" || !category ? (
        <h1 className="text-white font-bold text-[#E96F22]">#A1xSuela</h1>
      ) : (
        <h1 className="text-white font-bold text-[#E96F22]">#FemxSuela</h1>
      )}

      <NavResults />

      <section className="flex gap-2">
        {teams?.length
          ? teams?.map((team) => (
              <Link key={team.id} to={`/teams/${team.id}`}>
                <img
                  src={team.logo}
                  className="object-cover w-8 shadow-lg shadow-white rounded-full"
                />
              </Link>
            ))
          : false}
      </section>
      
      <CategoryHome />
    </div>
  );
}
