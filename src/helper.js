export const cleanHtmlText = (htmlString) => {
  if (!htmlString || typeof htmlString !== "string") return "";

  return (
    htmlString
      //Заменяем &nbsp; на обычный пробел
      .replace(/&nbsp;/g, " ")

      //Обрабатываем HTML-теги
      .replace(/<br\s*\/?>/gi, "\n") // <br> → один перенос строки
      .replace(/<\/p>\s*<p>/gi, "\n\n") // </p><p> → два переноса (новый абзац)
      .replace(/<[^>]*>/g, "") // удаляем все остальные теги

      //Нормализуем пробелы внутри строк (не трогаем \n)
      .replace(/[^\S\n]+/g, " ") // множественные пробелы/табы → один пробел (но не между \n)

      //Нормализуем пустые строки между абзацами
      .replace(/\n\s*\n/g, "\n\n")

      //Убираем переносы в начале и конце
      .replace(/^\n+|\n+$/g, "")

      .trim()
  );
};

export const normalizeTextCase = (text) => {
  if (!text) return text;

  // Если весь текст в верхнем регистре
  if (text === text.toUpperCase()) {
    // Преобразуем первую букву каждого слова в заглавную, остальные в строчные
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => {
        // Исключения для коротких слов (предлогов, союзов и т.д.)
        const shortWords = [
          "a",
          "an",
          "and",
          "as",
          "at",
          "but",
          "by",
          "for",
          "in",
          "of",
          "on",
          "or",
          "the",
          "to",
          "with",
        ];
        if (shortWords.includes(word.toLowerCase())) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  return text;
};

export function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
