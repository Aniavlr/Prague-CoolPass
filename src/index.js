import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/mainPage.css"; // Исправил путь, если был "../src/"
import App from "./App";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);