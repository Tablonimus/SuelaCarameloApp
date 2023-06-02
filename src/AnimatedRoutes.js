import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home/Home";
import Landing from "./components/Home/Landing";
import { AnimatePresence } from "framer-motion";
import Download from "./components/Download/Download";
import NoticeDetail from "./components/Notice/NoticeDetail";
import "./App.css";
import CreateNotice from "./components/Admin/CreateNotice";
import AboutUs from "./components/AboutUs/AboutUs";
import ContactUs from "./components/ContactUs/ContactUs";
import RichTextEditor from "./components/RichTextEditor/RichTextEditor";
import NavBar from "./components/NavBar/NavBar";
import FooterComp from "./components/FooterComp/FooterComp";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <section id="general" className="">
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
        </Routes>
        <div className=" ">
          <NavBar />
          <Routes location={location} key={location.pathname}>
            <Route path="/sobrenosotros" element={<AboutUs />} />
            <Route path="/contacto" element={<ContactUs />} />
            <Route path="/test" element={<RichTextEditor />} />

            <Route path="/home" element={<Home />} />
            <Route path="/notices/:id" element={<NoticeDetail />} />
            <Route path="/descargar" element={<Download />} />
            {/* Ruta en español para la gente */}
            <Route path="/createnotice" element={<CreateNotice />} />
          </Routes>
          <FooterComp />
        </div>
      </AnimatePresence>
    </section>
  );
}

export default AnimatedRoutes;
