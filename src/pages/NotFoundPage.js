import { Link } from "react-router-dom";
import "../styles/notFoundPage.css";

export default function NotFoundPage() {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">In development</h1>

      <p className="not-found-text">This page is still under construction.</p>

      <Link to="/" className="not-found-button">
        Return to home
      </Link>
    </div>
  );
}
