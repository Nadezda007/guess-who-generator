import i18n from "./i18n";

export const getJsonTranslation = (jsonObj, userData) => {
    if (!jsonObj) return "";
    if (typeof jsonObj === "string") return jsonObj;
    const lang = userData?.customCardLanguage || i18n.language;

    return jsonObj[lang] || jsonObj.en || Object.values(jsonObj)[0] || "";
}
