import React from "react";
import NavBar from "../NavBar/NavBar";
import { Tabs } from "flowbite-react";
import { HiAdjustments, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import CreateNotice from "./CreateNotice";
import Fixtures from "./Fixtures";
import Positions from "./Positions";
export default function AdminHome() {
  return (
    <div className="flex flex-col items-center h-screen text-white overflow-auto">
      <NavBar />
      <section className="bg-black/80 my-4 p-1 rounded-md">
        <Tabs aria-label="Default tabs" style="default">
          <Tabs.Item active title="Noticias" icon={HiUserCircle}>
            <CreateNotice />
          </Tabs.Item>
          <Tabs.Item title="Fixtures" icon={MdDashboard}>
            <Fixtures />
          </Tabs.Item>
          <Tabs.Item title="Posiciones" icon={HiAdjustments}>
            <Positions />
          </Tabs.Item>
        </Tabs>
      </section>
    </div>
  );
}
