const isValidString = (str) => {
    return typeof str === "string" && str.trim() !== "";
};

export default isValidString;