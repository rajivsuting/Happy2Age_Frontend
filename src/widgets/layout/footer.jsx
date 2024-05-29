import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/solid";

export function Footer({ brandName, brandLink, routes }) {
  const year = new Date().getFullYear();

  return (
    <footer className="w-[100%] py-2 bg-white w-full text-center fixed bottom-0 left-[80px] mt-[200px]">
      <div className="flex flex-col items-center justify-center gap-2">
        <Typography variant="small" className="font-normal text-inherit">
          &copy; {year}, made with{" "}
          <HeartIcon className="-mt-0.5 inline-block h-3.5 w-3.5 text-red-600" /> by{" "}
          {/* <a
            href={"https://happy2age.com/"}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-blue-500 font-bold"
          > */}
            Brafony
          {/* </a>{" "} */}
        </Typography>
        {/* <ul className="flex items-center gap-4">
          {routes.map(({ name, path }) => (
            <li key={name}>
              <Typography
                as="a"
                href={path}
                target="_blank"
                rel="noopener noreferrer"
                variant="small"
                className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500"
              >
                {name}
              </Typography>
            </li>
          ))}
        </ul> */}
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  brandName: "Creative Tim",
  brandLink: "https://www.creative-tim.com",
  routes: [
    { name: "Creative Tim", path: "https://www.creative-tim.com" },
    { name: "About Us", path: "https://www.creative-tim.com/presentation" },
    { name: "Blog", path: "https://www.creative-tim.com/blog" },
    { name: "License", path: "https://www.creative-tim.com/license" },
  ],
};

Footer.propTypes = {
  brandName: PropTypes.string,
  brandLink: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
