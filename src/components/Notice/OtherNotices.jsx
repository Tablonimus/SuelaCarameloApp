import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import b1 from "../../assets/images/b1.png";

import electricidad from "../../assets/images/electricidad.gif";
import b2 from "../../assets/images/b2.png";
export default function OtherNotices() {
  const allNotices = useSelector((state) => state.copyAllNotices);
  console.log(allNotices);

  let randomBig = allNotices[Math.floor(Math.random() * allNotices.length)];

  let random1 = allNotices[Math.floor(Math.random() * allNotices.length)];
  let random2 = allNotices[Math.floor(Math.random() * allNotices.length)];
  let random3 = allNotices[Math.floor(Math.random() * allNotices.length)];

  console.log(randomBig);
  return (
    <div className="rounded-lg border-t border-white m-5 bg-black w-screen flex flex-col items-center justify-center">
      <span className="text-white">Mirá tambien:</span>{" "}
      <div className="grid grid-cols-2 gap-2 drop-shadow-2xl  border-t border-white bg-black w-screen">
        <div className="flex flex-col gap-3 items-center justify-around">
          <Link to={`/notices/${randomBig?.id}`}>
            <div className="flex flex-col items-center justify-center">
              {randomBig?.videos?.length ? (
                <video src={randomBig?.videos[0]} className="w-24 h-24" />
              ) : (
                <img src={randomBig?.images[0]} alt="" className="w-96 h-24" />
              )}

              <span className="text-md text-white">{randomBig?.title}</span>
            </div>
          </Link>

          <Link to={`/home`} className="">
            <img src={b1} alt="" />
          </Link>
        </div>

        <div className="flex flex-col gap-2 my-5 p-1">
          <Link to={`/notices/${random1?.id}`}>
            <div className=" flex flex-row items-center gap-3  border-y">
              <section className="w-1/3">
                {random1?.videos?.length ? (
                  <video src={random1?.videos[0]} className="w-24 h-14 object-cover" />
                ) : (
                  <img src={random1?.images[0]} alt="" className="w-24 h-14 object-cover" />
                )}
              </section>
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
            <img src={b2} alt="" className="" />
          </div>

          <Link to={`/notices/${random2?.id}`}>
            <div className=" flex flex-row items-center gap-3 border-y">
              <section className="w-1/3">
                {random2?.videos?.length ? (
                  <video src={random2?.videos[0]} className="object-cover w-24 h-14" />
                ) : (
                  <img src={random2?.images[0]} alt="" className="object-cover w-24 h-14" />
                )}
              </section>
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
            <div className=" flex flex-row items-center gap-3 border-y">
              <section className="w-1/3">
                {random3?.videos?.length ? (
                  <video src={random3?.videos[0]} className="object-cover w-24 h-14" />
                ) : (
                  <img src={random3?.images[0]} alt="" className="object-cover w-24 h-14" />
                )}
              </section>
              <section className="flex flex-col justify-center">
                <span className="text-[10px] text-white">
                  {random3?.title?.length > 20
                    ? `${random3?.title.slice(0, 20)}...`
                    : random3?.title}
                </span>
                <span className="text-[8px] text-white">
                  {random3?.subtitle?.length > 20
                    ? `${random3?.subtitle.slice(0, 20)}...`
                    : random3 ?.subtitle}
                </span>
              </section>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
