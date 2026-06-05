# SuelaCarameloApp — Frontend

App PWA de noticias y gestión de fútbol de salón (futsal) para la liga "Suela Caramelo".

## Stack

- **React 18** + **Vite** (plugin-react-swc)
- **Redux** + Redux Toolkit + redux-thunk (estado global)
- **React Router v6** (SPA, rutas en `src/App.jsx`)
- **Tailwind CSS** + Flowbite React (UI)
- **Firebase 10** — Firestore, Storage, FCM (push notifications)
- **Cloudinary** — imágenes y transformaciones
- **Embla Carousel**, **react-quill**, **TinyMCE** — carrusel y editores de texto rico
- **Framer Motion** — animaciones
- **PWA** via `vite-plugin-pwa` (service worker autoUpdate)
- **Deploy**: Firebase Hosting (`npm run fire` = build + firebase deploy)

## Estructura

```
src/
  App.jsx               # Router principal, rutas protegidas, LoginModal
  components/
    Admin/              # Panel admin: noticias, fixture, posiciones, sponsors, hero
    Clubs/              # Equipos y detalle de plantel
    Editor/             # Editor de partidos en vivo (MatchSelector, LiveMatchEditor)
    Fixture/            # Fixture y tabla de posiciones
    Home/               # Home, HeroCarousel, Noticias
    NavBar/             # NavBar, Sidebar, resultados
    Notice/             # Detalle y listado de noticias
    Voucher/            # Cupones de descuento
    YoutubeEmbed/       # Embed de YouTube
    LiveMatchesTicker/  # Ticker de partidos en vivo
    RichTextEditor/     # Quill y TinyMCE wrappers
  firebase/
    firebase-config.js  # Config Firebase (cliente)
  utils/
    config/fierbase/firebase.js  # Segunda instancia Firebase (admin actions)
    data/               # JSONs locales: fixture, notices, results, teams
  redux/
    store.js
    reducer.js
    actions/            # Thunks y action types
  hooks/
    usePushNotifications.js
```

## Rutas

| Ruta | Componente | Protegida |
|------|-----------|-----------|
| `/` | Home | No |
| `/noticias` | Noticias | No |
| `/noticias/:id` | NoticeDetail | No |
| `/equipos` | Clubs | No |
| `/equipos/:category/:name` | ClubDetail | No |
| `/fixture` | Fixture | No |
| `/posiciones` | Posiciones | No |
| `/cupones` | Descuentos | No |
| `/contacto` | ContactUs | No |
| `/editor` | MatchSelector | Sí |
| `/editor/:id` | LiveMatchEditor | Sí |
| `/createnotice` | AdminHome | Sí |
| `/crear-nota` | Journalist | Sí |

Las rutas protegidas usan un `LoginModal` con credenciales hardcodeadas en `src/App.jsx` (arreglo `usersJson`). No hay JWT en el frontend — la auth del editor es solo UI.

## Comandos

```bash
npm run dev       # Servidor de desarrollo (con --host, accesible en red local)
npm run build     # Build de producción
npm run fire      # Build + deploy a Firebase Hosting
npm run preview   # Preview del build
npm run lint      # ESLint
```

## Notas importantes

- El archivo `.env` y `firebase-config.js` contienen claves — no commitear secrets.
- Los datos estáticos de equipos y fixture también están en JSONs en `src/utils/data/`.
- La PWA tiene `registerType: "autoUpdate"` — el SW se actualiza solo.
- `firestore.rules` y `storage.rules` controlan permisos en Firebase — tocar con cuidado.
- La carpeta `dist/` es el build generado — no editar manualmente.
