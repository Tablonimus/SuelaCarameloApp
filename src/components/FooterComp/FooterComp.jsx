import b1 from "../../assets/images/b1.png";
import b2 from "../../assets/images/b2.png";
import b3 from "../../assets/images/b3.png";
import b4 from "../../assets/images/b4.png";
import b8 from "../../assets/images/sponsors/fefusa.webp";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSponsors } from "../../redux/actions/index";

const SOCIALS = [
  { icon: "bxl-facebook",  href: "https://www.facebook.com/SuelaCarameloOk" },
  { icon: "bxl-instagram", href: "https://www.instagram.com/suelacaramelo/" },
  { icon: "bxl-youtube",   href: "https://www.youtube.com/@suelacaramelo" },
  { icon: "bxl-tiktok",    href: "https://www.tiktok.com/@suelacaramelo" },
];

export default function FooterComp() {
  const dispatch = useDispatch();
  const sponsors = useSelector((state) => state.sponsors);

  useEffect(() => {
    dispatch(getAllSponsors());
  }, [dispatch]);

  const defaultSponsors = [
    { id: 1, logo: b1, name: "Sponsor 1",           website: "https://maps.app.goo.gl/ZCzjqBVZ39iQCCLR9" },
    { id: 2, logo: b2, name: "Squadra Indumentaria", website: "https://www.instagram.com/squadraindumentaria?igsh=MW9tZzZjbWlyMWlwdA==" },
    { id: 3, logo: b3, name: "Sponsor 3",            website: "https://maps.app.goo.gl/aystKkyxwR3Qnkft6" },
    { id: 4, logo: b4, name: "Hache Market",         website: "https://www.instagram.com/hache_market?igsh=cHEwd2Jna3cxZnlh" },
    { id: 5, logo: b8, name: "Fefusa Mendoza",       website: "https://www.instagram.com/fefusamendoza?igsh=bXhva3V0ZXhwbTE0" },
  ];

  const displaySponsors = sponsors && sponsors.length > 0 ? sponsors : defaultSponsors;

  return (
    <footer className="bg-zinc-900 border-t border-white/10 w-full">

      {/* Etiqueta de sección */}
      <div className="max-w-6xl mx-auto px-4 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em] whitespace-nowrap">
            Auspiciantes
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>
      </div>

      {/* Slider con fade lateral */}
      <div
        className="slider"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="slide-track">
          {displaySponsors.map((sponsor, index) => (
            <div className="slide" key={`first-${index}`}>
              <a target="_blank" rel="noopener noreferrer" href={sponsor.website || sponsor.instagram || "#"}>
                <img
                  className="object-contain h-16 opacity-60 hover:opacity-100 transition-opacity duration-300"
                  src={sponsor.logo}
                  alt={sponsor.name}
                />
              </a>
            </div>
          ))}
          {displaySponsors.map((sponsor, index) => (
            <div className="slide" key={`second-${index}`}>
              <a target="_blank" rel="noopener noreferrer" href={sponsor.website || sponsor.instagram || "#"}>
                <img
                  className="object-contain h-16 opacity-60 hover:opacity-100 transition-opacity duration-300"
                  src={sponsor.logo}
                  alt={sponsor.name}
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Barra inferior */}
      <div className="max-w-6xl mx-auto px-4 py-4 mt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Íconos sociales */}
        <div className="flex items-center gap-5">
          {SOCIALS.map((s) => (
            <Link
              key={s.icon}
              to={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-orange-400 text-2xl transition-colors duration-200"
            >
              <i className={`bx ${s.icon}`} />
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} Suela Caramelo™ · v3.4.1
        </p>

      </div>
    </footer>
  );
}
