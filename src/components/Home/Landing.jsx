import React from "react";
import landing1 from "../../assets/videos/landing1.mp4";
import naranja from "../../assets/images/remeranaranja.png";
import negra from "../../assets/images/remeranegra.png";

import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeCategory } from "../../redux/actions";

export default function Landing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleClickA1(e) {
    e.preventDefault();
    const category = "A1";
    dispatch(changeCategory(category)).then(navigate("/home"));
  }

  function handleClickFem(e) {
    e.preventDefault();
    const category = "FEM";
    dispatch(changeCategory(category)).then(navigate("/home"));
  }

  return (
    <div className="w-full bg-gradient-to-t from-black to-[#E96F22] h-screen ">
      <div className="relative flex flex-col items-center">
        <div className="absolute top-3/4 flex flex-row">
          <button
            onClick={(e) => handleClickA1(e)}
            className="opacity-80 hover:bg-gray-500 active:bg-violet-700 z-30 m-2 flex bg-[#E96F22] flex-col w-16 h-16  drop-shadow-2xl rounded-full border border-slate-700 items-center justify-center text-white"
            value={"A1"}
          >
            <img src={negra} alt="" className="drop-shadow-2xl w-6" />
            <span className="font-bold text-[10px] font-serif">A1</span>
          </button>

          <button
            onClick={(e) => handleClickFem(e)}
            className="opacity-80 hover:bg-gray-500 active:bg-violet-700 z-30 m-2 flex bg-[#E96F22] flex-col w-16 h-16  drop-shadow-2xl rounded-full border border-slate-700 items-center justify-center text-white"
            value={"FEM"}
          >
            <img src={naranja} alt="" className="drop-shadow-2xl w-6" />
            <span className="font-bold text-[10px] font-serif">FEM</span>
          </button>
        </div>
        <video
          src={landing1}
          autoPlay={true}
          muted={true}
          loop={true}
          className="h-screen w-screen"
          poster=""
        ></video>
      </div>
    </div>
  );
}
