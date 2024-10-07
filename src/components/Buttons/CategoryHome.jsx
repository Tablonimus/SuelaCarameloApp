import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  changeCategory,
  getAllMatches,
  getAllNotices,
  getAllTeams,
} from "../../redux/actions";
import naranja from "../../assets/images/f1.png";
import negra from "../../assets/images/a1.png";
import dh from "../../assets/images/dh.png";

export default function CategoryHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categoryState = useSelector((state) => state.category);


  function handleClickA1(e) {
    e.preventDefault();
    const category = "A1";
    dispatch(getAllNotices(category));
    dispatch(changeCategory(category));
    dispatch(getAllTeams(category));
    dispatch(getAllMatches(category));
  }

  function handleClickFem(e) {
    e.preventDefault();
    const category = "FEM";
    dispatch(getAllNotices(category));
    dispatch(changeCategory(category));
    dispatch(getAllTeams(category));
    dispatch(getAllMatches(category));
  }
  function handleClickHonor(e) {
    e.preventDefault();
    const category = "DH";
    dispatch(getAllNotices(category));
    dispatch(changeCategory(category));
    dispatch(getAllTeams(category));
    dispatch(getAllMatches(category));
  }

  return (
    <div className="flex flex-row">
      <button
        onClick={(e) => handleClickA1(e)}
        className={
          categoryState === "A1"
            ? "opacity-80  m-2 flex bg-[#E96F22] flex-row w-16 h-16 gap-3  drop-shadow-2xl rounded-full border border-slate-700 items-center justify-center text-black ring ring-yellow-200"
            : "opacity-80  m-2 flex bg-gray-200 flex-row w-16 h-16 gap-3  drop-shadow-2xl rounded-full border border-slate-700 items-center justify-center text-black"
        }
        value={"A1"}
      >
        <img src={negra} alt="" className="drop-shadow-2xl w-14" />
      </button>

      <button
        onClick={(e) => handleClickFem(e)}
        className={
          categoryState === "FEM"
            ? "opacity-80  m-2 flex bg-[#E96F22] flex-row w-16 h-16 gap-3  drop-shadow-2xl rounded-full border border-slate-700 items-center justify-center text-black ring ring-yellow-200"
            : "opacity-80  m-2 flex bg-gray-200 flex-row w-16 h-16 gap-3  drop-shadow-2xl rounded-full border border-slate-700 items-center justify-center text-black"
        }
        value={"FEM"}
      >
        <img src={naranja} alt="" className="drop-shadow-2xl w-14" />
      </button>
      <button
        onClick={(e) => handleClickHonor(e)}
        className={
          categoryState === "DH"
            ? "opacity-80  m-2 flex bg-[#E96F22] flex-row w-16 h-16 gap-3  drop-shadow-2xl rounded-full border border-slate-700 items-center justify-center text-black ring ring-yellow-200"
            : "opacity-80  m-2 flex bg-gray-200 flex-row w-16 h-16 gap-3  drop-shadow-2xl rounded-full border border-slate-700 items-center justify-center text-black"
        }
        value={"DH"}
      >
        <img src={dh} alt="" className="drop-shadow-2xl w-14" />
      </button>
    </div>
  );
}
