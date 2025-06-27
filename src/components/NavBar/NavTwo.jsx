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


  const zonaA = [];
  const zonaB = [];

  for (let i = 0; i < teams.length; i++) {
    const element = teams[i];
    if (
      element.short_name === "DonO" ||
      element.short_name === "Tal" ||
      element.short_name === "Joc" ||
      element.short_name === "SANM" ||
      element.short_name === "CemB" ||
      element.short_name === "Cop" ||
      element.short_name === "BAN" ||
      element.short_name === "GCB" ||
      element.short_name === "Cuc" ||
      element.short_name === "San"
    ) {
      zonaA.push(element);
    } else {
      zonaB.push(element);
    }
  }

  return (
    <div className="bg-black  w-full  flex flex-col items-center py-5 m-2">
      <h1 className="font-bold text-[#E96F22] lg:text-3xl mb-5">
     
        {category === "A1" || !category ? "FSP Masculino" :category === "FEM"?
         "FSP Femenino":
         "#DHxSuela"}
      </h1>

      {/* <NavResults /> */}

      {category === "A1" ? (
        <>
          <span className="text-sm lg:text-lg text-[#E96F22] font-semibold border-b border-[#E96F22] mb-2">
            Zona A
          </span>
          <section className="  flex items-center  justify-center gap-1.5  mb-2  border-white w-full h-full">
            {zonaA?.length ? (
              zonaA?.map((team) => (
                // <Link key={team.id} to={`/teams/${team.id}`}>

                <img
                  key={team.id}
                  src={team.logo}
                  className=" bg-[#E96F22] object-cover border border-[#E96F22]  w-8 h-8  rounded-full"
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

          <span className="text-sm lg:text-lg text-[#E96F22] font-semibold border-b border-[#E96F22] mb-2">
            Zona B
          </span>
          <section className="flex items-center justify-center gap-1.5   rounded- border-b pb-2 mb-5 border-white w-full h-full">
            {zonaB?.length ? (
              zonaB?.map((team) => (
                // <Link key={team.id} to={`/teams/${team.id}`}>

                <img
                  key={team.id}
                  src={team.logo}
                  className="bg-[#E96F22] object-cover border border-[#E96F22]  w-8 h-8  rounded-full"
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
        </>
      ) : (
        <section className="flex items-center gap-1.5  overflow-x-auto p-2  border-b  border-white">
          {teams.map((team) => (
            <img
              key={team.id}
              src={team.logo}
              className="bg-[#E96F22] object-cover border border-[#E96F22]  w-8 h-8  rounded-full"
            />
          ))}
        </section>
      )}

      <CategoryHome />
    </div>
  );
}
