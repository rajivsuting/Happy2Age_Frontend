module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Ensure Tailwind scans the right files
  theme: {
    extend: {
      animation: {
        slideDown: "slideDown 0.3s ease-out",
      },
      colors: {
        primary: "#0c0b45",
        brand: "#239d62",
      },
      keyframes: {
        slideDown: {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
