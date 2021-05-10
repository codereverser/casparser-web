import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [eslintPlugin(), vue()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000/",
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
