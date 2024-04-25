import React from "react";

// import lata from "../../assets/images/lata.png";

export default function Pagination({
  fixturesPerPage,
  fixtures,
  pagination,
  currentPage,
}) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(fixtures / fixturesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="p-2 flex flex-col gap-2 w-full bg-zinc-900 ">
      <h3 className="font-bold text-white self-center underline">Fechas</h3>
      <div className="overflow-auto flex justify-center">
        {pageNumbers?.map((number) => (
          <button
            key={number}
            className={
              currentPage === number
                ? "w-10 h-10 m-1 rounded-full bg-[#F17023] border-2 border-white hover:text-orange-400"
                : "w-10 h-10 m-1 rounded-full bg-zinc-700/60 hover:text-orange-400"
            }
            onClick={() => pagination(number)}
          >
            <div className="">
              <span className="text-white font-bold">
                {number.toString().length === 1 ? `${number}` : number}{" "}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
