import React from "react";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { ToastContainer } from "react-toastify";

import App from "./App";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />

    <ToastContainer
      position="top-right"
      autoClose={3000}
      theme="colored"
    />
  </React.StrictMode>
);