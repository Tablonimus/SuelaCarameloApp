import React, { useState } from "react";
import * as XLSX from "xlsx";
import ssf from "ssf";
import { useDispatch } from "react-redux";
import { createPlayersByExcel } from "../../redux/actions";

export default function PlayersConverter() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Función para dividir el objeto en partes
  const splitPlayersObject = (obj, parts) => {
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

  const handleConvert = async (e) => {
    const file = e.target.files[0];
    const inputFile = document.getElementById("file-converter");

    if (!category) {
      inputFile.value = "";
      return alert(
        "Debes seleccionar una categoría y luego cargar el archivo."
      );
    }

    if (!file) {
      return alert("Formato de archivo no soportado");
    }

    setIsLoading(true);

    try {
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });

      const workbook = XLSX.read(data, { type: "array" });
      let teamsObject = {};

      for (let i = 0; i < workbook.SheetNames.length; i++) {
        const sheetName = workbook.SheetNames[i];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        const formattedPlayers = json.map((player) => ({
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
        }));

        teamsObject[sheetName] = formattedPlayers;
      }

      // Dividir el objeto en 3 partes
      const chunks = splitPlayersObject(teamsObject, 3);

      // Enviar cada parte secuencialmente
      for (const chunk of chunks) {
        await dispatch(createPlayersByExcel(chunk));
        await new Promise((resolve) => setTimeout(resolve, 500)); // Pequeña pausa entre envíos
      }

      alert("Jugadores cargados exitosamente!");
    } catch (error) {
      console.error("Error al procesar archivo:", error);
      alert("Ocurrió un error al procesar el archivo");
    } finally {
      setIsLoading(false);
      inputFile.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <select
        name="category"
        defaultValue={""}
        className="text-black rounded-lg"
        onChange={(e) => setCategory(e.target.value)}
        disabled={isLoading}
      >
        <option disabled value="">
          Seleccione categoría
        </option>
        <option value="A1">A1</option>
        <option value="FEM">FEM</option>
      </select>

      <label
        className={`align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] flex items-center text-[--primary] gap-3 border-2 border-[--primary] ${
          isLoading ? "opacity-75 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "⏳" : "🔨"}
        <span>{isLoading ? "Cargando..." : "Cargar"}</span>
        <input
          id="file-converter"
          className="hidden"
          type="file"
          accept=".xls,.xlsx"
          onChange={handleConvert}
          disabled={isLoading}
        />
      </label>
    </div>
  );
}
