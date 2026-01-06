import React, { useState, useEffect } from "react";
import { cleanHtmlText } from "../helper";

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

  const splitTitle = (title) => {
    if (!title) return { title_line1: "", title_line2: "" };

    let cleanTitle = title
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#039;/g, "'");

    const parts = cleanTitle.split(/<br\s*\/?\s*>/i);

    const line1 = parts[0]?.trim() || "";
    const line2 = parts[1]?.trim() || "";

    return { title_line1: line1, title_line2: line2 };
  };

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

      const pageContent =
        pageData.content?.[selectedCode] || pageData.content?.en || {};
      const { title_line1, title_line2 } = splitTitle(pageContent.title);

      const benefitsTranslations = {};
      if (pageContent.benefits) {
        if (pageContent.benefits.benefits_title) {
          benefitsTranslations["benefits_title"] = cleanHtmlText(
            pageContent.benefits.benefits_title
          );
        }

        if (
          pageContent.benefits.items &&
          Array.isArray(pageContent.benefits.items)
        ) {
          pageContent.benefits.items.forEach((item, index) => {
            benefitsTranslations[`benefit_${index}_title`] = cleanHtmlText(
              item.title
            );
            benefitsTranslations[`benefit_${index}_text`] = cleanHtmlText(
              item.text
            );
          });
        }
      }

      const offersTranslations = {};
      if (pageContent.offers) {
        if (pageContent.offers.offers_title) {
          offersTranslations["offers_title"] = cleanHtmlText(
            pageContent.offers.offers_title
          );
        }

        if (
          pageContent.offers.items &&
          Array.isArray(pageContent.offers.items)
        ) {
          pageContent.offers.items.forEach((item, index) => {
            offersTranslations[`offer_${index}_title`] = cleanHtmlText(
              item.title
            );
            offersTranslations[`offer_${index}_features`] = cleanHtmlText(
              item.features_list
            );
            offersTranslations[`offer_${index}_button`] = cleanHtmlText(
              item.button_text
            );
          });
        }
      }

      const howToUseTranslations = {};
      if (pageContent.how_to_use) {
        if (pageContent.how_to_use.how_to_use_title) {
          howToUseTranslations["how_to_use_title"] = cleanHtmlText(
            pageContent.how_to_use.how_to_use_title
          );
        }

        if (
          pageContent.how_to_use.descriptions &&
          Array.isArray(pageContent.how_to_use.descriptions)
        ) {
          pageContent.how_to_use.descriptions.forEach((desc, index) => {
            howToUseTranslations[`how_to_use_${index}`] = cleanHtmlText(desc);
          });
        }
      }

      const attractionsTranslations = {};
      if (Array.isArray(attractData)) {
        attractData.forEach((attraction) => {
          const id = attraction._id;
          if (!id) return;

          const langContent =
            attraction.content?.[selectedCode] || attraction.content?.en || {};

          if (langContent.title) {
            attractionsTranslations[`ATTR_${id}_title`] = cleanHtmlText(
              langContent.title
            );
          }
          if (langContent.subtitle) {
            attractionsTranslations[`ATTR_${id}_subtitle`] = cleanHtmlText(
              langContent.subtitle
            );
          }
        });
      }

      const finalTranslations = {
        ...(translationData[selectedCode] || {}),
        ...menuTranslations,

        subtitle: cleanHtmlText(pageContent.subtitle || ""),
        header_banner: cleanHtmlText(pageContent.header_banner || ""),

        title_line1,
        title_line2,

        ...benefitsTranslations,
        ...offersTranslations,
        ...howToUseTranslations,
        ...attractionsTranslations,
      };

      onTranslationsChange(finalTranslations);
    } catch (err) {
      console.error("Ошибка загрузки переводов:", err);
    }
  };

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
