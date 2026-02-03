import React, { useState, useEffect } from "react";
import { useTranslation } from "../TranslationContext";

const languages = [
  { code: "en", label: "English" },
  { code: "cs", label: "Čeština" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "fr", label: "Français" },
  { code: "ru", label: "Русский" },
  { code: "pl", label: "Polski" },
];

export default function ButtonTranslate() {
  const { currentLangCode, loadTranslations } = useTranslation();
  const [currentLabel, setCurrentLabel] = useState("РУССКИЙ");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lang = languages.find((l) => l.code === currentLangCode);
    if (lang) setCurrentLabel(lang.label.toUpperCase());
  }, [currentLangCode]);

  const handleSelect = (label, code) => {
    setCurrentLabel(label);
    setIsOpen(false);
    localStorage.setItem("selectedLang", label);
    loadTranslations(code);
  };

  return (
    <div className="language-select-wrapper">
      <button className="btn-translate" onClick={() => setIsOpen(!isOpen)}>
        {currentLabel} {isOpen ? "▲" : "▼"}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`dropdown-item ${currentLabel === lang.label ? "selected" : ""}`}
              onClick={() => handleSelect(lang.label, lang.code)}
            >
              {lang.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}