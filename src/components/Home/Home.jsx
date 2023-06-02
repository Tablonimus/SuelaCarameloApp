import React, { useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import { Spinner } from "flowbite-react";
import FooterComp from "../FooterComp/FooterComp.jsx";
import NavTwo from "../NavBar/NavTwo";
import { useDispatch, useSelector } from "react-redux";
import { getAllMatches, getAllNotices, getAllTeams } from "../../redux/actions";
import Notices from "../Notice/Notices";

export default function Home() {
  const dispatch = useDispatch();
  const categoryState = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getAllNotices(categoryState));
    dispatch(getAllTeams(categoryState));
    dispatch(getAllMatches(categoryState));
  }, []);

  const allNotices = useSelector((state) =>
    state.allNotices
      .sort((a, b) => {
        return a.id - b.id;
      })
      .reverse()
  );

  return (
    <div className="flex flex-col justify-between items-center">
      <NavBar />
      <NavTwo />
      <section className="py-5 w-full h-full flex flex-col items-center justify-center gap-10">
        {allNotices?.length > 0 ? (
          allNotices.map((notice) => (
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
          <div className="flex flex-col">
            <div className=" max-w-sm  bg-black bg-opacity-80 p-1 rounded-lg shadow-inner shadow-white  w-11/12">
              <div className="animate-pulse h-64 object-cover  bg-gray-600 rounded-t-lg ">
                {" "}
              </div>

              <div className="animate-pulse flex flex-col px-5 pt-3 pb-5 gap-2">
                <div className="rounded-full w-1/2 h-6  text-2xl font-bold tracking-tight bg-gray-600"></div>
                <div className="rounded-full w-11/12 h-5 font-normal lg:text-lg bg-gray-600"></div>
              </div>
            </div>
          </div>
        )}
      </section>

      <FooterComp />
    </div>
  );
}
