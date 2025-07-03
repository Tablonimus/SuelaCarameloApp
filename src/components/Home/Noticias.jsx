import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotices } from "../../redux/actions";
import Notices from "../Notice/Notices";
import { Pagination } from "flowbite-react";
import NoticeLoaderComponent from "./NoticeLoaderComponent";
import FooterComp from "../FooterComp/FooterComp";
import Sidebar from "../NavBar/Sidebar";
import { motion } from "framer-motion";
import logoSuela from "../../assets/images/banner2.png";
export default function Noticias() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    { value: "", label: "Últimas Noticias" },
    { value: "A1", label: "FSP Masculino" },
    { value: "F1", label: "FSP Femenino" },
    { value: "DH", label: "División de Honor" },
    { value: "CM", label: "Copa Mendoza" },
    { value: "TN", label: "Torneos Nacionales" },
    { value: "TI", label: "Torneos Internacionales" },
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
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setCurrentPage(1);
  };

  const selectedCategory =
    categories.find((cat) => cat.value === category) || categories[0];

  return (
    <div className="pl-[70px] md:pl-0 flex flex-col min-h-screen">
      {/* Sidebar para mobile */}
      <div className="md:hidden fixed top-0 left-0 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="m-2 p-2 rounded-lg bg-zinc-800 text-white"
        >
          <i className="bx bx-menu text-2xl"></i>
        </button>
      </div>

      <Sidebar
        active={"noticias"}
        isMobileOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Contenido principal */}
      <main className="flex-1 md:pl-[70px] ">
        {/* Header */}
        <header className="w-full bg-zinc-900 py-4 md:py-6 px-4 sticky top-0 z-40 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <img src={logoSuela} alt="" className="h-8 object-contain" />
              <h2 className="text-xl md:text-2xl font-bold text-white text-center md:text-left">
                NOTICIAS
              </h2>

              {/* Selector para mobile */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-full px-4 py-2 bg-zinc-800 text-white rounded-lg border border-white/10"
                >
                  <span className="text-sm">{selectedCategory.label}</span>
                  <i
                    className={`bx bx-chevron-down ml-2 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-20 mt-1 w-[calc(100%-32px)] bg-zinc-800 border border-white/10 rounded-lg shadow-lg">
                    {categories.map((cat) => (
                      <button
                        key={cat.value || "all"}
                        onClick={() => handleCategoryChange(cat.value)}
                        className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 border-b border-white/10 last:border-b-0"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selector para desktop */}
              <div className="hidden md:block relative w-full md:w-64">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-full px-4 py-2 bg-zinc-800 text-white rounded-lg border border-white/10 hover:bg-zinc-700"
                >
                  <span className="text-sm">{selectedCategory.label}</span>
                  <i
                    className={`bx bx-chevron-down ml-2 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-20 mt-1 w-full bg-zinc-800 border border-white/10 rounded-lg shadow-lg">
                    {categories.map((cat) => (
                      <button
                        key={cat.value || "all"}
                        onClick={() => handleCategoryChange(cat.value)}
                        className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 border-b border-white/10 last:border-b-0"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Grid de noticias */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {currentNotices?.length > 0
              ? currentNotices.map((notice, index) => (
                  <Notices
                    id={notice._id}
                    title={notice.title}
                    subtitle={notice.subtitle}
                    images={notice.images}
                    videos={notice.videos}
                    author={notice.author}
                    date={notice.date}
                  />
                ))
              : [1, 2, 3, 4].map((item) => <NoticeLoaderComponent />)}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="bg-zinc-800 p-2 rounded-lg border border-white/10">
                <Pagination
                  currentPage={currentPage}
                  layout="pagination"
                  nextLabel=">"
                  previousLabel="<"
                  onPageChange={setCurrentPage}
                  showIcons
                  totalPages={totalPages}
                  className="text-white"
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <FooterComp />
    </div>
  );
}
