import type { Config } from "tailwindcss";
export default{
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Manrope: ["Manrope", "sans-serif"],
      },
      colors:{
        'card-description': '#80858c',  
        'inputBackground' : "#2d2d2d",
        'primary': '#6f42f5',
        'secondary' : '#cdbff5'
      }
    },
  },
  plugins: [],
} satisfies Config
