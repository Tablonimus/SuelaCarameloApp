import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Noticias from "./components/Home/Noticias";
//import Landing from "./components/Home/Landing";
import NoticeDetail from "./components/Notice/NoticeDetail";
import "./App.css";
import CreateNotice from "./components/Admin/CreateNotice";
import AboutUs from "./components/AboutUs/AboutUs";
import ContactUs from "./components/ContactUs/ContactUs";
import RichTextEditor from "./components/RichTextEditor/RichTextEditor";
import FooterComp from "./components/FooterComp/FooterComp";
import Clubs from "./components/Clubs/Clubs";
import ClubDetail from "./components/Clubs/ClubDetail";
import Descuentos from "./components/Voucher/Descuentos";
import NavFooter from "./components/NavBar/NavFooter";
import Home from "./components/Home/Home";
import Sidebar from "./components/NavBar/Sidebar";
import Resultados from "./components/Fixture/Resultados";
import Fixture from "./components/Fixture/Fixture";
import Posiciones from "./components/Fixture/Posiciones";

function App() {
  const location = useLocation();

  return (
    <section id="general" className="">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/notices/:id" element={<NoticeDetail />} />
        <Route path="/clubes" element={<Clubs />} />
        <Route path="/clubes/:name" element={<ClubDetail />} />
        <Route path="/fixture" element={<Fixture/>} />
        <Route path="/posiciones" element={<Posiciones/>} />
        <Route path="/descuentos" element={<Descuentos />} />
        <Route path="/contacto" element={<ContactUs />} />
        <Route path="/test" element={<RichTextEditor />} />
        <Route path="/createnotice" element={<CreateNotice />} />
        {/* <Route path="/descargar" element={<Download />} /> */}
        {/* <Route path="/sobrenosotros" element={<AboutUs />} /> */}
        {/* Ruta en español para la gente */}
      </Routes>
      {/* <NavFooter /> */}
      <FooterComp />
    </section>
  );
}

export default App;
