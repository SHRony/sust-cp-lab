import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      backgroundColor:{
        'primary' : 'var(--primary)'
        
      },
      textColor: {
        onPrimary : 'var(--onPrimary)'
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      dropShadow: {
        '3xl': '10px 10px 10px rgba(0, 0, 0, 0.2)',
      },
      width:{
        '300' : '300px',
        '400' : '400px',
        '600' : '600px',
        '700' : '700px',
        '800' : '800px'
      },
      height:{
        '300' : '300px',
        '400' : '400px',
        '600' : '600px',
        '700' : '700px',
        '800' : '800px'
      },
      minWidth:{
        '300' : '300px',
        '400' : '400px',
        '600' : '600px',
        '700' : '700px',
        '800' : '800px'
      },
      minHeight:{
        '300' : '300px',
        '400' : '400px',
        '600' : '600px',
        '700' : '700px',
        '800' : '800px'
      }
      ,
      maxWidth:{
        '300' : '300px',
        '400' : '400px',
        '600' : '600px',
        '700' : '700px',
        '800' : '800px'
      },
      maxHeight:{
        '300' : '300px',
        '400' : '400px',
        '600' : '600px',
        '700' : '700px',
        '800' : '800px'
      }
    },
  },
  plugins: [],
};
export default config;
