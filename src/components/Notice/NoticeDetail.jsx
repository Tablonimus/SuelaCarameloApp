import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { clearPage, getNoticeDetail } from "../../redux/actions";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";
import Sidebar from "../NavBar/Sidebar";
import FooterComp from "../FooterComp/FooterComp";
import logoSuela from "../../assets/images/banner2.png";
import SEO from "../SEO/SEO";

const CATEGORY_LABELS = {
  A1: "FSP Masculino",
  F1: "FSP Femenino",
  DH: "División de Honor",
  CM: "Copa Mendoza",
  TN: "Torneos Nacionales",
  TI: "Torneos Internacionales",
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric",
  });
};

const isMP4 = (src) => /\.mp4(\?|$)/i.test(src ?? "");

function VideoPlayer({ src }) {
  if (isMP4(src)) {
    return (
      <video
        controls
        className="w-full rounded-xl border border-white/10 bg-zinc-900"
      >
        <source src={src} type="video/mp4" />
        Tu navegador no soporta el reproductor de video.
      </video>
    );
  }
  return <YoutubeEmbed embedId={src} />;
}

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
      <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.22em] whitespace-nowrap">
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
    </div>
  );
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function NoticeDetail() {
  const dispatch = useDispatch();
  const params   = useParams();
  const notice   = useSelector((state) => state.noticeDetail);
  const [modalImage, setModalImage] = useState(null);

  const parrafo       = notice?.content?.split("//");
  const categoryLabel = notice?.category
    ? (CATEGORY_LABELS[notice.category] ?? notice.category)
    : null;

  const hasImages  = (notice?.images?.length ?? 0) > 0;
  const extraImages = notice?.images?.slice(1) ?? [];
  const hasExtra   = extraImages.length > 0;
  const hasVideo   = Boolean(notice?.videos);

  const seoDescription = notice?.subtitle
    || (notice?.content?.replace(/<[^>]+>/g, "").slice(0, 155) ?? "");

  const articleJsonLd = notice ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": notice.title,
    "description": seoDescription,
    "image": notice.images?.[0] ? [notice.images[0]] : ["https://suelacaramelo.com.ar/suela.png"],
    "datePublished": notice.date,
    "dateModified": notice.date,
    "author": {
      "@type": "Person",
      "name": notice.author?.name || "Suela Caramelo"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Suela Caramelo",
      "logo": {
        "@type": "ImageObject",
        "url": "https://suelacaramelo.com.ar/suela.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://suelacaramelo.com.ar/noticias/${params.id}`
    },
    ...(categoryLabel && { "articleSection": categoryLabel }),
    "inLanguage": "es-AR",
    "isPartOf": { "@id": "https://suelacaramelo.com.ar/#website" }
  } : null;

  useEffect(() => {
    dispatch(getNoticeDetail(params.id));
    return () => dispatch(clearPage());
  }, [params.id]);

  return (
    <div className="pl-[70px] flex flex-col min-h-screen bg-zinc-950">
      <SEO
        title={notice?.title}
        description={seoDescription || undefined}
        image={notice?.images?.[0]}
        url={`/noticias/${params.id}`}
        type="article"
        jsonLd={articleJsonLd}
      />
      <Sidebar active="noticias" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <img src={logoSuela} alt="" className="h-7 object-contain flex-shrink-0" />
          <span className="text-zinc-700 flex-shrink-0">·</span>
          <Link
            to="/noticias"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-sm group"
          >
            <i className="bx bx-left-arrow-alt text-xl group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium hidden sm:inline">Noticias</span>
          </Link>
          {categoryLabel && (
            <>
              <span className="text-zinc-700 hidden sm:block">·</span>
              <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide hidden sm:block">
                {categoryLabel}
              </span>
            </>
          )}
        </div>
      </header>

      <main className="flex-1">
        {!notice ? (
          /* Skeleton */
          <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-5">
            <div className="w-full h-72 sm:h-96 bg-zinc-800 rounded-xl animate-pulse" />
            <div className="h-3.5 bg-zinc-800 rounded animate-pulse w-24" />
            <div className="h-8   bg-zinc-800 rounded animate-pulse w-3/4" />
            <div className="h-5   bg-zinc-800 rounded animate-pulse w-1/2" />
            <div className="h-px bg-white/10 w-full" />
            {[80, 90, 75, 85, 60].map((w, i) => (
              <div key={i} className="h-4 bg-zinc-800 rounded animate-pulse" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : (
          <>
            {/* ── Hero ── */}
            {hasImages ? (
              <div
                className="w-full h-64 sm:h-80 lg:h-96 bg-zinc-900 cursor-zoom-in relative group overflow-hidden"
                onClick={() => setModalImage(notice.images[0])}
              >
                <img
                  src={notice.images[0]}
                  alt=""
                  className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-90"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-sm rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : hasVideo ? (
              /* Fallback hero: video si no hay imágenes */
              <div className="w-full max-w-4xl mx-auto px-4 pt-6">
                <VideoPlayer src={notice.videos} />
              </div>
            ) : null}

            {/* ── Cuerpo del artículo ── */}
            <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">

              {/* Categoría + título + subtítulo */}
              <div className="flex flex-col gap-3">
                {categoryLabel && (
                  <span className="self-start bg-orange-500/15 text-orange-400 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-orange-500/20">
                    {categoryLabel}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  {notice?.title}
                </h1>
                {notice?.subtitle && (
                  <h2 className="text-base sm:text-lg text-zinc-400 font-medium leading-relaxed">
                    {notice.subtitle}
                  </h2>
                )}
              </div>

              {/* Autor + fecha */}
              {(notice?.author?.name || notice?.date) && (
                <div className="flex items-center gap-3 py-4 border-y border-white/10">
                  {notice?.author?.img && (
                    <img
                      src={notice.author.img}
                      alt={notice.author.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-white/10"
                    />
                  )}
                  <div>
                    {notice?.author?.name && (
                      <p className="text-sm font-semibold text-white">{notice.author.name}</p>
                    )}
                    {notice?.date && (
                      <p className="text-xs text-zinc-500">{formatDate(notice.date)}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Contenido */}
              {notice?.content?.length > 0 && (
                notice.content[0] !== "<" ? (
                  <div className="flex flex-col gap-4">
                    {parrafo?.map((parra, i) => (
                      <p key={i} className="text-zinc-300 text-base leading-relaxed">
                        {parra}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div
                    className="text-zinc-300 text-base leading-relaxed [&_p]:mb-4 [&_h2]:text-white [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-6 [&_h3]:text-white [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-4 [&_a]:text-orange-400 [&_a]:underline [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1"
                    dangerouslySetInnerHTML={{ __html: notice.content }}
                  />
                )
              )}

              {/* ── Galería de imágenes extra (images[1+]) ── */}
              {hasExtra && (
                <div>
                  <SectionDivider label="Más fotos" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {extraImages.map((img, i) => (
                      <div
                        key={i}
                        className="aspect-square cursor-zoom-in rounded-lg overflow-hidden border border-white/10 group relative"
                        onClick={() => setModalImage(img)}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <i className="bx bx-expand-alt text-white text-2xl drop-shadow-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Video (siempre abajo si hay imágenes, o ya se mostró como hero) ── */}
              {hasVideo && hasImages && (
                <div>
                  <SectionDivider label="Video" />
                  <VideoPlayer src={notice.videos} />
                </div>
              )}

            </div>
          </>
        )}
      </main>

      <FooterComp />

      {/* Modal de imagen ampliada */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4"
          onClick={() => setModalImage(null)}
        >
          <div
            className="flex flex-col items-center w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full mb-4">
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.22em]">
                {notice?.title}
              </p>
              <button
                onClick={() => setModalImage(null)}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
            <img
              src={modalImage}
              alt="Vista ampliada"
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
