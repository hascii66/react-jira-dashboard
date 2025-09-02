import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/react-jira-dashboard/",
  server: {
    proxy: {
      "/jira": {
        target: "https://sirisoftth.atlassian.net",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/jira/, ""),
      },
    },
  },
});
