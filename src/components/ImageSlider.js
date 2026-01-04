import React, { useState, useEffect } from "react";
import "../styles/imageSlider.css";

const ImageSlider = () => {
  const images = [
    "img/7763f09a-1a9a-45d7-a889-da34ad84da5d.jpg",
    "img/b96b23c8-82ec-4474-8d1e-b8d50d019533.jpg",
    "img/d242bc80-5178-4a8b-bcc6-9350aba5ad80.jpg",
    "img/ab8ee2c6-1c1b-4e33-9791-1fcf86075861.jpg",
  ];

  const length = images.length;
  const [current, setCurrent] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Клоны для бесконечной прокрутки
  const slides = [images[length - 1], ...images, images[0]];

  // Автоматический переход (всегда вперёд)
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setTransitionEnabled(true);
      setCurrent((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);


  useEffect(() => {
    if (current === length || current === -1) {
      const timer = setTimeout(() => {
        setTransitionEnabled(false);
        setCurrent(current === length ? 0 : length - 1);
      }, 600); // равна длительности transition (0.6s)

      return () => clearTimeout(timer);
    }
  }, [current, length]);

  const goToSlide = (index) => {
    if (index === current) return;

    setTransitionEnabled(true);

    if (current === length - 1 && index === 0) {
      setCurrent(length);
    } else if (current === 0 && index === length - 1) {
      setCurrent(-1);
    } else {
      setCurrent(index);
    }
  };

  // slideIndex с учётом клонов
  const slideIndex = current + 1;

  return (
    <div
      className="slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="slider-overlay"></div>

      <div
        className="slider-wrapper"
        style={{
          display: "flex",
          transform: `translateX(-${slideIndex * 100}%)`,
          transition: transitionEnabled ? "transform 0.6s ease-in-out" : "none",
        }}
        onTransitionEnd={() => {
          if (current === length || current === -1) {
            setTransitionEnabled(false);
            setCurrent(current === length ? 0 : length - 1);
          }
        }}
      >
        {slides.map((img, i) => (
          <div
            key={i}
            className="slide-layer"
            style={{
              flex: "0 0 100%",
              backgroundImage: `url(${img})`,
            }}
          />
        ))}
      </div>

      <div className="indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === current ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
