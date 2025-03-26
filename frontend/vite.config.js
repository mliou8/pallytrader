import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    allowedHosts: [
      "97e4c1ef-292a-42c9-9e9b-6b1deb2a9f4a-00-gh069fu7tsw2.sisko.replit.dev",
    ],
    host: "0.0.0.0", // Ensure this is set for external access
  },
  plugins: [tailwindcss()],
});
