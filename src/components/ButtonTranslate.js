import { useState, useEffect } from "react";

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

export default function ButtonTranslate({ onTranslationsChange }) {
  const [currentLabel, setCurrentLabel] = useState("РУССКИЙ");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("https://api2.praguecoolpass.com/translation").then((r) =>
        r.json()
      ),
      fetch("https://api2.praguecoolpass.com/menu").then((r) => r.json()),
    ])
      .then(([translationData, menuData]) => {
        const combined = {};

        languages.forEach((lang) => {
          const code = lang.code;
          combined[code] = {
            ...(translationData[code] || {}),

            // Добавляем переводы меню (приоритет)
            ...menuData.reduce((acc, item) => {
              if (item.menu) {
                acc[item._id] =
                  item.content[code]?.title ||
                  item.content.en?.title ||
                  "Unknown";
              }
              return acc;
            }, {}),
          };
        });

        const defaultCode = "ru";
        onTranslationsChange(combined[defaultCode] || {});

        // Восстанавливаем сохранённый язык
        const savedLabel = localStorage.getItem("selectedLang") || "РУССКИЙ";
        const savedLang = languages.find((l) => l.label === savedLabel) || {
          code: defaultCode,
        };
        setCurrentLabel(savedLang.label);
        onTranslationsChange(combined[savedLang.code] || combined[defaultCode]);
      })
      .catch((err) => console.error("Load error:", err));
  }, [onTranslationsChange]);

  const handleSelect = (label, code) => {
    setCurrentLabel(label);
    setIsOpen(false);
    localStorage.setItem("selectedLang", label);

    // При смене языка — заново загружаем и объединяем
    Promise.all([
      fetch("https://api2.praguecoolpass.com/translation").then((r) =>
        r.json()
      ),
      fetch("https://api2.praguecoolpass.com/menu").then((r) => r.json()),
    ]).then(([translationData, menuData]) => {
      const menuTranslations = menuData.reduce((acc, item) => {
        if (item.menu) {
          acc[item._id] =
            item.content[code]?.title || item.content.en?.title || "Unknown";
        }
        return acc;
      }, {});

      const final = {
        ...(translationData[code] || {}),
        ...menuTranslations,
      };

      onTranslationsChange(final);
    });
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
              className={`dropdown-item ${
                currentLabel === lang.label ? "selected" : ""
              }`}
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
