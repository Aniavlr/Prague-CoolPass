import { useTranslation } from "../TranslationContext";

import "../styles/news.css";

export default function News() {
  const {t} = useTranslation();

  return (
    <>
      <div className="container">
        <h3 className="news-title-section">
          {t("HOME_news_title") || "НОВОСТИ"}
        </h3>
      </div>

      <div className="news">
        <div className="news-container">
          <div className="news-content">
            <div className="news-card-container">
              <div
                className="news-image"
                style={{ backgroundImage: "url('img/news1.jpg')" }}
              >
                <div data-v-28b4c0a4="" class="news-date">
                  10.12.2025
                </div>
              </div>
              <div className="news-text">
                <a href="*" className="link">
                  <h4 class="news-title">
                    CELEBRATE CHRISTMAS WITH SAVINGS: ENJOY COOLPASS HOLIDAY
                    DISCOUNTS UNTIL JANUARY 4 ✨
                  </h4>
                </a>
                <p className="news-paragraph">
                  Unwrap the joy of savings with CoolPass during the holiday
                  season! As the festive spirit takes hold and Prague streets
                  and squares turn into a sparkling wonderland, we are happy to
                  announce our special Christmas offer. Starting from December
                  10th, all passes sell online with 10% discount.
                  <br />
                  Make sightseeing part of your Prague winter adventure,
                  choosing from the numerous top attractions as well as hidden
                  gems included in CoolPass. Explore the iconic Prague Castle
                  and Jewish Quarter, admire the elegant views of the city from
                  a cruise boat, have some fun at the Illusion Art M...
                </p>
                <a href="*" className="link">
                  <p data-v-28b4c0a4="" class="read-more">
                    {t("READ_MORE") || "читать далее"}
                  </p>
                </a>
              </div>
            </div>

            <div className="news-card-container">
              <div className="news-text">
                <a href="*" className="link">
                  <h4 class="news-title">
                    MEET COOLPASS CZ - NEW APP FULL OF CZECHIA!
                  </h4>
                </a>
                <p className="news-paragraph">
                  We are happy to share exciting news – the brand-new CoolPass
                  app covering the entire Czechia has arrived! Its name is{" "}
                  <a
                    href="https://www.coolpass.cz/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <strong>CoolPass CZ</strong>
                  </a>{" "}
                  and by this we mean that dozens of exclusive deals and
                  discounts are now available to you – not just in Prague, but
                  also in Czech regions. Central and South Bohemia, Karlovy
                  Vary, Highlands, Bohemian Paradise and more – discover
                  adventure all over the country while making great savings on
                  your way.
                  <br />
                  The app is free to use for guidance and informatio...
                </p>
                <a href="*" className="link">
                  <p data-v-28b4c0a4="" class="read-more">
                    {t("READ_MORE") || "читать далее"}
                  </p>
                </a>
              </div>
              <div
                className="news-image"
                style={{ backgroundImage: "url('img/news2.jpg')" }}
              >
                <div data-v-28b4c0a4="" class="news-date">
                  18.04.2025
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <a href="*" className="button-container">
              <button className="button">
                {t("SEE_ALL_NEWS") || "ПОСМОТРЕТЬ ВСЕ НОВОСТИ"}
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
