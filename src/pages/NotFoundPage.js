import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { showWhiteScreen } from "..";
import "../styles/notFoundPage.css";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleHomeClick = (e) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      window.innerWidth <= 768 ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    const duration = isMobile ? 4500 : 4000;

    showWhiteScreen(duration);

    setTimeout(() => {
      navigate("/", { replace: true });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="not-found-container">
      <h1 className="not-found-title">In development</h1>
      <p className="not-found-text">This page is still under construction.</p>
      <Link
        to="/"
        className="not-found-button"
        onClick={handleHomeClick}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Return to home"}
      </Link>
    </div>
  );
}
