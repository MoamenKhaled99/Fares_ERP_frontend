import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: "en",
    debug: false,
    interpolation: { escapeValue: false },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
  });

i18n.on("languageChanged", (lng) => {
  const htmlElement = document.documentElement;

  if (lng === "ar") {
    htmlElement.setAttribute("dir", "rtl");
    htmlElement.setAttribute("lang", "ar");
    document.body.style.direction = "rtl";
  } else {
    htmlElement.setAttribute("dir", "ltr");
    htmlElement.setAttribute("lang", "en");
    document.body.style.direction = "ltr";
  }
});
export default i18n;
