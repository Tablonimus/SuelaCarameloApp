import NavBar from "../NavBar/NavBar";
import { Tabs } from "flowbite-react";
import { HiAdjustments, HiUserCircle, HiArchive } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import CreateNotice from "./CreateNotice";
import Positions from "./Positions";
import TeamsConverter from "./TeamsConverter";
import GeneralPositions from "./GeneralPositions";
import DataManagment from "./DataManagment";
import PlayersConverter from "./PlayersConverter";
import LiveResultsUpdater from "./LiveResultsUpdater";
import HeroImageManager from "./HeroImageManager";
import FixturesManager from "./FixturesManager";

export default function AdminHome() {
  return (
    <div className="flex flex-col items-center h-screen text-white overflow-auto">
      <NavBar />
      <section className="bg-black/80 my-4 p-1 rounded-md w-11/12">
        <Tabs aria-label="Default tabs" style="default">
          <Tabs.Item active title="Resultados en Vivo" icon={MdDashboard}>
            <LiveResultsUpdater />
          </Tabs.Item>
          <Tabs.Item title="Notas" icon={HiUserCircle}>
            <CreateNotice />
          </Tabs.Item>
          <Tabs.Item title="Fixtures" icon={MdDashboard}>
            <FixturesManager />
          </Tabs.Item>
          <Tabs.Item title="Posiciones" icon={HiAdjustments}>
            <Positions />
          </Tabs.Item>
          <Tabs.Item title="Tabla General" icon={HiAdjustments}>
            <GeneralPositions />
          </Tabs.Item>
          <Tabs.Item title="Gestión de Datos" icon={HiAdjustments}>
            <DataManagment />
          </Tabs.Item>
          <Tabs.Item title="Jugadores" icon={HiAdjustments}>
            <PlayersConverter />
          </Tabs.Item>
          <Tabs.Item title="Equipos" icon={HiAdjustments}>
            <TeamsConverter />
          </Tabs.Item>
          <Tabs.Item title="Banners" icon={HiArchive}>
            <HeroImageManager />
          </Tabs.Item>
        </Tabs>
      </section>
    </div>
  );
}
