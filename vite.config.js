import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // these settings only apply when running npm run dev locally — they have no effect on production
  server: {
    // a proxy is an object where each key is a URL prefix to intercept.
    proxy: {
      // intercepted /api requests get forwarded to the express server at port 8080
      // /api/health becomes http://localhost:8080/api/health.
      "/api": {
        target: "http://localhost:8080",
        // tells Vite to change the Host header of the forwarded request to match the target (localhost:8080) rather than the source (localhost:5173)
        // without this some server configurations reject the request because the host header doesn't match where the request is going
        // safe default to always include
        changeOrigin: true,
      },
    },
  },
});

/*
Right now if the React app (running on localhost:5173) tries to fetch from the Express server (running on localhost:8080), the browser treats these as different origins (different ports means different origin). The CORS middleware in Express allows localhost:5173 but during development, the cleaner and more professional approach is to set up a proxy in Vite. 

A proxy tells Vite's dev server: "any request starting with /api — don't send it to the browser's origin, forward it to my Express server instead." This means the React code can call /api/health rather than http://localhost:8080/api/health, which more closely mirrors how the deployed app behaves.

It also means if the backend port ever changes, you only update vite.config.js — not every single fetch() call across the entire codebase
*/
