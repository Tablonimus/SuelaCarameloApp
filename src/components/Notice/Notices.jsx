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
    <div className="max-w-sm my-3 ">
      <Link to={`/notices/${id}`}>
        <Card
          // imgAlt="image"
          imgSrc={images[0]}
          class="bg-[#E96F22] rounded-lg shadow-lg"
        >
         
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
