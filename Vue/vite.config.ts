import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import eslintPlugin from "vite-plugin-eslint";

export default defineConfig({
  plugins: [
    vue(),
    // 在项目运行时就能检查eslint规范
    eslintPlugin({
      include: ["src/**/*.js", "src/**/*.vue", "src/*.js", "src/*.vue"],
    }),
  ],
  resolve: {
    alias: {
      // 配置别名
      "@": resolve("./src"),
      // com: resolve("./src/components"),
    },
  },
  base: "./", // 打包路径
  server: {
    host: "0.0.0.0", // 设置后开启Network网络链接
    port: 3000, // 服务端口
    open: false, // 启动服务时是否自动打开浏览器
    cors: true, // 允许跨域
  },
});
