import React, { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination";
import { useSelector } from "react-redux";

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
    <div id="" className="flex flex-col h-full justify-center py-8 px-2">
      <div className="flex flex-col  h-full items-center justify-center ">
{        console.log(currentFixtures)}
        {currentFixtures?.length > 0
          ? currentFixtures?.map((fixture, i) => (
          
              <img
                key={i}
                src={fixture.image}
                alt="fixture futbol de salón"
                className="rounded-t-xl object-cover  w-full  max-w-xl "
              />
            ))
          : "componente de carga"}
      </div>
      <Pagination
        fixturesPerPage={fixturesPerPage}
        fixtures={fixtures?.length}
        pagination={pagination}
        currentPage={currentPage}
      />
    </div>
  );
}
