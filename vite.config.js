import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      injectRegister: "auto",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Suela Caramelo",
        short_name: "SuelApp",
        background_color: "#ed7020",
        description: "Noticias del fútbol de salón.",
        theme_color: "#ed7020",
        icons: [
          {
            src: "psuela.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "suela.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
