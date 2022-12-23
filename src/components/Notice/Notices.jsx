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
    <div className="max-w-sm my-3 flex flex-col text-center items-center justify-center">
      <Link to={`/notices/${id}`}>
        <Card
          // imgAlt="image"
          imgSrc={
            images[0] ? (
              images[0]
            ) : (
              <Spinner
                color="warning"
                aria-label="Warning spinner example"
                size="xl"
              />
            )
          }
          class="bg-[#F98958] rounded-lg shadow-inner border border-[#E96F22] shadow-white"
        >
          {videos?.length >= 1 ? (
            <YoutubeEmbed embedId={ videos} />
          ) : videos?.length ? (
            <Spinner
              color="warning"
              aria-label="Warning spinner example"
              size="xl"
            />
          ) : (
            false
          )}
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
          <p className="font-normal text-black dark:text-gray-400">
            {subtitle}
          </p>
        </Card>
      </Link>
    </div>
  );
}
