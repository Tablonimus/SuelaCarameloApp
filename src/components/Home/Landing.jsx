import React from "react";
import landing1 from "../../assets/videos/landing1.mp4";

import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeCategory } from "../../redux/actions";
import CategoryButton from "../Buttons/CategoryButton";

export default function Landing() {
  return (
    <div className="w-full bg-gradient-to-t from-black to-[#E96F22] h-screen ">
      <div className="relative flex flex-col items-center">
        <section className="absolute top-3/4">
          <CategoryButton />
        </section>
        <audio src=""></audio>
        <video
          src={landing1}
          autoPlay={true}
          muted={true}
          loop={true}
          className="h-screen w-screen"
          
          poster=""
        />
      </div>
    </div>
  );
}
