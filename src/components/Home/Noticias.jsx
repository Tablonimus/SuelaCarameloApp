import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotices } from "../../redux/actions";
import Notices from "../Notice/Notices";
import { Pagination } from "flowbite-react";
import NoticeLoaderComponent from "./NoticeLoaderComponent";
import FooterComp from "../FooterComp/FooterComp";
import logoA1 from "../../assets/images/botones/A1.png";
import logoF1 from "../../assets/images/botones/F1.png";
import logoDH from "../../assets/images/botones/DH.png";
import logoTI from "../../assets/images/botones/TI.webp";
import logoTN from "../../assets/images/botones/TN.webp";
import logoCM from "../../assets/images/botones/CM.png";
import suela from "../../assets/images/suela.png";
import Sidebar from "../NavBar/Sidebar";

export default function Noticias() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = [
    { value: "", label: "Últimas Noticias", logo: suela },
    { value: "A1", label: "FSP Masculino", logo: logoA1 },
    { value: "F1", label: "FSP Femenino", logo: logoF1 },
    { value: "DH", label: "División de Honor", logo: logoDH },
    { value: "CM", label: "Copa Mendoza", logo: logoCM },
    { value: "TN", label: "Torneos Nacionales", logo: logoTN },
    { value: "TI", label: "Torneos Internacionales", logo: logoTI },
  ];

  useEffect(() => {
    dispatch(getAllNotices(category));
  }, [category, dispatch]);

  const allNotices = useSelector((state) => state.allNotices);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 4;
  const currentNotices = allNotices?.slice(
    (currentPage - 1) * noticesPerPage,
    currentPage * noticesPerPage
  );
  const totalPages = Math.ceil(allNotices.length / noticesPerPage);

  const handleCategoryChange = (categoryValue) => {
    setCategory(categoryValue);
    const selected = categories.find((cat) => cat.value === categoryValue);

    setIsDropdownOpen(false);
    setCurrentPage(1);
  };

  const selectedCategory =
    categories.find((cat) => cat.value === category) || categories[0];

  return (
    <div className="pl-[70px] flex flex-col w-full min-h-screen ">
      <Sidebar active={"noticias"} />

      {/* Header con título y selector */}
      <header className="w-full bg-zinc-900 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-white text-center md:text-left italic">
              NOTICIAS
            </h2>

            {/* Selector mejorado para desktop */}
            <div className="relative w-full md:w-64">
              <p className="text-gray-400 text-sm mb-1  text-center animate-pulse">
                Selecciona una categoría ▼
              </p>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors"
                aria-label="Seleccionar categoría"
              >
                <div className="flex items-center">
                  {selectedCategory.logo && (
                    <img
                      src={selectedCategory.logo}
                      alt={selectedCategory.label}
                      className="w-6 h-6 mr-3 rounded-full object-cover"
                    />
                  )}
                  <span className="truncate">{selectedCategory.label}</span>
                </div>
                <svg
                  className={`w-5 h-5 ml-2 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute z-20 mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat.value || "all"}
                      onClick={() => handleCategoryChange(cat.value)}
                      className="flex items-center w-full px-4 py-3 text-left text-white hover:bg-zinc-700 transition-colors border-b border-zinc-700 last:border-b-0"
                    >
                      {cat.logo && (
                        <img
                          src={cat.logo}
                          alt={cat.label}
                          className="w-6 h-6 mr-3 rounded-full object-cover"
                        />
                      )}
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Grid de noticias */}
          <section
            id="nSection"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          >
            {currentNotices?.length > 0 ? (
              currentNotices.map((notice, index) => (
                <Notices
                  key={index}
                  id={notice._id}
                  title={notice.title}
                  subtitle={notice.subtitle}
                  images={notice.images}
                  videos={notice.videos}
                  content={notice.content}
                  category={notice.category}
                  author={notice.author}
                  date={notice.date}
                />
              ))
            ) : (
              <div className="col-span-full">
                <NoticeLoaderComponent />
              </div>
            )}
          </section>

          {/* Paginación */}
          <div className="flex justify-center mt-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Pagination
                currentPage={currentPage}
                layout="pagination"
                nextLabel="Siguiente"
                onPageChange={setCurrentPage}
                previousLabel="Anterior"
                showIcons
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </main>

      <FooterComp />
    </div>
  );
}
