import React from "react";
import ReactDOM from "react-dom/client";
//import { Global, css } from "@emotion/react"
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    {/*
    <Global
      styles={css`
        body {
          font-family: "Roboto";
        }
      `}
    />
  */}
    <App />
  </BrowserRouter>,
);
