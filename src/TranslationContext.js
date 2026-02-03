import { createContext, useContext, useState } from "react";

const TranslationContext = createContext({});

export const TranslationProvider = ({ children, initialTranslations = {} }) => {
  const [translations, setTranslations] = useState(initialTranslations);
  
  const t = (key) => translations[key] || key;

  return (
    <TranslationContext.Provider value={{ t, translations, setTranslations }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error("useTranslation must be used within TranslationProvider");
  return context; // { t, translations, setTranslations }
};