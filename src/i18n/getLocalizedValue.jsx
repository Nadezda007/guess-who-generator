import i18n from "./i18n";

export const getLocalizedValue = (nameObj) => {
    if (!nameObj) return "Unknown"; // If the object is empty
    const currentLang = i18n.resolvedLanguage || "en"; // Use i18n.resolvedLanguage

    return nameObj[currentLang] || nameObj["en"] || Object.values(nameObj)[0] || "Unknown";
};
