import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home/Home";
import Landing from "./components/Home/Landing";
import { AnimatePresence } from "framer-motion";
import Download from "./components/Download/Download";
import NoticeDetail from "./components/Notice/NoticeDetail";

import CreateNotice from "./components/Admin/CreateNotice";
import { getAllNotices, getAllTeams } from "./redux/actions";
import { useDispatch } from "react-redux";
import AboutUs from "./components/AboutUs/AboutUs";
import ContactUs from "./components/ContactUs/ContactUs";

function AnimatedRoutes() {
  const location = useLocation();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getAllNotices());
  //   dispatch(getAllTeams());
  // }, [dispatch]);

  return (
    <section className="bg-black h-screen">
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/sobrenosotros" element={<AboutUs />} />
          <Route path="/contacto" element={<ContactUs />} />

          <Route path="/home" element={<Home />} />
          <Route path="/notices/:id" element={<NoticeDetail />} />
          <Route path="/descargar" element={<Download />} />
          {/* Ruta en español para la gente */}
          <Route path="/createnotice" element={<CreateNotice />} />
        </Routes>
      </AnimatePresence>
    </section>
  );
}

export default AnimatedRoutes;
