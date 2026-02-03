import { createContext, useContext, useState, useEffect } from "react";
import { cleanHtmlText, normalizeTextCase } from "../src/helper";

const TranslationContext = createContext(null);

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

const processText = (text) => {
  const cleaned = cleanHtmlText(text || "");
  return normalizeTextCase(cleaned);
};

const splitTitle = (title) => {
  if (!title) return { title_line1: "", title_line2: "" };
  let cleanTitle = title
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#039;/g, "'")
    .replace(/'/g, "'");

  const parts = cleanTitle.split(/<br\s*\/?\s*>/i);
  return {
    title_line1: parts[0]?.trim() || "",
    title_line2: parts[1]?.trim() || "",
  };
};

export function TranslationProvider({ children }) {
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentLangCode, setCurrentLangCode] = useState("ru");

  const t = (key) => translations[key] ?? key;

  const loadTranslations = async (selectedCode = "ru") => {
    setIsLoading(true);
    try {
      const [translationRes, menuRes, pageRes, attractRes] = await Promise.all([
        fetch("https://api2.praguecoolpass.com/translation"),
        fetch("https://api2.praguecoolpass.com/menu"),
        fetch("https://api2.praguecoolpass.com/pages/5fd771cc072e5479bded0f2b"),
        fetch("https://api2.praguecoolpass.com/object/attraction/"),
      ]);

      if (!translationRes.ok || !menuRes.ok || !pageRes.ok || !attractRes.ok) {
        throw new Error(
          `API error: ${translationRes.status} / ${menuRes.status}`
        );
      }

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
            item.content?.[selectedCode]?.title ||
            item.content?.en?.title ||
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
        if (Array.isArray(pageContent.benefits.items)) {
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
        if (Array.isArray(pageContent.offers.items)) {
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
        if (Array.isArray(pageContent.how_to_use.descriptions)) {
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

      const attractionsList = attractData
        .map((attr) => {
          const langContent =
            attr.content?.[selectedCode] || attr.content?.en || {};
          return {
            _id: attr._id,
            title: processText(langContent.title || "Без названия"),
            type: attr.type || "attraction",
          };
        })
        .filter((item) => item.title && item.title !== "Без названия");

      const finalTranslations = {
        ...(translationData[selectedCode] || translationData.en || {}),
        ...menuTranslations,
        subtitle: cleanHtmlText(pageContent.subtitle || ""),
        header_banner: cleanHtmlText(pageContent.header_banner || ""),
        title_line1,
        title_line2,
        ...benefitsTranslations,
        ...offersTranslations,
        ...howToUseTranslations,
        ...attractionsTranslations,
        attractionsList,
      };

      setTranslations(finalTranslations);
      setCurrentLangCode(selectedCode);


    } catch (err) {
      console.error("Ошибка загрузки переводов:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedLabel = localStorage.getItem("selectedLang") || "РУССКИЙ";
    const savedLang = languages.find((l) => l.label === savedLabel) || {
      code: "ru",
      label: "Русский",
    };
    loadTranslations(savedLang.code);
  }, []);

  useEffect(() => {
    if (Object.keys(translations).length > 10 && isLoading) {
      setIsLoading(false);
    }
  }, [translations, isLoading]);

  const value = {
    t,
    translations,
    setTranslations,
    isLoading,
    setIsLoading,
    currentLangCode,
    loadTranslations,
  };

  return (
    <TranslationContext.Provider value={value}>
      {isLoading ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "white",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.4s ease",
          }}
        >
          <div className="loader">Загрузка...</div>
        </div>
      ) : (
        children
      )}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("useTranslation used outside provider");
  return ctx;
};
