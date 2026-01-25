import { useTranslation } from "../TranslationContext";
import { useState, useRef, useEffect } from "react";

import "../styles/howToUse.css";

export default function HowToUse() {
  const { t } = useTranslation();

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const steps = [...Array(4)].map((_, index) => ({
    img: ["use1", "use2", "use3", "prague-card"][index],
    text: t(`how_to_use_${index}`) || "",
  }));

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const card = container.querySelector(".step-item");
      if (!card) return;
      const cardWidth = card.offsetWidth + 16; 
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(newIndex, steps.length - 1));
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [steps.length]);

  const goToStep = (index) => {
    if (scrollRef.current) {
      const cards = scrollRef.current.querySelectorAll(".step-item");
      const target = cards[index];
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          inline: "start",
          block: "nearest",
        });
      }
    }
  };

  return (
    <>
      <div className="container">
        <h3 className="howToUse-title">
          {t("HOME_how_to_use_title") ||
            "КАК ПОЛЬЗОВАТЬСЯ PRAGUE COOLPASS - НЕСКОЛЬКО ПРОСТЫХ ШАГОВ"}
        </h3>
      </div>

      <div className="how-to-use">
        <div className="howToUse-container">
          {/* Карусель для мобильных */}
          <div className="steps-carousel" ref={scrollRef}>
            {steps.map((step, index) => (
              <div key={index} className="step-item">
                <div className="content-use">
                  <div
                    className="step-img"
                    style={{
                      backgroundImage: `url('img/${step.img}.jpg')`,
                    }}
                  >
                    {index === 3 && (
                      <>
                        <a
                          href="https://apps.apple.com/us/app/prague-cool-pass/id1378275600"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link app-store"
                          aria-label="Скачать в App Store"
                        />
                        <a
                          href="https://play.google.com/store/apps/details?id=com.bookletia.coolpassprague"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link google-play"
                          aria-label="Скачать в Google Play"
                        />
                      </>
                    )}
                  </div>

                  <div className="ordering">{index + 1}</div>
                  <div className="step-hint">{step.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="howToUse-steps">
            {steps.map((step, index) => (
              <div key={index} className="content-use">
                <div
                  className="step-img"
                  style={{
                    backgroundImage: `url('img/${step.img}.jpg')`,
                  }}
                >
                  {index === 3 && (
                    <>
                      <a
                        href="https://apps.apple.com/us/app/prague-cool-pass/id1378275600"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                        aria-label="App Store"
                      />
                      <a
                        href="https://play.google.com/store/apps/details?id=com.bookletia.coolpassprague"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                        aria-label="Google Play"
                      />
                    </>
                  )}
                </div>
                <div className="ordering">{index + 1}</div>
                <div className="step-hint">{step.text}</div>
              </div>
            ))}
          </div>
        </div>

          <div className="carousel-dots">
            {steps.map((_, index) => (
              <button
                key={index}
                className={`dot ${activeIndex === index ? "active" : ""}`}
                onClick={() => goToStep(index)}
                aria-label={`Шаг ${index + 1}`}
              />
            ))}
          </div>
      </div>
    </>
  );
}