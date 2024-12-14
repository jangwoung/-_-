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
        "beige-dark": "#A87117",
      },
      keyframes: {
        flowRight: {
          "0%": { transform: "translateX(8%)" },
          "50%": { transform: "translateX(-430%)" },
          "100%": { transform: "translateX(8%)" },
        },
        flowLeft: {
          "0%": { transform: "translateX(-430%)" },
          "50%": { transform: "translateX(8%)" },
          "100%": { transform: "translateX(-430%)" },
        },
      },
      animation: {
        "flow-right": "flowRight 32s linear infinite",
        "flow-left": "flowLeft 32s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
