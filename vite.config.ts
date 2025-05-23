import { defineConfig, Plugin } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), replaceAPI()],
  base: process.env.NODE_ENV === "production" ? "/front_5th_chapter2-3/" : "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        // target: 'https://jsonplaceholder.typicode.com',
        target: "https://dummyjson.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})

function replaceAPI(): Plugin {
  return {
    name: "api-replace",
    transform(code, id) {
      if (id.endsWith(".ts") || id.endsWith(".js")) {
        return code.replace(/(["'`])\/api/g, `$1https://dummyjson.com`)
      }
    },
  }
}
