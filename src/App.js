import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { TranslationProvider } from "./TranslationContext";

import MainPage from "./pages/MainPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [translations, setTranslations] = useState({});

  return (
    <TranslationProvider translations={translations}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<MainPage setTranslations={setTranslations} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </TranslationProvider>
  );
}

export default App;
