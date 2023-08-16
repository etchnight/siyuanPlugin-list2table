// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "file:///D:/project/0project_new/siyuanPlugin-list2table/node_modules/.pnpm/vite@4.3.7_@types+node@20.2.0_sass@1.62.1/node_modules/vite/dist/node/index.js";
import minimist from "file:///D:/project/0project_new/siyuanPlugin-list2table/node_modules/.pnpm/minimist@1.2.8/node_modules/minimist/index.js";
import { viteStaticCopy } from "file:///D:/project/0project_new/siyuanPlugin-list2table/node_modules/.pnpm/vite-plugin-static-copy@0.15.0_vite@4.3.7/node_modules/vite-plugin-static-copy/dist/index.js";
import livereload from "file:///D:/project/0project_new/siyuanPlugin-list2table/node_modules/.pnpm/rollup-plugin-livereload@2.0.5/node_modules/rollup-plugin-livereload/dist/index.cjs.js";
import { svelte } from "file:///D:/project/0project_new/siyuanPlugin-list2table/node_modules/.pnpm/@sveltejs+vite-plugin-svelte@2.0.3_svelte@3.57.0_vite@4.3.7/node_modules/@sveltejs/vite-plugin-svelte/dist/index.js";
import zipPack from "file:///D:/project/0project_new/siyuanPlugin-list2table/node_modules/.pnpm/vite-plugin-zip-pack@1.0.5_vite@4.3.7/node_modules/vite-plugin-zip-pack/dist/esm/index.mjs";
import fg from "file:///D:/project/0project_new/siyuanPlugin-list2table/node_modules/.pnpm/fast-glob@3.2.12/node_modules/fast-glob/out/index.js";
var __vite_injected_original_dirname = "D:\\project\\0project_new\\siyuanPlugin-list2table";
var args = minimist(process.argv.slice(2));
var isWatch = args.watch || args.w || false;
var devDistDir = "./dev";
var distDir = isWatch ? devDistDir : "./dist";
console.log("isWatch=>", isWatch);
console.log("distDir=>", distDir);
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  plugins: [
    svelte(),
    viteStaticCopy({
      targets: [
        {
          src: "./README*.md",
          dest: "./"
        },
        {
          src: "./icon.png",
          dest: "./"
        },
        {
          src: "./preview.png",
          dest: "./"
        },
        {
          src: "./plugin.json",
          dest: "./"
        },
        {
          src: "./src/i18n/**",
          dest: "./i18n/"
        }
      ]
    })
  ],
  // https://github.com/vitejs/vite/issues/1930
  // https://vitejs.dev/guide/env-and-mode.html#env-files
  // https://github.com/vitejs/vite/discussions/3058#discussioncomment-2115319
  // 在这里自定义变量
  define: {
    "process.env.DEV_MODE": `"${isWatch}"`
  },
  build: {
    // 输出路径
    outDir: distDir,
    emptyOutDir: false,
    // 构建后是否生成 source map 文件
    sourcemap: false,
    // 设置为 false 可以禁用最小化混淆
    // 或是用来指定是应用哪种混淆器
    // boolean | 'terser' | 'esbuild'
    // 不压缩，用于调试
    minify: !isWatch,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      // the proper extensions will be added
      fileName: "index",
      formats: ["cjs"]
    },
    rollupOptions: {
      plugins: [
        ...isWatch ? [
          livereload(devDistDir),
          {
            //监听静态资源文件
            name: "watch-external",
            async buildStart() {
              const files = await fg([
                "src/i18n/*.json",
                "./README*.md",
                "./plugin.json"
              ]);
              for (let file of files) {
                this.addWatchFile(file);
              }
            }
          }
        ] : [
          zipPack({
            inDir: "./dist",
            outDir: "./",
            outFileName: "package.zip"
          })
        ]
      ],
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["siyuan", "process"],
      output: {
        entryFileNames: "[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "index.css";
          }
          return assetInfo.name;
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0XFxcXDBwcm9qZWN0X25ld1xcXFxzaXl1YW5QbHVnaW4tbGlzdDJ0YWJsZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxccHJvamVjdFxcXFwwcHJvamVjdF9uZXdcXFxcc2l5dWFuUGx1Z2luLWxpc3QydGFibGVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3Byb2plY3QvMHByb2plY3RfbmV3L3NpeXVhblBsdWdpbi1saXN0MnRhYmxlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCJcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIlxyXG5pbXBvcnQgbWluaW1pc3QgZnJvbSBcIm1pbmltaXN0XCJcclxuaW1wb3J0IHsgdml0ZVN0YXRpY0NvcHkgfSBmcm9tIFwidml0ZS1wbHVnaW4tc3RhdGljLWNvcHlcIlxyXG5pbXBvcnQgbGl2ZXJlbG9hZCBmcm9tIFwicm9sbHVwLXBsdWdpbi1saXZlcmVsb2FkXCJcclxuaW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSBcIkBzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGVcIlxyXG5pbXBvcnQgemlwUGFjayBmcm9tIFwidml0ZS1wbHVnaW4temlwLXBhY2tcIjtcclxuaW1wb3J0IGZnIGZyb20gJ2Zhc3QtZ2xvYic7XHJcblxyXG5jb25zdCBhcmdzID0gbWluaW1pc3QocHJvY2Vzcy5hcmd2LnNsaWNlKDIpKVxyXG5jb25zdCBpc1dhdGNoID0gYXJncy53YXRjaCB8fCBhcmdzLncgfHwgZmFsc2VcclxuY29uc3QgZGV2RGlzdERpciA9IFwiLi9kZXZcIlxyXG5jb25zdCBkaXN0RGlyID0gaXNXYXRjaCA/IGRldkRpc3REaXIgOiBcIi4vZGlzdFwiXHJcblxyXG5jb25zb2xlLmxvZyhcImlzV2F0Y2g9PlwiLCBpc1dhdGNoKVxyXG5jb25zb2xlLmxvZyhcImRpc3REaXI9PlwiLCBkaXN0RGlyKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICBcIkBcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpLFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAgIHN2ZWx0ZSgpLFxyXG5cclxuICAgICAgICB2aXRlU3RhdGljQ29weSh7XHJcbiAgICAgICAgICAgIHRhcmdldHM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzcmM6IFwiLi9SRUFETUUqLm1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdDogXCIuL1wiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzcmM6IFwiLi9pY29uLnBuZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Q6IFwiLi9cIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3JjOiBcIi4vcHJldmlldy5wbmdcIixcclxuICAgICAgICAgICAgICAgICAgICBkZXN0OiBcIi4vXCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYzogXCIuL3BsdWdpbi5qc29uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdDogXCIuL1wiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzcmM6IFwiLi9zcmMvaTE4bi8qKlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Q6IFwiLi9pMThuL1wiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9KSxcclxuICAgIF0sXHJcblxyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVqcy92aXRlL2lzc3Vlcy8xOTMwXHJcbiAgICAvLyBodHRwczovL3ZpdGVqcy5kZXYvZ3VpZGUvZW52LWFuZC1tb2RlLmh0bWwjZW52LWZpbGVzXHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdml0ZWpzL3ZpdGUvZGlzY3Vzc2lvbnMvMzA1OCNkaXNjdXNzaW9uY29tbWVudC0yMTE1MzE5XHJcbiAgICAvLyBcdTU3MjhcdThGRDlcdTkxQ0NcdTgxRUFcdTVCOUFcdTRFNDlcdTUzRDhcdTkxQ0ZcclxuICAgIGRlZmluZToge1xyXG4gICAgICAgIFwicHJvY2Vzcy5lbnYuREVWX01PREVcIjogYFwiJHtpc1dhdGNofVwiYCxcclxuICAgIH0sXHJcblxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgICAvLyBcdThGOTNcdTUxRkFcdThERUZcdTVGODRcclxuICAgICAgICBvdXREaXI6IGRpc3REaXIsXHJcbiAgICAgICAgZW1wdHlPdXREaXI6IGZhbHNlLFxyXG5cclxuICAgICAgICAvLyBcdTY3ODRcdTVFRkFcdTU0MEVcdTY2MkZcdTU0MjZcdTc1MUZcdTYyMTAgc291cmNlIG1hcCBcdTY1ODdcdTRFRjZcclxuICAgICAgICBzb3VyY2VtYXA6IGZhbHNlLFxyXG5cclxuICAgICAgICAvLyBcdThCQkVcdTdGNkVcdTRFM0EgZmFsc2UgXHU1M0VGXHU0RUU1XHU3OTgxXHU3NTI4XHU2NzAwXHU1QzBGXHU1MzE2XHU2REY3XHU2REM2XHJcbiAgICAgICAgLy8gXHU2MjE2XHU2NjJGXHU3NTI4XHU2NzY1XHU2MzA3XHU1QjlBXHU2NjJGXHU1RTk0XHU3NTI4XHU1NEVBXHU3OUNEXHU2REY3XHU2REM2XHU1NjY4XHJcbiAgICAgICAgLy8gYm9vbGVhbiB8ICd0ZXJzZXInIHwgJ2VzYnVpbGQnXHJcbiAgICAgICAgLy8gXHU0RTBEXHU1MzhCXHU3RjI5XHVGRjBDXHU3NTI4XHU0RThFXHU4QzAzXHU4QkQ1XHJcbiAgICAgICAgbWluaWZ5OiAhaXNXYXRjaCxcclxuXHJcbiAgICAgICAgbGliOiB7XHJcbiAgICAgICAgICAgIC8vIENvdWxkIGFsc28gYmUgYSBkaWN0aW9uYXJ5IG9yIGFycmF5IG9mIG11bHRpcGxlIGVudHJ5IHBvaW50c1xyXG4gICAgICAgICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2luZGV4LnRzXCIpLFxyXG4gICAgICAgICAgICAvLyB0aGUgcHJvcGVyIGV4dGVuc2lvbnMgd2lsbCBiZSBhZGRlZFxyXG4gICAgICAgICAgICBmaWxlTmFtZTogXCJpbmRleFwiLFxyXG4gICAgICAgICAgICBmb3JtYXRzOiBbXCJjanNcIl0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICAgICAgICAgIC4uLihcclxuICAgICAgICAgICAgICAgICAgICBpc1dhdGNoID8gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXZlcmVsb2FkKGRldkRpc3REaXIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1x1NzZEMVx1NTQyQ1x1OTc1OVx1NjAwMVx1OEQ0NFx1NkU5MFx1NjU4N1x1NEVGNlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3dhdGNoLWV4dGVybmFsJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jIGJ1aWxkU3RhcnQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCBmZyhbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzcmMvaTE4bi8qLmpzb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLi9SRUFETUUqLm1kJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJy4vcGx1Z2luLmpzb24nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZmlsZSBvZiBmaWxlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFdhdGNoRmlsZShmaWxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdIDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB6aXBQYWNrKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluRGlyOiAnLi9kaXN0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dERpcjogJy4vJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dEZpbGVOYW1lOiAncGFja2FnZS56aXAnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICBdLFxyXG5cclxuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHRvIGV4dGVybmFsaXplIGRlcHMgdGhhdCBzaG91bGRuJ3QgYmUgYnVuZGxlZFxyXG4gICAgICAgICAgICAvLyBpbnRvIHlvdXIgbGlicmFyeVxyXG4gICAgICAgICAgICBleHRlcm5hbDogW1wic2l5dWFuXCIsIFwicHJvY2Vzc1wiXSxcclxuXHJcbiAgICAgICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6IFwiW25hbWVdLmpzXCIsXHJcbiAgICAgICAgICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZSA9PT0gXCJzdHlsZS5jc3NcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJpbmRleC5jc3NcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXNzZXRJbmZvLm5hbWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgIH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1VSxTQUFTLGVBQWU7QUFDL1YsU0FBUyxvQkFBNkI7QUFDdEMsT0FBTyxjQUFjO0FBQ3JCLFNBQVMsc0JBQXNCO0FBQy9CLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsY0FBYztBQUN2QixPQUFPLGFBQWE7QUFDcEIsT0FBTyxRQUFRO0FBUGYsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTSxPQUFPLFNBQVMsUUFBUSxLQUFLLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLElBQU0sVUFBVSxLQUFLLFNBQVMsS0FBSyxLQUFLO0FBQ3hDLElBQU0sYUFBYTtBQUNuQixJQUFNLFVBQVUsVUFBVSxhQUFhO0FBRXZDLFFBQVEsSUFBSSxhQUFhLE9BQU87QUFDaEMsUUFBUSxJQUFJLGFBQWEsT0FBTztBQUVoQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ2pDO0FBQUEsRUFDSjtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLElBRVAsZUFBZTtBQUFBLE1BQ1gsU0FBUztBQUFBLFFBQ0w7QUFBQSxVQUNJLEtBQUs7QUFBQSxVQUNMLE1BQU07QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLFVBQ0ksS0FBSztBQUFBLFVBQ0wsTUFBTTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsVUFDSSxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsUUFDVjtBQUFBLFFBQ0E7QUFBQSxVQUNJLEtBQUs7QUFBQSxVQUNMLE1BQU07QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLFVBQ0ksS0FBSztBQUFBLFVBQ0wsTUFBTTtBQUFBLFFBQ1Y7QUFBQSxNQUNKO0FBQUEsSUFDSixDQUFDO0FBQUEsRUFDTDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFNQSxRQUFRO0FBQUEsSUFDSix3QkFBd0IsSUFBSTtBQUFBLEVBQ2hDO0FBQUEsRUFFQSxPQUFPO0FBQUE7QUFBQSxJQUVILFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQTtBQUFBLElBR2IsV0FBVztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNWCxRQUFRLENBQUM7QUFBQSxJQUVULEtBQUs7QUFBQTtBQUFBLE1BRUQsT0FBTyxRQUFRLGtDQUFXLGNBQWM7QUFBQTtBQUFBLE1BRXhDLFVBQVU7QUFBQSxNQUNWLFNBQVMsQ0FBQyxLQUFLO0FBQUEsSUFDbkI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNYLFNBQVM7QUFBQSxRQUNMLEdBQ0ksVUFBVTtBQUFBLFVBQ04sV0FBVyxVQUFVO0FBQUEsVUFDckI7QUFBQTtBQUFBLFlBRUksTUFBTTtBQUFBLFlBQ04sTUFBTSxhQUFhO0FBQ2Ysb0JBQU0sUUFBUSxNQUFNLEdBQUc7QUFBQSxnQkFDbkI7QUFBQSxnQkFDQTtBQUFBLGdCQUNBO0FBQUEsY0FDSixDQUFDO0FBQ0QsdUJBQVMsUUFBUSxPQUFPO0FBQ3BCLHFCQUFLLGFBQWEsSUFBSTtBQUFBLGNBQzFCO0FBQUEsWUFDSjtBQUFBLFVBQ0o7QUFBQSxRQUNKLElBQUk7QUFBQSxVQUNBLFFBQVE7QUFBQSxZQUNKLE9BQU87QUFBQSxZQUNQLFFBQVE7QUFBQSxZQUNSLGFBQWE7QUFBQSxVQUNqQixDQUFDO0FBQUEsUUFDTDtBQUFBLE1BRVI7QUFBQTtBQUFBO0FBQUEsTUFJQSxVQUFVLENBQUMsVUFBVSxTQUFTO0FBQUEsTUFFOUIsUUFBUTtBQUFBLFFBQ0osZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCLENBQUMsY0FBYztBQUMzQixjQUFJLFVBQVUsU0FBUyxhQUFhO0FBQ2hDLG1CQUFPO0FBQUEsVUFDWDtBQUNBLGlCQUFPLFVBQVU7QUFBQSxRQUNyQjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
