import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { BrowserRouter } from "react-router-dom";
import { MaterialTailwindControllerProvider } from "./context/index.jsx";
import { Provider } from "react-redux";
import { store } from "./Redux/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <MaterialTailwindControllerProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </MaterialTailwindControllerProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
