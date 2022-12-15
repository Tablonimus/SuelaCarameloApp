import React from "react";
import suela from "../../assets/images/suela.png";
import aleman from "../../assets/images/aleman.png";
import godoy from "../../assets/images/godoy.png";
import gye from "../../assets/images/gye.png";
import calendario from "../../assets/images/calendario.png";
import { Navbar, Spinner } from "flowbite-react";
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

      <section className="flex items-center justify-center gap-2  rounded-b-lg border-b pb-2 mb-5 border-white w-full h-full">
        {teams?.length ? (
          teams?.map((team) => (
            // <Link key={team.id} to={`/teams/${team.id}`}>
            <img
              key={team.id}
              src={team.logo}
              className="bg-white object-cover border border-[#E96F22]  w-8 h-8  rounded-full"
            />
            // </Link>
          ))
        ) : (
          <div className="ml-10 flex items-center justify-center gap-5">
            <Spinner
              color="warning"
              aria-label="Warning spinner example"
              size="md"
            />
            <Spinner
              color="warning"
              aria-label="Warning spinner example"
              size="md"
            />
            <Spinner
              color="warning"
              aria-label="Warning spinner example"
              size="md"
            />
            <Spinner
              color="warning"
              aria-label="Warning spinner example"
              size="md"
            />
          </div>
        )}
      </section>

      <CategoryHome />
    </div>
  );
}
