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
      to={`/notices/${id}`} //bg-[#F98958]
      class="max-w-sm h-auto bg-black bg-opacity-90 p-1 rounded-lg shadow-inner shadow-white w-11/12 lg:max-w-xs md:h-[420px]"
    >
      {images && images[0] ? (
        <img
          src={images[0] }
          className="w-96  lg:h-64 object-cover rounded-t-lg "
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
      <div className="flex flex-col px-5 pt-3 pb-5 gap-2">
        <h5 className="text-2xl font-bold tracking-tight text-gray-300">
          {title}
        </h5>
        <p
        className="mt-2 overflow-hidden font-normal lg:text-md lg:leading-tight text-gray-200">{subtitle.split(" ").slice(0,15).join(" ")} ...</p>
      </div>
    </Link>
  );
}
