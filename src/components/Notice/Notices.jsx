import React from "react";
import { Link } from "react-router-dom";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";
import { motion } from "framer-motion";

const CATEGORY_LABELS = {
  A1: "FSP Masculino",
  F1: "FSP Femenino",
  DH: "División de Honor",
  CM: "Copa Mendoza",
  TN: "Torneos Nacionales",
  TI: "Torneos Internacionales",
};

export default function Notices({ id, images, title, subtitle, videos, date, author, category }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="h-full">
      <Link
        to={`/noticias/${id}`}
        className="flex flex-col h-full bg-zinc-900 rounded-xl border border-white/10 overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-black/50 hover:border-orange-500/40"
      >
        {/* Imagen / video */}
        <div className="relative w-full aspect-video bg-zinc-800 flex-shrink-0 overflow-hidden">
          {images?.[0] ? (
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}
          {videos?.length >= 1 && (
            <div className="absolute inset-0">
              <YoutubeEmbed embedId={videos} />
            </div>
          )}
          {/* Badge de categoría */}
          {category && CATEGORY_LABELS[category] && (
            <span className="absolute bottom-2 left-2 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide shadow-lg">
              {CATEGORY_LABELS[category]}
            </span>
          )}
        </div>

        {/* Contenido */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          <h2 className="text-sm font-bold text-white line-clamp-2 leading-snug">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-zinc-400 line-clamp-2">{subtitle}</p>
          )}

          {/* Footer: autor + fecha */}
          <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/10 mt-auto">
            <div className="flex items-center gap-2 min-w-0">
              {author?.img && (
                <img
                  src={author.img}
                  alt={author.name}
                  className="w-5 h-5 rounded-full object-cover flex-shrink-0 border border-white/20"
                />
              )}
              {author?.name && (
                <span className="text-xs text-zinc-400 truncate">{author.name}</span>
              )}
            </div>
            {date && (
              <span className="text-xs text-zinc-500 whitespace-nowrap flex-shrink-0">
                {new Date(date).toLocaleDateString("es-AR")}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
