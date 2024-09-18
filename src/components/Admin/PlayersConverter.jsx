import React, { useState } from "react";
import * as XLSX from "xlsx";
import ssf from "ssf";
import { useDispatch } from "react-redux";
import { createPlayersByExcel } from "../../redux/actions";
export default function PlayersConverter() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  console.log(category);

  const handleConvert = (e) => {
    const file = e.target.files[0];

    if (!category) {
      const inputFile = document.getElementById("file-converter");
      inputFile.value = "";
      return alert(
        "Debes seleccionar una categoría y luego cargar el archivo."
      );
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });

        let teamsObject = {};

        for (let i = 0; i < workbook.SheetNames.length; i++) {
          const sheetName = workbook.SheetNames[i];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);

          // console.log(json);

          const formattedPlayers = json.map((player) => {
            return {
              name: player["NOMBRE Y APELLIDO"] || "-",
              number: player["NUM. DE JUEGO"] || "-",
              alias: player["APODO"] || "-",
              birthdate:
                ssf.format("DD/MM/YYYY", player["FECHA DE NACIMIENTO"]) || "-",
              club_arrival: player["LLEGADA AL CLUB"] || "-",
              current_club_name: sheetName,
              category: category,
              position: player["PUESTO"] || "-",
              instagram: player["INSTAGRAM -CELULAR"] || "-",
              image: player["FOTO"] || "-",
            };
          });

          teamsObject[sheetName] = formattedPlayers;
        }

        console.log(teamsObject);

        dispatch(createPlayersByExcel(teamsObject));
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Formato de archivo no soportado");
    }
    const inputFile = document.getElementById("file-converter");
    inputFile.value = "";
  };

  return (
    <div className="flex flex-col gap-3">
      <select
        name="category"
        id=""
        defaultValue={""}
        className="text-black rounded-lg "
        onChange={(e) => setCategory(e.target.value)}
      >
        <option disabled value="">
          Seleccione categoría
        </option>
        <option value="A1">A1</option>
        <option value="FEM">FEM</option>
      </select>

      <label
        className={`align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] flex items-center text-[--primary] gap-3 border-2 border-[--primary]`}
      >
        🔨
        <span className="">Cargar</span>
        <input
          id="file-converter"
          className="hidden"
          type="file"
          accept=".xls,.xlsx"
          onChange={(e) => handleConvert(e)}
        />
      </label>
    </div>
  );
}
