import { Card } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

export default function Notices({
  id,
  images,
  title,
  subtitle,
  content,
  category,
}) {
  return (
    <div className="max-w-sm m-4">
      <Link to={`/noticia/${id}`}>
        <Card
          // imgAlt="image"
          imgSrc={images[0]}
          class="bg-[#E96F22] rounded-lg shadow-lg"
        >
          <div className="lg:h-11/12 w-24 lg:w-1/2">
            {/* <YoutubeEmbed embedId="3dmGzwSRl2s" /> */}
            {/* <img src={notice?.images[0]} alt="" className="object-cover"/> */}
          </div>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {subtitle}
          </p>
        </Card>
      </Link>
    </div>
  );
}
