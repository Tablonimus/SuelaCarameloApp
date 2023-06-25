import React, { useEffect } from "react";

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
    state.allNotices
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
      <NavTwo />
      <section
        id="nSection"
        className="py-5 w-full h-full flex flex-col items-center justify-center gap-10"
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
