import React from "react";
import ReactDOM from "react-dom/client";
import "../src/styles/mainPage.css";
import App from "./App";

const rootElement = document.getElementById("root");

// Проверка на мобильное устройство
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

// Скрываем и настраиваем
rootElement.style.opacity = "0";
rootElement.style.visibility = "hidden";
document.body.style.backgroundColor = "white";
document.body.style.overflow = "hidden";

// Логируем для отладки
console.log(
  `Device info: Mobile=${isMobile}, Width=${
    window.innerWidth
  }, UserAgent=${navigator.userAgent.substring(0, 50)}...`
);

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Разное время для разных устройств
if (isMobile) {
  // Мобильные - показываем белый фон дольше
  console.log("Mobile device detected - using 2 second delay");
  setTimeout(() => {
    rootElement.style.opacity = "1";
    rootElement.style.visibility = "visible";
    document.body.style.overflow = "auto";
  }, 2000);
} else {
  // Десктоп - быстрее
  console.log("Desktop device detected - using 3 second delay");
  setTimeout(() => {
    rootElement.style.opacity = "1";
    rootElement.style.visibility = "visible";
    document.body.style.overflow = "auto";
  }, 3000);
}
