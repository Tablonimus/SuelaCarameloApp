import logoSC from "../../assets/images/banner2.png";
import FooterComp from "../FooterComp/FooterComp";
import { Link } from "react-router-dom";
import "./home.css";
import LiveMatchesTicker from "../LiveMatchesTicker/LiveMatchesTicker";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllNotices } from "../../redux/actions";
import HeroCarousel from "./HeroCarousel";
import SEO from "../SEO/SEO";

const HOME_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://suelacaramelo.com.ar/#webpage",
  "url": "https://suelacaramelo.com.ar",
  "name": "Suela Caramelo | Liga de Fútbol de Salón · Mendoza",
  "isPartOf": { "@id": "https://suelacaramelo.com.ar/#website" },
  "about": { "@id": "https://suelacaramelo.com.ar/#organization" },
  "description": "Portal oficial de la liga Suela Caramelo. Accedé a noticias, fixture, posiciones y equipos del futsal mendocino.",
  "inLanguage": "es-AR"
};

const CATEGORY_LABELS = {
  A1: "FSP Masculino",
  F1: "FSP Femenino",
  Ascenso: "Ascenso",
  DH: "División de Honor",
  CM: "Copa Mendoza",
  TN: "Torneos Nacionales",
  TI: "Torneos Internacionales",
};

const NAV_LINKS = [
  { to: "/fixture",    icon: "bx-calendar-alt", label: "Fixture",       desc: "Partidos programados" },
  { to: "/posiciones", icon: "bx-table",         label: "Posiciones",   desc: "Ranking de equipos" },
  { to: "/equipos",    icon: "bx-group",         label: "Equipos",      desc: "Planteles del FSP" },
  { to: "/noticias",   icon: "bx-news",          label: "Noticias",     desc: "Últimas noticias" },
  { to: "/cupones",    icon: "bx-wallet-alt",    label: "Descuentos",   desc: "Ofertas exclusivas" },
  { to: "/contacto",   icon: "bxs-contact",      label: "Contacto",     desc: "Contactanos" },
];

function NewsCard({ news }) {
  return (
    <Link
      to={`/noticias/${news._id}`}
      className="group flex flex-col bg-zinc-900 border border-white/10 rounded-xl overflow-hidden hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-200 h-full"
    >
      {/* Imagen */}
      <div className="relative h-44 sm:h-48 overflow-hidden bg-zinc-800 flex-shrink-0">
        {news.images?.[0] ? (
          <img
            src={news.images[0]}
            alt={news.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="bx bx-news text-4xl text-zinc-700" />
          </div>
        )}
        {news.category && (
          <span className="absolute bottom-2 left-2 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            {CATEGORY_LABELS[news.category] ?? news.category}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-orange-400 transition-colors">
          {news.title}
        </h3>
        {news.subtitle && (
          <p className="text-xs text-zinc-500 line-clamp-1">{news.subtitle}</p>
        )}
        <p className="text-xs text-zinc-600 mt-auto pt-1">
          {new Date(news.date).toLocaleDateString("es-AR")}
        </p>
      </div>
    </Link>
  );
}

function NavCard({ to, icon, label, desc }) {
  return (
    <Link
      to={to}
      className="group flex flex-col items-center lg:items-start gap-2 lg:gap-2.5 bg-zinc-900 border border-white/10 rounded-xl p-3 lg:p-4 hover:border-orange-500/40 hover:bg-zinc-800 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200"
    >
      <div className="bg-orange-500 p-2 rounded-lg shadow-sm group-hover:rotate-6 transition-transform">
        <i className={`bx ${icon} text-lg lg:text-xl text-white`} />
      </div>
      <div className="text-center lg:text-left">
        <p className="text-xs lg:text-sm font-bold text-white">{label}</p>
        <p className="hidden lg:block text-xs text-zinc-500 mt-0.5 leading-snug">{desc}</p>
      </div>
    </Link>
  );
}

const Home = () => {
  const dispatch   = useDispatch();
  const allNotices = useSelector((state) => state.allNotices);
  const featuredNews = allNotices.slice(0, 4);

  useEffect(() => {
    dispatch(getAllNotices(""));
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <SEO
        description="Suela Caramelo: la liga de fútbol de salón (futsal) más importante de Mendoza, Argentina. Noticias, fixture, posiciones y equipos del FSP Masculino, Femenino, División de Honor y Copa Mendoza."
        url="/"
        jsonLd={HOME_JSONLD}
      />

      {/* Logo bar */}
      <div className="flex items-center justify-center py-2 bg-zinc-900 border-b border-white/10">
        <img src={logoSC} alt="Logo Suela Caramelo" className="h-9 lg:h-12 object-contain" />
      </div>

      {/* Ticker de partidos */}
      <LiveMatchesTicker />

      {/* Hero carousel */}
      <HeroCarousel />

      {/* Contenido principal */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Secciones: primero en DOM → aparece arriba en mobile, derecha en desktop ── */}
          <aside className="flex flex-col gap-3 order-1 lg:order-2">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-1.5 rounded-lg shadow-md">
                <i className="bx bx-grid-alt text-base text-white" />
              </div>
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                Secciones
              </h2>
            </div>

            {/* 3 cols en mobile (2 filas), 2×3 en desktop */}
            <div className="grid grid-cols-3 lg:grid-cols-2 gap-2 lg:gap-3">
              {NAV_LINKS.map((link) => (
                <NavCard key={link.to} {...link} />
              ))}
            </div>
          </aside>

          {/* ── Noticias: segundo en DOM → aparece abajo en mobile, izquierda en desktop ── */}
          <section className="lg:col-span-2 flex flex-col gap-4 order-2 lg:order-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-1.5 rounded-lg shadow-md">
                  <i className="bx bx-news text-base text-white" />
                </div>
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                  Últimas Noticias
                </h2>
              </div>
              <Link
                to="/noticias"
                className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 group transition-colors"
              >
                Ver todas
                <i className="bx bx-chevron-right group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Grid de cards — 2 cols en sm+, 1 col en mobile */}
            {allNotices.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-zinc-800/50 rounded-xl animate-pulse aspect-[4/3]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuredNews.map((news) => (
                  <NewsCard key={news._id} news={news} />
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      <FooterComp />
    </div>
  );
};

export default Home;
