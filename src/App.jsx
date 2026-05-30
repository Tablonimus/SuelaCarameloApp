import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Noticias from "./components/Home/Noticias";
import NoticeDetail from "./components/Notice/NoticeDetail";
import ContactUs from "./components/ContactUs/ContactUs";
import Clubs from "./components/Clubs/Clubs";
import ClubDetail from "./components/Clubs/ClubDetail";
import Descuentos from "./components/Voucher/Descuentos";
import Home from "./components/Home/Home";
import Fixture from "./components/Fixture/Fixture";
import Posiciones from "./components/Fixture/Posiciones";
import "./App.css";
import AdminHome from "./components/Admin/AdminHome";
import Journalist from "./components/Admin/Journalist";
import MatchSelector from "./components/Editor/MatchSelector";
import LiveMatchEditor from "./components/Editor/LiveMatchEditor";
// import usePushNotifications from "./hooks/usePushNotifications";

const usersJson = [
  {
    username: "escueladeperiodismo",
    password: "suela2026.",
  },
];

const isProtectedRoute = (pathname) =>
  pathname === "/editor" ||
  pathname.startsWith("/editor/") ||
  pathname === "/createnotice" ||
  pathname === "/crear-nota";

function LoginModal({ isOpen, username, setUsername, password, setPassword, onSubmit, onCancel, error }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#111",
          borderRadius: "16px",
          padding: "24px",
          color: "#f8f8f8",
          boxShadow: "0 18px 45px rgba(0,0,0,0.4)",
        }}
      >
        <h2 style={{ margin: "0 0 12px", fontSize: "1.4rem" }}>Hola!</h2>
        <p style={{ margin: "0 0 20px", color: "#d1d5db" }}>
          Debes iniciar sesión para entrar a esta sección.
        </p>
        <form onSubmit={onSubmit}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "0.95rem" }}>
            Usuario
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="periodista 1"
            style={{
              width: "100%",
              padding: "0.85rem 1rem",
              marginBottom: "14px",
              borderRadius: "12px",
              border: "1px solid #333",
              background: "#1f2937",
              color: "#f8f8f8",
            }}
          />
          <label style={{ display: "block", marginBottom: "8px", fontSize: "0.95rem" }}>
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="*******"
            style={{
              width: "100%",
              padding: "0.85rem 1rem",
              marginBottom: "14px",
              borderRadius: "12px",
              border: "1px solid #333",
              background: "#1f2937",
              color: "#f8f8f8",
            }}
          />
          {error && (
            <div style={{ color: "#f87171", marginBottom: "14px", fontSize: "0.95rem" }}>
              {error}
            </div>
          )}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: "transparent",
                color: "#f8f8f8",
                border: "1px solid #4b5563",
                borderRadius: "999px",
                padding: "0.8rem 1rem",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                background: "#22c55e",
                color: "#0f172a",
                border: "none",
                borderRadius: "999px",
                padding: "0.8rem 1rem",
                cursor: "pointer",
              }}
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProtectedRoute({
  children,
  isAuthenticated,
  showLogin,
  username,
  setUsername,
  password,
  setPassword,
  onSubmit,
  onCancel,
  error,
}) {
  if (isAuthenticated) return children;

  return (
    <LoginModal
      isOpen={showLogin}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      onSubmit={onSubmit}
      onCancel={onCancel}
      error={error}
    />
  );
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(isProtectedRoute(location.pathname));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setIsAuthenticated(false);

    if (isProtectedRoute(location.pathname)) {
      setShowLogin(true);
      setError("");
      setUsername("");
      setPassword("");
    } else {
      setShowLogin(false);
    }
  }, [location.pathname]);

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    const validUser = usersJson.some(
      (user) => user.username === username && user.password === password
    );

    if (validUser) {
      setIsAuthenticated(true);
      setShowLogin(false);
      setError("");
      return;
    }

    setError("Usuario o contraseña incorrectos.");
    alert("Usuario o contraseña incorrectos.");
    setShowLogin(false);
    setIsAuthenticated(false);
    navigate("/", { replace: true });
  };

  const handleCancelLogin = () => {
    setShowLogin(false);
    setIsAuthenticated(false);
    navigate("/", { replace: true });
  };

  return (
    <section id="general" className="">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/noticias/:id" element={<NoticeDetail />} />
        <Route path="/equipos" element={<Clubs />} />
        <Route path="/equipos/:category/:name" element={<ClubDetail />} />
        <Route path="/fixture" element={<Fixture />} />
        <Route path="/posiciones" element={<Posiciones />} />
        <Route path="/cupones" element={<Descuentos />} />
        <Route path="/contacto" element={<ContactUs />} />

        <Route
          path="/editor"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              showLogin={showLogin}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              onSubmit={handleLoginSubmit}
              onCancel={handleCancelLogin}
              error={error}
            >
              <MatchSelector />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              showLogin={showLogin}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              onSubmit={handleLoginSubmit}
              onCancel={handleCancelLogin}
              error={error}
            >
              <LiveMatchEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createnotice"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              showLogin={showLogin}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              onSubmit={handleLoginSubmit}
              onCancel={handleCancelLogin}
              error={error}
            >
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crear-nota"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              showLogin={showLogin}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              onSubmit={handleLoginSubmit}
              onCancel={handleCancelLogin}
              error={error}
            >
              <Journalist />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Home />} />
      </Routes>
    </section>
  );
}

export default App;
