import React, { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./App.css";
// import usePushNotifications from "./hooks/usePushNotifications";

const Home          = lazy(() => import("./components/Home/Home"));
const Noticias      = lazy(() => import("./components/Home/Noticias"));
const NoticeDetail  = lazy(() => import("./components/Notice/NoticeDetail"));
const Clubs         = lazy(() => import("./components/Clubs/Clubs"));
const ClubDetail    = lazy(() => import("./components/Clubs/ClubDetail"));
const Fixture       = lazy(() => import("./components/Fixture/Fixture"));
const Posiciones    = lazy(() => import("./components/Fixture/Posiciones"));
const Descuentos    = lazy(() => import("./components/Voucher/Descuentos"));
const ContactUs     = lazy(() => import("./components/ContactUs/ContactUs"));
const AdminHome     = lazy(() => import("./components/Admin/AdminHome"));
const Journalist    = lazy(() => import("./components/Admin/Journalist"));
const MatchSelector = lazy(() => import("./components/Editor/MatchSelector"));
const LiveMatchEditor = lazy(() => import("./components/Editor/LiveMatchEditor"));

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const BACKEND_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";
// const BACKEND_URL = "http://localhost:3000/sc";

const isProtectedRoute = (pathname) =>
  pathname === "/editor" ||
  pathname.startsWith("/editor/") ||
  pathname === "/redaccion" ||
  pathname === "/crear-nota";

const SESSION_KEY = "sc_session";

function saveSession(user, remember) {
  const payload = JSON.stringify(user);
  if (remember) localStorage.setItem(SESSION_KEY, payload);
  else sessionStorage.setItem(SESSION_KEY, payload);
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

function LoginModal({ isOpen, username, setUsername, password, setPassword, onSubmit, onCancel, error, rememberSession, setRememberSession }) {
  if (!isOpen) return null;

  const inputStyle = {
    width: "100%",
    padding: "0.85rem 1rem",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#0a0a0a",
    color: "#f8f8f8",
    fontSize: "0.95rem",
    outline: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#18181b",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header naranja institucional */}
        <div
          style={{
            background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
            padding: "28px 28px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img src="/suela.png" alt="Suela Caramelo" style={{ width: "42px", height: "42px", objectFit: "contain" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.14em", color: "rgba(255,255,255,0.8)", textTransform: "uppercase" }}>
                Suela Caramelo
              </div>
              <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "700", color: "#fff", lineHeight: 1.2 }}>
                Área de redacción
              </h2>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>
            Ingresá con tus credenciales
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: "24px 28px 28px" }}>
          <form onSubmit={onSubmit}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.8rem", fontWeight: "600", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Usuario
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="nombre.apellido"
              style={inputStyle}
            />

            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.8rem", fontWeight: "600", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />

            {error && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "16px",
                color: "#fca5a5",
                fontSize: "0.875rem",
              }}>
                ⚠ {error}
              </div>
            )}

            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "#f97316", cursor: "pointer" }}
              />
              <span style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>Recordar sesión</span>
            </label>

            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              <button
                type="button"
                onClick={onCancel}
                style={{
                  flex: 1,
                  background: "transparent",
                  color: "#a1a1aa",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "10px",
                  padding: "0.85rem 1rem",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  flex: 2,
                  background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.85rem 1rem",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  letterSpacing: "0.04em",
                }}
              >
                Ingresar
              </button>
            </div>
          </form>
        </div>
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
  rememberSession,
  setRememberSession,
}) {
  const noIndex = (
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );

  if (isAuthenticated) return <>{noIndex}{children}</>;

  return (
    <>
      {noIndex}
      <LoginModal
        isOpen={showLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        onSubmit={onSubmit}
        onCancel={onCancel}
        error={error}
        rememberSession={rememberSession}
        setRememberSession={setRememberSession}
      />
    </>
  );
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(isProtectedRoute(location.pathname));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberSession, setRememberSession] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    if (isProtectedRoute(location.pathname)) {
      const saved = loadSession();
      if (saved) {
        setCurrentUser(saved);
        setIsAuthenticated(true);
        setShowLogin(false);
        return;
      }
      setIsAuthenticated(false);
      setCurrentUser(null);
      setShowLogin(true);
      setError("");
      setUsername("");
      setPassword("");
    } else {
      setShowLogin(false);
    }
  }, [location.pathname]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Usuario o contraseña incorrectos.");
        return;
      }

      const user = await res.json();
      saveSession(user, rememberSession);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setShowLogin(false);
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    }
  };

  const handleCancelLogin = () => {
    clearSession();
    setShowLogin(false);
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate("/", { replace: true });
  };

  const lazy = (Component) => (
    <Suspense fallback={<PageFallback />}>
      <Component />
    </Suspense>
  );

  return (
    <section id="general" className="">
      <Routes>
        <Route path="/" element={lazy(Home)} />
        <Route path="/noticias" element={lazy(Noticias)} />
        <Route path="/noticias/:id" element={lazy(NoticeDetail)} />
        <Route path="/equipos" element={lazy(Clubs)} />
        <Route path="/equipos/:category/:name" element={lazy(ClubDetail)} />
        <Route path="/fixture" element={lazy(Fixture)} />
        <Route path="/posiciones" element={lazy(Posiciones)} />
        <Route path="/cupones" element={lazy(Descuentos)} />
        <Route path="/contacto" element={lazy(ContactUs)} />

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
              rememberSession={rememberSession}
              setRememberSession={setRememberSession}
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
              rememberSession={rememberSession}
              setRememberSession={setRememberSession}
              error={error}
            >
              <LiveMatchEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/redaccion"
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
              rememberSession={rememberSession}
              setRememberSession={setRememberSession}
              error={error}
            >
              <AdminHome
                userRole={currentUser?.role}
                currentUser={currentUser}
                onLogout={handleCancelLogin}
              />
            </ProtectedRoute>
          }
        />


        <Route path="*" element={lazy(Home)} />
      </Routes>
    </section>
  );
}

export default App;
