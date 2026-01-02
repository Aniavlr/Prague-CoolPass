import { useState } from "react";
import ButtonPay from "./ButtonPay";
import ButtonTranslate from "./ButtonTranslate";
import { TranslationProvider } from "../TranslationContext";

export default function Navigation() {
  const [translations, setTranslations] = useState({});

  const menuIds = [
    "5a7a893966105c2e28d87bd1", // CoolPass/Card
    "5a7a894466105c2e28d87bd2", // Attractions / Объекты
    "5a7a894f66105c2e28d87bd3", // Get your pass / Приобрести Pass
    "5a7a896166105c2e28d87bd4", // Plan your trip / Перед поездкой
    "5a7a897266105c2e28d87bd5", // Current news / Новости
    "5a7a898166105c2e28d87bd6", // FAQ / Вопросы-ответы
  ];

  return (
    <TranslationProvider translations={translations}>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="left-nav">
            <a href="/" className="navbar-brand">
              CoolPass
            </a>
          </div>

          <div className="center-nav">
            <ul className="menu">
              {menuIds.map((id) => (
                <li key={id}>
                  <a href="*">{translations[id] || "Loading..."}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="right-nav">
            <ul className="menu">
              <li>
                <ButtonPay />
              </li>
              <li>
                <ButtonTranslate onTranslationsChange={setTranslations} />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </TranslationProvider>
  );
}
