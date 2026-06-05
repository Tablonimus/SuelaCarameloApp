import { Carousel } from "flowbite-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { clearPage, getNoticeDetail } from "../../redux/actions";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";
import Sidebar from "../NavBar/Sidebar";
import FooterComp from "../FooterComp/FooterComp";
import logoSuela from "../../assets/images/banner2.png";

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
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function NoticeDetail() {
  const dispatch = useDispatch();
  const params   = useParams();
  const notice   = useSelector((state) => state.noticeDetail);

  const parrafo      = notice?.content?.split("//");
  const categoryLabel = notice?.category
    ? (CATEGORY_LABELS[notice.category] ?? notice.category)
    : null;

  useEffect(() => {
    dispatch(getNoticeDetail(params.id));
    return () => dispatch(clearPage());
  }, [params.id]);

  return (
    <div className="pl-[70px] flex flex-col min-h-screen bg-zinc-950">
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
          /* Skeleton de carga */
          <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-5">
            <div className="w-full h-72 sm:h-96 bg-zinc-800 rounded-xl animate-pulse" />
            <div className="h-3.5 bg-zinc-800 rounded animate-pulse w-24" />
            <div className="h-8  bg-zinc-800 rounded animate-pulse w-3/4" />
            <div className="h-5  bg-zinc-800 rounded animate-pulse w-1/2" />
            <div className="h-px bg-white/10 w-full" />
            {[80, 90, 75, 85, 60].map((w, i) => (
              <div key={i} className="h-4 bg-zinc-800 rounded animate-pulse" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : (
          <>
            {/* Hero: carousel o embed de YouTube */}
            {notice?.images?.length > 0 ? (
              <div className="w-full h-64 sm:h-80 lg:h-96 bg-zinc-900">
                <Carousel
                  leftControl={<></>}
                  rightControl={<></>}
                  draggable
                  slide
                  slideInterval={3000}
                  className="h-full"
                >
                  {notice.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ))}
                </Carousel>
              </div>
            ) : notice?.videos ? (
              <div className="w-full max-w-4xl mx-auto px-4 pt-8">
                <YoutubeEmbed embedId={notice.videos} />
              </div>
            ) : null}

            {/* Cuerpo del artículo */}
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

            </div>
          </>
        )}
      </main>

      <FooterComp />
      {/* <OtherNotices /> */}
    </div>
  );
}
