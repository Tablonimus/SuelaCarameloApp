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
        to={`/notices/${id}`}
        class=" relative h-auto bg-zinc-800 rounded-lg shadow-md min-w-60 max-w-72 md:h-[410px] hover:scale-105 duration-300"
      >
        {images && images[0] ? (
          <img
            src={images[0]}
            className="w-full h-64 lg:h-64 object-cover rounded-t-lg "
          />
        ) : (
          false
        )}
        {videos?.length >= 1 ? (
          <YoutubeEmbed embedId={videos} />
        ) : videos?.length ? (
          <Spinner
            color="warning"
            aria-label="Warning spinner example"
            size="xl"
          />
        ) : (
          false
        )}
        <div className="flex flex-col justify-between px-5 py-3 gap-2">
          <h5 className="text-xl font-semibold tracking-tight text-gray-300 md:leading-6">
            {title}
          </h5>
          <p className="overflow-hidden font-medium lg:text-md lg:leading-tight text-zinc-500">
            {subtitle.split(" ").slice(0, 8).join(" ")}...
          </p>

          <div className="flex items-center justify-end gap-1">
            <img src={author.img} alt="" className="rounded-full w-6 h-6 object-cover" />

            <span className="text-zinc-500 font-bold text-start">
              {author.name}
            </span>
          </div>
        </div>
      </Link>
    </>
  );
}
