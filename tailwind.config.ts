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
        '300-px' : '300px',
        '400-px' : '400px',
        '600-px' : '600px',
        '700-px' : '700px',
        '800-px' : '800px',
        '80': '20rem',
        '90': '22.5rem',
        '100': '25rem',
        '106': '26.5rem',
        '112': '28rem',
        '120': '30rem',
        '170': '42.5rem',
        '192': '48rem',
        '200': '50rem',
        '240': '60rem',
        '256': '64rem',
        '300': '75rem',
        '320': '80rem',
        '360': '90rem',
      },
      height:{
        '300-px' : '300px',
        '400-px' : '400px',
        '600-px' : '600px',
        '700-px' : '700px',
        '800-px' : '800px'
      },
      minWidth:{
        '300-px' : '300px',
        '400-px' : '400px',
        '600-px' : '600px',
        '700-px' : '700px',
        '800-px' : '800px'
      },
      minHeight:{
        '300-px' : '300px',
        '400-px' : '400px',
        '600-px' : '600px',
        '700-px' : '700px',
        '800-px' : '800px'
      }
      ,
      maxWidth:{
        '300-px' : '300px',
        '400-px' : '400px',
        '600-px' : '600px',
        '700-px' : '700px',
        '800-px' : '800px'
      },
      maxHeight:{
        '300-px' : '300px',
        '400-px' : '400px',
        '600-px' : '600px',
        '700-px' : '700px',
        '800-px' : '800px'
      },
      screens: {
        'desktop': '1460px',
        'laptop': '1024px',
        'tablet': '768px',
        'mobile': '425px',
      }
    },

  },
  plugins: [],
};
export default config;
