import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import { ThemeProvider } from "./context/ThemeContext.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/theme.css";
const root = createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
