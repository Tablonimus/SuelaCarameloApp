import { useState } from "react";
import { HiAdjustments, HiUserCircle, HiArchive, HiLogout, HiMenu, HiX } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import CreateNotice from "./CreateNotice";
import Positions from "./Positions";
import TeamsConverter from "./TeamsConverter";
import GeneralPositions from "./GeneralPositions";
import PlayersConverter from "./PlayersConverter";
import LiveResultsUpdater from "./LiveResultsUpdater";
import HeroImageManager from "./HeroImageManager";
import FixturesManager from "./FixturesManager";
import SponsorsManager from "./SponsorsManager";
import UsersManager from "./UsersManager";

const ALL_TABS = [
  { title: "Resultados en Vivo", icon: MdDashboard,   roles: ["admin"],                         component: <LiveResultsUpdater /> },
  { title: "Notas",              icon: HiUserCircle,  roles: ["admin", "reviewer", "reporter"], component: <CreateNotice /> },
  { title: "Fixtures",           icon: MdDashboard,   roles: ["admin"],                         component: <FixturesManager /> },
  { title: "Posiciones",         icon: HiAdjustments, roles: ["admin"],                         component: <Positions /> },
  { title: "Tabla General",      icon: HiAdjustments, roles: ["admin"],                         component: <GeneralPositions /> },
  { title: "Jugadores",          icon: HiAdjustments, roles: ["admin"],                         component: <PlayersConverter /> },
  { title: "Equipos",            icon: HiAdjustments, roles: ["admin"],                         component: <TeamsConverter /> },
  { title: "Banners",            icon: HiArchive,     roles: ["admin"],                         component: <HeroImageManager /> },
  { title: "Sponsors",           icon: HiArchive,     roles: ["admin"],                         component: <SponsorsManager /> },
  { title: "Usuarios",           icon: FaUsers,       roles: ["admin"],                         component: <UsersManager /> },
];

const ROLE_LABEL = { admin: "Administrador", reviewer: "Revisor", reporter: "Notero" };
const ROLE_COLOR = { admin: "text-orange-400", reviewer: "text-blue-400", reporter: "text-green-400" };

export default function AdminHome({ userRole = "reporter", currentUser, onLogout }) {
  const visibleTabs = ALL_TABS.filter((tab) => tab.roles.includes(userRole));
  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeTab = visibleTabs[activeIndex] ?? visibleTabs[0];

  function selectTab(index) {
    setActiveIndex(index);
    setSidebarOpen(false);
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          flex flex-col w-60 bg-zinc-900 border-r border-white/10
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <img src="/suela.png" alt="Suela Caramelo" className="w-6 h-6 object-contain" />
          </div>
          <span className="font-bold text-white tracking-wide text-sm uppercase">Suela Caramelo</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {visibleTabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = index === activeIndex;
            return (
              <button
                key={tab.title}
                onClick={() => selectTab(index)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-colors text-left
                  ${isActive
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent"
                  }`}
              >
                <Icon className={`text-base flex-shrink-0 ${isActive ? "text-orange-400" : "text-zinc-500"}`} />
                {tab.title}
              </button>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm uppercase">
              {currentUser?.username?.[0] ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{currentUser?.username ?? "—"}</p>
              <p className={`text-xs font-medium ${ROLE_COLOR[userRole] ?? "text-zinc-400"}`}>
                {ROLE_LABEL[userRole] ?? userRole}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:bg-red-900/30 hover:text-red-400 transition-colors border border-transparent hover:border-red-800/50"
          >
            <HiLogout className="text-base" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-zinc-900 flex-shrink-0">
          {/* Hamburger — solo mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors flex-shrink-0"
          >
            {sidebarOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-xs text-zinc-500 hidden sm:block flex-shrink-0">Redacción</span>
            <span className="text-xs text-zinc-600 hidden sm:block">/</span>
            <span className="text-sm font-semibold text-white truncate">{activeTab?.title}</span>
          </div>

          {/* Username — mobile */}
          <div className="flex items-center gap-2 lg:hidden flex-shrink-0">
            <div className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-xs uppercase">
              {currentUser?.username?.[0] ?? "?"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-4">
          {activeTab?.component}
        </main>
      </div>
    </div>
  );
}
