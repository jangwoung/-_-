import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "base-black": "#030303",
        "green-light": "#5A7D5C",
        "green-dark": "#31422F",
        yellow: "#FFDD68",
        beige: "#FFE2B2",
      },
    },
  },
  plugins: [],
} satisfies Config;
