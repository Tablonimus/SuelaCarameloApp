import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createGeneralPosition,
  createPosition,
} from "../../redux/actions/index";
import axios from "axios";
import "react-quill/dist/quill.snow.css";

const defaultInput = {
  id: "",
};
export default function DataManagment() {
  const dispatch = useDispatch();

  const [input, setInput] = useState(defaultInput);

  function handleChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    if (input.id) {
      dispatch(deleteNotice(input.id))
        .then(() => {
          alert("Noticia eliminada correctamente");
          setInput(defaultInput);
          document.getElementById("positionsForm").reset();
        })
        .catch((err) => alert(err.message));
    } else {
      alert("FALTAN CAMPOS POR LLENAR");
    }
  }

  return (
    <section className="flex flex-col items-center justify-center text-black">
      <h2 className="text-2xl text-white font-bold">Gestionar datos</h2>

      <form
        id="positionsForm"
        onSubmit={(e) => onSubmitHandler(e)}
        className=" flex flex-col  items-center justify-center gap-3 bg-gray-500 rounded-lg p-5"
      >
        <h3 className="text-white font-semibold">Eliminar noticia</h3>

        <input
          type="text"
          name="id"
          className="rounded-lg"
          placeholder="Id de noticia..."
          onChange={(e) => handleChange(e)}
        />

        <hr className="border w-full" />
        <button className="shadow-lg text-white font-bold bg-green-600 rounded-lg w-full h-14 border border-white">
          CARGAR TABLA
        </button>
      </form>
    </section>
  );
}
