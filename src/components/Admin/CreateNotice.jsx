import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createMatch,
  createNotice,
  createTeam,
  postImage,
} from "../../redux/actions/index";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import { Accordion } from "flowbite-react";

export default function CreateNotice() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const teams = useSelector((state) => state.allTeams);

  //---------------MATCH HANDLERS---------------------------------
  const [match, setMatch] = useState({
    place: "",
    date: "",
    time: "",
    local: "",
    visitor: "",
    category: "",
  });
  function handleMatch(e) {
    setMatch({
      ...match,
      [e.target.name]: e.target.value,
    });
  }

  function onSubmitMatch(e) {
    e.preventDefault();
    dispatch(createMatch(match)).then(
      navigate("/home"),
      alert("Partido Creado Correctamente")
    );
  }
  //---------------TEAM HANDLERS-------------------------------
  const [logo, setLogo] = useState("");
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [team, setTeam] = useState({
    name: "",
    short_name: "",
    logo: "",
    place: "",
    category: "",
  });
  function handleTeam(e) {
    setTeam({
      ...team,
      [e.target.name]: e.target.value,
    });
  }
  async function handleLogo(e) {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "suelApp");
    data.append("folder", "suelApp");
    setLoadingLogo(true);
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/tablonimus/image/upload",
      data
    );

    setLogo(res.data.secure_url);
    setTeam({
      ...team,
      logo: res.data.secure_url,
    });

    setLoadingLogo(false);
  }
  function onSubmitTeam(e) {
    e.preventDefault();
    dispatch(createTeam(team)).then(
      navigate("/home"),
      alert("Equipo Creado Correctamente")
    );
  }
  //----------------------NOTICE HANDLERS------------------------
  const [image, setImage] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [video, setVideo] = useState("");
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [input, setInput] = useState({
    title: "",
    subtitle: "",
    images: [],
    videos: [],
    content: "",
    category: "",
    team1: "",
    team2: "",
  });

  function handleChange(e) {
    if (e.target.name === "videos") {
      setInput({
        ...input,
        [e.target.name]: [e.target.value],
      });
    }

    if (e.target.name === "teams") {
      setInput({
        ...input,
        [e.target.name]: [e.target.value],
      });
    } else {
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
    console.log(res);
    setImage(res.data.secure_url);
    setInput({
      ...input,
      images: [res.data.secure_url],
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
    console.log(res);
    setVideo(res.data.secure_url);
    setInput({
      ...input,
      videos: [res.data.secure_url],
    });

    setLoadingVideo(false);
  }
  function onSubmitHandler(e) {
    e.preventDefault();
    dispatch(createNotice(input)).then(
      navigate("/home"),
      alert("Noticia Creada Correctamente")
    );
  }

  return (
    <div className="flex flex-col items-center justify-between bg-black ">
      <NavBar />
      <section className="mt-20 flex items-center justify-center w-screen">
        <Accordion alwaysOpen={true} className="w-96">
          <Accordion.Panel>
            <Accordion.Title>
              <span className="text-white">Generar Partido</span>
            </Accordion.Title>
            <Accordion.Content className="bg-amber-600">
              <form
                onSubmit={(e) => onSubmitMatch(e)}
                className="flex flex-col gap-3 items-center justify-center bg-gray-500 rounded-lg p-5"
              >
                <section className="flex  flex-col items-center ">
                  <label htmlFor="category" className="text-white">
                    Categoría
                  </label>
                  <select
                    className="rounded-lg"
                    name="category"
                    onChange={(e) => handleMatch(e)}
                  >
                    <option value="A1">Seleccione una categoria</option>
                    <option value="A1">A1</option>
                    <option value="FEM">FEM</option>
                  </select>
                </section>
                <section className="flex gap-3">
                  <section className="flex flex-col items-center">
                    <label htmlFor="local" className="text-white">
                      Local
                    </label>
                    <input
                      type="text"
                      name="local"
                      id="local"
                      placeholder="Local"
                      className="rounded-lg w-24"
                      onChange={(e) => handleMatch(e)}
                    />
                  </section>
                  <span className="text-white">vs</span>
                  <section className="flex flex-col items-center">
                    <label htmlFor="visitor" className="text-white">
                      Visitante
                    </label>
                    <input
                      type="text"
                      name="visitor"
                      id="visitor"
                      placeholder="Visitante"
                      className="rounded-lg w-24"
                      onChange={(e) => handleMatch(e)}
                    />
                  </section>
                </section>

                <section className="flex flex-col items-center">
                  <label htmlFor="place" className="text-white">
                    Lugar
                  </label>
                  <input
                    type="text"
                    name="place"
                    id="place"
                    placeholder="Lugar"
                    className="rounded-lg w-56"
                    onChange={(e) => handleMatch(e)}
                  />
                </section>

                <section className="flex flex-col items-center">
                  <label htmlFor="date" className="text-white">
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    className="rounded-lg"
                    onChange={(e) => handleMatch(e)}
                  />
                </section>
                <section className="flex flex-col items-center">
                  <label htmlFor="date" className="text-white">
                    Hora
                  </label>
                  <input
                    type="time"
                    name="time"
                    id="time"
                    className="rounded-lg"
                    onChange={(e) => handleMatch(e)}
                  />
                </section>
                <button className="shadow-lg text-white font-bold bg-green-600 rounded-lg w-24 h-14 border border-white">
                  CREAR PARTIDO
                </button>
              </form>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>
              {" "}
              <span className="text-white">Crear Equipo</span>
            </Accordion.Title>
            <Accordion.Content>
              <form
                onSubmit={(e) => onSubmitTeam(e)}
                className="flex flex-col gap-3 items-center justify-center bg-gray-500 rounded-lg p-5"
              >
                <section className="flex flex-col items-center">
                  <label htmlFor="name" className="text-white">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Nombre del equipo"
                    className="rounded-lg w-24"
                    onChange={(e) => handleTeam(e)}
                  />
                </section>
                <section className="flex flex-col items-center">
                  <label htmlFor="short_name" className="text-white">
                    Siglas
                  </label>
                  <input
                    type="text"
                    name="short_name"
                    id="short_name"
                    placeholder="IND A..."
                    className="rounded-lg"
                    onChange={(e) => handleTeam(e)}
                  />
                </section>
                <section className="flex  flex-col items-center ">
                  <label htmlFor="category" className="text-white">
                    Categoría
                  </label>
                  <select
                    className="rounded-lg"
                    name="category"
                    onChange={(e) => handleTeam(e)}
                  >
                    <option value="A1">Seleccione una categoria</option>
                    <option value="A1">A1</option>
                    <option value="FEM">FEM</option>
                  </select>
                </section>
                <section className="flex gap-6 items-center justify-center">
                  <section className="flex flex-col items-center">
                    <label htmlFor="place" className="text-white">
                      Lugar del equipo
                    </label>
                    <input
                      type="text"
                      name="place"
                      id="place"
                      placeholder="Lugar de origen"
                      className="rounded-lg"
                      onChange={(e) => handleTeam(e)}
                    />
                  </section>
                </section>
                <section className="flex flex-col gap-6 items-center justify-center">
                  <label className="font-light text-white text-xl">Logo</label>
                  <input
                    type="file"
                    name="image"
                    accept=".jpg, .png, .jpeg"
                    onChange={(e) => handleLogo(e)}
                    className="rounded-lg flex-1 appearance-none w-full py-2 px-4 bg-amber-600  text-white placeholder-white text-sm focus:outline-none focus:border-transparent"
                  />
                  {loadingLogo ? (
                    <h3 className="font-light text-white text-xl">
                      Cargando logo...
                    </h3>
                  ) : (
                    <img src={logo} alt="" width="300px" />
                  )}
                </section>
                <button className="shadow-lg text-white font-bold bg-green-600 rounded-lg w-24 h-14 border border-white">
                  CREAR EQUIPO
                </button>
              </form>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>
              {" "}
              <span className="text-white">Redactar Nota</span>
            </Accordion.Title>
            <Accordion.Content className="bg-amber-600">
              <form
                onSubmit={(e) => onSubmitHandler(e)}
                className=" flex flex-col  items-center justify-center gap-3 bg-gray-500 rounded-lg p-5"
              >
                <div className="grid grid-cols-2 gap-3">
                  <section className="flex flex-col items-center justify-center">
                    <label
                      htmlFor="team2"
                      className="font-light text-white text-xl"
                    >
                      Equipo 1
                    </label>
                    <input
                      className="rounded-lg w-24"
                      type="text"
                      name="team1"
                      onChange={(e) => handleChange(e)}
                    />
                  </section>
                  <section className="flex flex-col items-center justify-center">
                    <label
                      htmlFor="team2"
                      className="font-light text-white text-xl"
                    >
                      Equipo 2
                    </label>
                    <input
                      className="rounded-lg w-24"
                      type="text"
                      name="team2"
                      onChange={(e) => handleChange(e)}
                    />
                  </section>
                </div>
                <select
                  className="rounded-lg"
                  name="category"
                  onChange={(e) => handleChange(e)}
                >
                  <option value="A1">Seleccione una categoria</option>
                  <option value="A1">A1</option>
                  <option value="FEM">FEM</option>
                </select>
                <input
                  className="rounded-lg"
                  type="text"
                  name="title"
                  placeholder="Titulo de la noticia"
                  onChange={(e) => handleChange(e)}
                />
                <textarea
                  className="rounded-lg w-11/12"
                  type="text"
                  name="subtitle"
                  placeholder="Subtitulo de la noticia"
                  onChange={(e) => handleChange(e)}
                />
                <textarea
                  className="rounded-lg w-11/12 h-96"
                  name="content"
                  placeholder="Contenido de la noticia"
                  height={50}
                  onChange={(e) => handleChange(e)}
                />

                <div className="flex flex-col items-center ">
                  <label className="font-light text-white text-xl">
                    Imagen de la noticia
                  </label>
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
                  <label className="font-light text-white text-xl">
                    Video de la noticia
                  </label>
                  <input
                    className="rounded-lg"
                    type="text"
                    name="videos"
                    id="videos"
                    placeholder="ID YOUTUBE..."
                    onChange={(e) => handleChange(e)}
                  />
                  <input
                    type="file"
                    name="video"
                    accept=".jpg, .png, .jpeg , .mp4"
                    onChange={(e) => handleVideo(e)}
                    className="rounded-lg flex-1 appearance-none w-full py-2 px-4 bg-amber-600  text-white placeholder-white text-sm focus:outline-none focus:border-transparent"
                  />
                  {loadingVideo ? (
                    <h3 className="font-light text-white text-xl">
                      Cargando video...
                    </h3>
                  ) : (
                    <video src={video} alt="" width="300px" />
                  )}
                </div>
                <button className="shadow-lg text-white font-bold bg-green-600 rounded-lg w-24 h-14 border border-white">
                  SUBIR NOTICIA
                </button>
              </form>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </section>
    </div>
  );
}
