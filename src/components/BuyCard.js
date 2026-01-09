import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "../TranslationContext";

import "../styles/buyCard.css";

export default function BuyCard() {
  const scrollContainerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [counts, setCounts] = useState({
    adult: Array(8).fill(0),
    student: Array(8).fill(0),
  });
  const t = useTranslation();

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

  const CARDS_PER_VIEW = 3;
  const TOTAL_PAGES = Math.ceil(cards.length / CARDS_PER_VIEW); // 3 страницы: 1-3, 4-6, 7-8

  const CARD_WIDTH = 355;
  const GAP = 20;
  const STEP = CARD_WIDTH + GAP; // 375px на карточку

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: currentPage * STEP * CARDS_PER_VIEW,
        behavior: "smooth",
      });
    }
  }, [currentPage, STEP]);

  const scrollLeft = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const scrollRight = () => {
    setCurrentPage((prev) => Math.min(TOTAL_PAGES - 1, prev + 1));
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
          {/* Стрелка влево */}
          <div
            className="buy-card-left-control"
            onClick={scrollLeft}
            role="button"
            tabIndex={0}
            aria-label="Предыдущие карточки"
          />

          {/* Контейнер со скроллом */}
          <div className="buy-card-scroll-wrapper" ref={scrollContainerRef}>
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
                    {/* Взрослый */}
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
                            <span className="horizontal"></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Студенты / Дети */}
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
                            <span className="horizontal"></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Итог */}
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

          {/* Стрелка вправо */}
          <div
            className="buy-card-right-control"
            onClick={scrollRight}
            role="button"
            tabIndex={0}
            aria-label="Следующие карточки"
          />
        </div>
        <div className="pagination">
          {Array.from({ length: TOTAL_PAGES }).map((_, pageIndex) => (
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
          ))}
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
