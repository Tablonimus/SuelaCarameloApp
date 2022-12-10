import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeCategory, getAllNotices } from "../../redux/actions";
import naranja from "../../assets/images/remeranaranja.png";
import negra from "../../assets/images/remeranegra.png";

export default function CategoryButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleClickA1(e) {
    e.preventDefault();
    const category = "A1";
    dispatch(getAllNotices(category));
  }

  function handleClickFem(e) {
    e.preventDefault();
    const category = "FEM";
    dispatch(getAllNotices(category));
  }

  return (
    <div className="flex flex-row">
      <button
        onClick={(e) => handleClickA1(e)}
        className="opacity-80 hover:bg-gray-500 active:bg-violet-700 z-30 m-2 flex bg-[#E96F22] flex-col w-16 h-16  drop-shadow-2xl rounded-full border border-slate-700 items-center justify-center text-white"
        value={"A1"}
      >
        <img src={negra} alt="" className="drop-shadow-2xl w-6" />
        <span className="font-bold text-[10px] font-serif">A1</span>
      </button>

      <button
        onClick={(e) => handleClickFem(e)}
        className="opacity-80 hover:bg-gray-500 active:bg-violet-700 z-30 m-2 flex bg-[#E96F22] flex-col w-16 h-16  drop-shadow-2xl rounded-full border border-slate-700 items-center justify-center text-white"
        value={"FEM"}
      >
        <img src={naranja} alt="" className="drop-shadow-2xl w-6" />
        <span className="font-bold text-[10px] font-serif">FEM</span>
      </button>
    </div>
  );
}
