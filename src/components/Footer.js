import { useTranslation } from "../TranslationContext";
import "../styles/footer.css";

export default function Footer() {
  const t = useTranslation();

  const getTranslation = (key, defaultText) => {
    const translation = t(key);

    if (!translation || translation === key || translation.trim() === "") {
      return defaultText;
    }

    return translation;
  };

  const currentYear = new Date().getFullYear();
  const apiData = getTranslation("FOOTER_year_card", "Prague Card 1992-$year");

  const formattedText = apiData.replace("$year", currentYear);

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <ul className="footer-section first-section">
            <a href="*">
              {getTranslation("FOOTER_pass_and_card", "CoolPass / Prague Card")}
            </a>
            <a href="*">
              {getTranslation("FOOTER_USING_COOLPASS", "How to use CoolPass")}
            </a>
            <a href="*">
              {getTranslation("FOOTER_how_you_save", "How to save")}
            </a>
            <a href="*">
              {getTranslation("FOOTER_get_your_pass", "Get your Pass")}
            </a>
            <a href="*">
              {getTranslation("FOOTER_sales_points", "Sales points")}
            </a>
            <a href="*">
              {getTranslation("FOOTER_reviews", "Customer reviews")}
            </a>
          </ul>
          <ul className="footer-section">
            <a href="*">{getTranslation("ATTRACTIONS", "ATTRACTIONS")}</a>
            <a href="*">
              {getTranslation("FOOTER_sightseeing_tours", "Sightseeing tours")}
            </a>
            <a href="*">{getTranslation("FOOTER_areas", "Prague areas")}</a>
            <a href="*">
              {getTranslation("FOOTER_closures", "Temporary closures")}
            </a>
            <a href="*">{getTranslation("FOOTER_whats_on", "News")}</a>
            <a href="*">{getTranslation("FOOTER_contact_us", "Contact us")}</a>
          </ul>
          <ul className="footer-section about-us">
            <a href="*" className="faq-btn">
              {getTranslation("FOOTER_faq", "FAQ")}
            </a>
            <a href="*">{getTranslation("FOOTER_about_us", "About us")}</a>
            <a href="*">
              {getTranslation(
                "FOOTER_terms_and_conditions",
                "Terms and conditions"
              )}
            </a>
            <a href="*">
              {getTranslation(
                "FOOTER_cancellation_and_refund",
                "Cancellation and refund"
              )}
            </a>
          </ul>
          <div className="download-links">
            <p className="download">{getTranslation("DOWNLOAD", "DOWNLOAD")}</p>
            <p className="app-title">
              {getTranslation(
                "FOOTER_prague_coolpass_app",
                "Prague CoolPass app"
              )}
            </p>
            <a
              href="https://apps.apple.com/us/app/prague-cool-pass/id1378275600"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
              aria-label={getTranslation(
                "DOWNLOAD_APP_STORE",
                "Download Prague CoolPass in App Store"
              )}
            >
              <div className="appstore"></div>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.bookletia.coolpassprague"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
              aria-label={getTranslation(
                "DOWNLOAD_GOOGLE_PLAY",
                "Download Prague CoolPass in Google Play"
              )}
            >
              <div className="google-play"></div>
            </a>
          </div>
          <div className="news-and-updates">
            <div className="news-and-updates-title">
              {getTranslation("NEWS_AND_UPDATES", "NEWS AND UPDATES")}
            </div>
            <div>
              <form className="subscribe-form">
                <label>
                  <input
                    name="email"
                    type="email"
                    placeholder={getTranslation(
                      "ENTER_EMAIL_PLACEHOLDER",
                      "Your e-mail"
                    )}
                  ></input>
                </label>
                <button type="submit" className="subscribe-btn">
                  {getTranslation("EMAIL_SUBSCRIBE", "subscribe")}
                </button>
              </form>
            </div>
            <div className="footer-info-year">{"CoolPass 2020-2026"}</div>
            <div className="footer-info">{formattedText}</div>
            <p className="rights-reserved-block">
              {getTranslation(
                "ALL_RIGHTS_RESERVED_LABEL",
                "All rights reserved Travel CoolPass Ltd. and CoolPass s.r.o."
              )}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
