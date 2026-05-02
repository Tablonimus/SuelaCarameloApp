import b1 from "../../assets/images/b1.png";
import b2 from "../../assets/images/b2.png";
import b3 from "../../assets/images/b3.png";
import b4 from "../../assets/images/b4.png";
import b8 from "../../assets/images/sponsors/fefusa.webp";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSponsors } from "../../redux/actions/index";

export default function FooterComp() {
  const dispatch = useDispatch();
  const sponsors = useSelector((state) => state.sponsors);

  useEffect(() => {
    dispatch(getAllSponsors());
  }, [dispatch]);

  // Default sponsors as fallback
  const defaultSponsors = [
    { id: 1, logo: b1, name: "Sponsor 1", website: "https://maps.app.goo.gl/ZCzjqBVZ39iQCCLR9" },
    { id: 2, logo: b2, name: "Squadra Indumentaria", website: "https://www.instagram.com/squadraindumentaria?igsh=MW9tZzZjbWlyMWlwdA==" },
    { id: 3, logo: b3, name: "Sponsor 3", website: "https://maps.app.goo.gl/aystKkyxwR3Qnkft6" },
    { id: 4, logo: b4, name: "Hache Market", website: "https://www.instagram.com/hache_market?igsh=cHEwd2Jna3cxZnlh" },
    { id: 5, logo: b8, name: "Fefusa Mendoza", website: "https://www.instagram.com/fefusamendoza?igsh=bXhva3V0ZXhwbTE0" },
  ];

  // Use sponsors from Redux or fallback to default
  const displaySponsors = sponsors && sponsors.length > 0 ? sponsors : defaultSponsors;

  return (
    <div className="bg-zinc-900  w-full py-4">
      <div className="w-full text-center bg-zinc-900">
        <section className="slider lg:w-full">
          <div className="slide-track">
            {/* First set of slides */}
            {displaySponsors.map((sponsor, index) => (
              <div className="slide" key={`first-${index}`}>
                <a target="_blank" href={sponsor.website || sponsor.instagram || "#"}>
                  <img className="object-contain h-16  " src={sponsor.logo} alt={sponsor.name} />
                </a>
              </div>
            ))}
            {/* Duplicate set for seamless scrolling */}
            {displaySponsors.map((sponsor, index) => (
              <div className="slide" key={`second-${index}`}>
                <a target="_blank" href={sponsor.website || sponsor.instagram || "#"}>
                  <img className="object-contain h-16  " src={sponsor.logo} alt={sponsor.name} />
                </a>
              </div>
            ))}
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
            <Footer.Copyright href="#" by="Suela Caramelo™ | v3.4.1" year={new Date().getFullYear()} />
          </section>
        </section>
      </div>
    </div>
  );
}
