import React from "react";

const Loader = () => {
  return (
    <div className="fullpage-loader">
      <div className="loader-content">
        <div className="spinner"></div>
        <p className="loading-text">Загрузка...</p>
      </div>
    </div>
  );
};

export default Loader;