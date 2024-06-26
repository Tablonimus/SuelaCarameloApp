import React from "react";
import { useDispatch } from "react-redux";
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

export default function CategoryButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleClickA1(e) {
    e.preventDefault();
    const category = "A1";
    dispatch(getAllNotices(category));
    dispatch(changeCategory(category));
    dispatch(getAllTeams(category));
    dispatch(getAllMatches(category));
    navigate("/");
  }

  function handleClickFem(e) {
    e.preventDefault();
    const category = "FEM";
    dispatch(getAllNotices(category));
    dispatch(changeCategory(category));
    dispatch(getAllTeams(category));
    dispatch(getAllMatches(category));
    navigate("/");
  }
  function handleClickHonor(e) {
    e.preventDefault();
    const category = "DH";
    dispatch(getAllNotices(category));
    dispatch(changeCategory(category));
    dispatch(getAllTeams(category));
    dispatch(getAllMatches(category));
    navigate("/");
  }

  return (
    <div className="flex flex-row">
      <button
        onClick={(e) => handleClickA1(e)}
        className="hover:bg-white active:bg-white z-30 m-2 flex  bg-gray-500 flex-col w-16 h-16  drop-shadow-2xl rounded-full border border-slate-700 items-center justify-center text-white"
        value={"A1"}
      >
        <img src={negra} alt="" className="drop-shadow-2xl " />
      </button>

      <button
        onClick={(e) => handleClickFem(e)}
        className="hover:bg-white active:bg-white z-30 m-2 flex bg-gray-500 flex-col w-16 h-16  drop-shadow-2xl rounded-full border border-slate-700 items-center justify-center text-white"
        value={"FEM"}
      >
        <img src={naranja} alt="" className="drop-shadow-2xl" />
      </button>
      <button
        onClick={(e) => handleClickHonor(e)}
        className="hover:bg-white active:bg-white z-30 m-2 flex bg-gray-500 flex-col w-16 h-16  drop-shadow-2xl rounded-full border border-slate-700 items-center justify-center text-white"
        value={"DH"}
      >
        <img src={dh} alt="" className="drop-shadow-2xl p-[3px]" />
      </button>
    </div>
  );
}
