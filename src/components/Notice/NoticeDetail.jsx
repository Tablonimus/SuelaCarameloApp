import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearPage, getNoticeDetail } from "../../redux/actions";

import FooterComp from "../FooterComp/FooterComp";
import NavBar from "../NavBar/NavBar";
import OtherNotices from "./OtherNotices";


export default function NoticeDetail() {
  const dispatch = useDispatch();
  const params = useParams();
  const notice = useSelector((state) => state.noticeDetail);
  
  useEffect(() => {
    dispatch(getNoticeDetail(params.id));
    return () => dispatch(clearPage());
  }, [dispatch, params.id]);

  return (
    <div className="bg-[#E96F22] flex flex-col justify-between items-center">
      <NavBar />

      <div className="mt-20 flex flex-col items-center justify-center">
        <h1 className="px-5 font-sans py-2 font-bold font-sans text-black text-3xl lg:text-4xl">
          {notice?.title}
        </h1>
        <h2 className="px-5 py-2 text-md lg:text-lg v font-semibold">
          {notice?.subtitle}
        </h2>
      </div>

      <div className="lg:h-11/12 w-full lg:w-1/2 font-sans">
        <img
          src={notice?.images?.length > 0 ? notice?.images[0] : false}
          alt=""
        />
      </div>
      <div className="w-11/12">
        <h5 className="p-5 text-black font-sans">{notice?.content}</h5>
      </div>


    <OtherNotices/>

      <FooterComp />
    </div>
  );
}
