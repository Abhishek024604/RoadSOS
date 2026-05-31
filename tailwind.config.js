/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        muted: "#667085",
        line: "#e5e7eb",
        roadsos: "#2563eb",
        emergency: "#ef4444"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(15, 23, 42, 0.12)"
      },
      borderRadius: {
        panel: "20px"
      }
    }
  },
  plugins: []
};
