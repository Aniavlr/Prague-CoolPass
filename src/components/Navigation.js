import ButtonPay from "./ButtonPay";
import ButtonTranslate from "./ButtonTranslate";
import { useTranslation } from "../TranslationContext";
import { useEffect, useState } from "react";

export default function Navigation() {
  const {t, setTranslations} = useTranslation();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);
  
  return (
    <div className={`nav-wrapper ${!isVisible ? "hidden" : ""}`}>
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
                  <a href="*">{t(id) || "Loading..."}</a>
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
    </div>
  );
}

const menuIds = [
  "5a7a893966105c2e28d87bd1",
  "5a7a894466105c2e28d87bd2",
  "5a7a894f66105c2e28d87bd3",
  "5a7a896166105c2e28d87bd4",
  "5a7a897266105c2e28d87bd5",
  "5a7a898166105c2e28d87bd6",
];
