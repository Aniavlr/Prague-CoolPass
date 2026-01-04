import { useState } from "react";
import Navigation from "../components/Navigation";
import ImageSlider from "../components/ImageSlider";
import { TranslationProvider } from "../TranslationContext";

import "../styles/mainPage.css";

export default function MainPage() {
  const [translations, setTranslations] = useState({});

  return (
    <TranslationProvider translations={translations}>
    <div className="main-page">
      <div className="nav-wrapper">
        <Navigation />
      </div>
      <div className="slider-section">
        <ImageSlider />

        <div className="overlay-content">
          <div className="title-block">
            <h1 className="header-title">
              PRAGUE COOLPASS
              <br />
              ВЫБОР НА ЛЮБОЙ ВКУС
            </h1>
            <h3 className="header-subtitle">
              Пасс "Все включено" - самый широкий выбор достопримечательностей и
              развлечений в Праге
            </h3>
          </div>
          <div className="form-container">
            <div className="search-container">
              <label>
                <div className="autocomplete__box autocomplete__searching">
                  <div className="autocomplete__inputs">
                    <input
                      placeholder="Поиск объектов"
                      type="text"
                      autocomplete="off"
                      className="attractions-search"
                    />
                    <input type="hidden" />
                  </div>
                </div>
              </label>
              <div className="magnifying-glass">
                <img
                  src="/img/search.a842451d.svg"
                  alt="search"
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    position: "absolute",
                    right: "9px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              </div>
            </div>
            <button className="action-button show-attractions-btn">
              Поехали
            </button>
          </div>
        </div>
      </div>

      <div className="underbar">
        <p className="underbar-text">
          C 1992 года - Вход в 80+ аттракций - Единственный Пасс с Национальным
          музеем и Национальной галереей - CoolPass или Prague Card - Лучшая
          цена
        </p>
      </div>
    </div>
    </TranslationProvider>
  );
}
