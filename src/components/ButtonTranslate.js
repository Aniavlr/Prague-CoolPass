import React, { useState, useEffect } from "react";

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

  // Функция разделения title на две строки
  const splitTitle = (title) => {
    if (!title) return { title_line1: "", title_line2: "" };

    // Убираем возможные HTML-энтити
    let cleanTitle = title
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#039;/g, "'");

    // Разделяем по <br>, <br/>, <br />
    const parts = cleanTitle.split(/<br\s*\/?\s*>/i);

    const line1 = parts[0]?.trim() || "";
    const line2 = parts[1]?.trim() || "";

    return { title_line1: line1, title_line2: line2 };
  };

  // Загрузка и обработка всех переводов
  const loadTranslations = async (selectedCode = "ru") => {
    try {
      const [translationRes, menuRes, pageRes, attractRes] = await Promise.all([
        fetch("https://api2.praguecoolpass.com/translation"),
        fetch("https://api2.praguecoolpass.com/menu"),
        fetch("https://api2.praguecoolpass.com/pages/5fd771cc072e5479bded0f2b"),
        fetch("https://api2.praguecoolpass.com/object/attraction/"),
      ]);

      const [translationData, menuData, pageData, attractData] =
        await Promise.all([
          translationRes.json(),
          menuRes.json(),
          pageRes.json(),
          attractRes.json(),
        ]);

      const menuTranslations = {};
      menuData.forEach((item) => {
        if (item.menu && item._id) {
          menuTranslations[item._id] =
            item.content[selectedCode]?.title ||
            item.content.en?.title ||
            "Unknown";
        }
      });

      // Обрабатываем title для выбранного языка
      const pageContent =
        pageData.content?.[selectedCode] || pageData.content?.en || {};
      const { title_line1, title_line2 } = splitTitle(pageContent.title);

      // Переводы достопримечательностей
      const attractionsTranslations = {};

      if (Array.isArray(attractData)) {
        attractData.forEach((attraction) => {
          const id = attraction._id;
          if (!id) return;

          const langContent =
            attraction.content?.[selectedCode] || attraction.content?.en || {};

          if (langContent.title) {
            attractionsTranslations[`ATTR_${id}_title`] = langContent.title;
          }
          if (langContent.subtitle) {
            const cleanSubtitle = langContent.subtitle
              .replace(/<br\s*\/?\s*>/gi, " ")
              .replace(/\s+/g, " ")
              .trim();
            attractionsTranslations[`ATTR_${id}_subtitle`] = cleanSubtitle;
          }
          // Если нужно — можно добавить text, banner и т.д.
        });
      }

      const finalTranslations = {
        ...(translationData[selectedCode] || {}),
        ...menuTranslations,
        ...pageContent,
        title_line1,
        title_line2,
        ...attractionsTranslations,
      };

      onTranslationsChange(finalTranslations);
    } catch (err) {
      console.error("Ошибка загрузки переводов:", err);
    }
  };

  // Первая загрузка
  useEffect(() => {
    const savedLabel = localStorage.getItem("selectedLang") || "РУССКИЙ";
    const savedLang = languages.find((l) => l.label === savedLabel) || {
      code: "ru",
      label: "РУССКИЙ",
    };

    setCurrentLabel(savedLang.label);
    loadTranslations(savedLang.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
