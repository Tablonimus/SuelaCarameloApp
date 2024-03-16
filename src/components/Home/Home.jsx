import React, { useEffect } from "react";
import noticesJson from "../../utils/data/notices.json";
import NavTwo from "../NavBar/NavTwo";
import { useDispatch, useSelector } from "react-redux";
import { getAllMatches, getAllNotices, getAllTeams } from "../../redux/actions";
import Notices from "../Notice/Notices";
import { useState } from "react";
import { Pagination } from "flowbite-react";
import NoticeLoaderComponent from "./NoticeLoaderComponent";

export default function Home() {
  const dispatch = useDispatch();
  const categoryState = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getAllNotices(categoryState));
  }, []);
  useEffect(() => {
    dispatch(getAllTeams(categoryState));
  }, []);
  useEffect(() => {
    dispatch(getAllMatches(categoryState));
  }, []);

  const allNotices = useSelector((state) =>
    noticesJson
      .sort((a, b) => {
        return a.id - b.id;
      })
      .reverse()
  );

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
    <div className="flex flex-col justify-between items-center">
        <article className="my-5 flex flex-col justify-center items-center text-center md:my-12 ">
        <h1 className="text-4xl font-extrabold text-zinc-800 leading-snug md:text-6xl">
          Suela Caramelo
          <br />
          <span className="px-1 italic text-black">Noticias</span>
        </h1>
        <p className="text-md font-semibold text-zinc-900 mt-7 md:text-lg">
          Lorem, ipsum dolor sit amet consectetur adipisicing. 
          <br />
          Lorem ipsum dolor sit amet.
        </p>
        <button
          className="bg-zinc-900 w-56 text-gray-300 py-2 rounded-md font-bold text-sm mt-4 hover:scale-105 hover:text-[#ED7020] duration-300 md:text-base md:mt-6"
        >
          Contact me
        </button> 
      </article>
      <section
        id="nSection"
        className="py-5 w-full h-full flex flex-wrap items-center justify-center gap-10"
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

      <section className="w-full m-4 pb-4 overflow-hidden">
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
    </div>
  );
}
