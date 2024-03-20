import { Card, Spinner } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";

export default function Notices({
  id,
  images,
  title,
  subtitle,
  content,
  videos,
  category,
}) {

  return (
    <Link
      to={`/notices/${id}`}
      class="h-auto bg-zinc-800 rounded-lg shadow-md min-w-60 max-w-72 md:h-[410px] hover:scale-105 duration-300"
    >
      {images && images[0] ? (
        <img
          src={images[0] }
          className="w-full h-40 lg:h-64 object-cover rounded-t-lg "
        />
      ) : (
        <></>
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
      <div className="flex flex-col px-5 pt-4 pb-3 gap-2">
        <h5 className="text-xl font-semibold tracking-tight text-gray-300 md:leading-6">
          {title}
        </h5>
        <p
        className=" overflow-hidden font-medium lg:text-md lg:leading-tight text-zinc-500">{subtitle.split(" ").slice(0,17).join(" ")} ...</p>
      </div>
    </Link>
  );
}
