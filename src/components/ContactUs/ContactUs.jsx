import React from "react";
import logoSC from "../../assets/images/banner2.png";
import { Link } from "react-router-dom";
import Sidebar from "../NavBar/Sidebar";
import FooterComp from "../FooterComp/FooterComp";

const SOCIALS = [
  {
    label: "Instagram",
    handle: "@suelacaramelo",
    href: "https://www.instagram.com/suelacaramelo/",
    icon: "bxl-instagram",
    color: "hover:border-pink-500/50 hover:text-pink-400",
  },
  {
    label: "YouTube",
    handle: "@suelacaramelo",
    href: "https://www.youtube.com/@suelacaramelo",
    icon: "bxl-youtube",
    color: "hover:border-red-500/50 hover:text-red-400",
  },
  {
    label: "Facebook",
    handle: "SuelaCarameloOk",
    href: "https://www.facebook.com/SuelaCarameloOk",
    icon: "bxl-facebook",
    color: "hover:border-blue-500/50 hover:text-blue-400",
  },
  {
    label: "TikTok",
    handle: "@suelacaramelo",
    href: "https://www.tiktok.com/@suelacaramelo",
    icon: "bxl-tiktok",
    color: "hover:border-white/30 hover:text-white",
  },
  {
    label: "Correo",
    handle: "suelacaramelo@gmail.com",
    href: "mailto:suelacaramelo@gmail.com",
    icon: "bxl-gmail",
    color: "hover:border-orange-500/50 hover:text-orange-400",
  },
];

export default function ContactUs() {
  return (
    <div className="pl-[70px] flex flex-col min-h-screen bg-zinc-950">
      <Sidebar active="contacto" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <img src={logoSC} alt="" className="h-7 object-contain flex-shrink-0" />
          <span className="text-sm font-bold text-white tracking-widest uppercase hidden sm:block">
            Contacto
          </span>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 gap-10">

        {/* Logo + copy */}
        <div className="flex flex-col items-center gap-4 text-center max-w-lg">
          <img src={logoSC} alt="Suela Caramelo" className="w-40 sm:w-52 object-contain" />

          <div className="flex items-center gap-3 mt-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] whitespace-nowrap">
              Ponete en contacto
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
          </div>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Informando y celebrando el futsal en Mendoza. Somos un medio apasionado por este
            deporte, con coberturas, contenido audiovisual y una visión de influencia global.
            También somos <span className="text-white font-semibold">Suela Producciones</span>,
            una productora audiovisual y fotográfica enfocada en deportes.
          </p>
          <p className="text-zinc-500 text-sm">
            Estamos ansiosos por leerte y compartir juntos esta pasión.{" "}
            ¿Querés sumarte o tenés alguna consulta? ¡Escribinos!
          </p>
        </div>

        {/* Links sociales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-xl">
          {SOCIALS.map((s) => (
            <Link
              key={s.label}
              to={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-3 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3.5 transition-all duration-200 hover:bg-zinc-800 ${s.color}`}
            >
              <i className={`bx ${s.icon} text-2xl flex-shrink-0 transition-colors`} />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white uppercase tracking-wide">{s.label}</p>
                <p className="text-xs text-zinc-500 truncate">{s.handle}</p>
              </div>
              <i className="bx bx-chevron-right text-zinc-700 group-hover:text-current ml-auto transition-all duration-200 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>

      </main>

      <FooterComp />
    </div>
  );
}
