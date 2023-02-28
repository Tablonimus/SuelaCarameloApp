import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import zulueta from "../../assets/images/zulueta.gif";
import hache from "../../assets/images/hache.gif";
import electricidad from "../../assets/images/electricidad.gif";
import sqadra from "../../assets/images/sqadra.gif";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";
import { getAllNotices } from "../../redux/actions";

export default function OtherNotices() {
  const dispatch = useDispatch();
  const allNotices = useSelector((state) => state.allNotices);
  
  useEffect(()=>{
    dispatch(getAllNotices())
  })
  let randomBig = allNotices[allNotices.length-1];

  let random1 = allNotices[allNotices.length-2];
  let random2 = allNotices[allNotices.length-3];
  let random3 = allNotices[allNotices.length-4];

  // let randomBig = allNotices[Math.floor(Math.random() * allNotices.length)];

  // let random1 = allNotices[Math.floor(Math.random() * allNotices.length)];
  // let random2 = allNotices[Math.floor(Math.random() * allNotices.length)];
  // let random3 = allNotices[Math.floor(Math.random() * allNotices.length)];

  return (
    <div className=" w-11/12 lg:w-1/2  rounded-lg border-t border-white drop-shadow-2xl  bg-black flex flex-col items-center justify-center my-5 p-2">
      <span className="text-white text-md lg:text-3xl lg:p-2">
        Mirá tambien:
      </span>
      <div className="w-full rounded-lg rounded-t-none grid grid-cols-2 drop-shadow-2xl  border-t border-[#E96F22] bg-black gap-5 py-5">
        <div className="flex flex-col gap-3 items-center justify-between">
          <Link to={`/notices/${randomBig?.id}`}>
            <div className="flex flex-col items-center border-y border-[#E96F22] ">
              {randomBig?.images?.length ? (
                <img
                  src={randomBig?.images[0]}
                  alt=""
                  className="object-cover w-96 h-32 lg:w-96 lg:h-56"
                />
              ) : (
                <section className="overflow-hidden h-32">

                  <YoutubeEmbed
                    embedId={randomBig?.videos[0] || randomBig?.videos}
                  />

                </section>
              )}

              <span className="text-md text-white px-2">
                {randomBig?.title}
              </span>
              <span className="text-sm text-white px-2">
                {" "}
                {randomBig?.subtitle?.length > 20
                  ? `${randomBig?.subtitle.slice(0, 45)}...`
                  : randomBig?.subtitle}
              </span>
            </div>
          </Link>

          <a
            href={
              "https://www.google.com/maps/place/Granja+Zulueta/@-32.9088319,-68.8389289,15z/data=!4m5!3m4!1s0x0:0x7bc9f6cc51b1d57e!8m2!3d-32.9087853!4d-68.8389242"
            }
          >
            <img src={zulueta} className="lg:w-80" />
          </a>

          <a href="https://www.instagram.com/squadraindumentaria/?hl=es">
            <img src={sqadra} alt=""  className="lg:w-80 rounded-lg" />
          </a>
        </div>

        <div className="flex flex-col gap-3 items-center justify-between">
          <Link to={`/notices/${random1?.id}`}>
            <div className="flex flex-row items-center gap-3  border-y border-[#E96F22]">
              {random1?.images?.length ? (
                <section className="overflow-hidden w-1/3 h-14  ">
                  <img
                    src={random1?.images[0]}
                    alt=""
                    className="object-cover w-24 h-14 lg:w-56 lg:h-32"
                  />
                </section>
              ) : (
                <section className="overflow-hidden w-1/3 h-14  ">
                  <YoutubeEmbed
                    embedId={random1?.videos[0] || random1?.videos}
                  />
                </section>
              )}
              <section className="flex flex-col justify-center">
                <span className="text-[10px] text-white">
                  {random1?.title?.length > 20
                    ? `${random1?.title.slice(0, 20)}...`
                    : random1?.title}
                </span>
                <span className="text-[8px] text-white">
                  {random1?.subtitle?.length > 20
                    ? `${random1?.subtitle.slice(0, 20)}...`
                    : random1?.subtitle}
                </span>
              </section>
            </div>
          </Link>

          <div className="flex flex-row items-center justify-center">
            <a href="https://www.google.com/maps/place/Electricidad+San+Luis/@-32.8856233,-68.8357053,16.5z/data=!4m5!3m4!1s0x0:0xe1d67ca3ac640c37!8m2!3d-32.8845727!4d-68.8358074">
              <img src={electricidad} alt=""  className="lg:w-80"/>
            </a>
          </div>

          <Link to={`/notices/${random2?.id}`}>
            <div className=" flex flex-row items-center gap-3 border-y border-[#E96F22]">
              {random2?.images?.length ? (
                <section className="overflow-hidden w-1/3 h-14  ">
                  <img
                    src={random2?.images[0]}
                    alt=""
                    className="object-cover w-24 h-14 lg:w-56 lg:h-32"
                  />
                </section>
              ) : (
                <section className="overflow-hidden w-1/3 h-14  ">
                  <YoutubeEmbed
                    embedId={random2?.videos[0] || random2?.videos}
                  />
                </section>
              )}
              <section className="flex flex-col justify-center">
                <span className="text-[10px] text-white">
                  {random2?.title?.length > 20
                    ? `${random2?.title.slice(0, 20)}...`
                    : random2?.title}
                </span>
                <span className="text-[8px] text-white">
                  {random2?.subtitle?.length > 20
                    ? `${random2?.subtitle.slice(0, 20)}...`
                    : random2?.subtitle}
                </span>
              </section>
            </div>
          </Link>

          <Link to={`/notices/${random3?.id}`}>
            <div className=" flex flex-row items-center gap-3 border-y border-[#E96F22]">
            
              {random3?.images?.length ? (
                <section className="overflow-hidden w-1/3 h-14  ">
                  <img
                    src={random3?.images[0]}
                    alt=""
                    className="object-cover w-24 h-14 lg:w-56 lg:h-32"
                  />
                </section>
              ) : (
                <section className="overflow-hidden w-1/3 h-14  ">
                  <YoutubeEmbed
                    embedId={random3?.videos[0] || random3?.videos}
                  />
                </section>
              )}
          
              <section className="flex flex-col justify-center">
                <span className="text-[10px] text-white">
                  {random3?.title?.length > 20
                    ? `${random3?.title.slice(0, 20)}...`
                    : random3?.title}
                </span>
                <span className="text-[8px] text-white">
                  {random3?.subtitle?.length > 20
                    ? `${random3?.subtitle.slice(0, 20)}...`
                    : random3?.subtitle}
                </span>
              </section>
            </div>
          </Link>
          <a href="https://www.instagram.com/hache_market/">
            <img src={hache} alt=""  className="lg:w-80" />
          </a>
        </div>
      </div>
    </div>
  );
}
