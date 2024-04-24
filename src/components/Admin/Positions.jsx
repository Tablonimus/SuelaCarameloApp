import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPosition } from "../../redux/actions/index";
import axios from "axios";
import "react-quill/dist/quill.snow.css";

const defaultInput = {
  image: null,
  category: "",
};
export default function Positions() {
  const dispatch = useDispatch();

  const [image, setImage] = useState(null);

  const [loadingImage, setLoadingImage] = useState(false);

  const [input, setInput] = useState(defaultInput);

  function handleChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  }
  async function handleImage(e) {
    const files = e.target.files;
    console.log(e.target.files);
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "suelApp");
    data.append("folder", "suelApp");
    setLoadingImage(true);
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/tablonimus/image/upload",
      data
    );

    setImage(res.data.secure_url);
    setInput({
      ...input,
      image: res.data.secure_url,
    });


    setLoadingImage(false);
  }

  function onSubmitHandler(e) {
    e.preventDefault();
     if (input.image && input.category) {
      dispatch(
        createPosition({
          image: input.image,
          category: input.category,
        })
      )
        .then(() => {
          alert("Tabla cargada correctamente");
          setImage(null);
          setInput(defaultInput);
          document.getElementById("positionsForm").reset();
        })
        .catch((err) => alert(err.message));
    } else {
      alert("FALTAN CAMPOS POR LLENAR");
    }
  }

  function handleDelete(event) {
    setInput({
      ...input,
      image: "",
    });
    setImage(null);
  }

  return (
    <section className="flex flex-col items-center justify-center text-black">
      <h2 className="text-2xl text-white font-bold">
        Cargar tabla de posiciones
      </h2>
      <form
        id="positionsForm"
        onSubmit={(e) => onSubmitHandler(e)}
        className=" flex flex-col  items-center justify-center gap-3 bg-gray-500 rounded-lg p-5"
      >
        <h3 className="text-white font-semibold">Categoría</h3>
        <select
          className="rounded-lg"
          name="category"
          onChange={(e) => handleChange(e)}
        >
          <option value="">Seleccione una categoria</option>
          <option value="A1">A1</option>
          <option value="F1">F1</option>
          <option value="DH">DH</option>
          <option value="TI">TI</option>
          <option value="TN">TN</option>
        </select>
        <hr className="border w-full" />

        <div className="flex flex-col items-center gap-5 ">
          <label className="font-light text-white text-xl">
            Imagen de la tabla
          </label>
          <input
            type="file"
            name="image"
            accept=".jpg, .png, .jpeg"
            onChange={(e) => handleImage(e)}
            className="rounded-lg flex-1 appearance-none w-full py-2 px-4 bg-amber-600  text-white placeholder-white text-sm focus:outline-none focus:border-transparent"
          />
          {loadingImage ? (
            <h3>Cargando imagen...</h3>
          ) : image ? (
            <div className="relative" key={image}>
              <button
                key={image}
                type="button"
                onClick={() => handleDelete(image)}
                className="absolute right-0 px-2 border-4 rounded-lg font-bold text-white bg-red-500"
              >
                X
              </button>
              <img src={image} alt="" width="300px" />
            </div>
          ) : (
            false
          )}
        </div>
        <hr className="border w-full" />
        <button className="shadow-lg text-white font-bold bg-green-600 rounded-lg w-full h-14 border border-white">
          CARGAR TABLA
        </button>
      </form>
      <h2 className="text-2xl text-white font-bold">Fecha Activa</h2>
    </section>
  );
}
