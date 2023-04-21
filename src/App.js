import React from "react";

import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import "./App.css";
import AnimatedRoutes from "./AnimatedRoutes";
import { inject } from "@vercel/analytics";

function App() {
  inject();
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
