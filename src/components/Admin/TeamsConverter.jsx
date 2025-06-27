import React, { useState } from "react";
import * as XLSX from "xlsx";
import ssf from "ssf";
import { useDispatch } from "react-redux";
import {
  createManyTeamsByExcel,
  createPlayersByExcel,
} from "../../redux/actions";

export default function TeamsConverter() {
  const dispatch = useDispatch();
  const [jsonData, setJsonData] = useState("");

  const splitObject = (obj, parts) => {
    const keys = Object.keys(obj);
    const chunkSize = Math.ceil(keys.length / parts);
    const result = [];

    for (let i = 0; i < keys.length; i += chunkSize) {
      const chunkKeys = keys.slice(i, i + chunkSize);
      const chunk = {};
      chunkKeys.forEach((key) => {
        chunk[key] = obj[key];
      });
      result.push(chunk);
    }

    return result;
  };

  const handleConvert = (e) => {
    const file = e.target.files[0];

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

          const formattedPlayers = json.map((player) => {
            return {
              name: player["NOMBRE Y APELLIDO"] || "-",
              number: player["NUM. DE JUEGO"] || "-",
              alias: player["APODO"] || "-",
              birthdate:
                ssf.format("DD/MM/YYYY", player["FECHA DE NACIMIENTO"]) || "-",
              club_arrival: player["LLEGADA AL CLUB"] || "-",
              current_club_name: sheetName,
              category: "FEM",
              position: player["PUESTO"] || "-",
              instagram: player["INSTAGRAM -CELULAR"] || "-",
              image: player["FOTO"] || "-",
            };
          });

          teamsObject[sheetName] = formattedPlayers;
        }

        // Dividir el objeto en 3 partes
        const chunks = splitObject(teamsObject, 3);

        // Enviar cada parte por separado
        chunks.forEach((chunk) => {
          dispatch(createManyTeamsByExcel(chunk));
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Formato de archivo no soportado");
    }
    const inputFile = document.getElementById("file-converter");
    inputFile.value = "";
  };

  return (
    <div>
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
