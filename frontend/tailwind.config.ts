import type { Config } from "tailwindcss";
export default{
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Manrope: ["Manrope", "sans-serif"],
      },
      colors:{
        'card-description': '#010306',  
      }
    },
  },
  plugins: [],
} satisfies Config
