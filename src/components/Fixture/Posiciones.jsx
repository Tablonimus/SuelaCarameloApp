import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGeneralPositions, getPositions } from "../../redux/actions";
import Sidebar from "../NavBar/Sidebar";
import FooterComp from "../FooterComp/FooterComp";
import logoSuela from "../../assets/images/banner2.png";

const CATEGORIES = [
  { value: "A1", label: "FSP Masculino", logo: "/botones/A1.png" },
  { value: "F1", label: "FSP Femenino",  logo: "/botones/F1.png" },
  // { value: "DH", label: "División de Honor", logo: "/botones/DH.png" },
  // { value: "CM", label: "Copa Mendoza",       logo: "/botones/CM.png" },
];

const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function ImageCard({ title, src, onClick }) {
  return (
    <div className="w-full max-w-xl bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.22em] whitespace-nowrap">
            {title}
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div
          className="relative cursor-zoom-in group rounded-lg overflow-hidden border border-white/10"
          onClick={onClick}
        >
          <img
            src={src}
            alt={`Tabla de posiciones — ${title}`}
            className="w-full h-auto object-contain transition-all duration-300 group-hover:brightness-90"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm rounded-full p-3">
              <ExpandIcon />
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-zinc-600 mt-2">
          Tocá la imagen para ampliar
        </p>
      </div>
    </div>
  );
}

const Posiciones = () => {
  const dispatch = useDispatch();
  const [positionState, setPositionState] = useState("A1");
  const [modalImage, setModalImage]       = useState(null);
  const [loading, setLoading]             = useState(true);

  const positions        = useSelector((state) => state.positions);
  const generalPositions = useSelector((state) => state.generalPositions);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dispatch(getPositions(positionState)),
      dispatch(getGeneralPositions(positionState)),
    ]).finally(() => setLoading(false));
  }, [positionState, dispatch]);

  const selectedCategory = CATEGORIES.find((c) => c.value === positionState) ?? CATEGORIES[0];

  return (
    <div className="pl-[70px] flex flex-col min-h-screen bg-zinc-950">
      <Sidebar active="positions" />

      {/* Header — mismo patrón que Fixture / Clubs / Noticias */}
      <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2.5">

          {/* Row 1: logo + título + categoría activa */}
          <div className="flex items-center gap-3 min-w-0">
            <img src={logoSuela} alt="" className="h-7 object-contain flex-shrink-0" />
            <span className="text-sm font-bold text-white tracking-widest uppercase hidden sm:block flex-shrink-0">
              Posiciones
            </span>
            <span className="text-zinc-600 hidden sm:block flex-shrink-0">·</span>
            <span className="text-sm font-semibold text-orange-400 truncate hidden sm:block">
              {selectedCategory.label}
            </span>
          </div>

          {/* Row 2: pills de categoría (solo si hay más de una) */}
          {CATEGORIES.length > 1 && (
            <div
              className="flex gap-1.5 overflow-x-auto pb-0.5"
              style={{ scrollbarWidth: "none" }}
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setPositionState(cat.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                    positionState === cat.value
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                      : "bg-zinc-800 text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <img src={cat.logo} alt="" className="w-4 h-4 object-contain" />
                  {cat.label}
                </button>
              ))}
            </div>
          )}

        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
            <p className="text-zinc-500 text-sm">Cargando posiciones...</p>
          </div>
        ) : !positions?.image ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <p className="text-zinc-500 text-sm">No hay tabla de posiciones disponible.</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row gap-6 items-start justify-center">
            <ImageCard
              title="En Juego"
              src={positions.image}
              onClick={() => setModalImage(positions.image)}
            />
            {generalPositions?.image && (
              <ImageCard
                title="Tabla General"
                src={generalPositions.image}
                onClick={() => setModalImage(generalPositions.image)}
              />
            )}
          </div>
        )}
      </main>

      <FooterComp />

      {/* Modal pantalla completa */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4"
          onClick={() => setModalImage(null)}
        >
          <div
            className="flex flex-col items-center w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div>
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.22em]">
                  Posiciones
                </p>
                <h3 className="text-xl font-black text-white">{selectedCategory.label}</h3>
              </div>
              <button
                onClick={() => setModalImage(null)}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
            <img
              src={modalImage}
              alt="Vista ampliada"
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Posiciones;
