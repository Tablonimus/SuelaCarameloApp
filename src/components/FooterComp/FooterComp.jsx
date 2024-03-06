import React from "react";
import suela from "../../assets/images/suela.png";
import b1 from "../../assets/images/b1.png";
import b2 from "../../assets/images/b2.png";
import b3 from "../../assets/images/b3.png";
import b4 from "../../assets/images/b4.png";
import b5 from "../../assets/images/zonafutsal.png"
import { Footer } from "flowbite-react";

export default function FooterComp() {
  return (
    <div className="bg-black rounded-t-lg w-full sticky">
      <div className="w-full text-center bg-black">
        <Footer.Divider />
        <div className="w-full flex justify-around items-center">
          <a href="https://www.instagram.com/hache_market/">
            <img src={b4} alt="" className="w-24" />
          </a>
          <a href="https://www.google.com/maps/place/Electricidad+San+Luis/@-32.8856233,-68.8357053,16.5z/data=!4m5!3m4!1s0x0:0xe1d67ca3ac640c37!8m2!3d-32.8845727!4d-68.8358074">
            <img src={b1} alt="" className="w-24" />
          </a>

          <a href="https://www.google.com/maps/place/Granja+Zulueta/@-32.9088319,-68.8389289,15z/data=!4m5!3m4!1s0x0:0x7bc9f6cc51b1d57e!8m2!3d-32.9087853!4d-68.8389242">
            <img src={b3} alt="" className="w-24" />
          </a>

          <a href="https://www.instagram.com/squadraindumentaria/?hl=es">
            <img src={b2} alt="" className="w-24" />
          </a>
          <a href="https://www.instagram.com/zonafutsal_mdz/">
            <img src={b5} alt="" className="w-24" />
          </a>
        </div>
        <Footer.Divider />
        <section>
          <Footer.LinkGroup className="flex items-center justify-center gap-3">
            <Footer.Link href="/sobrenosotros">Sobre Nosotros</Footer.Link>
            <Footer.Link href="/descargar">Descargar App</Footer.Link>
            <Footer.Link href="https://www.facebook.com/SuelaCarameloOk/">
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
