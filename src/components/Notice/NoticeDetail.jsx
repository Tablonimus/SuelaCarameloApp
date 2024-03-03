import { Carousel } from "flowbite-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearPage, getNoticeDetail } from "../../redux/actions";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";
import OtherNotices from "./OtherNotices";

export default function NoticeDetail() {
  const dispatch = useDispatch();
  const params = useParams();
  const notice = useSelector((state) => state.noticeDetail);

  const parrafo = notice?.content?.split("//");

  useEffect(() => {
    dispatch(getNoticeDetail(params.id));
    return () => dispatch(clearPage());
  }, [dispatch, params.id]);

  return (
    <div id="noticia" className="pt-32 min-w-screen flex flex-col items-center">
  
      <div className=" w-11/12 lg:w-1/2 flex-flex-col items-center justify-center">
        <h1 className="px-5 text-center font-bold text-black text-3xl lg:text-4xl">
          {notice?.title}
        </h1>
        <h2 className="px-5 py-2 text-md text-center lg:text-lg text-black font-semibold">
          {notice?.subtitle}
        </h2>
      </div>

      <div className="w-11/12 lg:w-1/2 flex-flex-col items-center justify-center ">
        {notice?.images?.length > 0 ? (
          <div className="flex flex-col opacity-100">
            {notice?.images[0] ? (
              <div className="opacity-100 h-96  xl:h-80 2xl:h-[530px]">
                <Carousel>
                  {notice?.images?.map((img) => (
                    <img src={img} alt="" className="opacity-100 rounded-lg" />
                  ))}
                </Carousel>
              </div>
            ) : (
              false
            )}
          </div>
        ) : (
          <YoutubeEmbed embedId={notice?.videos} />
        )}
      </div>
      <div className="flex flex-col  w-11/12 lg:w-1/2 items-center justify-center py-8 m-2 rounded-lg bg-gray-100 opacity-80 shadow-xl">
        <div className="w-11/12 flex flex-col items-center justify-center">
          {notice?.content?.length > 0 && notice?.content[0] !== "<" ? (
            parrafo?.map((parra) => (
              <p key={parra} className="px-5 py-2 text-md font-semibold">
                {parra}
              </p>
            ))
          ) : (
            <p dangerouslySetInnerHTML={{ __html: notice?.content }} />
          )}
        </div>
        <div id="content"></div>
      </div>

      <OtherNotices />

    
    </div>
  );
}
