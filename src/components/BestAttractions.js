import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "../TranslationContext";

import "../styles/bestAttractions.css";

export default function BestAttractions() {
  const scrollContainerRef = useRef(null);
  const [likedCards, setLikedCards] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const {t} = useTranslation();

  const handleLikeClick = (index) => {
    setLikedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleMouseEnter = (index) => {
    setHoveredCard(index);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const attractions = [
    {
      id: "5a2d0366e7f9516f98bc904e", // Собор Святого Вита
      img: "img/small_3ea2e28d-bcac-447c-9b02-eadcb21a05f4.jpg",
    },
    {
      id: "5a3252535d71665d5eacc36d", // Пражский зоопарк
      img: "img/small_e355f6ab-122a-44d0-b907-8e5abe0fc447.jpg",
    },
    {
      id: "5a2ffbdb142d58464cbac7e7", // Еврейский музей
      img: "img/ev.jpg",
    },
    {
      id: "5a312536142d58464cbac7fe", // Круиз Пражская Венеция
      img: "img/cruiz.jpg",
    },
    {
      id: "5a55f9b3ee67b73d3bfa56f8", // Автобусный тур
      img: "img/bus_tour.jpg",
    },
    {
      id: "5a3179c7142d58464cbac80d", // Национальный музей
      img: "img/nat_museum.jpg",
    },
    {
      id: "5a2e1198142d58464cbac7cb", // Лобковицкий дворец
      img: "img/palace.jpg",
    },
    {
      id: "5a3ec76013c21322a891f833", // Музей города Праги
      img: "img/museum_prague.jpg",
    },
    {
      id: "5ad8874e312c8c1c751b5c77", // Музей чувств
      img: "img/mus_feeling.jpg",
    },
    {
      id: "5a27c30b1594ba5ec0e03b9e", // Дом у Золотого перстня
      img: "img/house.jpg",
    },
    {
      id: "5a311923142d58464cbac7f3", // Монастырь Святой Анежи
      img: "img/monastery.jpg",
    },
    {
      id: "5a3246685d71665d5eacc366", // Вышеградские казематы
      img: "img/kasemats.jpg",
    },
    {
      id: "5a2e18ce142d58464cbac7d4", // Museum of Bricks
      img: "img/mus_bricks.jpg",
    },
    {
      id: "6697c0961bccd5142d6ece0e", // Story of Prague
      img: "img/story.jpg",
    },
    {
      id: "64745fccb337964663231dd8", // Pilsner Urquell
      img: "img/pilsner.jpg",
    },
  ];

  const CARDS_PER_VIEW = 4;
  const TOTAL_CARDS = attractions.length;
  const TOTAL_PAGES = Math.ceil(TOTAL_CARDS / CARDS_PER_VIEW);

  const CARD_WIDTH = 270;
  const GAP = 20;
  const STEP = CARD_WIDTH + GAP; // 290px на карточку

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= TOTAL_PAGES - 1;

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: currentPage * STEP * CARDS_PER_VIEW,
        behavior: "smooth",
      });
    }
  }, [currentPage, STEP]);

  const scrollLeft = () => {
    if (!isFirstPage) {
      setCurrentPage((prev) => Math.max(0, prev - 1));
    }
  };

  const scrollRight = () => {
    if (!isLastPage) {
      setCurrentPage((prev) => Math.min(TOTAL_PAGES - 1, prev + 1));
    }
  };

  return (
    <>
      <div className="container">
        <h3 className="top-attractions-title">
          {t("HOME_top_attractions_title") ||
            "ЛУЧШИЕ ДОСТОПРИМЕЧАТЕЛЬНОСТИ ПРАГИ В ПРЕДЛОЖЕНИИ COOLPASS"}
        </h3>
      </div>

      <div className="attractions-carousel">
        <div className="carousel-container">
          {/* Стрелка влево */}
          <div
            className={`left-control ${isFirstPage ? "disabled" : ""}`}
            onClick={scrollLeft}
            role="button"
            tabIndex={0}
            aria-label="Предыдущие достопримечательности"
          />

          {/* Контейнер с карточками */}
          <div className="carousel-scroll-wrapper" ref={scrollContainerRef}>
            <div className="carousel-track">
              {attractions.map((attr, index) => (
                <div
                  key={index}
                  className="card-wrapper"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className="card-container"
                    style={{ backgroundImage: `url('${attr.img}')` }}
                  >
                    <a href="*" className="link">
                      <div className="card-benefit">
                        <p className="benefit-text">
                          {localStorage.getItem("selectedLang") === "Русский"
                            ? "ВКЛЮЧЕНО с Пассом"
                            : t("ENTRY INCLUDED") || "ENTRY INCLUDED"}
                        </p>
                      </div>
                      <div
                        className={`card-footer ${
                          hoveredCard === index ? "expanded" : ""
                        }`}
                      >
                        <div className="card-footer-content">
                          <p className="attraction-title">
                            {t(`ATTR_${attr.id}_title`) ||
                              "Название не найдено"}
                          </p>
                          {hoveredCard === index && (
                            <p className="attraction-subtitle">
                              {t(`ATTR_${attr.id}_subtitle`) || ""}
                            </p>
                          )}
                        </div>
                        <div
                          className={
                            likedCards.has(index)
                              ? "like-btn-active"
                              : "like-btn-disabled"
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLikeClick(index);
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={
                            likedCards.has(index)
                              ? "Убрать из избранного"
                              : "Добавить в избранное"
                          }
                        />
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Стрелка вправо */}
          <div
            className={`right-control ${isLastPage ? "disabled" : ""}`}
            onClick={scrollRight}
            role="button"
            tabIndex={0}
            aria-label="Следующие достопримечательности"
          />
        </div>
      </div>
    </>
  );
}
