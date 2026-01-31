import React from "react";
import ReactDOM from "react-dom/client";
import "../src/styles/mainPage.css";
import App from "./App";

const rootElement = document.getElementById("root");


export const showWhiteScreen = (duration = 3000) => {
  console.log(`showWhiteScreen called with duration: ${duration}ms`);

  rootElement.style.opacity = "0";
  rootElement.style.visibility = "hidden";
  document.body.style.backgroundColor = "white";
  document.body.style.overflow = "hidden";


  setTimeout(() => {
    rootElement.style.opacity = "1";
    rootElement.style.visibility = "visible";
    document.body.style.overflow = "auto";
  }, duration);
};


const checkMobile = () => {
  const isMobileByUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const isMobileByWidth = window.innerWidth <= 768;
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  return isMobileByUA || isMobileByWidth || isTouchDevice;
};

const isMobile = checkMobile();

showWhiteScreen(4000);

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);