import { Link } from "react-router-dom";

const NavFooter = () => {
  return (
    <>
      <nav className="w-full h-16 z-10 bg-gray-900 fixed bottom-0 px-1">
        <ul className="w-full h-full px-1 py-2 flex gap-4 text-gray-500 font-semibold justify-center items-center text-base">
          <Link to={"/"}>
            <li className="flex flex-col items-center">
              <i className="bx bx-home-alt-2 text-orange-700 text-3xl font-medium"></i>
              <span>Home</span>
            </li>
          </Link>
          <Link to={"/clubes"}>
            <li className="flex flex-col items-center ">
              <i className="bx bx-shield text-3xl text-orange-700 font-medium"></i>
              <span>Clubes</span>
            </li>
          </Link>
          <Link to={"/noticias"}>
            <li className="flex flex-col items-center">
              <i className="bx bx-news text-3xl font-medium text-orange-700"></i>
              <span>Noticias</span>
            </li>
          </Link>
          <Link to={"/descuentos"}>
            <li className="flex flex-col items-center">
              <i className="bx bx-purchase-tag-alt text-orange-700 text-3xl font-medium"></i>
              <span>Cupones</span>
            </li>
          </Link>
          <Link to={"/contacto"}>
            <li className="flex flex-col items-center">
              <i className="bx bx-table text-3xl text-orange-700 font-medium "></i>
              <span>Fixture</span>
            </li>
          </Link>
        </ul>
      </nav>
    </>
  );
};

export default NavFooter;
