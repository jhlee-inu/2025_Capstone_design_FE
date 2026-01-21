import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    //allowedHosts: ['4cd2403d53b0.ngrok-free.app'],
    allowedHosts: [".ngrok-free.app", ".ngrok-free.dev"], // 모든 ngrok 도메인 허용
  },
});
