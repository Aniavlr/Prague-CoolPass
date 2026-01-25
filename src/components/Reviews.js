import { useState, useEffect, useRef } from "react";
import { useTranslation } from "../TranslationContext";
import "../styles/reviews.css";

export default function Reviews() {
  const { t } = useTranslation();
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewsData, setReviewsData] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(date);
  };

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  const shouldTruncateText = (text) => (text?.length ?? 0) > 200;
  const truncateText = (text) => (text?.length ?? 0) > 200 ? text.substring(0, 200) + "..." : text || "";

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch("https://api2.praguecoolpass.com/review/approved");
        const allReviews = await response.json();

        const filteredReviews = allReviews.filter((review) => staticReviewIds.includes(review._id));
        const sortedReviews = staticReviewIds
          .map((id) => filteredReviews.find((r) => r._id === id))
          .filter(Boolean);

        setReviewsData(sortedReviews);
      } catch (error) {
        console.error("Ошибка загрузки отзывов:", error);
      }
    };
    loadReviews();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const CARD_WIDTH = 367;
  const GAP = 20;
  const CARDS_PER_VIEW_DESKTOP = 3;
  const MOBILE_CARD_WIDTH = typeof window !== "undefined" ? window.innerWidth * 0.9 : 320;

  const cardsPerView = isMobile ? 1 : CARDS_PER_VIEW_DESKTOP;
  const totalReviews = reviewsData.length;

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      // Реальная ширина одной карточки на текущем устройстве
      const cardElements = container.querySelectorAll(".rev-card-wrapper");
      const cardWidth = cardElements.length > 0 ? cardElements[0].offsetWidth + GAP : CARD_WIDTH + GAP;

      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(Math.min(newIndex, totalReviews - 1));
    };

    container.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 100);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [reviewsData.length]);


  const scrollPrev = () => {
    if (scrollContainerRef.current && currentIndex > 0) {
      const step = isMobile ? MOBILE_CARD_WIDTH + GAP : (CARD_WIDTH + GAP) * cardsPerView;
      scrollContainerRef.current.scrollBy({ left: -step, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (scrollContainerRef.current && currentIndex < totalReviews - cardsPerView) {
      const step = isMobile ? MOBILE_CARD_WIDTH + GAP : (CARD_WIDTH + GAP) * cardsPerView;
      scrollContainerRef.current.scrollBy({ left: step, behavior: "smooth" });
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
              {[...Array(5)].map((_, i) => (
                <span key={i} className="active-star"></span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="reviews-carousel">
        <div className="reviews-carousel-container">
          <div
            className={`reviews-left-control ${currentIndex === 0 ? "disabled" : ""}`}
            onClick={scrollPrev}
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
                    <div className={`rev-card-container ${isExpanded ? "expanded" : ""}`}>
                      <div className="review-header">
                        <div className="stars-rating rating">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? "active-star" : "star"}></span>
                          ))}
                        </div>
                        <div className="review-summary">{review.title || "Без названия"}</div>
                        <div className="date">{formatDate(review.date) || "Дата не указана"}</div>
                      </div>

                      <div className={`review-body ${isExpanded ? "expanded" : ""}`}>
                        <span className={`review-text ${!isExpanded && shouldShowMoreButton ? "truncated" : ""}`}>
                          {displayText || "Текст отзыва отсутствует"}
                        </span>

                        {shouldShowMoreButton && (
                          <span className="more-btn" onClick={() => toggleReviewExpansion(review._id)}>
                            {isExpanded ? "less" : "more"}
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
            className={`reviews-right-control ${currentIndex >= totalReviews - cardsPerView ? "disabled" : ""}`}
            onClick={scrollNext}
          />
        </div>
      </div>

      {isMobile && totalReviews > 0 && (
        <div className="mobile-review-indicator">
          <span className="current-review">{currentIndex + 1}</span>
          <span className="total-reviews">/{totalReviews}</span>
        </div>
      )}

      <div className="buttons">
        <div id="see-all" className="review-button">
          <a href="*">{t("REVIEWS_see_all") || "ПОСМОТРЕТЬ ВСЕ ОТЗЫВЫ"}</a>
        </div>
        <div id="write-your-opinion-btn" className="review-button">
          <span>{t("REVIEWS_write_your_opinion") || "НАПИШИТЕ СВОЙ ОТЗЫВ"}</span>
        </div>
      </div>
    </>
  );
}