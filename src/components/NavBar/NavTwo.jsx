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

export default function NavTwo() {
  const category = useSelector((state) => state.category);

  return (
    <div className="bg-black w-full flex flex-col items-center mt-14 m-2">
      {category === "A1" || !category ? (
        <h1 className="text-white font-bold text-[#E96F22]">#A1xSuela</h1>
      ) : (
        <h1 className="text-white font-bold text-[#E96F22]">#FEMxSuela</h1>
      )}

      <NavResults />
      <CategoryHome />
    </div>
  );
}
