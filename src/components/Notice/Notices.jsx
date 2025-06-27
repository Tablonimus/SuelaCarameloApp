import { Spinner } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";
import Sidebar from "../NavBar/Sidebar";

export default function Notices({
  id,
  images,
  title,
  subtitle,
  videos,
  date,
  author,
}) {
  return (
    <>
      <Sidebar active="noticias" />
      <Link
        to={`/noticias/${id}`}
        className="block bg-zinc-900 rounded-lg border border-zinc-700 overflow-hidden max-w-sm transition-transform hover:scale-[1.01]"
      >
        {/* Imagen de portada */}
        {images?.[0] && (
          <img
            src={images[0]}
            alt="Imagen de la noticia"
            className="w-full h-52 object-cover"
          />
        )}

        {/* Video embebido */}
        {videos?.length >= 1 ? (
          <div className="w-full aspect-video">
            <YoutubeEmbed embedId={videos} />
          </div>
        ) : videos?.length ? (
          <div className="flex justify-center items-center h-52">
            <Spinner color="gray" size="lg" />
          </div>
        ) : null}

        {/* Contenido */}
        <div className="p-4 space-y-2">
          <h2 className="text-base font-semibold text-white leading-snug">
            {title}
          </h2>

          <p className="text-sm text-zinc-400 leading-tight">
            {subtitle.split(" ").slice(0, 12).join(" ")}...
          </p>

          <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
            <img
              src={author.img}
              alt={author.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-zinc-100">{author.name}</span>
          </div>
        </div>
      </Link>
    </>
  );
}
