import b1 from "../../assets/images/b1.png";
import b2 from "../../assets/images/b2.png";
import b3 from "../../assets/images/b3.png";
import b4 from "../../assets/images/b4.png";
import b6 from "../../assets/images/sponsors/tano.webp";
import b8 from "../../assets/images/sponsors/fefusa.webp";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";

export default function FooterComp() {
  return (
    <div className="bg-zinc-900  w-full py-4">
      <div className="w-full text-center bg-zinc-900">
        <section className="slider lg:w-full">
          <div className="slide-track">
            <div className="slide">
              <a
                target="_blank"
                href="https://maps.app.goo.gl/ZCzjqBVZ39iQCCLR9"
              >
                <img className="object-contain h-16  " src={b1} />
              </a>
            </div>
            <div className="slide">
              <a
                target="_blank"
                href="https://www.instagram.com/squadraindumentaria?igsh=MW9tZzZjbWlyMWlwdA=="
              >
                <img className="object-contain h-16  " src={b2} />
              </a>
            </div>
            <div className="slide">
              <a
                target="_blank"
                href="https://maps.app.goo.gl/aystKkyxwR3Qnkft6"
              >
                <img className="object-contain h-16  " src={b3} />
              </a>
            </div>
            <div className="slide">
              <a
                target="_blank"
                href="https://www.instagram.com/hache_market?igsh=cHEwd2Jna3cxZnlh"
              >
                <img className="object-contain h-16  " src={b4} />
              </a>
            </div>

            <div className="slide">
              <a
                target="_blank"
                href="https://www.instagram.com/eltanopiadineria?igsh=YmlydG02cGp4ZHlt"
              >
                <img className="object-contain h-16  " src={b6} />
              </a>
            </div>
            <div className="slide">
              <a
                target="_blank"
                href="https://www.instagram.com/fefusamendoza?igsh=bXhva3V0ZXhwbTE0"
              >
                <img className="object-contain h-16  " src={b8} />
              </a>
            </div>
            <div className="slide">
              <a
                target="_blank"
                href="https://maps.app.goo.gl/ZCzjqBVZ39iQCCLR9"
              >
                <img className="object-contain h-16  " src={b1} />
              </a>
            </div>
            <div className="slide">
              <a
                target="_blank"
                href="https://www.instagram.com/squadraindumentaria?igsh=MW9tZzZjbWlyMWlwdA=="
              >
                <img className="object-contain h-16  " src={b2} />
              </a>
            </div>
            <div className="slide">
              <a
                target="_blank"
                href="https://maps.app.goo.gl/aystKkyxwR3Qnkft6"
              >
                <img className="object-contain h-16  " src={b3} />
              </a>
            </div>
            <div className="slide">
              <a
                target="_blank"
                href="https://www.instagram.com/hache_market?igsh=cHEwd2Jna3cxZnlh"
              >
                <img className="object-contain h-16  " src={b4} />
              </a>
            </div>

            <div className="slide">
              <a
                target="_blank"
                href="https://www.instagram.com/eltanopiadineria?igsh=YmlydG02cGp4ZHlt"
              >
                <img className="object-contain h-16  " src={b6} />
              </a>
            </div>
            <div className="slide">
              <a
                target="_blank"
                href="https://www.instagram.com/fefusamendoza?igsh=bXhva3V0ZXhwbTE0"
              >
                <img className="object-contain h-16  " src={b8} />
              </a>
            </div>
          </div>
        </section>

        <section className="w-full flex flex-col justify-end items-center pr-1">
          <ul className="w-4/5 flex justify-center items-center text-4xl  ml-[50px] lg:ml-[20px] mt-3 gap-6 lg:gap-10">
            <Link to={"https://www.facebook.com/SuelaCarameloOk"}>
              <li>
                <i className="bx bxl-facebook text-orange-700"></i>
              </li>
            </Link>
            <Link to={"https://www.instagram.com/suelacaramelo/"}>
              <li>
                <i className="bx bxl-instagram text-orange-700"></i>
              </li>
            </Link>
            <Link to={"https://www.youtube.com/@suelacaramelo"}>
              <li>
                <i className="bx bxl-youtube text-orange-700"></i>
              </li>
            </Link>
            <Link to={"https://www.tiktok.com/@suelacaramelo"}>
              <li>
                <i className="bx bxl-tiktok text-orange-700"></i>
              </li>
            </Link>
          </ul>
          <section className="w-4/5 font-semibold flex justify-center items-center  ml-[50px] lg:ml-[20px] mt-4">
            <Footer.Copyright href="#" by="Suela Caramelo™" year={2016} />
          </section>
        </section>
      </div>
    </div>
  );
}
