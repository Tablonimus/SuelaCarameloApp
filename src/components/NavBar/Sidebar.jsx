import { Link } from "react-router-dom";
import logoSC from "../../assets/images/banner2.png";
import logoSC2 from "../../assets/images/suela.png";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo_details">
          <img
            className={!isOpen ? "hidden max-w-10" : null}
            src={logoSC2}
            alt=""
          />
          <i onClick={toggleSidebar} className="bx bx-menu" id="btn"></i>
        </div>
        <ul className="nav-list">
          <Link to={"/"}>
            <li>
              <a href="#">
                <i class="bx bxs-home-alt-2"></i>
                <span className="link_name">Home</span>
              </a>
            </li>
          </Link>
          <Link to={"/noticias"}>
            <li>
              <a href="#">
                <i class="bx bx-news"></i>
                <span className="link_name">Noticias</span>
              </a>
            </li>
          </Link>
          <Link to={"/clubes"}>
            <li>
              <a href="#">
                <i class="bx bxs-shield"></i>
                <span className="link_name">Clubes</span>
              </a>
            </li>
          </Link>
          <Link to={"/fixture"}>
            <li>
              <a href="#">
                 <i className="bx bx-football"></i>
                <span className="link_name">Fixture</span>
              </a>
            </li>
          </Link>
         
          <Link to={"/posiciones"}>
            <li>
              <a href="#">
                <i class="bx bx-list-ol"></i>
                <span className="link_name">Posiciones</span>
              </a>
            </li>
          </Link>
          <Link to={"/descuentos"}>
            <li>
              <a href="#">
                <i class="bx bxs-purchase-tag-alt"></i>
                <span className="link_name">Descuentos</span>
              </a>
            </li>
          </Link>
          <Link to={"/contacto"}>
            <li>
              <a href="#">
                <i class="bx bxs-contact"></i>
                <span className="link_name">Contacto</span>
              </a>
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
};
export default Sidebar;
