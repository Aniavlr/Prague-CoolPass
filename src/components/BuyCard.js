import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "../TranslationContext";
import "../styles/buyCard.css";

export default function BuyCard() {
  const scrollContainerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [counts, setCounts] = useState({
    adult: Array(8).fill(0),
    student: Array(8).fill(0),
  });
  const {t} = useTranslation();

  // Определяем мобильное устройство
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const cards = [
    { days: 1, adultPrice: 72, studentPrice: 52 },
    { days: 2, adultPrice: 96, studentPrice: 68 },
    { days: 3, adultPrice: 116, studentPrice: 84 },
    { days: 4, adultPrice: 128, studentPrice: 92 },
    { days: 5, adultPrice: 132, studentPrice: 96 },
    { days: 6, adultPrice: 144, studentPrice: 104 },
    { days: 7, adultPrice: 152, studentPrice: 112 },
    { days: 10, adultPrice: 160, studentPrice: 120 },
  ];

  // Разные настройки для десктопа и мобильных
  const DESKTOP_CARDS_PER_VIEW = 3;
  const MOBILE_CARDS_PER_VIEW = 1;
  
  const CARDS_PER_VIEW = isMobile ? MOBILE_CARDS_PER_VIEW : DESKTOP_CARDS_PER_VIEW;
  const TOTAL_PAGES = Math.ceil(cards.length / CARDS_PER_VIEW);

  const CARD_WIDTH = 355;
  const GAP = 20;
  const STEP = CARD_WIDTH + GAP;

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= TOTAL_PAGES - 1;


  useEffect(() => {
    setCurrentPage(0);
  }, [isMobile]);

  // Обработчики свайпа
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!isMobile) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;
    const threshold = 50; // Минимальное расстояние для свайпа
    
    // Свайп вправо (показать предыдущую карточку)
    if (deltaX > threshold && !isFirstPage) {
      setCurrentPage(prev => Math.max(0, prev - 1));
    }
    // Свайп влево (показать следующую карточку)
    else if (deltaX < -threshold && !isLastPage) {
      setCurrentPage(prev => Math.min(cards.length - 1, prev + 1));
    }
  };

  // Обработка скролла колесиком мыши и касанием
  const handleScroll = () => {
    if (!scrollContainerRef.current || !isMobile) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const cardIndex = Math.round(scrollLeft / (CARD_WIDTH + GAP));
    
    if (cardIndex >= 0 && cardIndex < cards.length) {
      setCurrentPage(cardIndex);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  useEffect(() => {
    if (scrollContainerRef.current && !isMobile) {
      scrollContainerRef.current.scrollTo({
        left: currentPage * STEP * CARDS_PER_VIEW,
        behavior: "smooth",
      });
    }
  }, [currentPage, STEP, CARDS_PER_VIEW, isMobile]);

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

  // Прямой переход к карточке (для мобильных)
  const goToCard = (cardIndex) => {
    if (isMobile) {
      // На мобильных каждая карточка - отдельная страница
      setCurrentPage(cardIndex);
      // Прокручиваем к карточке
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          left: cardIndex * (CARD_WIDTH + GAP),
          behavior: "smooth",
        });
      }
    } else {
      // На десктопе определяем страницу по индексу карточки
      const page = Math.floor(cardIndex / DESKTOP_CARDS_PER_VIEW);
      setCurrentPage(page);
    }
  };

  const handleIncrement = (index, type) => {
    setCounts((prev) => ({
      ...prev,
      [type]: prev[type].map((count, i) => (i === index ? count + 1 : count)),
    }));
  };

  const handleDecrement = (index, type) => {
    setCounts((prev) => ({
      ...prev,
      [type]: prev[type].map((count, i) =>
        i === index && count > 0 ? count - 1 : count
      ),
    }));
  };

  const calculateTotal = (index) => {
    const adult = counts.adult[index] * cards[index].adultPrice;
    const student = counts.student[index] * cards[index].studentPrice;
    return (adult + student).toFixed(2);
  };

  const getTitle = (days) => {
    return (
      `${days} ` +
        t("ESHOP_product_name_DAY") +
        " " +
        t("ESHOP_product_name_PASS") || `${days} ДНЕВНЫй ПАСС`
    );
  };

  return (
    <>
      <div className="container">
        <h3 className="calculator-section-title">
          {t("BUY_COOLPASS_PRAGUE_CARD") ||
            "КУПИТЬ КАРТОЧКУ ПРАГИ /PRAGUE COOLPASS"}
        </h3>
      </div>

      <div className="calculator-section">
        <div className="buy-card-carousel">
        
          <div
            className={`buy-card-left-control ${isFirstPage ? "disabled" : ""}`}
            onClick={scrollLeft}
            role="button"
            tabIndex={0}
            aria-label="Предыдущие карточки"
          />

         
          <div 
            className="buy-card-scroll-wrapper" 
            ref={scrollContainerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="buy-card-track">
              {cards.map((card, index) => (
                <div key={index} className="calculator-container">
                  <div className="card-header">
                    <div className="card-header-content">
                      <h2 className="card-type">{getTitle(card.days)}</h2>
                      <p className="card-subtitle">
                        {t("BUY_PRAGUE_CARD_COOL_PASS") ||
                          "Покупка Prague CoolPass /Card"}
                      </p>
                    </div>
                  </div>

                  <div className="card-body">
                   
                    <div className="adult-card-calculator">
                      <p className="adult-calculator-label">
                        {t("ADULT") || "Взрослый"}
                      </p>
                      <p className="price-label">{t("PRICE") || "Цена"}</p>
                      <div className="price-section">
                        <p className="adult-price">{card.adultPrice} EUR</p>
                      </div>
                      <div className="calculator">
                        <div
                          className="decrement-btn"
                          onClick={() => handleDecrement(index, "adult")}
                        >
                          <span className="decrement"></span>
                        </div>
                        <div className="card-count">
                          <p className="card-counter">{counts.adult[index]}</p>
                        </div>
                        <div
                          className="increment-btn"
                          onClick={() => handleIncrement(index, "adult")}
                        >
                          <div className="plus">
                            <span className="vertical"></span>
                            <span className="decrement"></span>
                          </div>
                        </div>
                      </div>
                    </div>

                 
                    <div className="child-card-calculator">
                      <p className="student-calculator-label">
                        {t("STUDENT_CHILD") || "Студенты /Дети"}
                      </p>
                      <div className="price-section">
                        <p className="student-price">{card.studentPrice} EUR</p>
                      </div>
                      <div className="calculator">
                        <div
                          className="decrement-btn"
                          onClick={() => handleDecrement(index, "student")}
                        >
                          <span className="decrement"></span>
                        </div>
                        <div className="card-count">
                          <p className="card-counter">
                            {counts.student[index]}
                          </p>
                        </div>
                        <div
                          className="increment-btn"
                          onClick={() => handleIncrement(index, "student")}
                        >
                          <div className="plus">
                            <span className="vertical"></span>
                            <span className="decrement"></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    
                    <div className="total-price-section">
                      <div className="total-price">
                        <p className="total-price-label">
                          {t("YOUR_PRICE") || "Стоимость:"}
                        </p>
                        <p className="price">{calculateTotal(index)} EUR</p>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer-card">
                    <a href="*">
                      <p className="footer-text">
                        {t("CALCULATOR_COMPLETE_BOOKING_BTN") ||
                          "Оформить заказ"}
                      </p>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

         
          <div
            className={`buy-card-right-control ${isLastPage ? "disabled" : ""}`}
            onClick={scrollRight}
            role="button"
            tabIndex={0}
            aria-label="Следующие карточки"
          />
        </div>
        
        
        <div className="pagination">
          {isMobile ? (
           
            Array.from({ length: cards.length }).map((_, index) => (
              <span
                key={index}
                className={`bullet ${
                  currentPage === index ? "bullet-active" : ""
                }`}
                onClick={() => goToCard(index)}
                role="button"
                tabIndex={0}
                aria-label={`Перейти к карточке ${index + 1} дней`}
              />
            ))
          ) : (
        
            Array.from({ length: TOTAL_PAGES }).map((_, pageIndex) => (
              <span
                key={pageIndex}
                className={`bullet ${
                  currentPage === pageIndex ? "bullet-active" : ""
                }`}
                onClick={() => setCurrentPage(pageIndex)}
                role="button"
                tabIndex={0}
                aria-label={`Перейти на страницу ${pageIndex + 1}`}
              />
            ))
          )}
        </div>
      </div>

      <div className="tips">
        <div className="first-tip-block">
          <ul style={{ listStyleImage: "url('img/list-bullet.svg')" }}>
            <li>
              {t("CALCULATOR_card_validity") ||
                "Prague CoolPass /Карточка Праги действительна в течение последовательных календарных дней (не 24 часов)."}
            </li>
            <li>
              {t("CALCULATOR_child_card_validity_tip") ||
                " Детский/студенческий пасс предназначен для детей 6-16 лет и студентов на дневном обучении до 26 лет."}
            </li>
          </ul>
        </div>
        <div className="second-tip-block">
          <ul style={{ listStyleImage: "url('img/list-bullet.svg')" }}>
            <li>
              {t("CALCULATOR_student_id_info") ||
                "Для использования студенческого пасса подойдет любой национальный или международный студенческий документ. Он не нужен при покупке карточки, но вас могут попросить предъявить его при входе в достопримечательности."}
            </li>
          </ul>
        </div>
        <div className="third-tip-block">
          <p>{t("ADULT_AGE") || "Взрослый 16+ лет"}</p>
          <p>{t("STUDENT_AGE") || "СТУДЕНТ 16-26 лет"}</p>
          <p>{t("CHILD_AGE") || "ДЕТИ 6-16 лет"}</p>
        </div>
      </div>
    </>
  );
}