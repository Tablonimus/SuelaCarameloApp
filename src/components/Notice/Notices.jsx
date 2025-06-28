import React from "react";
import { Link } from "react-router-dom";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";
import Sidebar from "../NavBar/Sidebar";
import { motion } from "framer-motion";

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
      <motion.div whileHover={{ y: -5 }} className="max-w-sm">
        <Link
          to={`/noticias/${id}`}
          className="block bg-zinc-900 rounded-xl border border-white/10 overflow-hidden transition-all hover:shadow-lg hover:border-orange-500/30"
        >
          {/* Imagen de portada o video */}
          <div className="relative w-full aspect-video bg-zinc-800">
            {images?.[0] && (
              <img
                src={images[0]}
                alt="Imagen de la noticia"
                className="w-full h-full object-cover"
              />
            )}

            {videos?.length >= 1 && (
              <div className="absolute inset-0">
                <YoutubeEmbed embedId={videos} />
              </div>
            )}
          </div>

          {/* Contenido */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-2">
              <h2 className="text-sm font-semibold text-white line-clamp-2">
                {title}
              </h2>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(date).toLocaleDateString("es-AR")}
              </span>
            </div>

            <p className="text-xs text-zinc-400 line-clamp-2">{subtitle}</p>

            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              {author.img && (
                <img
                  src={author.img}
                  alt={author.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
              )}
              <span className="text-xs text-zinc-300">{author.name}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    </>
  );
}
