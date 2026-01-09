import Navigation from "../components/Navigation";
import ImageSlider from "../components/ImageSlider";
import BestAttractions from "../components/BestAttractoins";
import CoolPassBenefits from "../components/CoolPassBenefits";
import IncludedCoolPass from "../components/IncludedCoolPass";
import HowToUse from "../components/HowToUse";
import News from "../components/News";
import BuyCard from "../components/BuyCard";
import Reviews from "../components/Reviews";
import { useTranslation } from "../TranslationContext";

import "../styles/mainPage.css";

export default function MainPage({ setTranslations }) {
  const t = useTranslation();

  return (
    <div className="main-page">
      <div className="nav-wrapper">
        <Navigation setTranslations={setTranslations} />
      </div>
      <div className="slider-section">
        <ImageSlider />

        <div className="overlay-content">
          <div className="title-block">
            <h1 className="header-title">
              {t("title_line1") ||
                (t("title") && t("title").split(/<br\/?>/i)[0]) ||
                "PRAGUE COOLPASS"}
              <br />
              {t("title_line2") ||
                (t("title") && t("title").split(/<br\/?>/i)[1]) ||
                "ВЫБОР НА ЛЮБОЙ ВКУС"}
            </h1>
            <h3 className="header-subtitle">
              {t("subtitle") ||
                `Пасс "Все включено" - самый широкий выбор достопримечательностей и
              развлечений в Праге`}
            </h3>
          </div>
          <div className="form-container">
            <div className="search-container">
              <label>
                <div className="autocomplete__box autocomplete__searching">
                  <div className="autocomplete__inputs">
                    <input
                      placeholder={t("SEARCH") || "Поиск объектов"}
                      type="text"
                      autoComplete="off"
                      className="attractions-search"
                    />
                    <input type="hidden" />
                  </div>
                </div>
              </label>
              <div className="magnifying-glass">
                <img
                  src="img/search.a842451d.svg"
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
              {t("HOME_lets_go_button") || "Поехали"}
            </button>
          </div>
        </div>
      </div>

      <div className="underbar">
        <p className="underbar-text">
          {t("header_banner") ||
            `C 1992 года - Вход в 80+ аттракций - Единственный Пасс с Национальным
          музеем и Национальной галереей - CoolPass или Prague Card - Лучшая
          цена`}
        </p>
      </div>

      <section>
        <BestAttractions />
      </section>

      <section>
        <CoolPassBenefits />
      </section>

      <section>
        <IncludedCoolPass />
      </section>

      <section>
        <HowToUse />
      </section>

      <section>
        <News />
      </section>

      <section>
        <BuyCard />
      </section>

      <section>
        <Reviews />
      </section>
    </div>
  );
}
