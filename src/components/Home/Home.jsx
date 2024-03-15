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
      <article className="my-8 px-5 w-full flex flex-col justify-center items-center text-center gap-2  md:w-4/5 lg:my-14 lg:w-[40%] lg:gap-6">
        <h1 className="text-2xl font-bold text-black lg:text-4xl">Lorem Impsum</h1>
        <p className="text-md text-gray-300 font-medium lg:text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, nobis.
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.

        </p>
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
