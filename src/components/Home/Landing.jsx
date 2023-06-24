import React from "react";
import landing1 from "../../assets/videos/landing1.mp4";
import landingImg from "../../assets/images/landing.jpg"
import CategoryButton from "../Buttons/CategoryButton";
import "../../App.css";
export default function Landing() {
  return (
    <div id="landing" className="w-full h-screen ">
      <div className="relative flex flex-col items-center ">
        <section className="absolute  top-3/4">
          <CategoryButton />
        </section>

        {/* <video
          src={landing1}
          autoPlay={true}
          muted={true}
          loop={true}
          className="h-screen w-screen"
          poster=""
        /> */}
        <img src={landingImg} className="h-screen object-cover w-screen"/>
      </div>
    </div>
  );
}
