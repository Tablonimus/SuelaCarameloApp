import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Noticias from "./components/Home/Noticias";
import NoticeDetail from "./components/Notice/NoticeDetail";
import ContactUs from "./components/ContactUs/ContactUs";
import RichTextEditor from "./components/RichTextEditor/RichTextEditor";
import Clubs from "./components/Clubs/Clubs";
import ClubDetail from "./components/Clubs/ClubDetail";
import Descuentos from "./components/Voucher/Descuentos";
import Home from "./components/Home/Home";
import Fixture from "./components/Fixture/Fixture";
import Posiciones from "./components/Fixture/Posiciones";
import "./App.css";
import AdminHome from "./components/Admin/AdminHome";

function App() {
  const location = useLocation();

  return (
    <section id="general" className="">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/notices/:id" element={<NoticeDetail />} />
        <Route path="/equipos" element={<Clubs />} />
        <Route path="/equipos/:category/:name" element={<ClubDetail />} />
        <Route path="/fixture" element={<Fixture />} />
        <Route path="/posiciones" element={<Posiciones />} />
        <Route path="/cupones" element={<Descuentos />} />
        <Route path="/contacto" element={<ContactUs />} />
        {/* <Route path="/test" element={<RichTextEditor />} /> */}
        <Route path="/createnotice" element={<AdminHome />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </section>
  );
}

export default App;
