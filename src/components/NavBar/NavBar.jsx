import React from "react";
import suela from "../../assets/images/banner2.png";
import { Navbar } from "flowbite-react";

export default function NavBar() {
  return (
    <Navbar
      class="bg-black flex flex-row justify-around items-center w-full p-5 sticky top-0 z-30 shadow-lg"
      fluid={true}
      rounded={true}
    >
      <Navbar.Brand href="/home">
        <span className="flex items-center ml-2 self-center whitespace-nowrap text-xl font-semibold text-white">
          <img
            src={suela}
            className="h-14 rounded-full flex"
            alt="Suela Caramelo"
          />
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="/clubes">
          <span className="text-white hover:text-orange-400">Clubes</span>
        </Navbar.Link>
        <Navbar.Link href="/descargar">
          <span className="text-white hover:text-orange-400">
            Descargar App
          </span>
        </Navbar.Link>

        <Navbar.Link href="/contacto">
          <span className="text-white hover:text-orange-400">Contacto</span>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
