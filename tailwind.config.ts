import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate"; // 使用 import 语法导入

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [tailwindcssAnimate], // 插件直接传入
};

export default config;
