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
