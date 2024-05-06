import React, { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination";
import { useSelector } from "react-redux";
import NoticeLoaderComponent from "../Home/NoticeLoaderComponent";

export default function FixturePagination({
  fixtures,
  // activeNumber,
  setCurrentPageTitle,
}) {
  //PAGINATION---
  const activeNumber = useSelector((state) => state.activeNumber);
  const [currentPage, setCurrentPage] = useState(activeNumber);
  const [fixturesPerPage, setFixturesPerPage] = useState(1);

  const indexOfLastFixture = currentPage * fixturesPerPage;
  const indexOfFirstFixture = indexOfLastFixture - fixturesPerPage;
  const currentFixtures = fixtures?.slice(
    indexOfFirstFixture,
    indexOfLastFixture
  );

  useEffect(() => {
    setCurrentPage(activeNumber);
  }, [fixtures]);

  const pagination = (pageNumber) => {
    setCurrentPage(pageNumber);
    setCurrentPageTitle(pageNumber);
  };
  return (
    <div id="" className="flex flex-col w-full h-full justify-center ">
      {currentFixtures?.length > 0 ? (
        currentFixtures?.map((fixture, i) => (
          <div
            className="flex flex-col w-full h-full items-center justify-center "
            key={i}
          >
            <div className="w-full lg:w-1/3 bg-zinc-900">
              <h3 className=" text-center font-bold text-white self-center underline">
                Fechas
              </h3>

              <div className="overflow-x-auto   lg:w-full">
                <Pagination
                  fixturesPerPage={fixturesPerPage}
                  fixtures={fixtures?.length}
                  pagination={pagination}
                  currentPage={currentPage}
                />
              </div>
            </div>
            <img
              src={fixture.image}
              alt="fixture futbol de salón"
              className="rounded-t-xl object-cover lg:w-1/3 px-1"
            />
          </div>
          // <NoticeLoaderComponent />
        ))
      ) : (
        <NoticeLoaderComponent />
      )}
    </div>
  );
}
