import Navigation from "../components/Navigation";
import ImageSlider from "../components/ImageSlider";
import BestAttractions from "../components/BestAttractions";
import CoolPassBenefits from "../components/CoolPassBenefits";
import IncludedCoolPass from "../components/IncludedCoolPass";
import HowToUse from "../components/HowToUse";
import News from "../components/News";
import BuyCard from "../components/BuyCard";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";

import { useTranslation } from "../TranslationContext";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/mainPage.css";

export default function MainPage() {
  const { t, translations } = useTranslation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showEmptySearchError, setShowEmptySearchError] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [skipNextSearch, setSkipNextSearch] = useState(false);
  const [showWhiteOverlay, setShowWhiteOverlay] = useState(true); //состояние для белого фона

  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const buttonRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  // Кэшируем список аттракций в нижнем регистре для быстрого поиска
  const attractionsLower = useMemo(() => {
    return (translations?.attractionsList || []).map((item) => ({
      ...item,
      titleLower: item.title.toLowerCase(),
    }));
  }, [translations?.attractionsList]);

  // Эффект для скрытия белого фона через время
  useEffect(() => {
    // Определяем время для разных устройств
    const duration = isMobile ? 2000 : 3000;

    const timer = setTimeout(() => {
      setShowWhiteOverlay(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [isMobile]);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setSearchQuery("");
        setSuggestions([]);
        setShowEmptySearchError(false);
        setShowNoResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (skipNextSearch) {
      setSkipNextSearch(false);
      return;
    }

    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowNoResults(false);
      return;
    }

    const timer = setTimeout(() => {
      const queryLower = searchQuery.toLowerCase().trim();

      const filtered = attractionsLower
        .filter((item) => item.titleLower.includes(queryLower))
        .slice(0, 8);

      setSuggestions(filtered);
      setShowNoResults(filtered.length === 0);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, attractionsLower]);

  const handleSelectSuggestion = (item) => {
    setSearchQuery(item.title);
    setSuggestions([]);
    setShowNoResults(false);
    setShowEmptySearchError(false);
    setSkipNextSearch(true);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowEmptySearchError(false);

    if (value.trim()) setShowNoResults(false);
    setSkipNextSearch(false);
  };

  const handleSearchSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!searchQuery.trim()) {
      setShowEmptySearchError(true);
      setShowNoResults(false);
      setSuggestions([]);

      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = setTimeout(() => {
        setShowEmptySearchError(false);
      }, 4000);

      return;
    }

    const queryLower = searchQuery.toLowerCase().trim();
    const hasResults = attractionsLower.some((item) =>
      item.titleLower.includes(queryLower)
    );

    if (!hasResults) {
      setShowNoResults(true);
      setSuggestions([]);

      setTimeout(() => setSearchQuery(""), 300);

      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = setTimeout(() => setShowNoResults(false), 3000);

      return;
    }

    console.log("Выполняем поиск для:", searchQuery);
    navigate("*");
    setSearchQuery("");
    setSuggestions([]);
    setShowEmptySearchError(false);
    setShowNoResults(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit(e);
    }
  };

  const handleInputFocus = () => {
    if (searchQuery.trim() && suggestions.length > 0) {
    }
  };

  const renderDropdownContent = () => {
    if (showEmptySearchError) {
      return (
        <div className="autocomplete__results">
          <div className="autocomplete__results__item">
            Please enter the name of an attraction you'd like to visit in Prague
          </div>
        </div>
      );
    }

    if (showNoResults) {
      return (
        <div className="autocomplete__results">
          <div className="autocomplete__results__item">
            {t("SEARCH_not_found") || "No attractions found"}
          </div>
        </div>
      );
    }

    if (suggestions.length > 0) {
      return (
        <ul className="autocomplete__results" ref={resultsRef}>
          {suggestions.map((item) => (
            <li
              className="autocomplete__results__item"
              key={item._id}
              onClick={() => handleSelectSuggestion(item)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      );
    }

    return null;
  };

  const shouldShowDropdown =
    showEmptySearchError || showNoResults || suggestions.length > 0;

  return (
    <div className="main-page">
      {/* Белый overlay поверх всего */}
      {showWhiteOverlay && (
        <div
          className="white-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            zIndex: 9999,
            pointerEvents: "none",
            opacity: 1,
            transition: "opacity 0.5s ease",
          }}
        />
      )}

      <div className="nav-wrapper">
        <Navigation />
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

          {/* Поисковая форма на десктопе здесь */}
          {!isMobile && (
            <div className="form-container">
              <div className="search-container" ref={searchRef}>
                <div
                  className={`autocomplete__box ${
                    shouldShowDropdown ? "autocomplete__searching" : ""
                  }`}
                >
                  <div className="autocomplete__inputs">
                    <input
                      placeholder={t("SEARCH") || "Поиск объектов"}
                      type="text"
                      autoComplete="off"
                      className="attractions-search"
                      value={searchQuery}
                      onChange={handleSearchInput}
                      onKeyDown={handleKeyDown}
                      onFocus={handleInputFocus}
                    />
                    <input type="hidden" />
                  </div>

                  {shouldShowDropdown && renderDropdownContent()}
                </div>
                <div
                  className="magnifying-glass"
                  onClick={handleSearchSubmit}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src="img/search.a842451d.svg"
                    alt="search"
                    style={{
                      width: "20px",
                      height: "20px",
                      position: "absolute",
                      right: "9px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                </div>
              </div>
              <button
                ref={buttonRef}
                className="action-button show-attractions-btn"
                onClick={handleSearchSubmit}
                type="button"
              >
                {t("HOME_lets_go_button") || "Поехали"}
              </button>
            </div>
          )}
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

      {/* Поисковая форма на мобильных после underbar */}
      {isMobile && (
        <div className="mobile-form-container">
          <div
            className="search-container mobile-search-container"
            ref={searchRef}
          >
            <div
              className={`autocomplete__box ${
                shouldShowDropdown ? "autocomplete__searching" : ""
              }`}
            >
              <div className="autocomplete__inputs">
                <input
                  placeholder={t("SEARCH") || "Поиск объектов"}
                  type="text"
                  autoComplete="off"
                  className="attractions-search mobile-attractions-search"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onKeyDown={handleKeyDown}
                  onFocus={handleInputFocus}
                />
                <input type="hidden" />
              </div>

              {shouldShowDropdown && renderDropdownContent()}
            </div>
            <div
              className="magnifying-glass mobile-magnifying-glass"
              onClick={handleSearchSubmit}
              style={{ cursor: "pointer" }}
            >
              <img src="img/search.a842451d.svg" alt="search" />
            </div>
          </div>
          <button
            ref={buttonRef}
            className="action-button mobile-show-attractions-btn"
            onClick={handleSearchSubmit}
            type="button"
          >
            {t("HOME_lets_go_button") || "Поехали"}
          </button>
        </div>
      )}

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

      <Footer />
    </div>
  );
}
