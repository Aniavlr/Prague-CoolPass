import { useTranslation } from "../TranslationContext";

import "../styles/howToUse.css";

export default function HowToUse() {
  const t = useTranslation();

  return (
    <>
      <div className="container">
        <h3 className="howToUse-title">
          {t("HOME_how_to_use_title") || "КАК ПОЛЬЗОВАТЬСЯ PRAGUE COOLPASS - НЕСКОЛЬКО ПРОСТЫХ ШАГОВ"}
        </h3>
      </div>

      <div className="how-to-use">
        <div className="howToUse-container">
          <div className="howToUse-steps">
            {[...Array(4)].map((_, index) => {
              const text = t(`how_to_use_${index}`) || "";

              return (
                <div key={index} className="content-use">
                  <div
                    className="step-img"
                    style={{
                      backgroundImage: `url('img/${
                        ["use1", "use2", "use3", "prague-card"][index]
                      }.jpg')`,
                    }}
                  >
                    <a
                      href="https://apps.apple.com/us/app/prague-cool-pass/id1378275600"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                      aria-label="Скачать Prague CoolPass в App Store"
                    ></a>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.bookletia.coolpassprague"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                      aria-label="Скачать Prague CoolPass в Google Play"
                    ></a>
                  </div>
                  <div className="ordering">{index + 1}</div>
                  <div className="step-hint">{text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
