import { Carousel } from "flowbite-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearPage, getNoticeDetail } from "../../redux/actions";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";
import OtherNotices from "./OtherNotices";
import Sidebar from "../NavBar/Sidebar";
import FooterComp from "../FooterComp/FooterComp";

export default function NoticeDetail() {
  const dispatch = useDispatch();
  const params = useParams();
  const notice = useSelector((state) => state.noticeDetail);

  const parrafo = notice?.content?.split("//");

  useEffect(() => {
    dispatch(getNoticeDetail(params.id));
    return () => dispatch(clearPage());
  }, [params.id]);

  return (
    <>
      <Sidebar active={"noticias"} />
      <div
        id="noticia"
        className="pt-8 min-w-screen overflow-hidden flex flex-col items-center"
      >
        <div className=" w-11/12 lg:w-1/2 flex-flex-col items-center justify-center ml-[70px]">
          <h1 className="px-5 text-center font-bold text-zinc-900 text-3xl lg:text-4xl">
            {notice?.title}
          </h1>
          <h2 className="px-6 py-2 text-md text-center lg:text-lg text-gray-200 font-semibold">
            {notice?.subtitle}
          </h2>
        </div>

        <div className="w-11/12 lg:w-1/2 flex-flex-col items-center justify-center  ml-[70px]">
          {notice?.images?.length > 0 ? (
            <div className="flex flex-col opacity-100">
              {notice?.images[0] ? (
                <div className="opacity-100 h-96  xl:h-80 2xl:h-[530px] ">
                  <Carousel
                    leftControl={<></>}
                    rightControl={<></>}
                    draggable
                    slide
                    slideInterval={3000}
                  >
                    {notice?.images?.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt=""
                        className="opacity-100 rounded-lg object-cover"
                      />
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

        <div className="py-6 flex flex-col  w-11/12 lg:w-1/2 items-center justify-center m-2 rounded-lg bg-zinc-900 text-gray-200 shadow-xl ml-[70px]">
          <div className="w-3/4 flex flex-col items-center justify-center">
            {notice?.content?.length > 0 && notice?.content[0] !== "<" ? (
              parrafo?.map((parra) => (
                <p key={parra} className="px-5 py-2 text-md font-semibold">
                  {parra}
                </p>
              ))
            ) : (
              <p dangerouslySetInnerHTML={{ __html: notice?.content }} />
            )}
            <div
              id="author"
              className="flex items-center justify-start w-full gap-3 mt-5"
            >
              <div className="flex gap-3 items-center justify-start  bg-zinc-300 rounded-lg p-2">
                <img
                  src={notice?.author?.img}
                  alt="suela caramelo"
                  className="rounded-full w-16 h-16 object-cover"
                />
                <span className="font-bold italic underline text-black">
                  {notice?.author?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
        <FooterComp />
        {/*   <OtherNotices /> */}
      </div>
    </>
  );
}
