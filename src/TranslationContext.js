import { createContext, useContext } from "react";

const TranslationContext = createContext({});

export const TranslationProvider = ({ children, translations }) => {
  return (
    <TranslationContext.Provider value={translations}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const translations = useContext(TranslationContext);
  return (key) => translations[key] || key;
};
