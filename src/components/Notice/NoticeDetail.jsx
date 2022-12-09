import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearPage, getNoticeDetail } from "../../redux/actions";
import Prueba from "../archivoprueba/Prueba";
import FooterComp from "../FooterComp/FooterComp";
import NavBar from "../NavBar/NavBar";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";

export default function NoticeDetail() {
  const dispatch = useDispatch();
  const params = useParams();
  const notice = useSelector((state) => state.noticeDetail);
  console.log(params);
  console.log(notice);
  useEffect(() => {
    dispatch(getNoticeDetail(params.id));
    return () => dispatch(clearPage());
  }, [dispatch, params.id]);

  return (
    <div className="bg-amber-600 h-screen flex flex-col justify-between items-center">
      <NavBar />

      <div className="mt-20 flex flex-col items-center justify-center">
        <h1 className="px-5 py-2 font-bold font-sans text-gray-800 text-3xl lg:text-4xl">
          {notice.title}
        </h1>
        <h2 className="px-5 py-2 text-xl lg:text-lg v font-semibold">
          {notice.subtitle}
        </h2>
      </div>

      <div className="lg:h-11/12 w-full lg:w-1/2">
        <img
          src={notice?.images?.length > 0 ? notice?.images[0] : false}
          alt=""
        />
      </div>
      <div className="w-11/12">
        <h5 className="p-5 text-gray-800">
    {notice.content}
        </h5>
      </div>
    
      <FooterComp />
    </div>
  );
}
