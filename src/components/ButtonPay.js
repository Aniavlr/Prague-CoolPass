import { useTranslation } from "../TranslationContext";

export default function ButtonPay() {
  const {t} = useTranslation();

  return (
    <a href="*" className="btn-pay">
      {t("BUY_NOW") === "BUY_NOW" ? "Loading..." : t("BUY_NOW")}
    </a>
  );
}
