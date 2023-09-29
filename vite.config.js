import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import fs from "fs";

export default defineConfig({
  plugins: [
    {
      name: "copy-plugin",
      generateBundle() {
        const fileContent = fs.readFileSync("src/types/main.d.ts", "utf-8");
        this.emitFile({
          type: "asset",
          fileName: "types/main.d.ts",
          source: fileContent,
        });
      },
    },
    dts({
      include: ["src/index.ts", "src/functions/**/*.ts", "src/utils/**/*.ts"],
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "hstate",
      formats: ["es"],
      fileName: () => `index.js`,
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true
  }
});
