import { Helmet } from "react-helmet-async";

const SITE_NAME  = "Suela Caramelo";
const BASE_URL   = "https://suelacaramelo.com.ar";
const DEFAULT_IMG = `${BASE_URL}/suela.png`;
const DEFAULT_DESC = "Liga de fútbol de salón de Mendoza, Argentina. Noticias, fixture, posiciones y equipos del FSP Masculino, Femenino, División de Honor y Copa Mendoza.";

/**
 * @param {string}  title       — Page title (site name appended automatically)
 * @param {string}  description — Meta description (155 chars max recommended)
 * @param {string}  image       — Absolute URL for OG image
 * @param {string}  url         — Canonical path, e.g. "/noticias/123"
 * @param {string}  type        — OG type: "website" | "article"
 * @param {object|object[]} jsonLd — JSON-LD schema object(s)
 */
export default function SEO({
  title,
  description = DEFAULT_DESC,
  image = DEFAULT_IMG,
  url = "",
  type = "website",
  jsonLd,
}) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Liga de Fútbol de Salón · Mendoza`;
  const canonical = `${BASE_URL}${url}`;
  const ogImage   = image.startsWith("http") ? image : `${BASE_URL}${image}`;
  const schemas   = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type"        content={type} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:url"         content={canonical} />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:locale"      content="es_AR" />

      {/* Twitter / X */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />

      {/* JSON-LD */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
