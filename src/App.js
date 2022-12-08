import React from "react";

import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import "./App.css";
import AnimatedRoutes from "./AnimatedRoutes";

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
