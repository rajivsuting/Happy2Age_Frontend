import withMT from "@material-tailwind/react/utils/withMT";
 
export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        maincolor : "#ff2881",
        maincolor2 : "#22d172"
      }
    },
  },
  plugins: [],
});