import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home/Home";
import Landing from "./components/Home/Landing";
import { AnimatePresence } from "framer-motion";
import Download from "./components/Download/Download";
import NoticeDetail from "./components/Notice/NoticeDetail";

import CreateNotice from "./components/Admin/CreateNotice";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/notices/:id" element={<NoticeDetail />} />
        <Route path="/dwnld" element={<Download />} />
        <Route path="/createnotice" element={<CreateNotice />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
