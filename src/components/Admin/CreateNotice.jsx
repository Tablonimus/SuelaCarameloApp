import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createNotice, postImage } from "../../redux/actions/index";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateNotice() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [input, setInput] = useState({
    title: "",
    subtitle: "",
    images: [],
    content: "",
    category: "",
  });

  function onSubmitHandler(e) {
    e.preventDefault();
    dispatch(createNotice(input)).then(
      navigate("/"),
      alert("Noticia Creada Correctamente")
    );
  }

  console.log(input);
  function handleChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    // setErrors(
    //   validate({
    //     ...input,
    //     [e.target.name]: e.target.value,
    //   })
    // );
  }

  async function handleImage(e) {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "suelApp");
    data.append("folder", "suelApp");
    setLoadingImage(true);
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/tablonimus/image/upload",
      data
    );
    console.log(res);
    setImage(res.data.secure_url);
    setInput({
      ...input,
      images: [res.data.secure_url],
    });

    setLoadingImage(false);
  }
  return (
    <div className="flex items-center justify-center bg-black h-screen">
      <form
        onSubmit={(e) => onSubmitHandler(e)}
        className="flex flex-col w-96 items-center justify-center gap-3 bg-gray-500 rounded-lg p-5"
      >
        <input
          className="rounded-lg"
          type="text"
          name="title"
          placeholder="Titulo de la noticia"
          onChange={(e) => handleChange(e)}
        />
        <input
          className="rounded-lg"
          type="text"
          name="subtitle"
          placeholder="Subtitulo de la noticia"
          onChange={(e) => handleChange(e)}
        />
        <textarea
          className="rounded-lg"
          name="content"
          placeholder="Contenido de la noticia"
          height={50}
          onChange={(e) => handleChange(e)}
        />
        <select
          className="rounded-lg"
          name="category"
          onChange={(e) => handleChange(e)}
        >
          <option value="A1">Seleccione una categoria</option>
          <option value="A1">A1</option>
          <option value="FEM">FEM</option>
        </select>
        <div className="flex flex-col items-center">
          <label className="font-light text-white text-xl">
            Imagen de la noticia
          </label>
          {/* <input
            type="file"
            name="image"
            onChange={(e) => handleImage(e)}
            className="rounded-lg flex-1 appearance-none w-full py-2 px-4 bg-amber-600  text-white placeholder-white text-sm focus:outline-none focus:border-transparent"
          /> */}
          <input
            type="file"
            name="image"
            accept=".jpg, .png, .jpeg"
            onChange={(e) => handleImage(e)}
            className="rounded-lg flex-1 appearance-none w-full py-2 px-4 bg-amber-600  text-white placeholder-white text-sm focus:outline-none focus:border-transparent"
          />
          {loadingImage ? (
            <h3 className="font-light text-white text-xl">
              Cargando imagen...
            </h3>
          ) : (
            <img src={image} alt="" width="300px" />
          )}
          {/* {errors.image && (
            <p className="font-bold text-red-700 text-center p-2">
              {errors.image}
            </p>
          )} */}
        </div>
        <button className="shadow-lg text-white font-bold bg-green-600 rounded-lg w-24 h-14 border border-white">
          SUBIR
        </button>
      </form>
    </div>
  );
}
