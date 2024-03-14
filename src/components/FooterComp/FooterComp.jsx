import React from "react";
import suela from "../../assets/images/suela.png";
import b1 from "../../assets/images/b1.png";
import b2 from "../../assets/images/b2.png";
import b3 from "../../assets/images/b3.png";
import b4 from "../../assets/images/b4.png";
import b5 from "../../assets/images/zonafutsal.png";
import { Footer } from "flowbite-react";

export default function FooterComp() {
  return (
    <div className="bg-black rounded-t-lg w-full sticky py-4">
      <div className="w-full text-center bg-black">
       
        <section className="slider">
          <div className="slide-track">
            <div className="slide">
              <img src={b1} />
            </div>
            <div className="slide">
              <img src={b2} />
            </div>
            <div className="slide">
              <img src={b3} />
            </div>
            <div className="slide">
              <img src={b4} />
            </div>
            <div className="slide">
              <img src={b5} />
            </div>
            <div className="slide">
              <img src={b1} />
            </div>
            <div className="slide">
              <img src={b2} />
            </div>
            <div className="slide">
              <img src={b3} />
            </div>
            <div className="slide">
              <img src={b4} />
            </div>
            <div className="slide">
              <img src={b5} />
            </div>
          </div>
        </section>

        <section>
          <Footer.LinkGroup className="text-gray-300 flex items-center justify-center gap-3">
            <Footer.Link class="text-gray-300" href="/sobrenosotros">Sobre Nosotros</Footer.Link>
            <Footer.Link class="text-gray-300" href="/descargar">Descargar App</Footer.Link>
            <Footer.Link class="text-gray-300" href="https://www.facebook.com/SuelaCarameloOk/">
              Facebook
            </Footer.Link>
            <Footer.Link href="https://www.instagram.com/suelacaramelo/">
              Instagram
            </Footer.Link>
            <Footer.Link href="https://www.tiktok.com/@suelacaramelo">
              Tik Tok{" "}
            </Footer.Link>
            <Footer.Link href="https://www.youtube.com/@suelacaramelo">
              Youtube
            </Footer.Link>
            <Footer.Link href="/contacto">Contacto</Footer.Link>
          </Footer.LinkGroup>
          <section className="flex items-center justify-center">
            <Footer.Brand href="#" src={suela} alt="Flowbite Logo" name="" />
            <Footer.Copyright href="#" by="Suela Caramelo™" year={2016} />
          </section>
        </section>
      </div>
    </div>
  );
}
