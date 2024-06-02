import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getAllNotices } from "../../redux/actions";
import Notices from "../Notice/Notices";
import { useState } from "react";
import { Pagination } from "flowbite-react";
import NoticeLoaderComponent from "./NoticeLoaderComponent";
import FooterComp from "../FooterComp/FooterComp";
import logoA1 from "../../assets/images/botones/A1.webp";
import logoF1 from "../../assets/images/botones/F1.png";
import logoDH from "../../assets/images/botones/DH.png";
import logoTI from "../../assets/images/botones/TI.webp";
import logoTN from "../../assets/images/botones/TN.webp";
import Sidebar from "../NavBar/Sidebar";

export default function Noticias() {
  const dispatch = useDispatch();
  const [noticeState, setNoticeState] = useState("Últimas Noticias");
  const [category, setCategory] = useState("");

  useEffect(() => {
    dispatch(getAllNotices(category));
  }, [category]);

  const allNotices = useSelector((state) => state.allNotices);

  const categoryHandler = (e) => {
    setCategory(e.target.name);

    if (e.target.name === "A1") setNoticeState("A1xSuela");
    if (e.target.name === "F1") setNoticeState("F1xSuela");
    if (e.target.name === "DH") setNoticeState("Liga de Honor");
    if (e.target.name === "TI") setNoticeState("Torneos Internacionales");
    if (e.target.name === "TN") setNoticeState("Torneos Nacionales");
  };

  //PAGINATION---
  const [currentPage, setCurrentPage] = useState(1);
  const [noticesPerPage, setNoticesPerPage] = useState(4);
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = allNotices?.slice(
    indexOfFirstNotice,
    indexOfLastNotice
  );

  const pagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const totalPages = Math.ceil(allNotices.length / noticesPerPage);

  return (
    <div className="pl-[70px]  flex flex-col w-full justify-between items-center">
      <Sidebar active={"noticias"} />
      <section className="w-full flex flex-col justify-center items-center bg-zinc-900 gap-2 py-4 lg:py-6">
        <h2 className="text-xl mb-2 italic lg:mb-4 lg:text-2xl  text-gray-200 font-bold">
          NOTICIAS
        </h2>
        <picture className="flex justify-center items-center overflow-hidden gap-6 lg:px-8 lg:gap-10">
          <img
            style={{}}
            src={logoA1}
            name="A1"
            className={`w-12 lg:w-16 ${
              noticeState === "A1xSuela" ? "scale-110" : null
            }  cursor-pointer hover:scale-105 duration-300 object-cover`}
            alt=""
            onClick={(e) => categoryHandler(e)}
          />
          <img
            src={logoF1}
            name="F1"
            className={`w-12 lg:w-16 ${
              noticeState === "F1xSuela" ? "scale-110" : null
            }  cursor-pointer hover:scale-105 duration-300 object-cover`}
            alt=""
            onClick={(e) => categoryHandler(e)}
          />
          <img
            src={logoDH}
            name="DH"
            className={`w-[45px] lg:w-14 ${
              noticeState === "Liga de Honor" ? "scale-110" : null
            }  cursor-pointer hover:scale-105 duration-300 object-cover`}
            alt=""
            onClick={(e) => categoryHandler(e)}
          />
          <img
            src={logoTN}
            name="TN"
            className={`w-[45px] lg:w-14 ${
              noticeState === "Torneos Nacionales" ? "scale-110" : null
            }  cursor-pointer hover:scale-105 duration-300 object-cover`}
            alt=""
            onClick={(e) => categoryHandler(e)}
          />
          <img
            src={logoTI}
            name="TI"
            className={`w-[45px] lg:w-14 ${
              noticeState === "Torneos Internacionales" ? "scale-110" : null
            }  cursor-pointer hover:scale-105 duration-300 object-cover`}
            alt=""
            onClick={(e) => categoryHandler(e)}
          />
        </picture>
      </section>
      <h2 className=" my-4 text-xl text-center lg:text-3xl font-bold text-zinc-800">
        {noticeState}
      </h2>
      <section
        id="nSection"
        className="py-3  w-full h-full flex flex-wrap items-center justify-center gap-8 "
      >
        {currentNotices?.length > 0 ? (
          currentNotices.map((notice, index) => (
            <Notices
              key={notice._id}
              id={notice._id}
              title={notice.title}
              subtitle={notice.subtitle}
              images={notice.images}
              videos={notice.videos}
              content={notice.content}
              category={notice.category}
              date={notice.date}
            />
          ))
        ) : (
          <NoticeLoaderComponent />
        )}
      </section>

      <section className="w-full m-4 py-6 overflow-hidden md:py-10">
        {/* PAGINADOR */}
        <div className="flex items-center justify-center text-center">
          <a href="#nSection">
            <Pagination
              currentPage={currentPage}
              layout="pagination"
              nextLabel="Siguiente"
              onPageChange={pagination}
              previousLabel="Atras"
              showIcons
              totalPages={totalPages}
            />
          </a>
        </div>
      </section>
      <FooterComp />
    </div>
  );
}
