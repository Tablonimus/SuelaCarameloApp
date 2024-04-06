import React, { useEffect } from "react";
import noticesJson from "../../utils/data/notices.json";
import { useDispatch, useSelector } from "react-redux";
import { getAllMatches, getAllNotices, getAllTeams } from "../../redux/actions";
import Notices from "../Notice/Notices";
import { useState } from "react";
import { Pagination } from "flowbite-react";
import NoticeLoaderComponent from "./NoticeLoaderComponent";
import FooterComp from "../FooterComp/FooterComp";
import logoA1 from "../../assets/images/botones/A1.webp";
import logoF1 from "../../assets/images/botones/F1.png";
import logoTI from "../../assets/images/botones/TI.webp";
import logoTN from "../../assets/images/botones/TN.webp";

export default function Noticias() {
  const dispatch = useDispatch();
  const [noticeState, setNoticeState] = useState("A1xSuela");
  const jsonNotices = useSelector((state) =>
    noticesJson
      .sort((a, b) => {
        return a.id - b.id;
      })
      .reverse()
  );

  const [allNotices, setAllNotices] = useState(jsonNotices);

  const categoryHandler = (e) => {
    let notices = jsonNotices.filter(
      (notice) => e.target.name === notice.category
    );

    setAllNotices(notices);
    if (e.target.value === "A1") setNoticeState("A1xSuela");
    if (e.target.value === "FEM") setNoticeState("F1xSuela");
    if (e.target.value === "TI") setNoticeState("Torneos Internacionales");
    if (e.target.value === "TN") setNoticeState("Torneos Nacionales");
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
    <div className="pl-[70px] flex flex-col w-full lg:h-screen justify-between items-center">
      <section className="w-full flex flex-col justify-center items-center bg-zinc-900 gap-2 py-6">
        <h2 className="text-2xl text-white font-bold">NOTICIAS</h2>
        <picture className="flex justify-center items-center overflow-hidden gap-3 lg:px-8 lg:gap-8">
          <img
            src={logoA1}
            name="A1"
            className="w-16 h-16  cursor-pointer hover:scale-105 duration-300 object-cover"
            alt=""
            onClick={(e) => categoryHandler(e)}
          />
          <img
            src={logoF1}
            name="FEM"
            className="w-16 h-16 cursor-pointer hover:scale-110 duration-300 object-cover"
            alt=""
            onClick={(e) => categoryHandler(e)}
          />
          <img
            src={logoTN}
            name="TN"
            className="w-14 h-14 cursor-pointer hover:scale-110 duration-300 object-cover"
            alt=""
            onClick={(e) => categoryHandler(e)}
          />
          <img
            src={logoTI}
            name="TI"
            className="w-14 h-14 cursor-pointer hover:scale-110 duration-300 object-cover"
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
          currentNotices.map((notice) => (
            <Notices
              key={notice.id}
              id={notice.id}
              title={notice.title}
              subtitle={notice.subtitle}
              images={notice.images}
              videos={notice.videos}
              content={notice.content}
              category={notice.category}
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
