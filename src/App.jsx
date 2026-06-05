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
  const [showPwd, setShowPwd] = useState(false);
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
            <div style={{ position: "relative", marginBottom: "14px" }}>
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle, marginBottom: 0, paddingRight: "2.8rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                tabIndex={-1}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#71717a",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPwd ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 640 512" fill="currentColor"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 576 512" fill="currentColor"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.9-.2-9.2 6.4-7.4 11.9c2.1 6.4 3.3 13.2 3.3 20.1z"/></svg>
                )}
              </button>
            </div>

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
