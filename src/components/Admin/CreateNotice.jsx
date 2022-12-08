import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { postImage } from "../../redux/actions/index";
import axios from "axios";

export default function CreateNotice() {
  const dispatch = useDispatch();

  const [image, setImage] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [input, setInput] = useState({
    title: "",
    subtitle: "",
    images: [],
    content: "",
    category: "",
  });

  console.log("IMAGE:", image);
  console.log("INPUTS:", input);

  function onSubmitHandler(e) {
    e.preventDefault();
  }

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
    data.append("upload_preset", "pretty");
    data.append("folder", "Images");
    setLoadingImage(true);
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/tablonimus/images/upload",
      data
    );

    console.log("RESPUESTA",res);
    setImage(res.data.secure_url);
    setInput({
      ...input,
      image: res.data.secure_url,
    });

    setLoadingImage(false);
  }
  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={(e) => onSubmitHandler(e)}
        className="flex flex-col w-96 items-center justify-center"
      >
        <input
          type="text"
          name="title"
          placeholder="Titulo de la noticia"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="text"
          name="subtitle"
          placeholder="Subtitulo de la noticia"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="text"
          name="content"
          placeholder="Contenido de la noticia"
          height={50}
          onChange={(e) => handleChange(e)}
        />
        <select name="category" onChange={(e) => handleChange(e)}>
          <option value="A1">Seleccione una categoria</option>
          <option value="A1">A1</option>
          <option value="FEM">FEM</option>
        </select>
        <div>
          <label className="font-light text-white text-xl">
            Imagen de perfil
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
      </form>
    </div>
  );
}
