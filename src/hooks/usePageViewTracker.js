import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";

const SECTION_MAP = {
  "/": "home",
  "/noticias": "noticias",
  "/equipos": "equipos",
  "/fixture": "fixture",
  "/posiciones": "posiciones",
  "/cupones": "cupones",
  "/contacto": "contacto",
};

function getSection(pathname) {
  if (SECTION_MAP[pathname]) return SECTION_MAP[pathname];
  if (pathname.startsWith("/noticias/")) return "noticia-detalle";
  if (pathname.startsWith("/equipos/")) return "equipo-detalle";
  if (
    pathname.startsWith("/editor") ||
    pathname.startsWith("/createnotice") ||
    pathname.startsWith("/crear-nota")
  ) {
    return null;
  }
  return "otro";
}

export default function usePageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    const section = getSection(location.pathname);
    if (!section) return;

    fetch(`${BASE_URL}/pageviews/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        route: location.pathname,
        section,
      }),
    }).catch(() => {});
  }, [location.pathname]);
}
