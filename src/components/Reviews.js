import { useState, useEffect, useRef } from "react";
import { useTranslation } from "../TranslationContext";
import "../styles/reviews.css";

export default function Reviews() {
  const {t} = useTranslation();
  const scrollContainerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [reviewsData, setReviewsData] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({}); // ← возвращаем индивидуальное состояние для каждой карточки

  const staticReviewIds = [
    "62c2bb7e067e8a53d7f8c308",
    "62de934abce9142a40a776a9",
    "64469ab6c7f4f7796e37913d",
    "64c3ac9ffc3f310cd7cdd2bf",
    "64c38882982a0711b05ee923",
    "5d31980efb520e63b62f5414",
    "5d975eaefb520e63b62f54a2",
    "6323581f6ab033790aea51fc",
    "647f0a4cb337964663231de0",
    "5d446de5fb520e63b62f5427",
    "64469ca8c7f4f7796e37913f",
    "5e0514471c2ed13d91d61e09",
    "62de940ebce9142a40a776aa",
    "67669e2bc7aaaf7af9be8d07",
    "670f8b039962b54dbd2269fe",
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const shouldTruncateText = (text) => {
    if (!text) return false;
    return text.length > 200;
  };

  const truncateText = (text) => {
    if (!text) return "";
    if (text.length <= 200) return text;
    return text.substring(0, 200) + "...";
  };

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch(
          "https://api2.praguecoolpass.com/review/approved"
        );
        const allReviews = await response.json();

        const filteredReviews = allReviews.filter((review) =>
          staticReviewIds.includes(review._id)
        );

        const sortedReviews = staticReviewIds
          .map((id) => filteredReviews.find((review) => review._id === id))
          .filter((review) => review);

        setReviewsData(sortedReviews);
      } catch (error) {
        console.error("Ошибка загрузки отзывов:", error);
      }
    };

    loadReviews();
  }, []);

  const CARDS_PER_VIEW = 3;
  const TOTAL_CARDS = reviewsData.length;
  const TOTAL_PAGES = Math.ceil(TOTAL_CARDS / CARDS_PER_VIEW);

  const CARD_WIDTH = 367;
  const GAP = 20;
  const STEP = CARD_WIDTH + GAP;

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

  if (reviewsData.length === 0) {
    return <div className="no-reviews">Отзывы не найдены</div>;
  }

  return (
    <>
      <div className="container">
        <div className="reviews-section-header">
          <h3 className="reviews-section-title">
            {t("REVIEWS_what_do_customers_say") ||
              "ЧТО ГОВОРЯТ НАШИ КЛИЕНТЫ О COOLPASS /КАРТОЧКЕ ПРАГИ"}
          </h3>
          <div className="rating-wrapper">
            <div className="average-review-rating">
              <div className="average-rating">4.6</div>
            </div>
            <div className="stars-rating">
              <span className="active-star"></span>
              <span className="active-star"></span>
              <span className="active-star"></span>
              <span className="active-star"></span>
              <span className="active-star"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="reviews-carousel">
        <div className="reviews-carousel-container">
          <div
            className={`reviews-left-control ${isFirstPage ? "disabled" : ""}`}
            onClick={scrollLeft}
            role="button"
            tabIndex={0}
            aria-label="Предыдущие отзывы"
          />

          <div className="carousel-scroll-wrapper" ref={scrollContainerRef}>
            <div className="carousel-track">
              {reviewsData.map((review) => {
                const isExpanded = expandedReviews[review._id];
                const shouldShowMoreButton = shouldTruncateText(review.text);
                const displayText = isExpanded
                  ? review.text
                  : shouldShowMoreButton
                  ? truncateText(review.text)
                  : review.text;

                return (
                  <div key={review._id} className="rev-card-wrapper">
                    <div
                      className={`rev-card-container ${
                        isExpanded ? "expanded" : ""
                      }`}
                    >
                      <div className="review-header">
                        <div className="stars-rating rating">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < review.rating ? "active-star" : "star"
                              }
                            ></span>
                          ))}
                        </div>
                        <div className="review-summary">
                          {review.title || "Без названия"}
                        </div>
                        <div className="date">
                          {formatDate(review.date) || "Дата не указана"}
                        </div>
                      </div>

                      <div
                        className={`review-body ${
                          isExpanded ? "expanded" : ""
                        }`}
                      >
                        <span
                          className={`review-text ${
                            !isExpanded && shouldShowMoreButton
                              ? "truncated"
                              : ""
                          }`}
                        >
                          {displayText || "Текст отзыва отсутствует"}
                        </span>

                        {shouldShowMoreButton && (
                          <span
                            className="more-btn"
                            onClick={() => toggleReviewExpansion(review._id)}
                          >
                            {isExpanded ? " less" : " more"}
                          </span>
                        )}
                      </div>

                      <div className="review-footer">
                        <div className="reviewer-data">
                          {review.name || "Аноним"},{" "}
                          {review.place || "Место не указано"}
                        </div>
                        <div className="see-translation"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className={`reviews-right-control ${isLastPage ? "disabled" : ""}`}
            onClick={scrollRight}
            role="button"
            tabIndex={0}
            aria-label="Следующие отзывы"
          />
        </div>
      </div>
      <div className="buttons">
        <div id="see-all" className="review-button">
          <a href="*">{t("REVIEWS_see_all") || "ПОСМОТРЕТЬ ВСЕ ОТЗЫВЫ"}</a>
        </div>
        <div id="write-your-opinion-btn" className="review-button">
          <span>
            {t("REVIEWS_write_your_opinion") || "НАПИШИТЕ СВОЙ ОТЗЫВ"}
          </span>
        </div>
      </div>
    </>
  );
}
