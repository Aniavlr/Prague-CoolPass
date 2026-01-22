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
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/mainPage.css";

export default function MainPage() {
  const { t, translations } = useTranslation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [hasResults, setHasResults] = useState(false);
  const [showEmptySearchError, setShowEmptySearchError] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const buttonRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  const attractions = translations?.attractionsList || [];

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
        setHasResults(false);
        setShowEmptySearchError(false);
        setShowNoResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setHasResults(false);
      setShowNoResults(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    const filtered = attractions
      .filter((item) => item.title.toLowerCase().includes(query))
      .slice(0, 8);

    setSuggestions(filtered);
    setHasResults(filtered.length > 0);
    setShowNoResults(filtered.length === 0);
  }, [searchQuery, attractions]);

  const handleSelectSuggestion = (item) => {
    setSearchQuery(item.title);
    setSuggestions([]);
    setHasResults(false);
    setShowNoResults(false);
    setShowEmptySearchError(false);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowEmptySearchError(false);
    setShowNoResults(false);
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
      setHasResults(false);

      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      errorTimeoutRef.current = setTimeout(() => {
        setShowEmptySearchError(false);
      }, 4000);

      return;
    }

    // Проверяем, есть ли результаты для текущего запроса
    const query = searchQuery.toLowerCase().trim();
    const hasResultsForQuery = attractions.some((item) => 
      item.title.toLowerCase().includes(query)
    );

    if (!hasResultsForQuery) {
      setShowNoResults(true);
      setSuggestions([]);
      setHasResults(false);
      
      setTimeout(() => {
        setSearchQuery("");
      }, 300);
      
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      
      errorTimeoutRef.current = setTimeout(() => {
        setShowNoResults(false);
      }, 3000);
      
      return;
    }

    console.log("Выполняем поиск для:", searchQuery);
    navigate("*");
    setSearchQuery("");
    setSuggestions([]);
    setHasResults(false);
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
      setHasResults(true);
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

  // Определяем, нужно ли показывать выпадающий список
  const shouldShowDropdown =
    showEmptySearchError || showNoResults || suggestions.length > 0;

  return (
    <div className="main-page">
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

                {/* Выпадающий список с подсказками или сообщениями об ошибках */}
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

      <Footer />
    </div>
  );
}