import { Link } from "react-router-dom";
import suela from "../../assets/images/banner2.png";

const NavbarPillin = () => {
    return (
        <>
        <div className="w-full h-24 overflow-hidden bg-black">
        <div className="w-full py-6 px-5 lg:px-28 flex justify-between text-gray-400 md:pl-10">
          <figure className="max-w-36 lg:md:max-w-44">
            <img src={suela} alt="" />
          </figure>
          <ul
            id="nav-btns"
            className="hidden md:flex items-center gap-10 font-cabin text-lg font-semibold pt-4 tracking-wider"
          >
            <Link to={"/"}>
              <li className="text-gray-400 hover:text-[#ED7020] hover:scale-105 duration-300">Noticias</li>
            </Link>
            <Link to={"/clubes"}>
              <li className="text-gray-400 hover:text-[#ED7020] hover:scale-105 duration-300">Clubes</li>
            </Link>
            <Link to={"/descuentos"}>
              <li className="text-gray-400 hover:text-[#ED7020] hover:scale-105 duration-300">Descuentos</li>
            </Link>
            <Link to={"/contacto"}>
              <li className="text-gray-400 hover:text-[#ED7020] hover:scale-105 duration-300">Contacto</li>
            </Link>
          </ul>

          {/* hamburger menu */}
          <button className="pr-4 pt-2 space-y-1 group md:hidden">
            <div className="w-8 h-1 bg-white"></div>
            <div className="w-8 h-1 bg-white"></div>
            <div className="w-8 h-1 bg-white"></div>

            {/* menu */}
            <ul className="bg-black w-full pb-10 absolute -top-full group-focus:top-0 right-0 duration-300 flex flex-col space-y-3 justify-start"
            style={{zIndex:"3000"}}
            >
              <button className="px-12 py-10 relative ml-auto">
                <div className="w-6 h-1 rotate-45 absolute bg-white"></div>
                <div className="w-6 h-1 -rotate-45 absolute bg-white"></div>
              </button>
              <Link to={"/"}>
              <li className="flex justify-center text-lg font-semibold text-gray-400 w-full py-4 hover:text-[#ED7020] hover:scale-105 duration-300">
                Noticias
              </li>
              </Link>
              <Link to={"/contacto"}>
              <li className="flex justify-center text-lg font-semibold w-full py-4 text-gray-400 hover:text-[#ED7020] hover:scale-105 duration-300">
                Contacto
              </li>
              </Link>
              <Link to={"/Clubes"}>
              <li className="flex justify-center text-lg font-semibold w-full py-4 text-gray-400 hover:text-[#ED7020] hover:scale-105 duration-300">
                Clubes
              </li>
              </Link>
              <Link to={"/descuentos"}>
              <li className="flex justify-center text-lg font-semibold w-full py-4 text-gray-400 hover:text-[#ED7020] hover:scale-105 duration-300">
                Descuentos
              </li>
              </Link>
            </ul>
          </button>
        </div>
      </div>
        </>
      );
    };
    
    export default NavbarPillin;
