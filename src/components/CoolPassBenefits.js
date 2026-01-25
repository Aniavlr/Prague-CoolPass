import React, { useState } from "react";
import { useTranslation } from "../TranslationContext";
import "../styles/coolPassBenefits.css";

export default function CoolPassBenefits() {
  const [openIndex, setOpenIndex] = useState(0);
  const {t} = useTranslation();

  const toggleSpoiler = (index) => {
    setOpenIndex(openIndex === index ? openIndex : index);
  };

  const BENEFITS_COUNT = 4;

  return (
    <>
      <div className="container">
        <h3 className="benefits-title">
          {t("HOME_benefits_title") ||
            "ПОЗНАКОМЬТЕСЬ С ПРАГОЙ, ИСПОЛЬЗУЯ ПРЕИМУЩЕСТВА COOLPASS"}
        </h3>
      </div>

      <div className="benefits-coolpass">
        <div className="benefits-coolpass-container">
          <div className="benefits-content-container">
            <div className="content">
              {[...Array(BENEFITS_COUNT)].map((_, index) => {
                const title = t(`benefit_${index}_title`) || `Заголовок преимущества ${index + 1}`;
                const rawText = t(`benefit_${index}_text`) || "";

                const paragraphs = rawText
                  .split(/\n\s*\n/)
                  .map(p => p.trim())
                  .filter(p => p.length > 0);

                return (
                  <div
                    key={index}
                    className="spoiler"
                    onClick={() => toggleSpoiler(index)}
                  >
                    <div className="title-box">
                      <h4 className="spoiler-title-text">{title}</h4>
                    </div>

                    <div
                      className={`box-content ${openIndex === index ? "active" : ""}`}
                    >
                      <div className="spoiler-text">
                        {paragraphs.map((paragraph, i) => (
                          <p key={i} className="spoiler-paragraph">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="phone-content">
              <div
                className="mobile-phone"
                style={{ backgroundImage: "url('img/mobile.87cdac93.png')" }}
              ></div>
              <div
                className="prague-card-image"
                style={{
                  backgroundImage: "url('img/prague-card-image.670e8103.png')",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}