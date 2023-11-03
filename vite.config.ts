import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { createRequire } from "module"; // Use createRequire if you're using Node.js ES Modules

const require = createRequire(import.meta.url);
const tailwindcss = require("tailwindcss");

export default defineConfig({
  plugins: [remix(), tsconfigPaths(), tailwindcss()],
});
