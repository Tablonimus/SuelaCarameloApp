import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNotice } from "../../redux/actions/index";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import youtube from "../../assets/images/youtube.png";

const defaultInput = {
  title: "",
  subtitle: "",
  images: [],
  videos: "",
  content: "",
  category: "",
  date: "",
};

export default function CreateNotice() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //----------------------NOTICE HANDLERS------------------------
  const [image, setImage] = useState(null);
  const [value, setValue] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [video, setVideo] = useState("");
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [input, setInput] = useState(defaultInput);

  function handleChange(e) {
    if (e.target.name === "videos") {
      setInput({
        ...input,
        [e.target.name]: e.target.value,
      });
    } else if (e.target.name === "teams") {
      setInput({
        ...input,
        [e.target.name]: e.target.value,
      });
    } else if (e.target.name) {
      setInput({
        ...input,
        [e.target.name]: e.target.value,
      });
    }
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

    setImage(res.data.secure_url);
    setInput({
      ...input,
      images: [...input.images, res.data.secure_url],
    });

    setLoadingImage(false);
  }
  async function handleVideo(e) {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "suelApp");
    data.append("folder", "suelApp");
    setLoadingVideo(true);
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/tablonimus/video/upload",
      data
    );

    setVideo(res.data.secure_url);
    setInput({
      ...input,
      videos: [...input.videos, res.data.secure_url],
    });

    setLoadingVideo(false);
  }
  function onSubmitHandler(e) {
    e.preventDefault();
    if (
      !input.category &&
      !input.content &&
      !input.date &&
      !input.title &&
      !input.subtitle
    ) {
      dispatch(
        createNotice({
          title: input.title,
          subtitle: input.subtitle,
          images: input.images,
          videos: input.videos,
          content: input.content,
          category: input.category,
          date: new Date(input.date),
        })
      ).then(() => {
        setImage(null);
        setValue("");
        setVideo("");
        setInput(defaultInput);
        window.location.reload();
      });
    } else {
      alert("Faltan datos importantes por completar.");
    }
  }
  function handleDelete(event) {
    setInput({
      ...input,
      images: input.images.filter((e) => e !== event),
    });
  }

  return (
    <section className="flex flex-col items-center justify-center text-black">
      {/* REDACTAR NOTA */}{" "}
      <h2 className="text-2xl text-white font-bold">Redactar Nota</h2>
      <form
        onSubmit={(e) => onSubmitHandler(e)}
        className=" flex flex-col  items-center justify-center gap-3 bg-gray-500 rounded-lg p-5"
      >
        <div className="flex gap-2">
          <div>
            <h3 className="text-white font-semibold">Categoría</h3>
            <select
              className="rounded-lg"
              name="category"
              onChange={(e) => handleChange(e)}
            >
              <option value="A1">Seleccione categoria</option>
              <option value="A1">A1</option>
              <option value="F1">F1</option>
              <option value="DH">DH</option>
              <option value="TI">TI</option>
              <option value="TN">TN</option>
            </select>
          </div>
          <div>
            <h3 className="text-white font-semibold">Fecha</h3>
            <input
              type="date"
              className="rounded-lg"
              name="date"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <hr className="border w-full" />
        <h3 className="text-white font-semibold">Título</h3>
        <input
          className="rounded-lg"
          type="text"
          name="title"
          placeholder="Titulo de la noticia"
          onChange={(e) => handleChange(e)}
        />
        <h3 className="text-white font-semibold">Bajada</h3>
        <textarea
          className="rounded-lg w-11/12"
          type="text"
          name="subtitle"
          placeholder="Bajada"
          onChange={(e) => handleChange(e)}
        />
        <h3 className="text-white font-semibold">Contenido de la noticia</h3>
        <ReactQuill
          className="bg-white w-11/12 "
          theme="snow"
          name="description"
          value={value}
          onChange={setValue}
        />
        {/* <h3 className="text-white font-semibold">Autor</h3>
        <input
          className="rounded-lg"
          type="text"
          name="author"
          placeholder="Ingrese el autor..."
          onChange={(e) => handleChange(e)}
        /> */}
        <hr className="border w-full" />
        <div className="flex flex-col items-center gap-5 ">
          <label className="font-light text-white text-xl">Imágenes</label>
          <input
            type="file"
            name="image"
            accept=".jpg, .png, .jpeg"
            onChange={(e) => handleImage(e)}
            className="rounded-lg flex-1 appearance-none w-full py-2 px-4 bg-amber-600  text-white placeholder-white text-sm focus:outline-none focus:border-transparent"
          />
          {loadingImage ? (
            <h3>Cargando imagen...</h3>
          ) : (
            input.images.map((el) => (
              <div key={el}>
                <button
                  key={el}
                  type="button"
                  onClick={() => handleDelete(el)}
                  className="px-2 border-4 rounded-lg font-bold text-yellow-900 border-yellow-900"
                >
                  x
                </button>
                <img src={el} alt="" width="300px" />
              </div>
            ))
          )}
          <hr className="border w-full" />
          <label className="font-light text-white text-xl">
            Link a video de la noticia
          </label>
          <section className="relative ">
            <img src={youtube} alt="youtubeLogo" className="absolute h-9  " />
            <input
              className="rounded-lg pl-24 h-9 border border-red-600"
              type="text"
              name="videos"
              id="videos"
              placeholder="ID YOUTUBE..."
              onChange={(e) => handleChange(e)}
            />
          </section>

          <label className="font-light text-white text-xl">ó</label>
          <label className="font-light text-white text-xl">Subir video</label>
          <input
            type="file"
            name="video"
            accept=".jpg, .png, .jpeg , .mp4"
            onChange={(e) => handleVideo(e)}
            className="rounded-lg flex-1 appearance-none w-full py-2 px-4 bg-amber-600  text-white placeholder-white text-sm focus:outline-none focus:border-transparent"
          />
          {loadingVideo ? (
            <h3 className="font-light text-white text-xl">Cargando video...</h3>
          ) : video ? (
            <video src={video} alt="" width="300px" />
          ) : (
            false
          )}
        </div>
        <hr className="border w-full" />
        <button className="shadow-lg text-white font-bold bg-green-600 rounded-lg w-full h-14 border border-white">
          SUBIR NOTICIA
        </button>
      </form>
    </section>
  );
}
