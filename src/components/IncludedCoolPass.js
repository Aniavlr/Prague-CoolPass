import React, { useState } from "react";
import { useTranslation } from "../TranslationContext";
import "../styles/includedCoolPass.css";

export default function IncludedCoolPass() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const {t} = useTranslation();

  const handleMouseEnter = (index) => {
    setHoveredCard(index);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const OFFERS_COUNT = 4;

  return (
    <>
      <div className="container">
        <h3 className="included-title">
          {t("HOME_offers_title") || "ЧТО ВКЛЮЧЕНО В PRAGUE COOLPASS"}
        </h3>
      </div>

      <div className="included-coolPass">
        <div className="included-container">
          <div className="content-coolPass">
            {[...Array(OFFERS_COUNT)].map((_, index) => {
              const title = t(`offer_${index}_title`) || "Заголовок не найден";
              const text = t(`offer_${index}_features`) || "";
              const buttonText = t(`offer_${index}_button`) || "Кнопка";

              const paragraphs = text
                .split("\n\n")
                .map((p) => p.trim())
                .filter((p) => p.length > 0);

              return (
                <div
                  key={index}
                  className="card"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    backgroundImage: `url('img/${
                      ["firstCard", "bus_tour", "thirdCard", "fourthCard"][
                        index
                      ]
                    }.jpg')`,
                  }}
                >
                  <div
                    className={`content-active ${
                      hoveredCard === index ? "hidden" : ""
                    }`}
                  >
                    <div className="exclusive-offer-btn">
                      <p className="offer-text">{title}</p>
                    </div>
                  </div>

                  <div
                    className={`popup-content ${
                      hoveredCard === index ? "active" : ""
                    }`}
                  >
                    <div className="text-container">
                      <div className="title">{title}</div>
                      <div className="popup-text">
                        {paragraphs.map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                    <div className="see-all-wrapper">
                      <a href="*" className="see-all-btn">
                        <button className="button-send">{buttonText}</button>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
