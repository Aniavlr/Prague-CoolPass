import ButtonPay from "./ButtonPay";
import ButtonTranslate from "./ButtonTranslate";
import { useTranslation } from "../TranslationContext";
import { useEffect, useState } from "react";

const menuIds = [
  "5a7a893966105c2e28d87bd1",
  "5a7a894466105c2e28d87bd2",
  "5a7a894f66105c2e28d87bd3",
  "5a7a896166105c2e28d87bd4",
  "5a7a897266105c2e28d87bd5",
  "5a7a898166105c2e28d87bd6",
];

export default function Navigation() {
  const { t, setTranslations } = useTranslation();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const delta = 20;

    const controlNavbar = () => {
      const current = window.scrollY;

      if (current <= 0) {
        setIsVisible(true);
        setLastScrollY(0);
        return;
      }

      if (current > lastScrollY + delta) {
        setIsVisible(false);
      } else if (current < lastScrollY - delta) {
        setIsVisible(true);
      }

      setLastScrollY(current);
    };

    window.addEventListener("scroll", controlNavbar, { passive: true });
    controlNavbar();

    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

 return (
    <>
      <div className={`nav-wrapper ${!isVisible ? "hidden" : ""}`}>
        <nav className="navbar">
          <div className="navbar-container">
            <button
                className="hamburger mobile-only"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <img src="/img/close.svg" alt="Close menu" />
                ) : (
                  <img src="/img/menu.svg" alt="Open menu" />
                )}
              </button>

            <div className="left-nav">
              <a href="/" className="navbar-brand">
                CoolPass
              </a>
            </div>

            {/* Десктопное меню */}
            <div className="center-nav desktop-menu">
              <ul className="menu">
                {menuIds.map((id) => (
                  <li key={id}>
                    <a href="*">{t(id) || "Loading..."}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Правая часть */}
            <div className="right-nav">
              <ButtonPay />

              <div className="desktop-only">
                <ButtonTranslate onTranslationsChange={setTranslations} />
              </div>
            </div>

          </div>
        </nav>
      </div>

      {/* Мобильное меню */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-content">

          <ul className="mobile-menu-list">
            {menuIds.map((id) => (
              <li key={id}>
                <a href="*" onClick={toggleMobileMenu}>
                  {t(id) || "Loading..."}
                </a>
              </li>
            ))}
          </ul>

          <div className="mobile-translate">
            <ButtonTranslate onTranslationsChange={setTranslations} />
          </div>

        </div>
      </div>
    </>
  );
}
